import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginSuccessModal } from '../components/Login/LoginUI';

export const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeLogin } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const isProcessed = useRef(false);//중복 방지

  useEffect(() => {
    if (isProcessed.current) return;
    const accessToken = searchParams.get('accessToken');

    const isFirst = searchParams.get('isFirst') === 'true';

    if (!accessToken) {
      navigate('/login');
      return;
    }

    isProcessed.current = true;

    completeLogin(accessToken)
      .then(() => {
        if (isFirst) {
          navigate('/profile', { replace: true });
        } else {
          setShowModal(true);
        }
      })
      .catch(() => {
        alert("로그인에 실패했습니다.");
        navigate('/login');
      });

  }, []);

  const handleClose = (destination = '/') => {
    navigate(destination, { replace: true });
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!showModal  && (
        <>
          <div className="text-xl font-bold mb-4">로그인 정보를 확인 중입니다...</div>
          <div className="w-12 h-12 border-4 border-primaryprimary-300 border-t-transparent rounded-full animate-spin"></div>
        </>
      )}
      {showModal && (
        <LoginSuccessModal
          onClose={() => handleClose('/')}
        />
      )}
    </div>
  );
};