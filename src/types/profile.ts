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

/**생성 */
//프로필 생성 요청
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
// 최종 응답 타입
export type ProfileCreateResponse = BaseResponse<ProfileCreateResult>;


/**조회 */
//프로필 조회 응답
export interface UserInfo {
  id: number;
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

//내 관심 태그 조회
export type InterestTagListResponse = BaseResponse<InterestTag[]>

//추가 항목 조회
export type IndexItemListResponse = BaseResponse<IndexItem[]>


/**수정 */
//프로필 수정 요청
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string | null;

  imageUrl?: string | null;
  university?: string | null;
  major?: string | null;
  bio?: string | null;
}

//프로필 수정 응답
export type UpdateProfileResponse = BaseResponse<null>;

//내 관심 태그 수정
export interface UpdateInterestTagsRequest {
  tagIds: number[];
}

export type UpdateInterestTagsResponse = BaseResponse<null>;


/**추가 항목 */
//추가 항목 수정/생성
export interface IndexItemDetailData {
  indexKey: string;
  indexValue: string;
  itemType: IndexItemType;
  linkUrl: string | null;
}

// 생성 API 응답  
export type CreateIndexItemResponse = BaseResponse<null>;

// 삭제 API 응답 
export type DeleteIndexItemResponse = BaseResponse<null>;

// 타인 프로필 조회 
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