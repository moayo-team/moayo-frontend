import { NavLink } from "react-router-dom";

function Navbar() {
  const linkBase = "font-roboto font-normal text-base leading-6";
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      linkBase,
      isActive ? "text-black font-semibold" : "text-gray-600 hover:text-black",
    ].join(" ");

  return (
    <nav className="h-20 border-b">
      <div className="max-w-[1440px] mx-auto h-full px-[50px] grid grid-cols-3 items-center">
        {/* 로고도 홈으로 이동 */}
        <NavLink
          to="/"
          className="font-pretendard text-[28px] font-bold leading-[36px] tracking-normal"
        >
          MOAYO!
        </NavLink>

        <ul className="flex items-center gap-10 h-6 justify-self-center">
          <li>
            <NavLink to="/" className={linkClass}>
              홈
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={linkClass}>
              프로필
            </NavLink>
          </li>
          <li>
            <NavLink to="/board" className={linkClass}>
              게시판
            </NavLink>
          </li>
          <li>
            <NavLink to="/messages" className={linkClass}>
              쪽지함
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={linkClass}>
              설정
            </NavLink>
          </li>
        </ul>

        <div />
      </div>
    </nav>
  );
}

export default Navbar;
