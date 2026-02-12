import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, type JSX } from 'react';
import smalllogo from '../assets/pavicon.svg';
import defultProfile from "../assets/default_profile.svg"
import { Menu, X } from 'lucide-react';

export const NavigationBar = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isBoardActive =
    location.pathname.startsWith('/board') ||
    location.pathname.startsWith('/post/') ||
    location.pathname.startsWith('/my-posts');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigationItems = [
    { id: 1, label: "홈", path: "/" },
    { id: 2, label: "프로필", path: "/profile" },
    { id: 3, label: "게시판", path: "/board" },
    { id: 4, label: "쪽지", path: "/message" },
  ];


  // 이미지 URL 처리 함수 
  const getProfileImageUrl = (imageUrl?: string | null) => {

    if (!imageUrl) return defultProfile;

    // 이미 풀 경로(http)거나 방금 바꾼 미리보기(blob)라면 그대로 반환
    if (imageUrl.startsWith('blob:') || imageUrl.startsWith('http')) return imageUrl;

    // 서버 경로인 경우만 베이스 URL 붙이기
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
    const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${baseUrl}${path}`;
  };

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
            className="relative w-10 h-10 aspect-[1]"
            alt="MOAYO Logo"
            src={smalllogo}
          />
          <div className="relative w-fit [font-family:'SuSeongHyeJeong',Helvetica] font-normal text-[#232323] text-2xl tracking-[-0.48px] leading-[normal]">
            MOAYO
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-6 xl:gap-10">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.path !== "#" && navigate(item.path)}
              className={`relative w-fit font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-black text-[length:var(--body-b1-200-font-size)] tracking-[var(--body-b1-200-letter-spacing)] leading-[var(--body-b1-200-line-height)] whitespace-nowrap [font-style:var(--body-b1-200-font-style)] hover:opacity-70 transition-opacity cursor-pointer 
                ${(item.path === "/" && location.pathname === "/") ||
                  (item.path === "/board" && isBoardActive) ||
                  (item.path !== "/" && item.path !== "/board" && location.pathname.startsWith(item.path) && item.path !== "#")
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
              <div className=" flex items-center items-center gap-2 cursor-pointer"
                onClick={() => navigate('/profile')}>

                <img
                  className={`w-8 h-8 rounded-[10px]
                    ${user.profile?.imageUrl
                      ? "object-cover"
                      : "object-contain p-1"
                    }
                   `}
                  alt={user.user?.name || '사용자'}
                  src={getProfileImageUrl(user.profile?.imageUrl)}
                  onError={(e) => {
                    e.currentTarget.src = defultProfile;
                  }}
                />
                <span className="font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-gray-scalegray-scale-900 text-sm">
                  {user.user?.name || '사용자'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-scalegray-scale-100 rounded-[10px] font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-gray-scalegray-scale-700 hover:bg-gray-scalegray-scale-200 transition-colors text-sm sm:text-base whitespace-nowrap cursor-pointer"
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
          {/* 모바일 햄버거 버튼 */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors "
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md w-full py-4 flex flex-col items-center gap-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
              className="w-full text-center py-2 font-bold text-gray-scalegray-scale-900 hover:bg-gray-100 transition-colors rounded-md"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

export default NavigationBar;