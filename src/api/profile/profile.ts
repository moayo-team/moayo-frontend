import type { BaseResponse, CreateIndexItemResponse, CreateProfileRequest, DeleteIndexItemResponse, IndexItemDetailData, IndexItemListResponse, InterestTagListResponse, ProfileCreateResponse, ProfileResponse, UpdateInterestTagsRequest, UpdateInterestTagsResponse, UpdateProfileRequest, UpdateProfileResponse } from "../../types/profile";
import axiosInstance from "../axios";


export const createProfile = async (profileData: CreateProfileRequest): Promise<ProfileCreateResponse> => {  
    const response = await axiosInstance.post<ProfileCreateResponse>('/profiles/me', profileData);
    
    return response.data;
    
}

/**프로필 조회 */
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await axiosInstance.get<ProfileResponse>(
    "/api/v1/profiles/me"
  );
  return response.data;
};

/**관심 태그 조회 */
export const getInterestTags = async (): Promise<InterestTagListResponse> => {
    const response = await axiosInstance.get<InterestTagListResponse>('/users/me/interest-tags');

    return response.data;

}
/**추가 항목 조회 */
export const getIndexItems = async (): Promise<IndexItemListResponse> => {
    const response = await axiosInstance.get<IndexItemListResponse>('/profiles/me/index-items');

    return response.data;

}
/**프로필 수정 */
export const updateProfile = async (profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    const response = await axiosInstance.patch<UpdateProfileResponse>('/profiles/me', profileData);

    return response.data;
}

/**관심 태그 수정 */
export const updateInterestTags = async (
  data: UpdateInterestTagsRequest
): Promise<UpdateInterestTagsResponse> => {
  const response = await axiosInstance.put<UpdateInterestTagsResponse>(
    "/users/me/interest-tags",
    data
  );
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

    const response = await axiosInstance.patch<BaseResponse<null>>(
        `/profiles/me/index-items/${itemId}`,
        formData,
        {
            headers: {
                "Content-Type": undefined 
            },
        }
    );

    return response.data;
}


/**추가 항목 생성 */
export const createIndexItem = async (
  detailData: IndexItemDetailData,
  file?: File | null
): Promise<CreateIndexItemResponse> => {
  const formData = new FormData();

  formData.append("data", JSON.stringify(detailData));

  if (file) {
    formData.append("file", file);
  }

  const response = await axiosInstance.post<CreateIndexItemResponse>(
    '/profiles/me/index-items',
    formData,
    {
      headers: {
        "Content-Type": undefined 
      },
    }
  );

  return response.data;
};

/** 추가 항목 삭제 */
export const deleteIndexItem = async (itemId: number): Promise<DeleteIndexItemResponse> => {
  const response = await axiosInstance.delete<DeleteIndexItemResponse>(
    `/profiles/me/index-items/${itemId}`
  );

  return response.data;
};
