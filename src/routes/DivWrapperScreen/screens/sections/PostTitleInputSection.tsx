import { useState } from "react";
import type { JSX } from "react";

export const PostTitleInputSection = (): JSX.Element => {
  const [title, setTitle] = useState("");

  return (
    <div className="flex w-[999px] h-[71px] items-center gap-[30px] absolute top-[215px] left-[391px]">
      <label
        htmlFor="post-title-input"
        className="relative w-fit font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-black text-[length:var(--heading-h3-300-font-size)] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] whitespace-nowrap [font-style:var(--heading-h3-300-font-style)]"
      >
        제목
      </label>

      <div className="flex flex-col h-[71px] items-start justify-center gap-2.5 p-5 relative flex-1 grow rounded-[10px] border border-solid border-[#d6d6d8]">
        <input
          id="post-title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="입력해주세요."
          className="w-full font-body-b1-100 font-[number:var(--body-b1-100-font-weight)] text-black text-[length:var(--body-b1-100-font-size)] tracking-[var(--body-b1-100-letter-spacing)] leading-[var(--body-b1-100-line-height)] [font-style:var(--body-b1-100-font-style)] placeholder:text-gray-scalegray-scale-400"
          aria-label="제목"
        />
      </div>
    </div>
  );
};
