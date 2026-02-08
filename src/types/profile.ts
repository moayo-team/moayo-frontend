//API
export type IndexItemType = "link" | "file" | "text";

/************************************* */
/** 서버 공통 응답 구조 타입*/
export interface BaseResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  timestamp: string;
  result: T;
}

/**프로필 관리 */
//프로필 생성 
export interface CreateProfileRequest {
  name: string;        
  phoneNumber: string;
  university?: string;
  major?: string;
  bio?: string;
  imageUrl?: string;
}
export interface ProfileCreateResult {
  id: number;
}

export type ProfileCreateResponse = BaseResponse<ProfileCreateResult>;


//프로필 조회 
export interface UserInfo {
  id: number | string;
  name: string;
  email: string;
  phoneNumber: string | null;
}

export interface ProfileDetail {
  id: number;
  imageUrl: string | null;
  university: string | null;
  major: string | null;
  bio: string | null;
}

export interface InterestTag {
  id: number;
  name: string;
}

export interface IndexItem {
  id: number;
  indexKey: string;   
  indexValue: string; 
  itemType: IndexItemType;
  linkUrl: string | null;
}

export interface ProfileDocument {
  id: number;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface GetProfileResult{
  user: UserInfo;
  profile: ProfileDetail | null;
  interestTags: InterestTag[];
  indexItems: IndexItem[];
  documents: ProfileDocument[];
}

export type ProfileResponse =  BaseResponse<GetProfileResult>;


//프로필 수정 
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string | null;

  imageUrl?: string | null;
  university?: string | null;
  major?: string | null;
  bio?: string | null;
}

//프로필 수정 
export type UpdateProfileResponse = BaseResponse<null>;

/**관심 태그 관리*/
//내 관심 태그 조회
export type InterestTagListResponse = BaseResponse<InterestTag[]>


//전체 관심 태그 목록 조회
export type AllInterestTagListResponse = BaseResponse<InterestTag[]>


//내 관심 태그 수정
export interface UpdateInterestTagsRequest {
  tagIds: number[];
}

export type UpdateInterestTagsResponse = BaseResponse<null>;


/**추가 항목 관리*/
//추가 항목 조회
export type IndexItemListResponse = BaseResponse<IndexItem[]>

//추가 항목 수정/생성
export interface IndexItemDetailData {
  indexKey: string;
  indexValue: string;
  itemType: IndexItemType;
  linkUrl: string | undefined;
  fileUrl?: string | undefined;  
  fileType?: string | undefined;  
  fileName?: string | undefined;  
  fileSize?: number | undefined; 
}

// 생성 API  
export type CreateIndexItemResponse = BaseResponse<null>;

// 삭제 API  
export type DeleteIndexItemResponse = BaseResponse<null>;

/**첨부 파일  */
// 첨부 파일 업로드 
export type UploadDocumentResponse = BaseResponse<ProfileDocument>;
// 첨부 파일 삭제
export type DeleteDocumentResponse = BaseResponse<null>;
//첨부 파일 조회
export type documentListResponse = BaseResponse<ProfileDocument[]>;

//타인 프로필 조회 응답
export interface OtherProfileResult {
	userId: number;
	name: string;
	email: string;
	phoneNumber: string | null;
	imageUrl: string;
	university: string;
	major: string;
	bio: string;
	interestTags: InterestTag[];
	indexItems: IndexItem[];
}

export type OtherProfileResponse = BaseResponse<OtherProfileResult>;