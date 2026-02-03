import React, { createContext, useState, useEffect, useCallback } from 'react';
import { logoutApi } from '../api/auth';
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

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();  // ← 추가

  const [user, setUser] = useState<GetProfileResult | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const { data } = await apiClient.get('/api/v1/profiles/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const freshUser: GetProfileResult = data.result;

      // 로컬 스토리지 및 상태 업데이트
      localStorage.setItem('user', JSON.stringify(freshUser));
      setUser(freshUser);
      setIsLoggedIn(true);
      console.log('🔄 사용자 정보 수동 갱신 완료');
    } catch (error) {
      console.error('❌ 사용자 정보 갱신 실패:', error);
    }
  }, []);

  useEffect(() => {
    // 2. 기존 로직 (새로고침 시 로컬 스토리지에서 복구)
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);

      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken'); // 토큰도 같이 제거하는 걸 권장
        setUser(null);
        setIsLoggedIn(false);
      }
    }

    if (token) {
      refreshUser();
    }

  }, [refreshUser]);

  const login = useCallback(() => {
    // 백엔드의 구글 인증 시작점으로 리다이렉트
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

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setUser, setIsLoggedIn, login, logout, refreshUser, completeLogin }}>
      {children}
    </AuthContext.Provider>
  );
};