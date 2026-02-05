export interface Career {
  id: number;
  period: string;
  role: string;
  title: string;
  startDate: string;
  organizer: string;
  participation: string;
  intro: string;
  fileName?: string[];
  link?: string[];
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
  startDate: string; 
  endDate: string;   
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