import { LoginCard } from '../components/Login/LoginUI';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-white">
      {/* onLogin이 호출되면 AuthProvider의 login()이 실행됩니다.
        리다이렉트 방식이므로 별도의 input 없이 구글 페이지로 이동하게 됩니다.
      */}
      <LoginCard onLogin={login} />
    </div>
  );
};

export default LoginPage;