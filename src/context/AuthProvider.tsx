import React, { createContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import type { GetProfileResult } from '../types/profile';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: GetProfileResult | null;
  isLoggedIn: boolean;
  authReady: boolean;
  setUser: (user: GetProfileResult | null) => void;
  setIsLoggedIn: (val: boolean) => void;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  completeLogin: (token: string) => Promise<void>;
}

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

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<GetProfileResult | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const normalizeUser = (rawUser: any) => {
    const name =
      rawUser?.name ??
      rawUser?.nickname ??
      rawUser?.userName ??
      rawUser?.username ??
      rawUser?.user_name ??
      rawUser?.authorName ??
      rawUser?.authorNickname ??
      rawUser?.displayName;
    const avatar =
      rawUser?.avatar ??
      rawUser?.profilePictureUrl ??
      rawUser?.profileImage ??
      rawUser?.imageUrl ??
      rawUser?.picture;
    return { ...rawUser, name, avatar };
  };

  const normalizeProfileResult = (payload: any): GetProfileResult => {
    if (payload?.user) {
      return {
        user: normalizeUser(payload.user),
        profile: payload.profile ?? null,
        interestTags: payload.interestTags ?? [],
        indexItems: payload.indexItems ?? [],
        documents: payload.documents ?? [],
      } as GetProfileResult;
    }

    return {
      user: normalizeUser(payload),
      profile: null,
      interestTags: [],
      indexItems: [],
      documents: [],
    } as GetProfileResult;
  };

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const { data } = await apiClient.get('/api/v1/profiles/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payload: any = data?.result ?? data;
      const freshUser = normalizeProfileResult(payload);

      localStorage.setItem('user', JSON.stringify(freshUser));
      setUser(freshUser);
      setIsLoggedIn(true);
      localStorage.removeItem('loginSuccessModal');
      console.log('🔄 사용자 정보 수동 갱신 완료');
    } catch (error) {
      console.error('❌ 사용자 정보 갱신 실패:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    // 1. URL에서 토큰 확인 (백엔드 리다이렉트 대비)
    const searchParams = new URLSearchParams(window.location.search);
    const urlAccessToken = searchParams.get('accessToken');

    if (urlAccessToken) {
      localStorage.setItem('accessToken', urlAccessToken);
      window.history.replaceState({}, document.title, window.location.pathname);

      (async () => {
        try {
          const { data } = await apiClient.get('/api/v1/profiles/me', {
            headers: { Authorization: `Bearer ${urlAccessToken}` }
          });

          const payload: any = data?.result ?? data;
          const normalizedUser = normalizeProfileResult(payload);

          localStorage.setItem('user', JSON.stringify(normalizedUser));
          setUser(normalizedUser);
          setIsLoggedIn(true);
          localStorage.setItem('loginSuccessModal', '1');
          console.log('✅ 로그인 성공 (AuthProvider 처리)');
        } catch (err: any) {
          console.error('❌ 프로필 로드 실패:', err);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          setUser(null);
          setIsLoggedIn(false);
        }
      })();

      return;
    }

  }, []);

  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      // 2. 기존 로직 (새로고침 시 로컬 스토리지에서 복구)
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (savedUser && token) {
        try {
          const parsed = JSON.parse(savedUser);
          const normalized = normalizeProfileResult(parsed);
          setUser(normalized);
          localStorage.setItem('user', JSON.stringify(normalized));
          setIsLoggedIn(true);

          if (!normalized.user?.name) {
            await refreshUser();
          }
          return;
        } catch (error) {
          console.error('Failed to parse saved user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          setUser(null);
          setIsLoggedIn(false);
        }
      }

      if (token) {
        await refreshUser();
        return;
      }

      // 3. 서버가 HttpOnly 쿠키로 세션을 관리하는 경우
      try {
        const { data } = await apiClient.get('/api/v1/profiles/me');
        const payload: any = data?.result ?? data;
        const normalizedUser = normalizeProfileResult(payload);

        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        setIsLoggedIn(true);
        localStorage.removeItem('loginSuccessModal');
        console.log('✅ 서버 세션으로부터 사용자 정보 복구 완료 (cookie-based auth)');
      } catch (err) {
        // 실패하면 무시
      }
    };

    initAuth().finally(() => {
      if (isMounted) setAuthReady(true);
    });

    return () => {
      isMounted = false;
    };
  }, [refreshUser]);

  const login = useCallback(() => {
    // 백엔드의 구글 인증 시작점으로 리다이렉트
    // use centralized helper to ensure /api/v1 is included consistently
    // 변경된 엔드포인트에 맞춰 리다이렉트
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/oauth/google`;
  }, []);

  const completeLogin = useCallback(async (token: string) => {
    try {
      console.log("🔄 로그인 처리 시작...");

      localStorage.setItem('accessToken', token);

      window.history.replaceState({}, document.title, window.location.pathname);

      const { data } = await apiClient.get('/api/v1/profiles/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const payload: any = data?.result ?? data;
      const userData = normalizeProfileResult(payload);

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('loginSuccessModal', '1');

      console.log('✅ 로그인 성공!');
    } catch (error) {
      console.error('❌ 로그인 처리 실패:', error);

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoggedIn(false);
      throw error;
    }
  }, [setUser, setIsLoggedIn]);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('loginSuccessModal');
      sessionStorage.removeItem('loginSuccessModalShown');
      setUser(null);
      setIsLoggedIn(false);
      queryClient.clear();
    }
  }, []);
  return (
    <AuthContext.Provider value={{ user, isLoggedIn, authReady, setUser, setIsLoggedIn, login, logout, refreshUser, completeLogin }}>
      {children}
    </AuthContext.Provider>
  );
};