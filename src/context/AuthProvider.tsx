import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types/auth';
import { AuthContext } from '../hooks/useAuth';

const MOCK_USER: User = {
  id: '1',
  name: '김주연',
  email: 'user@example.com',
  avatar: 'https://ui-avatars.com/api/?name=김주연&background=E9FCEF&color=26E1AC&size=128',
  school: '서울대학교',
  department: '디자인학과',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(() => {
    setUser(MOCK_USER);
    localStorage.setItem('user', JSON.stringify(MOCK_USER));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  // 초기 로드 로직
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
