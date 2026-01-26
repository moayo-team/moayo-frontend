import { useState } from "react";
import type { JSX } from "react";
import bottomarr from "../../../../assets/bottomarr.svg";

interface FilterOption {
  label: string;
  placeholder: string;
}

export const PostFiltersSection = (): JSX.Element => {
  const [selectedPeople, setSelectedPeople] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [selectedDeadline, setSelectedDeadline] = useState<string>("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filterOptions: FilterOption[] = [
    {
      label: "모집인원",
      placeholder: "인원선택",
    },
    {
      label: "모집 포지션",
      placeholder: "선택해주세요",
    },
    {
      label: "마감일",
      placeholder: "날짜선택",
    },
  ];

  const handleFilterChange = (index: number, value: string) => {
    if (index === 0) setSelectedPeople(value);
    if (index === 1) setSelectedPosition(value);
    if (index === 2) setSelectedDeadline(value);
  };

  return (
    <section
      className="flex flex-col w-[999px] items-start gap-2.5 p-5 absolute top-[313px] left-[391px] bg-gray-scale30 rounded-[20px]"
      role="search"
      aria-label="게시물 필터"
    >
      <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
        <div className="inline-flex items-center gap-8 relative flex-[0_0_auto]">
          <label
            htmlFor="people-filter"
            className="relative w-fit font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-black text-[length:var(--heading-h3-300-font-size)] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] whitespace-nowrap [font-style:var(--heading-h3-300-font-style)]"
          >
            모집인원
          </label>

          <div className="relative">
            <select
              id="people-filter"
              value={selectedPeople}
              onChange={(e) => handleFilterChange(0, e.target.value)}
              className="flex flex-col w-[177px] h-16 items-start justify-center gap-2 p-4 bg-white rounded-lg border border-solid border-[#d9d9d9] font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-gray-scalegray-scale-500 text-[length:var(--body-b1-200-font-size)] leading-[var(--body-b1-200-line-height)] tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)] cursor-pointer appearance-none"
              style={{
                backgroundImage: bottomarr,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
                backgroundSize: "20px 20px",
              }}
              aria-label="모집인원 선택"
            >
              <option value="">인원선택</option>
              <option value="1-5">1-5명</option>
              <option value="6-10">6-10명</option>
              <option value="11+">11명 이상</option>
            </select>
          </div>
        </div>

        <div className="inline-flex items-center gap-8 relative flex-[0_0_auto]">
          <label
            htmlFor="position-filter"
            className="relative w-fit font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-black text-[length:var(--heading-h3-300-font-size)] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] whitespace-nowrap [font-style:var(--heading-h3-300-font-style)]"
          >
            모집 포지션
          </label>

          <div className="relative">
            <select
              id="position-filter"
              value={selectedPosition}
              onChange={(e) => handleFilterChange(1, e.target.value)}
              className="flex flex-col w-[177px] h-16 items-start justify-center gap-2 p-4 bg-white rounded-lg border border-solid border-[#d9d9d9] font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-gray-scalegray-scale-500 text-[length:var(--body-b1-200-font-size)] leading-[var(--body-b1-200-line-height)] tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)] cursor-pointer appearance-none"
              style={{
                backgroundImage: bottomarr,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
                backgroundSize: "20px 20px",
              }}
              aria-label="모집 포지션 선택"
            >
              <option value="">선택해주세요</option>
              <option value="frontend">프론트엔드</option>
              <option value="backend">백엔드</option>
              <option value="designer">디자이너</option>
              <option value="pm">기획자</option>
            </select>
          </div>
        </div>

        <div className="inline-flex items-center gap-[49px] relative flex-[0_0_auto]">
          <label
            htmlFor="deadline-filter"
            className="relative w-fit font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-black text-[length:var(--heading-h3-300-font-size)] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] whitespace-nowrap [font-style:var(--heading-h3-300-font-style)]"
          >
            마감일
          </label>

          <div className="relative">
            <input
              type="date"
              id="deadline-filter"
              value={selectedDeadline}
              onChange={(e) => handleFilterChange(2, e.target.value)}
              placeholder="날짜선택"
              className="flex flex-col w-[177px] h-16 items-start justify-center gap-2 p-4 bg-white rounded-lg border border-solid border-[#d9d9d9] font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-gray-scalegray-scale-500 text-[length:var(--body-b1-200-font-size)] leading-[var(--body-b1-200-line-height)] tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)] cursor-pointer"
              style={{
                backgroundImage: bottomarr,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
                backgroundSize: "20px 20px",
              }}
              aria-label="마감일 선택"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
