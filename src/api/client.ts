import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({
  // base URL은 호스트만 사용하고 각 요청에서 /api/v1을 포함합니다
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 5000,
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 5000,
});

const requestTokenRefresh = async () => {
  console.debug('[auth] token refresh 요청');
  const res = await refreshClient.post('/api/v1/auth/token/refresh');
  const payload: any = res.data?.result ?? res.data;
  const newToken =
    payload?.accessToken ??
    payload?.token ??
    res.headers?.authorization?.replace(/^Bearer\s+/i, '');
  console.debug('[auth] token refresh 응답', { hasToken: Boolean(newToken) });
  if (newToken) {
    localStorage.setItem('accessToken', newToken);
  }
  return newToken;
};

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
  (response) => {
    // 200 OK지만 isSuccess: false일 경우
    if (response.data && response.data.isSuccess === false) {
      const customError = new AxiosError(
        response.data.message || "서버 내부 오류",
        response.data.code || "SERVER_ERROR",
        response.config,
        response.request,
        response
      );
      return Promise.reject(customError);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await requestTokenRefresh();
        if (originalRequest?.headers) {
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          } else {
            delete originalRequest.headers.Authorization;
            localStorage.removeItem('accessToken');
          }
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);