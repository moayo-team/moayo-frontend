export interface FileData {
  name: string;
  url?: string; 
}

export interface ResumeData {
  id: number;           // 고유 식별자 (필수)
  title: string;        // 활동명
  organizer: string;    // 주최/기관
  period: string;       // 기간
  startDate: string;    // 정렬을 위한 기준 날짜 (예: "2024-12-13")
  participation: string;// 참여형태
  role: string;         // 역할
  description: string;  // 활동 소개
  isPublic: boolean;    // 공개 여부
  
  // 다중 데이터를 위해 배열 타입 추가
  files?: FileData[];   // 첨부 파일 객체 배열
  links?: string[];     // 링크 주소 배열 (여러 개)
  
  // 하위 호환을 위해 남겨둘 수 있는 단일 필드 
  fileName?: string;
  link?: string;
}