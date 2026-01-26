import { NavLink } from "react-router-dom";

function Navbar() {
  const baseClass =
    "font-roboto text-base leading-6 cursor-pointer transition-colors";
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      baseClass,
      isActive ? "font-bold text-[#25221D]" : "font-normal text-[#5F5749]",
    ].join(" ");

  return (
    <nav className="h-20 border-b w-full bg-white sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto h-full px-[50px] grid grid-cols-3 items-center">
        <span className="font-pretendard text-[28px] font-bold leading-[36px] tracking-normal">
          MOAYO!
        </span>

        <ul className="flex items-center gap-10 h-6 justify-self-center">
          <li>
            <NavLink to="/" end className={linkClass}>
              홈
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={linkClass}>
              프로필
            </NavLink>
          </li>
          <li className="font-roboto font-normal text-base leading-6 cursor-pointer text-[#5F5749]">
            게시판
          </li>
          <li>
            <NavLink to="/message" className={linkClass}>
              쪽지함
            </NavLink>
          </li>
        </ul>

        <div />
      </div>
    </nav>
  );
}

export default Navbar;
