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
import type { AttachmentFileRequest, CreateExperienceLinkRequset, CreateExperienceRequest, UpdateExperienceLinkRequest, UpdateExperienceRequest } from "../types/career";
import { addExperienceLink, createExperience, deleteExperience, deleteExperienceFile, deleteExperienceLink, patchExperienceVisibility, postExperienceFile, updateExperienceDetail, updateExperienceLink, uploadFile } from "../api/profile/experiences";

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
                return;
            }
            isRunning.current = true;
            try {
                const getValueOrUndefined = (id: string) => {
                    const val = profileData.details.find((d: any) => d.id === id)?.value;
                    return val && val.trim() !== "" ? val : undefined;
                };

                let finalImageUrl = profileData.imageUrl;

                // 새로 선택된 사진이r 있을 경우
                if (profileFile) {
                    if (profileData.imageId) {
                        try {
                            await deleteProfileDocument(Number(profileData.imageId));
                        } catch (e: any) {
                        }
                    }

                    //  새 이미지 업로드 
                    try {
                        const uploadRes = await uploadProfileDocument(profileFile);
                        if (uploadRes.isSuccess && uploadRes.result?.fileUrl) {
                            finalImageUrl = uploadRes.result.fileUrl;
                        } else {
                            throw new Error(uploadRes.message || "업로드 응답 오류");
                        }
                    } catch (e: any) {

                        // 사용자에게 구체적인 에러 메시지 제공
                        const errorMsg = e.response?.data?.message || e.message || "알 수 없는 오류";
                        alert(`프로필 이미지 업로드 실패:\n${errorMsg}\n\n기존 이미지를 유지하고 다른 정보를 저장합니다.`);
                    }
                }

                const rawPhone =
                    profileData.details.find((d: any) => d.id === "phone")?.value || "";

                const requestBody = {
                    name: profileData.name,
                    phoneNumber: rawPhone.replace(/-/g, ""),
                    imageUrl: finalImageUrl,
                    university: getValueOrUndefined("school") ?? "",
                    major: getValueOrUndefined("major") ?? "",
                    email: getValueOrUndefined("email") || "",
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
                            deleteIndexItem(id).catch(() => {
                            }));
                    });

                    currentItems.forEach((item: any) => {
                        if (!item.value || item.value.trim() === "") return;
                        if (!item.label || item.label.trim() === "") return;

                        // File 객체
                        // const fileToSend = item.fileObj instanceof File
                        //     ? item.fileObj
                        //     : item.fileObj?.fileObj;
                        let fileToSend: File | undefined;
                        if (item.type === "file") {
                            if (item.fileObj instanceof File) {
                                fileToSend = item.fileObj;
                            } else if (item.fileObj?.fileObj instanceof File) {
                                fileToSend = item.fileObj.fileObj;
                            } else {
                                console.warn(`⚠️ 파일 항목인데 실제 File이 없습니다. label: ${item.label}`);
                            }
                        }
                        if (fileToSend === undefined && item.type === "file") {
    alert(`파일 항목 "${item.label}"이(가) 선택되지 않았습니다. 저장할 수 없습니다.`);
    return;
}
                        const detailData = {
                            indexKey: item.label,
                            indexValue: String(item.value).substring(0, 20),
                            itemType: item.type,
                            linkUrl: item.type === "link" ? (item.url || item.value) : ""
                        };

                        if (typeof item.id === "number") {
                            promises.push(updateIndexItem(item.id, detailData, fileToSend));
                        } else {

                            promises.push(createIndexItem(detailData, fileToSend));
                        }
                    });
                }

                await Promise.all(promises);
            } catch (error) {
                throw error;

            } finally {
                isRunning.current = false;
            }
        },

        onSuccess: async () => {
            await refreshUser();
            await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
            await queryClient.refetchQueries({ queryKey: ["myProfile"] })

            alert("성공적으로 저장되었습니다!");
        },

        onError: (error: any) => {
            const msg = error.response?.data?.message || error.message;
            alert(`저장 중 오류 발생\n${msg}`);
        },
    });
};

//이력 생성
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

//이력 삭제
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

// 이력 공개 여부 변경
export const useExperienceVisibility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ experienceId, visible }: { experienceId: number; visible: boolean }) =>
            patchExperienceVisibility(experienceId, visible),

        onSuccess: (_, variables) => {
            // 전체 이력 리스트 무효화
            queryClient.invalidateQueries({ queryKey: ["myExperiences"] });
            // 해당 이력의 상세 데이터 무효화
            queryClient.invalidateQueries({ queryKey: ["experienceDetail", variables.experienceId] });
            // 프로필 데이터 무효화
            queryClient.invalidateQueries({ queryKey: ["myProfile"] });

        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "공개 상태 변경 중 오류가 발생했습니다.";
            alert(msg);
        },
    });
};

//이력 수정
export const useExperienceUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            formData,
            visible
        }: {
            id: number;
            formData: UpdateExperienceRequest;
            visible: boolean
        }) => updateExperienceDetail(id, formData, visible),

        onSuccess: async (_, variables) => {
            // 상세 정보와 리스트 쿼리 모두 무효화하여 최신 데이터 유지
            await queryClient.invalidateQueries({ queryKey: ["myExperiences"] });
            await queryClient.invalidateQueries({ queryKey: ["experienceDetail", variables.id] });
            alert("수정사항이 성공적으로 저장되었습니다.");
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "수정 중 오류가 발생했습니다.");
        }
    });
};

// 이력 파일 업로드
export const useFileUpload = () => {
    return useMutation({
        mutationFn: (file: File) => uploadFile(file),

        onSuccess: (_data) => {
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "파일 업로드 중 오류가 발생했습니다.";
            alert(`파일 업로드 실패: ${msg}`);
        },
    });
};
// 이력 파일 생성
export const useExperienceFileAttach = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            experienceId,
            fileData
        }: {
            experienceId: number;
            fileData: AttachmentFileRequest
        }) => postExperienceFile(experienceId, fileData),

        onSuccess: (_, variables) => {
            // 상세 정보 쿼리 무효화하여 새로운 첨부파일 목록 반영
            queryClient.invalidateQueries({ queryKey: ["experienceDetail", variables.experienceId] });
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "파일 연결 중 오류가 발생했습니다.");
        }
    });
};

// 이력 파일 삭제
export const useExperienceFileDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ experienceId, fileId }: { experienceId: number; fileId: number }) =>
            deleteExperienceFile(experienceId, fileId),

        onSuccess: (_, variables) => {
            // 파일 목록 UI 갱신
            queryClient.invalidateQueries({ queryKey: ["experienceDetail", variables.experienceId] });
            queryClient.invalidateQueries({ queryKey: ["experienceFiles", variables.experienceId] });

        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "파일 삭제 중 오류가 발생했습니다.";
            alert(msg);
        },
    });
};

//이력 링크 생성
export const useExperienceLinkAdd = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ experienceId, data }: { experienceId: number; data: CreateExperienceLinkRequset }) =>
            addExperienceLink(experienceId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["experienceLinks", variables.experienceId] });
        },
    });
};

// 이력 링크 수정 
export const useExperienceLinkUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ experienceId, linkId, data }: { experienceId: number; linkId: number; data: UpdateExperienceLinkRequest }) =>
            updateExperienceLink(experienceId, linkId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["experienceLinks", variables.experienceId] });
        },
    });
};

// 이력 링크 삭제
export const useExperienceLinkDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ experienceId, linkId }: { experienceId: number; linkId: number }) =>
            deleteExperienceLink(experienceId, linkId),

        onSuccess: (_, variables) => {
            // 해당 이력의 링크 목록 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ["experienceLinks", variables.experienceId] });
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "링크 삭제 중 오류가 발생했습니다.";
            alert(msg);
        },
    });
};