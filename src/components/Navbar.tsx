function Navbar() {
  return (
    <nav className="h-20 border-b">
      <div className="max-w-[1440px] mx-auto h-full px-[50px] grid grid-cols-3 items-center">
        
        {/* Left: 로고 */}
        <span className="font-pretendard text-[28px] font-bold leading-[36px] tracking-normal">
          MOAYO!
        </span>

        {/* Center: 메뉴 */}
        <ul className="flex items-center gap-10 h-6 justify-self-center">
          <li className="font-roboto font-normal text-base leading-6 cursor-pointer">
            홈
          </li>
          <li className="font-roboto font-normal text-base leading-6 cursor-pointer">
            프로필
          </li>
          <li className="font-roboto font-normal text-base leading-6 cursor-pointer">
            게시판
          </li>
          <li className="font-roboto font-normal text-base leading-6 cursor-pointer">
            쪽지함
          </li>
          <li className="font-roboto font-normal text-base leading-6 cursor-pointer">
            설정
          </li>
        </ul>

        <div />
      </div>
    </nav>
  );
}

export default Navbar;
