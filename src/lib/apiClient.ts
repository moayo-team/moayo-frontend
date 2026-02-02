import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const ENV_TOKEN = import.meta.env.VITE_MOAYO_ACCESS_TOKEN as string | undefined;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// 모든 요청에 JWT 자동 첨부 (매 요청마다 최신 토큰)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") ?? ENV_TOKEN;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
