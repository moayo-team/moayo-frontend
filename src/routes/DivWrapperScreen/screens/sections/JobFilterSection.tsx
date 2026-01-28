import { useState } from "react";
import type { JSX } from "react";

interface JobCategory {
  id: string;
  label: string;
  selected: boolean;
}

export const JobFilterSection = (): JSX.Element => {
  const [categories, setCategories] = useState<JobCategory[]>([
    { id: "planning", label: "기획", selected: true },
    { id: "marketing", label: "마케팅", selected: false },
    { id: "design", label: "디자인", selected: false },
    { id: "development", label: "개발", selected: true },
    { id: "startup", label: "창업", selected: false },
    { id: "arts", label: "예체능", selected: false },
    { id: "literature", label: "문학", selected: false },
    { id: "other", label: "기타", selected: false },
  ]);

  const handleCategoryClick = (id: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === id
          ? { ...category, selected: !category.selected }
          : category,
      ),
    );
  };

  const renderCategoryButton = (category: JobCategory, index: number) => {
    const isSelected = category.selected;
    const bgColor = isSelected
      ? "bg-primaryprimary-50"
      : "bg-gray-scalegray-scale-50";
    const borderColor = isSelected ? "border-[#26e1ac]" : "border-[#d6d6d8]";
    const textColor = isSelected
      ? "text-gray-scalegray-scale-900"
      : "text-gray-scalegray-scale-300";
    const widthClass = category.id === "development" ? "w-[110px]" : "w-28";
    const marginClass = index % 2 === 1 ? "mr-[-2.00px]" : "";

    return (
      <button
        key={category.id}
        onClick={() => handleCategoryClick(category.id)}
        className={`${widthClass} ${marginClass} ${bgColor} ${borderColor} flex h-[51px] items-center justify-center gap-[5px] px-2.5 py-[3px] relative rounded-[10px] border border-solid`}
        aria-pressed={isSelected}
        type="button"
      >
        <span
          className={`${isSelected ? "relative flex-1" : "flex-1"} font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] ${textColor} text-[length:var(--body-b1-200-font-size)] text-center tracking-[var(--body-b1-200-letter-spacing)] leading-[var(--body-b1-200-line-height)] [font-style:var(--body-b1-200-font-style)]`}
        >
          {category.label}
        </span>
      </button>
    );
  };

  const categoryRows = [
    categories.slice(0, 2),
    categories.slice(2, 4),
    categories.slice(4, 6),
    categories.slice(6, 8),
  ];

  return (
    <section className="flex flex-col w-[280px] items-start gap-5 absolute top-[215px] left-[50px]">
      <h2 className="self-stretch mt-[-1.00px] font-heading-h2-300 font-[number:var(--heading-h2-300-font-weight)] text-black text-[length:var(--heading-h2-300-font-size)] leading-[var(--heading-h2-300-line-height)] relative tracking-[var(--heading-h2-300-letter-spacing)] [font-style:var(--heading-h2-300-font-style)]">
        직무필터
      </h2>

      <div className="flex items-center gap-2.5 px-6 py-[31px] relative self-stretch w-full flex-[0_0_auto] rounded-[10px] border border-solid border-[#a7a7aa]">
        <div className="flex flex-col w-[232px] items-start gap-5 relative">
          <div className="flex flex-col items-start gap-[30px] relative self-stretch w-full flex-[0_0_auto]">
            {categoryRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]"
              >
                {row.map((category, colIndex) =>
                  renderCategoryButton(category, colIndex),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
