import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavigationBar } from "../components/Navbar";
import { LoginSuccessModal } from "../components/Login/LoginUI";
import { useAuth } from "../hooks/useAuth";


const HomeLayout = () => {
  const { isLoggedIn } = useAuth();
  const [showLoginSuccessModal, setShowLoginSuccessModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      sessionStorage.removeItem('loginSuccessModalShown');
      return;
    }
    const flag = localStorage.getItem('loginSuccessModal');
    const alreadyShown = sessionStorage.getItem('loginSuccessModalShown');
    if (flag === '1' && alreadyShown !== '1') {
      setShowLoginSuccessModal(true);
      sessionStorage.setItem('loginSuccessModalShown', '1');
      localStorage.removeItem('loginSuccessModal');
    }
  }, [isLoggedIn]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <div className="relative z-[9999]"> 
        <NavigationBar />
      </div> 
        <div className="flex-1 w-full mt-[100px] pb-[100px] overflow-x-auto flex flex-col items-center">
        <main className="w-full flex flex-col items-center min-w-0 px-[20px]">
          <Outlet />
        </main>
      </div>

      {showLoginSuccessModal && (
        <LoginSuccessModal onClose={() => setShowLoginSuccessModal(false)} />
      )}
    </div>
  );
};

export default HomeLayout;
