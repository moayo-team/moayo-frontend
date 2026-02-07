import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../api/client';

export const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');

    if (accessToken) {
      // 1. 토큰 저장
      localStorage.setItem('accessToken', accessToken);

      // 2. 내 프로필 정보 가져오기 (명세서: GET /api/v1/profiles/me)
      apiClient.get('/profiles/me')
        .then(({ data }) => {
          const payload: any = data?.result ?? data;
          const rawUser = payload?.user ?? payload;
          const name =
            rawUser?.name ??
            rawUser?.nickname ??
            rawUser?.userName ??
            rawUser?.username ??
            rawUser?.user_name ??
            rawUser?.authorName ??
            rawUser?.authorNickname ??
            rawUser?.displayName;
          const avatar = rawUser?.avatar ?? rawUser?.profilePictureUrl ?? rawUser?.profileImage ?? rawUser?.imageUrl ?? rawUser?.picture;
          const normalizedUser = { ...rawUser, name, avatar } as any;
          localStorage.setItem('user', JSON.stringify(normalizedUser));
          setUser(normalizedUser);
          setIsLoggedIn(true);
          localStorage.setItem('loginSuccessModal', '1');
          navigate('/'); // 로그인 성공 후 홈으로 이동
        })
        .catch((err) => {
          console.error('Profile fetch failed:', err);
          navigate('/login');
        });
    } else {
      console.error('No token found');
      navigate('/login');
    }
  }, [searchParams, navigate, setUser, setIsLoggedIn]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-xl font-bold mb-4">로그인 정보를 확인 중입니다...</div>
      <div className="w-12 h-12 border-4 border-primaryprimary-300 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};