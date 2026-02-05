import { apiClient } from "../lib/apiClient";

export type Visibility = "PUBLIC" | "PRIVATE";

export type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  timestamp: string;
  result: T;
};

export type CreateExperienceRequest = {
  title: string;
  visibility: Visibility;
};

export type CreateExperienceResult = {
  experienceId: number; // 서버가 experienceId로 주는지, id로 주는지 확인 필요
  // id: number;
};

export type DraftRequest = {
  prompt: string;
};

export type DraftResult = {
  organization: string;
  title: string;
  activity: string;
  role: string;
  summary: string;
  startDate: string; // "2026-02-05"
  endDate: string;   // "2026-02-05"
};

export async function createExperience(body: CreateExperienceRequest) {
  const res = await apiClient.post<ApiEnvelope<CreateExperienceResult>>(
    "/api/v1/experiences",
    body
  );
  return res.data;
}

export async function createAIDraft(experienceId: number, body: DraftRequest) {
  const res = await apiClient.post<ApiEnvelope<DraftResult>>(
    `/api/v1/experiences/${experienceId}/ai/draft`,
    body
  );
  return res.data;
}
