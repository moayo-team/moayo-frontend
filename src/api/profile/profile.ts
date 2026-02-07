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
    `/profiles/${userId}`
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

     console.log("📤 [UPDATE] FormData 내용:");  // ← UPDATE 표시 추가
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


/**추가 항목 생성 */
export const createIndexItem = async (
    detailData: IndexItemDetailData,
    file?: File | null
): Promise<CreateIndexItemResponse> => {
    const formData = new FormData();

    formData.append("data", JSON.stringify(detailData));

    if (file) {
        console.log("📎 파일 추가:", file.name, file.type, file.size);
        formData.append("file", file);
    }

    console.log("📤 [CREATE] FormData 내용:");  // ← CREATE 표시 추가
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }

    try {
        const response = await apiClient.post<CreateIndexItemResponse>(
            "/api/v1/profiles/me/index-items",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        
        console.log("✅ createIndexItem 성공:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [CREATE] 실패:", {
            status: error.response?.status,
            data: error.response?.data,
        });
        
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

/**첨부파일 업로드 */
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
/**첨부 파일 조회 */
export const getProfileDocuments = async (): Promise<documentListResponse> => {
  const res = await apiClient.get<documentListResponse>("/api/v1/profiles/me/documents");
  return res.data;
};
/**첨부 파일 삭제 */
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
		`/profiles/${userId}`
	);

	return response.data.result;
};