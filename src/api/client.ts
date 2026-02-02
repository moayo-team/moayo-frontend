import axios, { AxiosError, type AxiosResponse } from 'axios';
import type { BaseResponse } from '../types/profile';

export const apiClient = axios.create({
  // base URL은 환경 변수에서 그대로 사용합니다 
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 5000,
});

// 요청 인터셉터: 모든 요청에 저장된 액세스 토큰 삽입
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); 
    if (token && config.headers) {
      // 따옴표 제거 로직 포함
      const cleanToken = token.startsWith('"') ? JSON.parse(token) : token;
      (config.headers as any).Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: BaseResponse의 isSuccess 체크 및 401 처리
apiClient.interceptors.response.use(
  (response: AxiosResponse<BaseResponse<any>>) => {
    if (response.data && (response.data as any).isSuccess === false) {
      const customError = new AxiosError(
        response.data.message || "서버 내부 오류가 발생했습니다.",
        response.data.code,
        response.config,
        response.request,
        response
      );
      return Promise.reject(customError);
    }
    return response;
  },
  (error: AxiosError) => {
    if ((error as any).response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);