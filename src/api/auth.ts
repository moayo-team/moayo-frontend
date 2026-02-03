import { apiClient } from './client';

/**
 * 구글 로그인 시작 URL 반환
 * 명세서: GET /api/v1/auth/oauth/google
 */
export const getGoogleLoginUrl = () => {
  return `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/oauth/google`;
};

/**
 * 로그아웃 API
 * 명세서: POST /api/v1/auth/logout
 */
export const logoutApi = async () => {
  return await apiClient.post('/api/v1/auth/logout');
};

/**
 * 토큰 재발급 API
 * 명세서: POST /api/v1/auth/token/refresh
 */
export const refreshTokenApi = async () => {
  const { data } = await apiClient.post('/api/v1/auth/token/refresh');
  return data;
};