import React, { createContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client'; // apiClient 추가
import type { GetProfileResult } from '../types/profile';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: GetProfileResult | null;
  isLoggedIn: boolean;
  setUser: (user: GetProfileResult | null) => void;
  setIsLoggedIn: (val: boolean) => void;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  completeLogin: (token: string) => Promise<void>;

}

export const logoutApi = async () => {
  return await apiClient.post('/auth/logout');
};

/**
 * 토큰 재발급 API
 * 명세서: POST /api/v1/auth/token/refresh
 */
export const refreshTokenApi = async () => {
  const { data } = await apiClient.post('/auth/token/refresh');
  return data;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();  // ← 추가

  const [user, setUser] = useState<GetProfileResult | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  

  useEffect(() => {
    // 1. URL에서 토큰 확인 (백엔드가 메인 페이지 '/'로 리다이렉트 시킬 경우 대비)
    const searchParams = new URLSearchParams(window.location.search);
    const urlAccessToken = searchParams.get('accessToken');

    if (urlAccessToken) {
      console.log('🌐 URL에서 토큰 발견:', urlAccessToken);

      // 토큰 저장
      localStorage.setItem('accessToken', urlAccessToken);

      // 주소창의 지저분한 토큰 제거 (사용자 경험 개선)
      window.history.replaceState({}, document.title, window.location.pathname);

      // 비동기 IIFE로 프로필 요청
      (async () => {
        try {
          console.log('AuthProvider: /profiles/me 호출 (토큰을 헤더로 사용)', urlAccessToken);
          const { data } = await apiClient.get('/profiles/me', {
            headers: { Authorization: `Bearer ${urlAccessToken}` }
          });

          // API may return { result: { user, profile } } or a flat user object.
          const payload: any = data.result ?? data;
          // If payload contains a nested `user`, prefer that. Otherwise assume payload is the user.
          const rawUser = payload.user ?? payload;

          // Normalize name/avatar field from possible server keys
          const name =
            rawUser.name ??
            rawUser.nickname ??
            rawUser.userName ??
            rawUser.username ??
            rawUser.user_name ??
            rawUser.authorName ??
            rawUser.authorNickname ??
            rawUser.displayName;
          const avatar = rawUser.avatar ?? rawUser.profilePictureUrl ?? rawUser.profileImage ?? rawUser.imageUrl ?? rawUser.picture;
          const normalizedUser = { ...rawUser, name, avatar } as any;

          localStorage.setItem('user', JSON.stringify(normalizedUser));
          setUser(normalizedUser);
          setIsLoggedIn(true);
          localStorage.setItem('loginSuccessModal', '1');
          console.log('✅ 로그인 성공 (AuthProvider 처리)');
        } catch (err: any) {
          console.error('❌ 프로필 로드 실패:', err);
          const resp = (err as any)?.response;
          if (resp) {
            console.error('Response status:', resp.status);
            console.error('Response data:', resp.data);
          }
          // 토큰이 잘못되었으면 삭제
          localStorage.removeItem('accessToken');
        }
      })();

  useEffect(() => {
    // 2. 기존 로직 (새로고침 시 로컬 스토리지에서 복구)
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');


    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
        return; // 이미 로컬에서 복구했으면 추가 호출 불필요

      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken'); // 토큰도 같이 제거하는 걸 권장
        setUser(null);
        setIsLoggedIn(false);
      }
    }

    // 3. 서버가 HttpOnly 쿠키로 세션을 관리하는 경우: 로컬에 토큰이 없더라도
    //    /profiles/me를 호출하면 세션 쿠키로 인증되어 사용자 정보를 받을 수 있습니다.
    //    따라서 로컬에 user/token이 없을 때는 한 번 서버에 사용자 정보를 요청해 봅니다.
    (async () => {
      try {
        const { data } = await apiClient.get('/profiles/me');
        const payload: any = data.result ?? data;
        const rawUser = payload.user ?? payload;
        const name =
          rawUser.name ??
          rawUser.nickname ??
          rawUser.userName ??
          rawUser.username ??
          rawUser.user_name ??
          rawUser.authorName ??
          rawUser.authorNickname ??
          rawUser.displayName;
        const avatar = rawUser.avatar ?? rawUser.profilePictureUrl ?? rawUser.profileImage ?? rawUser.imageUrl ?? rawUser.picture;
        const normalizedUser = { ...rawUser, name, avatar } as any;

        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        setIsLoggedIn(true);
        console.log('✅ 서버 세션으로부터 사용자 정보 복구 완료 (cookie-based auth)');
      } catch (err) {
        // 실패하면 무시 — 사용자는 비로그인 상태로 남습니다.
        // 자세한 오류는 개발자 도구의 네트워크/콘솔에서 확인하세요.
        // console.debug('No server session or failed to recover user from server:', err);ㅉㅉ
      }
    })();

    if (token) {
      refreshUser();
    }

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

      const { data } = await apiClient.get('api/v1/profiles/me');
      const userData: GetProfileResult = data.result;

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);

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
      setUser(null);
      setIsLoggedIn(false);
      queryClient.clear()
      window.location.href = '/';
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const { data } = await apiClient.get('/profiles/me', { headers });

      const payload: any = data.result ?? data;
      const rawUser = payload.user ?? payload;

      const name =
        rawUser.name ??
        rawUser.nickname ??
        rawUser.userName ??
        rawUser.username ??
        rawUser.user_name ??
        rawUser.authorName ??
        rawUser.authorNickname ??
        rawUser.displayName;
      const avatar = rawUser.avatar ?? rawUser.profilePictureUrl ?? rawUser.profileImage ?? rawUser.imageUrl ?? rawUser.picture;
      const updatedUser = { ...rawUser, name, avatar } as any;

      // 로컬 스토리지 및 상태 업데이트
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log('🔄 사용자 정보 갱신 완료');
    } catch (error: any) {
      console.error('❌ 사용자 정보 갱신 실패:', error);
      const resp = (error as any)?.response;
      if (resp) {
        console.error('Response status:', resp.status);
        console.error('Response data:', resp.data);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setUser, setIsLoggedIn, login, logout, refreshUser, completeLogin }}>
      {children}
    </AuthContext.Provider>
  );
};