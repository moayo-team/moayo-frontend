import type { InterestTag, ProfileDocument } from "./profile";

//UI
export type ProfileDetailFieldId = "school" | "major" | "email" | "phone";

export interface ProfileDetailField {
    id: ProfileDetailFieldId;
    label: string;
    value: string;
    isVerified?: boolean;

}

export type AdditionalItemType = "text" | "link" | "file";

export interface AdditionalDetailItem {
    id: number | "temp";
    label: string;
    value: string;
    type: AdditionalItemType;
    linkUrl?: string | null;  // ✅ 추가!
    fileUrl?: string | null;  // ✅ 추가!
    fileName?: string | null;
    fileType?: string | null;
    fileSize?: number | null;
    fileObj?: File | null;
}

export interface ProfileFormData {
    id: number | null;
    name: string;
    profileImage: string;//미리보기용
    imageUrl?: string; //서버 업로드용
    imageId?: number | null;
    introduction: string;
    profileFile?: File | null;
    tags?: InterestTag[];
    additionalDetails?: AdditionalDetailItem[];
    details: ProfileDetailField[];
    documents?: ProfileDocument[];
}
