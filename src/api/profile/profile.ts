import type {
    AllInterestTagListResponse,
    BaseResponse,
    CreateIndexItemResponse,
    CreateProfileRequest,
    DeleteDocumentResponse,
    DeleteIndexItemResponse,
    documentListResponse,
    IndexItemDetailData,
    IndexItemListResponse,
    InterestTagListResponse,
    ProfileCreateResponse,
    ProfileResponse,
    UpdateInterestTagsRequest,
    UpdateInterestTagsResponse,
    UpdateProfileRequest,
    UpdateProfileResponse,
    UploadDocumentResponse,
    OtherProfileResponse,
    OtherProfileResult
} from "../../types/profile";
import { apiClient } from "../client";


export const createProfile = async (profileData: CreateProfileRequest): Promise<ProfileCreateResponse> => {
    const response = await apiClient.post<ProfileCreateResponse>(
        "/api/v1/profiles/me",
        profileData
    );

    return response.data;

};

/**프로필 조회 */
export const getProfile = async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>("/api/v1/profiles/me");
    return response.data;
};


/**프로필 수정 */
export const updateProfile = async (profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    const response = await apiClient.patch<UpdateProfileResponse>(
        "/api/v1/profiles/me",
        profileData
    );

    return response.data;
};

/** 관심 태그 전체 조회*/
export const getAllInterestTag = async (): Promise<AllInterestTagListResponse> => {
    const response = await apiClient.get<AllInterestTagListResponse>("/api/v1/interest-tags");
    return response.data;
};

/**프로필 조회 (userId) */
export const getProfileById = async (userId: string | number): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>(
        `/api/v1/profiles/${userId}`
    );
    return response.data;
};

/**관심 태그 조회 */
export const getInterestTags = async (): Promise<InterestTagListResponse> => {
    const response = await apiClient.get<InterestTagListResponse>("/api/v1/users/me/interest-tags");

    return response.data;

};


/**관심 태그 수정 */
export const updateInterestTags = async (
    data: UpdateInterestTagsRequest
): Promise<UpdateInterestTagsResponse> => {
    const response = await apiClient.put<UpdateInterestTagsResponse>(
        "/api/v1/users/me/interest-tags",
        data
    );
    return response.data;
};

/**추가 항목 조회 */
export const getIndexItems = async (): Promise<IndexItemListResponse> => {
    const response = await apiClient.get<IndexItemListResponse>(
        "/api/v1/profiles/me/index-items");

    return response.data;

};

/**추가 항목 수정 */
export const updateIndexItem = async (
    itemId: number,
    detailData: IndexItemDetailData,
    file?: File | null
): Promise<BaseResponse<null>> => {
    const formData = new FormData();

    // JSON 객체를 문자열로 변환
    formData.append("data", JSON.stringify(detailData));

    if (file) {
        formData.append("file", file);
    }

    console.log("📤 [UPDATE] FormData 내용:");
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }
    const response = await apiClient.patch<BaseResponse<null>>(
        `/api/v1/profiles/me/index-items/${itemId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        }
    );

    return response.data;
};


// /**추가 항목 생성 */
// export const createIndexItem = async (
//     detailData: IndexItemDetailData,
//     file?: File | null
// ): Promise<CreateIndexItemResponse> => {
//     const formData = new FormData();

//     const payload: any = {
//         indexKey: detailData.indexKey.trim(),
//         indexValue: detailData.indexValue?.trim() || "",
//         itemType: detailData.itemType,
//     };

//     // linkUrl 처리: 텍스트일 때는 필드를 아예 안 보내거나 null로 명시
//     if (detailData.itemType === 'link') {
//         payload.linkUrl = detailData.linkUrl || detailData.indexValue;
//     } else {
//         payload.linkUrl = null;
//     }

//     console.log("🚀 [FINAL CHECK] Payload:", payload);
//     formData.append("data", new Blob([JSON.stringify(payload)], {
//         type: "application/json"
//     }));

//     if (file instanceof File) {
//         formData.append("file", file);
//         console.log("📎 전송 직전 최종 체크(File):", file.name);

//     } else {
//         // 파일이 없으면 빈 Blob 전송
//         formData.append("file", new Blob([], { type: "application/octet-stream" }));
//     }

//     const response = await apiClient.post<CreateIndexItemResponse>(
//         "/api/v1/profiles/me/index-items",
//         formData
//     );

//     return response.data;
// };
export const createIndexItem = async (
    detailData: IndexItemDetailData,
    file?: File | null
): Promise<CreateIndexItemResponse> => {
    const formData = new FormData();

    const jsonString = JSON.stringify(detailData);
    console.log("📝 [1. JSON 데이터]:", jsonString);

    formData.append("data", JSON.stringify(detailData));

    if (file) {
        console.log("📎 [2. 파일 정보]:", {
            name: file.name,
            type: file.type,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            isActualFile: file instanceof File
        }); formData.append("file", file);
    } else {
        console.log("📎 [2. 파일 정보]: 첨부된 파일 없음");
    }

    console.group("📤 [3. 서버로 날아가는 FormData 최종 체크]");
    for (let [key, value] of formData.entries()) {
        if (key === "data") {
            console.log(`🔑 Key: ${key} | 📄 Value:`, value);
        } else {
            console.log(`🔑 Key: ${key} | 📁 Value:`, value instanceof File ? `File: ${value.name}` : value);
        }
    }
    console.groupEnd();

    try {
        const response = await apiClient.post<CreateIndexItemResponse>(
            "/api/v1/profiles/me/index-items",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("✨ [RESULT] 서버 응답 성공:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("💥 [RESULT] 서버 응답 실패:", error.response?.data || error.message);

        if (error.response?.data) {
            console.error("📋 [CREATE] 에러 상세:", JSON.stringify(error.response.data, null, 2));
        }

        throw error;
    }
};
/** 추가 항목 삭제 */
export const deleteIndexItem = async (itemId: number): Promise<DeleteIndexItemResponse> => {
    const response = await apiClient.delete<DeleteIndexItemResponse>(
        `/api/v1/profiles/me/index-items/${itemId}`
    );

    return response.data;
};

/**첨부파일 업로드 (프사/ 학력파일/ 이력 파일)*/
export const uploadProfileDocument = async (file: File): Promise<UploadDocumentResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<UploadDocumentResponse>(
        "/api/v1/profiles/me/documents",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

/**첨부 파일 조회 (프사/ 학력파일/ 이력 파일)*/
export const getProfileDocuments = async (): Promise<documentListResponse> => {
    const res = await apiClient.get<documentListResponse>("/api/v1/profiles/me/documents");
    return res.data;
};
/**첨부 파일 삭제 (프사/ 학력파일/ 이력 파일)*/
export const deleteProfileDocument = async (
    documentId: number
): Promise<DeleteDocumentResponse> => {
    const res = await apiClient.delete<DeleteDocumentResponse>(
        `/api/v1/profiles/me/documents/${documentId}`
    );
    return res.data;
};

// 타인 프로필 조회(GET) API 
export const getUserProfileById = async (
    userId: number
): Promise<OtherProfileResult> => {
    const response = await apiClient.get<OtherProfileResponse>(
        `/api/v1/profiles/${userId}`
    );

    return response.data.result;
};

/**타인 프로필 조회 */
export const getOtherProfile = async (userId: number): Promise<OtherProfileResponse> => {
    const response = await apiClient.get<OtherProfileResponse>(
        `/api/v1/profiles/${userId}`
    );
    return response.data;
};