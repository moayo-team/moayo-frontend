import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 기반 세션/리프레시 토큰 사용 시 필수
});

// 요청 인터셉터: 모든 요청에 저장된 액세스 토큰 삽입
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      // 중요: 혹시 모를 앞뒤 따옴표(")를 제거합니다.
      const cleanToken = token.replace(/^"(.*)"$/, '$1'); 
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료 처리 (401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      // 필요 시 로그인 페이지로 강제 이동 로직 추가 가능
    }
    return Promise.reject(error);
  }
);