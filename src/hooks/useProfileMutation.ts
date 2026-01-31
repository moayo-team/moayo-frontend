import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createProfile,
    updateProfile,
    updateInterestTags,
    createIndexItem,
    updateIndexItem,
    deleteIndexItem,
    getProfile,
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
        }: {
            profileData: ProfileFormData;
            initialIndexItemIds: number[];
        }) => {
            const rawPhone =
                profileData.details.find((d: any) => d.id === "phone")?.value || "";

            const requestBody = {
                name: profileData.name,
                phoneNumber: rawPhone.replace(/-/g, ""),
                imageUrl: profileData.profileImage || "",
                bio: profileData.introduction || "",
                university:
                    profileData.details.find((d: any) => d.id === "school")?.value || "",
                major:
                    profileData.details.find((d: any) => d.id === "major")?.value || "",
                email:
                    profileData.details.find((d: any) => d.id === "email")?.value || "",
            };

            let isNewProfile = false;

            if (profileData.id) {
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
                const currentIds = currentItems.map((i: any) => i.id);

                const idsToDelete = initialIndexItemIds.filter(
                    (id) => !currentIds.includes(id)
                );

                idsToDelete.forEach((id) => promises.push(deleteIndexItem(id)));

                currentItems.forEach((item: any) => {
                    const detailData = {
                        indexKey: item.label,
                        indexValue: item.value,
                        itemType: item.type,
                        linkUrl: item.type === "link" ? item.value : null,
                    };

                    if (typeof item.id === "number") {
                        promises.push(updateIndexItem(item.id, detailData, item.fileObj));
                    } else {
                        promises.push(createIndexItem(detailData, item.fileObj));
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
