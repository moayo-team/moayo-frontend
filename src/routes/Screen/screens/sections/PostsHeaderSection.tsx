import type { JSX } from "react";

export const PostsHeaderSection = (): JSX.Element => {
  const handleAddPost = () => {
    console.log("Add post clicked");
  };

  return (
    <header className="flex w-[1023px] items-center justify-between absolute top-32 left-[367px]">
      <h1 className="relative w-fit font-heading-h1-200 font-[number:var(--heading-h1-200-font-weight)] text-black text-[length:var(--heading-h1-200-font-size)] tracking-[var(--heading-h1-200-letter-spacing)] leading-[var(--heading-h1-200-line-height)] whitespace-nowrap [font-style:var(--heading-h1-200-font-style)]">
        내가 쓴 게시글
      </h1>

      <button
        className="all-[unset] box-border w-[143px] p-[15px] bg-primaryprimary-300 rounded-[10px] flex items-center justify-center gap-2.5 relative cursor-pointer hover:bg-primaryprimary-400 focus:outline-none focus:ring-2 focus:ring-primaryprimary-500 focus:ring-offset-2 transition-colors"
        onClick={handleAddPost}
        type="button"
        aria-label="게시글 추가"
      >
        <span className="relative w-fit mt-[-1.00px] font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
          게시글 추가
        </span>
      </button>
    </header>
  );
};
