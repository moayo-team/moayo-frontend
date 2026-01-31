import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider'; // AuthProvider에서 생성된 컨텍스트를 가져옴

/**
 * 전역 인증 상태를 사용하기 위한 커스텀 훅
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    // 이 에러가 발생한다면 App.tsx에서 AuthProvider로 감싸지 않았음을 의미합니다.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};