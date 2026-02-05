import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createProfile,
    updateProfile,
    updateInterestTags,
    createIndexItem,
    updateIndexItem,
    deleteIndexItem,
    getProfile,
    uploadProfileDocument,
    deleteProfileDocument,
} from "../api/profile/profile";
import type { ProfileFormData } from "../types/profileForm";
import { useAuth } from "./useAuth";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateExperienceRequest } from "../types/career";
import { createExperience, deleteExperience } from "../api/profile/experiences";

const waitForProfileToExist = async () => {
    for (let i = 0; i < 5; i++) {
        try {
            await getProfile();
            return true;
        } catch {
            await new Promise((r) => setTimeout(r, 1000));
        }
    }
    throw new Error("프로필 생성 반영 시간 초과");
};

export const useProfileSave = () => {
    const queryClient = useQueryClient();
    const { refreshUser } = useAuth();
    const isRunning = useRef(false);

    return useMutation({
        mutationFn: async ({
            profileData,
            initialIndexItemIds,
            profileFile,
        }: {
            profileData: ProfileFormData;
            initialIndexItemIds: number[];
            profileFile?: File | null;
        }) => {
            if (isRunning.current) {
                console.warn("⚠️ 이미 실행 중입니다. 중단.");
                return;
            }
            isRunning.current = true;
            try {
                const getValueOrUndefined = (id: string) => {
                    const val = profileData.details.find((d: any) => d.id === id)?.value;
                    return val && val.trim() !== "" ? val : undefined;
                };

                let finalImageUrl = profileData.imageUrl;

                // 새로 선택된 사진이 있을 경우
                if (profileFile) {
                    console.log("📸 프로필 이미지 업로드 시작:", {
                        name: profileFile.name,
                        type: profileFile.type,
                        size: profileFile.size
                    });
                    if (profileData.imageId) {
                        try {
                            await deleteProfileDocument(Number(profileData.imageId));
                            console.log("✅ 기존 이미지 삭제 성공");
                        } catch (e: any) {
                            if (e?.response?.status !== 404) {
                                console.warn("⚠️ 삭제 실패 (계속 진행):", e.message);
                            }
                        }
                    }

                    // ✅ 새 이미지 업로드 (삭제 결과에 관계없이 항상 진행)
                    try {
                        const uploadRes = await uploadProfileDocument(profileFile);
                        if (uploadRes.isSuccess && uploadRes.result?.fileUrl) {
                            finalImageUrl = uploadRes.result.fileUrl;
                            console.log("✅ 이미지 업로드 성공:", finalImageUrl);
                        } else {
                            throw new Error(uploadRes.message || "업로드 응답 오류");
                        }
                    } catch (e: any) {
                        console.error("❌ 이미지 업로드 실패:", {
                            message: e.message,
                            code: e.code,
                            status: e.response?.status,
                            data: e.response?.data
                        });

                        // 사용자에게 구체적인 에러 메시지 제공
                        const errorMsg = e.response?.data?.message || e.message || "알 수 없는 오류";
                        alert(`프로필 이미지 업로드 실패:\n${errorMsg}\n\n기존 이미지를 유지하고 다른 정보를 저장합니다.`);

                        // 기존 이미지 URL 유지
                        console.warn("⚠️ 기존 이미지 유지:", finalImageUrl);
                    }
                }

                const rawPhone =
                    profileData.details.find((d: any) => d.id === "phone")?.value || "";

                const requestBody = {
                    name: profileData.name,
                    phoneNumber: rawPhone.replace(/-/g, ""),
                    imageUrl: finalImageUrl,
                    university: getValueOrUndefined("school"),
                    major: getValueOrUndefined("major"),
                    email: getValueOrUndefined("email"),
                    bio: profileData.introduction,
                };

                let isNewProfile = false;
                if (profileData.id && typeof profileData.id === "number") {
                    await updateProfile(requestBody);
                } else {
                    await createProfile(requestBody);
                    isNewProfile = true;
                }

                if (isNewProfile) {
                    await waitForProfileToExist();
                }

                const promises: Promise<any>[] = [];

                // 태그
                if (profileData.tags) {
                    const tagIds = profileData.tags.map((t: any) => t.id);
                    promises.push(updateInterestTags({ tagIds }));
                }

                // 추가 항목
                if (profileData.additionalDetails) {
                    const currentItems = profileData.additionalDetails;

                    const currentIds = currentItems
                        .map((i: any) => i.id)
                        .filter((id: any) => typeof id === "number");

                    const idsToDelete = initialIndexItemIds.filter(
                        (id) => !currentIds.includes(id) && id !== undefined
                    );
                    idsToDelete.forEach((id) => {
                        promises.push(
                            deleteIndexItem(id).catch(err => console.error(`${id} 삭제 실패`, err))
                        );
                    });

                    currentItems.forEach((item: any) => {
                        if (!item.value || item.value.trim() === "") return;
                        if (!item.label || item.label.trim() === "") return;

                        let cleanFileType = null;
                        if (item.type === "file" && item.fileType) {
                            cleanFileType = item.fileType.includes('/')
                                ? item.fileType.split('/')[1]
                                : item.fileType;
                        }

                        const detailData = {
                            indexKey: item.label,
                            indexValue: String(item.value).substring(0, 20),
                            itemType: item.type,
                            linkUrl: item.type === "link" ? (item.url || item.value) : null,
                            fileUrl: item.type === "file" && item.url ? item.url : null,
                            fileType: item.type === "file" ? cleanFileType : null,
                            fileName: item.type === "file" ? item.value : null,  // value에 파일명이 들어있음
                            fileSize: item.type === "file" ? (item.fileSize || 0) : null
                        };
                        console.log("📤 전송 데이터 확인:", detailData);

                        const fileToSend = item.type === "file" && item.fileObj ? item.fileObj : null;
                        console.log("📎 전송할 파일:", fileToSend);

                        if (typeof item.id === "number") {
                            promises.push(updateIndexItem(item.id, detailData, null));
                        } else {
                            console.log("✅ createIndexItem 호출 - ID:", item.id);

                            promises.push(createIndexItem(detailData, fileToSend));
                        }
                    });
                }

                await Promise.all(promises);
            } catch (error) {
                console.error("프로필 저장 중 오류:", error);
                throw error; // react-query onError로 넘김

            } finally {
                isRunning.current = false;
            }
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
            await queryClient.refetchQueries({ queryKey: ["myProfile"] })
            await refreshUser();
            alert("성공적으로 저장되었습니다!");
        },

        onError: (error: any) => {
            const msg = error.response?.data?.message || error.message;
            alert(`저장 중 오류 발생\n${msg}`);
        },
    });
};

export const useExperienceCreate = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: CreateExperienceRequest) => createExperience(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myExperiences"] });
            queryClient.invalidateQueries({ queryKey: ["myProfile"] });
            
            alert("이력이 성공적으로 등록되었습니다.");
            navigate("/profile"); 
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "이력 등록 중 오류가 발생했습니다.";
            alert(`등록 실패: ${msg}`);
        },
    });
};

export const useExperienceDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (experienceId: number) => deleteExperience(experienceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myExperiences"] });
            queryClient.invalidateQueries({ queryKey: ["myProfile"] });
            alert("이력이 삭제되었습니다.");
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "삭제 중 오류가 발생했습니다.");
        },
    });
};
