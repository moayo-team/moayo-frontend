import { useState } from 'react';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

export const Header = () => {
  const [activeNav, setActiveNav] = useState<string>('board');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName] = useState<string>('홍길동');

  const navigationItems: NavigationItem[] = [
    { id: 'home', label: '홈', href: '#home' },
    { id: 'profile', label: '프로필', href: '#profile' },
    { id: 'board', label: '게시판', href: '#board' },
    { id: 'settings', label: '설정', href: '#settings' },
  ];

  const handleNavClick = (id: string) => {
    setActiveNav(id);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <nav
      className="w-full h-20 bg-white shadow-[0px_0px_6px_#0000001f] flex items-center justify-between px-[50px]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-[51px]">
        <div className="w-10 h-10 bg-[#0000001a] rounded-[100px]" aria-hidden="true" />
        <h1 className="[font-family:'Pretendard-Bold',Helvetica] font-bold text-black text-[28px] tracking-[0] leading-9 whitespace-nowrap">
          MOAYO!
        </h1>
      </div>

      <ul className="inline-flex items-center gap-10">
        {navigationItems.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              onClick={() => handleNavClick(item.id)}
              className="relative w-fit [font-family:'Roboto',Helvetica] font-normal text-black text-base tracking-[0] leading-6 whitespace-nowrap hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-opacity"
              aria-current={activeNav === item.id ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <button
            onClick={handleLogin}
            className="px-5 py-2 bg-primaryprimary-500 rounded-[10px] font-heading-h3-200 text-black hover:opacity-80 transition-opacity"
          >
            로그인
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="font-body-b2-200 text-black">{userName}</span>
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-gray-scalegray-scale-300 rounded-[10px] font-heading-h3-200 text-black hover:opacity-80 transition-opacity"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
