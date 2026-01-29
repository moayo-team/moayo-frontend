import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginCard, LoginSuccessModal } from '../components/Login/LoginUI';
import { NavigationBar } from '../components/Navbar';

const LoginPage = () => {
  const { login } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 실제 API 연동 시 백엔드에서 제공하는 이메일/비밀번호 혹은 OAuth 토큰을 전달합니다.
      // 현재는 테스트용 데이터를 전달하도록 설정합니다.
      await login({ email: "user@example.com", password: "password" });
      
      // 로그인 성공 시 성공 모달 표시
      setShowSuccessModal(true);
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <div className="flex items-center justify-center py-20 px-4">
        <LoginCard onLogin={handleLogin} />
      </div>

      {showSuccessModal && (
        <LoginSuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
};

export default LoginPage;