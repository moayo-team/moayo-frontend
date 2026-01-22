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
