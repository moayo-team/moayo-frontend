export interface Career {
  id: number;
  period: string;
  role: string;
  title: string;
  startDate: string;
  endDate: string;
  organizer: string;
  participation: string;
  intro: string;
  fileName?: string[];
  link?: string[];
  visible: boolean;
  isPublic: boolean;
}

/*********************** */
// 전체 응답 구조 
export interface BaseResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  timestamp: string;
  result: T;
}

// 내 이력 목록 개별 항목  
export interface ExperienceSummary {
  experienceId: number;
  organization: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  activity: string;
  role: string;
  visible: boolean;
  summary: string;
}
export type CareerListResponse = BaseResponse<ExperienceSummary>

// 이력 생성 요청
export interface CreateExperienceRequest {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  activity: string;
  role: string;
  summary: string;
}

// 이력 생성 응답
export type CreateExperienceResponse = BaseResponse<number>;

//상세 조회 응답
export type CareerDetailReponse = BaseResponse<ExperienceSummary>;

//이력 삭제 응답
export type DeleteExperienceResponse = BaseResponse<null>;

//이력 공개 상태 변 경 요청 
export interface UpdateVisibilityRequest {
  visible: boolean;
}

//이력 공개 여부 응답
export type ExperienceVisibilityResponse = BaseResponse<null>;

// 이력 수정 
export interface UpdateExperienceRequest {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  activity: string;
  role: string;
  summary: string;
}

// 수정 응답 타입 
export type UpdateExperienceResponse = BaseResponse<null>;

// 이력 파일 첨부 요청
export interface AttachmentFileRequest {
  fileId: number;
  fileName: string;
}

// 파일 첨부 응답 
export type AttachmentFileResponse = BaseResponse<null>;

//커스텀 파일 타입
export interface AttachedFile {
  id?: number;
  name: string;
  url?: string;
  fileObj?: File;
  type?: string;
}

// 파일 조회 응답
export interface ExperienceFileResponse {
  fileId: number;
  fileName: string;
}

export type GetExperienceFilesResponse = BaseResponse<ExperienceFileResponse[]>;

//파일 삭제 요청
export interface DetachFileRequest {
  experienceId: number;
  fileId: number;
}

//파일 삭제 응답
export type DetachFileResponse = BaseResponse<null>;

//링크 생성 요청
export interface CreateExperienceLinkRequset {
  title?: string;
  url: string;
}

//링크 생성 응답
export type CreateExperienceLinkResponse = BaseResponse<null>;

//링크 조회 응답
export interface ExperienceLink {
  linkId: number;
  title: string;
  url: string;
}

export type GetExperienceLinksResponse = BaseResponse<ExperienceLink[]>

//링크 수정 요청
export interface UpdateExperienceLinkRequest {
  title: string;
  url: string;
}

//링크 수정 응답
export type UpdateExperienceLinkResponse = BaseResponse<null>;

//링크 삭제 요청
export interface DeleteLinkRequest {
  experienceId: number;
  linkId: number;
}

//링크 삭제 응답
export type DeleteLinkReponse = BaseResponse<null>;

//특정 사용자의 공개 이력 목록 조회 응답
export type PublicExperienceListResponse = BaseResponse<ExperienceSummary[]>;

//ai 초안 작성글
export type DraftRequest = {
  prompt: string;
}

//공개 이력 링크 조회 응답
export interface PublicExperienceLink {
  linkId: number;
  title: string;
  url: string;
}

export type GetPublicExperienceLinksResponse = BaseResponse<PublicExperienceLink[]>;

//공개 이력 파일 조회 응답 
export interface PublicExperienceFile {
  fileId: number;
  fileName: string;
}

export type GetPublicExperienceFilesResponse = BaseResponse<PublicExperienceFile[]>;

//공개 이력 상세 조회 응답
export type GetPublicExperienceDetailsResponse = BaseResponse<ExperienceSummary>;

//이력파일업로드타입
export interface CareerFile {
  fileId: number;
  fileName: string;
  contentType: string;
  size: number;

}
//이력 파일 업로드 응답
export type FileUploadReponse = BaseResponse<CareerFile>;

