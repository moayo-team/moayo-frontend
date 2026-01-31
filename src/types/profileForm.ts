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
    fileObj?: File | null;
}

export interface ProfileTagItem {
    id: number;
    title: string;
}

export interface ProfileFormData {
    id: number | null;
    name: string;
    profileImage: string;
    introduction: string;

    tags: ProfileTagItem[];
    additionalDetails: AdditionalDetailItem[];
    details: ProfileDetailField[];
}
