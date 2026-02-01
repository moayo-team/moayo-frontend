/**
 * 서비스 내 사용자 기본 정보
 */
export interface User {
  id: string | number;
  email: string;
  name: string;
  avatar?: string;       // 프로필 이미지 URL
  school?: string;       // 학교 정보
  major?: string;        // 전공 정보
  bio?: string;          // 자기소개
  created_at?: string;
}

/**
 * 로그인 성공 시 서버에서 내려주는 응답 구조
 * 액세스 토큰과 유저 정보를 한 번에 받는 경우를 가정합니다.
 */
export interface AuthResponse {
  accessToken: string;
  user: User;
}

/**
 * 전역 인증 컨텍스트(AuthContext)에서 사용할 상태 및 함수 타입
 */
export interface AuthContextType {
  user: User | null;          // 현재 로그인한 유저 정보 (로그아웃 시 null)
  isLoggedIn: boolean;        // 로그인 여부 (!!user 와 동일)
  setIsLoggedIn: (val: boolean) => void;
  setUser: (user: User | null) => void;
  
  /**
   * 구글 로그인 시작 함수
   * 리다이렉트 방식이므로 별도의 인자 없이 백엔드로 이동시킵니다.
   */
  login: () => void;
  
  /**
   * 로그아웃 함수
   * 서버 세션 종료 및 로컬 스토리지 정리를 수행합니다.
   */
  logout: () => Promise<void>;

  completeLogin: (token: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

/**
 * (선택사항) 만약 이메일 로그인을 추가할 경우 사용할 요청 타입
 */
export interface LoginRequest {
  email: string;
  password: string;
}