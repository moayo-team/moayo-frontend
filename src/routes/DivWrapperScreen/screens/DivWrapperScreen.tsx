import { JobFilterSection } from "./sections/JobFilterSection";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { PostContentSection } from "./sections/PostContentSection";
import { PostFiltersSection } from "./sections/PostFiltersSection";
import { PostTitleInputSection } from "./sections/PostTitleInputSection";
import { TagSelectionSection } from "./sections/TagSelectionSection";
import type { JSX } from "react";

export const DivWrapperScreen = (): JSX.Element => {
  return (
    <div className="relative w-[1440px] h-[1450px] bg-white">
      <NavigationBarSection />

      <div className="flex w-[998px] items-center justify-around gap-[766px] absolute top-[126px] left-[calc(50.00%_-_329px)]">
        <div className="inline-flex items-center gap-[22px] relative flex-[0_0_auto]">
          <h1 className="relative w-fit mt-[-1.00px] font-heading-h1-200 font-[number:var(--heading-h1-200-font-weight)] text-black text-[length:var(--heading-h1-200-font-size)] tracking-[var(--heading-h1-200-letter-spacing)] leading-[var(--heading-h1-200-line-height)] whitespace-nowrap [font-style:var(--heading-h1-200-font-style)]">
            게시판 글 작성하기
          </h1>
        </div>
      </div>

      <JobFilterSection />
      <PostTitleInputSection />
      <PostFiltersSection />
      <PostContentSection />
      <TagSelectionSection />

      <button className="all-[unset] box-border flex w-[227px] h-[74px] items-center justify-center gap-2.5 px-[15px] py-2.5 absolute top-[1159px] left-[776px] bg-primaryprimary-500 rounded-[10px]">
        <span className="relative w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
          게시글 등록하기
        </span>
      </button>
    </div>
  );
};
