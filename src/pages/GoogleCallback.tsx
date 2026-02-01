import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoginSuccessModal } from '../components/Login/LoginUI';
import { useAuth } from '../hooks/useAuth';

export const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeLogin } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const isProcessed = useRef(false);//중복 방지

  useEffect(() => {
    if (isProcessed.current) return;
    const accessToken = searchParams.get('accessToken');

    if (accessToken) {
      isProcessed.current = true;
      completeLogin(accessToken)
        .then(() => {
          // 성공하면 모달 띄우기
          setShowModal(true);
        })
        .catch(() => {
          // 실패하면 로그인 화면으로
          alert("로그인에 실패했습니다.");
          navigate('/login');
        });
    } else {
      // 토큰 없으면 로그인 화면으로
      navigate('/login');
    }
  }, [searchParams, completeLogin, navigate]);

  const handleClose = (destination = '/') => {
    navigate(destination, { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!showModal && (
        <>
          <div className="text-xl font-bold mb-4">로그인 정보를 확인 중입니다...</div>
          <div className="w-12 h-12 border-4 border-primaryprimary-300 border-t-transparent rounded-full animate-spin"></div>
        </>
      )}
      {showModal && (
        <LoginSuccessModal
          onClose={() => handleClose('/profile')}
        />
      )}
    </div>
  );
};