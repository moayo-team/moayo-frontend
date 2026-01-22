import type { JSX } from "react";

export const NavigationBarSection = (): JSX.Element => {
  const navigationItems = [
    { id: 1, label: "홈" },
    { id: 2, label: "프로필" },
    { id: 3, label: "게시판" },
    { id: 4, label: "쪽지" },
  ];

  return (
    <nav
      className="absolute w-full top-0 left-0 h-20 bg-white shadow-[0px_0px_6px_#0000001f]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="inline-flex items-center gap-10 absolute top-[25px] left-[calc(50.00%_-_131px)]">
        {navigationItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.label}`}
            className="relative w-fit mt-[-1.00px] font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-black text-[length:var(--body-b1-200-font-size)] tracking-[var(--body-b1-200-letter-spacing)] leading-[var(--body-b1-200-line-height)] whitespace-nowrap [font-style:var(--body-b1-200-font-style)] hover:opacity-70 transition-opacity"
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="absolute top-[22px] left-[92px] [font-family:'Pretendard-Bold',Helvetica] font-bold text-black text-[28px] tracking-[0] leading-9 whitespace-nowrap">
        MOAYO!
      </div>

      <img
        className="absolute top-5 left-[41px] w-10 h-10"
        alt="MOAYO Logo"
        src="https://c.animaapp.com/mknskxfd3qPIE6/img/------01.svg"
      />
    </nav>
  );
};
