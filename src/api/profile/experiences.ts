import { type CreateExperienceRequest, type CreateExperienceResponse, type CareerListResponse, type CareerDetailReponse, type DeleteExperienceResponse, type ExperienceVisibilityResponse, type UpdateVisibilityRequest, type UpdateExperienceResponse, type UpdateExperienceRequest, type AttachmentFileRequest, type AttachmentFileResponse, type ExperienceFileResponse, type BaseResponse, type DetachFileResponse, type CreateExperienceLinkRequset, type GetExperienceLinksResponse, type ExperienceLink, type GetExperienceFilesResponse, type UpdateExperienceLinkRequest, type UpdateExperienceLinkResponse, type PublicExperienceListResponse, type GetPublicExperienceLinksResponse, type GetPublicExperienceFilesResponse, type GetPublicExperienceDetailsResponse, type ExperienceSummary, } from "../../types/career";
import { apiClient } from "../client";

/** 내 이력서 목록 조회 */
export const getMyExperiences = async (): Promise<CareerListResponse> => {
    const response = await apiClient.get<CareerListResponse>(
        "/api/v1/experiences/me"
    );
    return response.data;
};


/** 이력 생성 */
export const createExperience = async (data: CreateExperienceRequest): Promise<CreateExperienceResponse> => {
    const response = await apiClient.post<CreateExperienceResponse>(
        "/api/v1/experiences",
        data
    );
    return response.data;
};

/**이력 상세 조회 */
export const getExperienceDetail = async (experienceId: number) => {
    const response = await apiClient.get<CareerDetailReponse>(
        `/api/v1/experiences/me/${experienceId}`
    );
    return response.data;
};

/**이력 삭제 */
export const deleteExperience = async (experienceId: number) => {
    const response = await apiClient.delete<DeleteExperienceResponse>(
        `/api/v1/experiences/${experienceId}`
    );

    return response.data;
};

/**이력 항목 공개/비공개 상태 변경 */
export const patchExperienceVisibility = async (
    experienceId: number,
    visible: boolean
): Promise<ExperienceVisibilityResponse> => {
    try {
        const requestBody: UpdateVisibilityRequest = { visible };

        const { data } = await apiClient.patch<ExperienceVisibilityResponse>(
            `/api/v1/experiences/${experienceId}/visibility`,
            requestBody
        );

        return data;
    } catch (error) {
        console.error('공개 여부 변경 중 오류 발생:', error);
        throw error;
    }
};

//이력 수정 (정보 + 공개여부)
export const updateExperienceDetail = async (
    experienceId: number,
    data: UpdateExperienceRequest,
    visible: boolean
) => {
    // 이력서 정보 수정 
    const updateInfo = apiClient.patch<UpdateExperienceResponse>(
        `/api/v1/experiences/${experienceId}`,
        data
    );

    //  공개 여부 변경 
    const updateVisibility = patchExperienceVisibility(experienceId, visible);

    const [infoRes, visibilityRes] = await Promise.all([updateInfo, updateVisibility]);

    return {
        info: infoRes.data,
        visibility: visibilityRes
    };
};

// 이력 파일 생성
export const postExperienceFile = async (
    experienceId: number,
    fileData: AttachmentFileRequest
): Promise<AttachmentFileResponse> => {
    const { data } = await apiClient.post<AttachmentFileResponse>(
        `/api/v1/experiences/${experienceId}/attachments/files`,
        fileData
    );
    return data;
};

//이력 파일 조회
export const getExperienceFiles = async (experienceId: number): Promise<BaseResponse<ExperienceFileResponse[]>> => {
    const { data } = await apiClient.get<BaseResponse<GetExperienceFilesResponse>>(
        `/api/v1/experiences/${experienceId}/attachments/files`
    );
    return data.result;
};

//이력 파일 삭제
export const deleteExperienceFile = async (
    expId: number,
    fileId: number
): Promise<DetachFileResponse> => {
    const { data } = await apiClient.delete<DetachFileResponse>(
        `/api/v1/experiences/${expId}/attachments/files/${fileId}`
    );
    return data;
};

//이력 링크 생성
export const addExperienceLink = async (
    experienceId: number,
    data: CreateExperienceLinkRequset
): Promise<CreateExperienceResponse> => {
    const response = await apiClient.post<CreateExperienceResponse>(
        `/api/v1/experiences/${experienceId}/attachments/links`,
        data
    );
    return response.data;
};

//이력 링크 조회
export const getExperienceLinks = async (experienceId: number): Promise<ExperienceLink[]> => {
    const { data } = await apiClient.get<GetExperienceLinksResponse>(
        `/api/v1/experiences/${experienceId}/attachments/links`
    );

    return data.result;
};

//이력 링크 수정
export const updateExperienceLink = async (
    experienceId: number,
    linkId: number,
    data: UpdateExperienceLinkRequest
): Promise<UpdateExperienceLinkResponse> => {
    const response = await apiClient.patch<UpdateExperienceLinkResponse>(
        `/api/v1/experiences/${experienceId}/attachments/links/${linkId}`,
        data
    );
    return response.data;
};

// 이력 링크 삭제
export const deleteExperienceLink = async (
    experienceId: number,
    linkId: number
): Promise<BaseResponse<null>> => {
    const { data } = await apiClient.delete<BaseResponse<null>>(
        `/api/v1/experiences/${experienceId}/attachments/links/${linkId}`
    );
    return data;
};

//특정 사용자 공개 이력 목록 조회
export const getPublicExperiences = async (userId: number): Promise<PublicExperienceListResponse> => {
    const response = await apiClient.get<PublicExperienceListResponse>(
        `/api/v1/users/${userId}/experiences`
    );
    return response.data;
};

// 공개 이력서 상세 조회
export const getPublicExperienceDetail = async (experienceId: number): Promise<BaseResponse<ExperienceSummary>> => {
    const response = await apiClient.get<GetPublicExperienceDetailsResponse>(
        `/api/v1/experiences/public/${experienceId}`
    );
    return response.data;
};
// 공개 이력 링크 조회
export const getPublicExperienceLinks = async (experienceId: number): Promise<GetPublicExperienceLinksResponse> => {
    const { data } = await apiClient.get<GetPublicExperienceLinksResponse>(
        `/api/v1/experiences/public/${experienceId}/attachments/links`
    );
    return data; // .result가 아니라 data 전체를 넘겨야 Hook에서 .result로 접근 가능
};

// 공개 이력 파일 조회
export const getPublicExperienceFiles = async (experienceId: number): Promise<GetPublicExperienceFilesResponse> => {
    const { data } = await apiClient.get<GetPublicExperienceFilesResponse>(
        `/api/v1/experiences/public/${experienceId}/attachments/files`
    );
    return data;
};
