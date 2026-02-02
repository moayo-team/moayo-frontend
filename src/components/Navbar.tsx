import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { JSX } from 'react';
import logo from '../assets/pavicon.png';

export const NavigationBar = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, logout } = useAuth();

  const navigationItems = [
    { id: 1, label: "홈", path: "/" },
    { id: 2, label: "프로필", path: "/profile" },
    { id: 3, label: "게시판", path: "/board" },
    { id: 4, label: "쪽지", path: "/message" },
  ];

  return (
    <nav
      className="fixed w-full top-0 left-0 h-16 sm:h-20 bg-white shadow-[0px_0px_6px_#0000001f] z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img
            className="w-8 h-8 sm:w-10 sm:h-10 aspect-[1]"
            alt="MOAYO Logo"
            src={logo}
          />
          <div className="[font-family:'Pretendard-Bold',Helvetica] font-bold text-black text-xl sm:text-[28px] tracking-[0] leading-9 whitespace-nowrap ">
            MOAYO!
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-6 xl:gap-10">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.path !== "#" && navigate(item.path)}
              className={`relative w-fit font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-black text-[length:var(--body-b1-200-font-size)] tracking-[var(--body-b1-200-letter-spacing)] leading-[var(--body-b1-200-line-height)] whitespace-nowrap [font-style:var(--body-b1-200-font-style)] hover:opacity-70 transition-opacity ${(item.path === "/" && location.pathname === "/") ||
                  (item.path !== "/" && location.pathname.startsWith(item.path) && item.path !== "#")
                  ? "opacity-100 font-bold"
                  : "opacity-70"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn && user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 cursor-pointer"
                  onClick={() => navigate('/profile')}>
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  alt={user.name}
                  src={user.avatar || "src/assets/profile_photo.svg"}
                />
                <span className="font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-gray-scalegray-scale-900 text-sm">
                  {user.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-scalegray-scale-100 rounded-[10px] font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-gray-scalegray-scale-700 hover:bg-gray-scalegray-scale-200 transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="cursor-pointer"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;