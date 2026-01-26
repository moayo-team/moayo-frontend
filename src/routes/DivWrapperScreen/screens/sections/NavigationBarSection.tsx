import type { JSX } from "react";
import logo from "../../../assets/pavicon.png";

export const NavigationBarSection = (): JSX.Element => {
  const navigationItems = [
    { label: "홈", fontClass: "font-body-b2-300" },
    { label: "프로필", fontClass: "font-body-b2-200" },
    { label: "게시판", fontClass: "font-body-b2-300" },
    { label: "쪽지함", fontClass: "font-body-b2-300" },
  ];

  return (
    <nav
      className="absolute top-0 left-[calc(50.00%_-_720px)] w-[1440px] h-20 bg-white shadow-[0px_0px_6px_#0000001f]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        className="absolute top-5 left-[50px] w-10 h-10 bg-[#0000001a] rounded-[100px]"
        aria-hidden="true"
      />

      <h1 className="absolute top-[22px] left-[101px] [font-family:'Pretendard-Bold',Helvetica] font-bold text-black text-[28px] tracking-[0] leading-9 whitespace-nowrap">
        MOAYO!
      </h1>

      <ul
        className="inline-flex items-center gap-10 absolute top-7 left-[calc(50.00%_-_130px)]"
        role="menubar"
      >
        {navigationItems.map((item, index) => (
          <li key={index} role="none">
            <a
              href="#"
              role="menuitem"
              className={`relative w-fit mt-[-1.00px] ${item.fontClass} font-[number:var(--${item.fontClass.replace("font-", "")}-font-weight)] text-black text-[length:var(--${item.fontClass.replace("font-", "")}-font-size)] tracking-[var(--${item.fontClass.replace("font-", "")}-letter-spacing)] leading-[var(--${item.fontClass.replace("font-", "")}-line-height)] whitespace-nowrap [font-style:var(--${item.fontClass.replace("font-", "")}-font-style)]`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <img
        className="absolute top-5 left-[50px] w-10 h-10"
        alt="MOAYO Logo"
        src={logo}
      />
    </nav>
  );
};
