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
            const getValueOrUndefined = (id: string) => {
                const val = profileData.details.find((d: any) => d.id === id)?.value;
                return val && val.trim() !== "" ? val : undefined; 
            };

            let finalImageUrl = profileData.imageUrl;

            // 새로 선택된 사진이 있을 경우
            if (profileFile) {
                if (profileData.imageId) {
                    try {
                        console.log("🗑️ 진짜 이미지 파일 삭제 시도 (ID):", profileData.imageId);
                        await deleteProfileDocument(Number(profileData.imageId));
                        console.log("✅ 이미지 파일 삭제 성공");
                    } catch (e) {
                        console.warn("⚠️ 삭제 실패:", e);
                    }
                }

                // 새 이미지 업로드
                const uploadRes = await uploadProfileDocument(profileFile);
                if (uploadRes.isSuccess) {
                    finalImageUrl = uploadRes.result.fileUrl;
                    console.log("✅ 새 이미지 업로드 성공:", finalImageUrl);
                } else {
                    throw new Error(uploadRes.message || "이미지 업로드 실패");
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
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myProfile"] });

            alert("성공적으로 저장되었습니다!");
        },

        onError: (error: any) => {
            const msg = error.response?.data?.message || error.message;
            alert(`저장 중 오류 발생\n${msg}`);
        },
    });
};
