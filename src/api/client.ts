import axios from 'axios';

export const apiClient = axios.create({
  // ★ 프록시 설정(vite.config.ts)을 타기 위해 도메인을 지우고 '/api'로 설정합니다.
  baseURL: '/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터: 모든 요청에 저장된 액세스 토큰 삽입
apiClient.interceptors.request.use(
  (config) => {
    // 주석 해제 및 수정
    const token = localStorage.getItem('accessToken'); 
    if (token && config.headers) {
      // 따옴표 제거 로직 포함
      const cleanToken = token.startsWith('"') ? JSON.parse(token) : token;
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