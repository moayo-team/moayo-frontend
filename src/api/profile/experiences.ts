import { type CreateExperienceRequest, type CreateExperienceResponse, type CareerListResponse, type CareerDetailReponse, type DeleteExperienceResponse,  } from "../../types/career";
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