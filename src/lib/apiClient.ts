// src/lib/apiClient.ts
import axios from "axios";

export const API_BASE_URL =
	import.meta.env.VITE_BASE_URL ?? "http://localhost:8080";

const ACCESS_TOKEN = import.meta.env.VITE_MOAYO_ACCESS_TOKEN as string | undefined;

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: false
});

// 모든 요청에 JWT 자동 첨부
apiClient.interceptors.request.use((config) => {
	if (ACCESS_TOKEN) {
		config.headers = config.headers ?? {};
		config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
	}
	return config;
});
