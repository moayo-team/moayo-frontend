// 공통적으로 사용되는 학력/경력 등의 베이스 인터페이스
interface BaseInfo {
  id: number;
  period: string;
}

// 연락처 정보 타입
export interface Contact {
  email: string;
  phone: string;
  kakaoId: string;
}

// 학력 정보 타입
export interface Education extends BaseInfo {
  school: string;
  major: string;
  subMajor: string | null;
  isVerified: boolean;
}

// 경력/활동 정보 타입
export interface Career extends BaseInfo {
  role: string;
  title: string;
  startDate: string;
  organizer: string;
  participation: string;
  intro: string;
  fileName?: string; 
  link?: string;     
}

// 추가 정보 (포트폴리오, 깃허브 등) 타입
export interface AdditionalInfo {
  id: number;
  type: "file" | "link";
  title: string;
  description?: string;
  link: string;
}

// 태그 타입
export interface Tag {
  id: number;
  title: string;
}

// 최종 프로필 데이터 타입
export interface ProfileData {
  name: string;
  jobTitle: string;
  profileImage: string;
  introduction: string;
  contact: Contact;
  education: Education[];
  careers: Career[];
  additionalInfo: AdditionalInfo[];
  tags: Tag[];
}