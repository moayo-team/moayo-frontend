import { apiClient } from "../client";
import type { BaseResponse, DraftRequest } from "../../types/career";
import type { CreateExperienceRequest } from "../../types/career";

export async function createExperienceSession(): Promise<BaseResponse<number>> {
  const body: CreateExperienceRequest = {
    title: "",     
    organization: "", 
    startDate: "", 
    endDate: "",      
    activity: "",     
    role: "",         
    summary: "", 
  };

  const res = await apiClient.post<BaseResponse<number>>("/api/v1/experiences", body);
  return res.data;
}

export async function createAIDraft(experienceId: number, body: DraftRequest) {
  const res = await apiClient.post<BaseResponse<any>>(
    `/api/v1/experiences/${experienceId}/ai/draft`,
    body
  );
  return res.data;
}

export type PatchExperienceBody = Partial<{
  title: string;
  organization: string;
  startDate: string | null;
  endDate: string | null;
  activity: string;
  role: string;
  summary: string;
  isPublic: boolean;
}>;

export async function patchExperience(experienceId: number, body: PatchExperienceBody) {
  const res = await apiClient.patch<BaseResponse<any>>(
    `/api/v1/experiences/${experienceId}`,
    body
  );
  return res.data;
}
