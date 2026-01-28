import axios from 'axios';
// Axios 인스턴스 
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }, timeout: 5000, // 5초 이상 응답 없으면 타임아웃 
});
// 요청 인터셉터 설정 
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers?.set(
        "Authorization",
        `Bearer ${accessToken}`
      );
    }
    return config;
  }, (error) => {
    // 요청 에러 처리 
    return Promise.reject(error);
  })
  ;
// 응답 인터셉터 설정 
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("인증이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem('accessToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;