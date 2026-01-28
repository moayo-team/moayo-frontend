//  공통 
export type ExtraInfoType = "link" | "file" | "text";

//  추가 정보 
export interface ExtraInfo {
  id: number;
  type: ExtraInfoType;
  title: string;
  value: string;      // link URL / 파일 URL / 텍스트 내용
}

//  태그 
export interface Tag {
  id: number;
  name: string;
  selected: boolean;
}

//  프로필 
export interface Profile {
  name: string;
  birthDate?: string;      // yyyy-mm-dd
  email?: string;
  university?: string;
  major?: string;
  profileImage?: string;
  introduction?: string;
  tags: Tag[];
  extraInfos: ExtraInfo[];
}


/************************************* */
/** 서버 공통 응답 구조 타입*/
export interface BaseResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

/**프로필 생성 */

//프로필 생성 요청
export interface CreateProfileRequest {
  imageUrl?: string;
  bio?:string;
  university?:string;
  major?:string;
}

// 프로필 생성 응답 
export interface ProfileCreateResult {
  id: number; 
}

// 최종 응답 타입
export type ProfileCreateResponse = BaseResponse<ProfileCreateResult>;


/**프로필 조회 */
//프로필 조회 응담
export interface ProfileResult{
  id: number | null;
  userId: number;
  imageUrl: string | null;
  bio: string | null;
  university: string | null;
  major: string | null;
}

export type ProfileResponse =  BaseResponse<ProfileResult>;


/**프로필 수정 */
//프로필 수정 요청
export interface UpdateProfileRequest {
  imageUrl?: string;
  bio?: string;
  university?: string;
  major?: string;
}

//프로필 수정 응답
export interface UpdateProfileResult {
  id: number;
}

export type UpdateProfileResponse = BaseResponse<UpdateProfileResult>;