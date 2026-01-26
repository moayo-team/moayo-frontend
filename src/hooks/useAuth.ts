// src/hooks/useAuth.ts
import { createContext, useContext } from 'react';
import type { AuthContextType } from '../types/auth';

// Context 객체 자체는 JSX가 아니므로 .ts 파일에 존재 가능합니다.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
