import type { JSX } from "react";

interface JobFilterProps {
  selectedFilters: string[];
  onToggleFilter: (label: string) => void;
}

export const JobFilter = ({ selectedFilters, onToggleFilter }: JobFilterProps): JSX.Element => {
  const jobFilters = [
    { id: 1, label: "기획" },
    { id: 2, label: "마케팅" },
    { id: 3, label: "디자인" },
    { id: 4, label: "개발" },
    { id: 5, label: "창업" },
    { id: 6, label: "예체능" },
    { id: 7, label: "문학" },
    { id: 8, label: "기타" }
  ];

  return (
    <aside className="flex flex-col w-full items-start gap-3 mt-8">
      <h2 className="relative self-stretch mt-[-1.00px] font-heading-h2-300 font-[number:var(--heading-h2-300-font-weight)] text-black text-[16px] tracking-[var(--heading-h2-300-letter-spacing)] leading-[var(--heading-h2-300-line-height)] [font-style:var(--heading-h2-300-font-style)]">
        직무필터
      </h2>
      <div className="flex items-center gap-2.5 px-4 sm:px-5 py-6 sm:py-6 relative self-stretch w-full flex-[0_0_auto] rounded-[10px] border border-solid border-gray-scalegray-scale-300">
        <div className="flex flex-col w-full items-start gap-4 relative">
          <div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
            <div className="grid grid-cols-2 gap-2 relative self-stretch w-full">
              {jobFilters.slice(0, 2).map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => onToggleFilter(filter.label)}
                  className={`flex w-full h-10 sm:h-11 px-2.5 py-[3px] ${
                    selectedFilters.includes(filter.label)
                      ? "bg-primaryprimary-50 border-primaryprimary-500"
                      : "bg-gray-scalegray-scale-50 border-gray-scalegray-scale-100"
                  } rounded-[10px] border border-solid items-center justify-center gap-[5px] relative hover:opacity-80 transition-opacity cursor-pointer`}
                  aria-pressed={selectedFilters.includes(filter.label)}
                >
                  <span className={`flex-1 font-body-b1-200 text-[13px] font-[number:var(--body-b1-200-font-weight)] ${
                    selectedFilters.includes(filter.label)
                      ? "text-primaryprimary-800"
                      : "text-gray-scalegray-scale-300"
                  } text-center tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)]`}>
                    {filter.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 relative self-stretch w-full">
              {jobFilters.slice(2, 4).map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => onToggleFilter(filter.label)}
                  className={`flex w-full h-10 sm:h-11 px-2.5 py-[3px] ${
                    selectedFilters.includes(filter.label)
                      ? "bg-primaryprimary-50 border-primaryprimary-500"
                      : "bg-gray-scalegray-scale-50 border-gray-scalegray-scale-100"
                  } rounded-[10px] border border-solid items-center justify-center gap-[5px] relative hover:opacity-80 transition-opacity cursor-pointer`}
                  aria-pressed={selectedFilters.includes(filter.label)}
                >
                  <span className={`flex-1 font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] ${
                    selectedFilters.includes(filter.label)
                      ? "text-primaryprimary-800"
                      : "text-gray-scalegray-scale-300"
                  } text-[13px] text-center tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)]`}>
                    {filter.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 relative self-stretch w-full">
              {jobFilters.slice(4, 6).map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => onToggleFilter(filter.label)}
                  className={`flex w-full h-10 sm:h-11 px-2.5 py-[3px] ${
                    selectedFilters.includes(filter.label)
                      ? "bg-primaryprimary-50 border-primaryprimary-500"
                      : "bg-gray-scalegray-scale-50 border-gray-scalegray-scale-100"
                  } rounded-[10px] border border-solid items-center justify-center gap-[5px] relative hover:opacity-80 transition-opacity cursor-pointer`}
                  aria-pressed={selectedFilters.includes(filter.label)}
                >
                  <span className={`relative flex-1 font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] ${
                    selectedFilters.includes(filter.label)
                      ? "text-primaryprimary-800"
                      : "text-gray-scalegray-scale-300"
                  } text-[13px] text-center tracking-[var(--body-b1-200-letter-spacing)] leading-[var(--body-b1-200-line-height)] [font-style:var(--body-b1-200-font-style)]`}>
                    {filter.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 relative self-stretch w-full">
              {jobFilters.slice(6, 8).map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => onToggleFilter(filter.label)}
                  className={`flex w-full h-10 sm:h-11 px-2.5 py-[3px] ${
                    selectedFilters.includes(filter.label)
                      ? "bg-primaryprimary-50 border-primaryprimary-500"
                      : "bg-gray-scalegray-scale-50 border-gray-scalegray-scale-100"
                  } rounded-[10px] border border-solid items-center justify-center gap-[5px] relative hover:opacity-80 transition-opacity cursor-pointer`}
                  aria-pressed={selectedFilters.includes(filter.label)}
                >
                  <span className={`relative flex-1 font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] ${
                    selectedFilters.includes(filter.label)
                      ? "text-primaryprimary-800"
                      : "text-gray-scalegray-scale-300"
                  } text-[13px] text-center tracking-[var(--body-b1-200-letter-spacing)] leading-[var(--body-b1-200-line-height)] [font-style:var(--body-b1-200-font-style)]`}>
                    {filter.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
