import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { BaseResponse } from '../types/profile';


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// 요청 인터셉터 설정 
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// 응답 인터셉터 설정 
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<BaseResponse<any>>) => {
    // HTTP 상태코드는 200이지만, 백엔드 로직상 실패인 경우 (Soft 500)
    if (response.data && response.data.isSuccess === false) {
      // 강제로 에러를 발생시켜서 catch 블록이나 React Query의 onError로 보냅니다.
      // 에러 객체에 서버 응답 데이터를 담아줘야 나중에 code("SERVER500_1") 등을 확인할 수 있습니다.
      const customError = new AxiosError(
        response.data.message || "서버 내부 오류가 발생했습니다.", // 에러 메시지
        response.data.code, // 에러 코드 (예: SERVER500_1)
        response.config,
        response.request,
        response // 응답 객체 전체를 포함
      );
      
      return Promise.reject(customError);
    }

    return response;
  },
  (error: AxiosError) => {
    
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;