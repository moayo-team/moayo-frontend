import React, { createContext, useState, useEffect, useCallback } from 'react';
import { logoutApi, getGoogleLoginUrl } from '../api/auth';
import { apiClient } from '../api/client'; // apiClient 추가
import type { User } from '../types/auth';

interface AuthContextType {
  user: User | null;  
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  setIsLoggedIn: (val: boolean) => void;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>; 
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
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
          const { data } = await apiClient.get('/v1/profiles/me', {
            headers: { Authorization: `Bearer ${urlAccessToken}` }
          });

          // API may return { result: { user, profile } } or a flat user object.
          const payload: any = data.result ?? data;
          // If payload contains a nested `user`, prefer that. Otherwise assume payload is the user.
          const rawUser = payload.user ?? payload;

          // Normalize avatar field from possible server keys
          const avatar = rawUser.avatar ?? rawUser.profilePictureUrl ?? rawUser.profileImage ?? rawUser.imageUrl ?? rawUser.picture;
          const normalizedUser = { ...rawUser, avatar } as any;

          localStorage.setItem('user', JSON.stringify(normalizedUser));
          setUser(normalizedUser);
          setIsLoggedIn(true);
          console.log('✅ 로그인 성공 (AuthProvider 처리)');
        } catch (err) {
          console.error('❌ 프로필 로드 실패:', err);
          // 토큰이 잘못되었으면 삭제
          localStorage.removeItem('accessToken');
        }
      })();

      return; // URL 토큰 처리 시 아래 로직 건너뜀
    }

    // 2. 기존 로직 (새로고침 시 로컬 스토리지에서 복구)
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  const login = useCallback(() => {
    // 백엔드의 구글 인증 시작점으로 리다이렉트
    // use centralized helper to ensure /api/v1 is included consistently
    window.location.href = getGoogleLoginUrl();
  }, []);

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
      window.location.href = '/';
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const { data } = await apiClient.get('/v1/profiles/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const payload: any = data.result ?? data;
      const rawUser = payload.user ?? payload;

      const avatar = rawUser.avatar ?? rawUser.profilePictureUrl ?? rawUser.profileImage ?? rawUser.imageUrl ?? rawUser.picture;
      const updatedUser = { ...rawUser, avatar } as any;

      // 로컬 스토리지 및 상태 업데이트
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log('🔄 사용자 정보 갱신 완료');
    } catch (error) {
      console.error('❌ 사용자 정보 갱신 실패:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setUser, setIsLoggedIn, login, logout,refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};