import axios, { AxiosError, type AxiosRequestHeaders } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 5000,
});

const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 5000,
});

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

const normalizeToken = (raw: unknown): string | null => {
  if (raw == null) return null;
  let t = String(raw);

  // JSON.stringify로 저장된 경우 대비
  try {
    if (t.startsWith('"') && t.endsWith('"')) t = JSON.parse(t);
  } catch {}

  t = String(t).replace(/^Bearer\s+/i, "").trim();
  return t.length > 0 ? t : null;
};

const setAuthHeader = (headers: any, token?: string | null) => {
  if (!headers) return;
  const t = normalizeToken(token);
  if (!t) {
    delete headers.Authorization;
    return;
  }
  headers.Authorization = `Bearer ${t}`;
};

const requestTokenRefresh = async (): Promise<string | null> => {
  const res = await refreshClient.post("/api/v1/auth/token/refresh");

  const payload: any = res.data?.result ?? res.data ?? {};
  const tokenFromBody = payload?.accessToken ?? payload?.token ?? payload?.access_token;

  const tokenFromHeader =
    res.headers?.authorization?.replace(/^Bearer\s+/i, "") ??
    res.headers?.Authorization?.replace(/^Bearer\s+/i, "");

  const newToken = normalizeToken(tokenFromBody ?? tokenFromHeader);

  if (newToken) {
    localStorage.setItem(TOKEN_KEY, newToken);
  }

  return newToken;
};

apiClient.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem(TOKEN_KEY);

    config.headers = (config.headers ?? {}) as AxiosRequestHeaders;

    const token = normalizeToken(raw);
    if (!token) {
      delete (config.headers as any).Authorization;
      return config;
    }

    (config.headers as any).Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
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

    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    const url = String(originalRequest.url ?? "");

    const isRefreshCall = url.includes("/api/v1/auth/token/refresh");

    if (status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      try {
        const newToken = await requestTokenRefresh();

        originalRequest.headers = originalRequest.headers ?? {};
        setAuthHeader(originalRequest.headers, newToken);

        // refresh 실패면 토큰 정리
        if (!newToken) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          return Promise.reject(error);
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
