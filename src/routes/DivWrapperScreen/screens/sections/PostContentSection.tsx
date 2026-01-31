import { useState } from "react";
import type { JSX } from "react";

interface ToolbarButton {
  id: string;
  label: string;
}

interface FormattingButton {
  id: string;
  content: string;
  className: string;
}

export const PostContentSection = (): JSX.Element => {
  const [content, setContent] = useState(
    "본문을 입력해주세요.\n[본문 가이드]\n요구역량을 작성해주세요.",
  );
  const [selectedFormat, setSelectedFormat] = useState<string>("본문");
  const [selectedFont, setSelectedFont] = useState<string>("서체");
  const [fontSize, setFontSize] = useState<string>("15px");

  const toolbarButtons: ToolbarButton[] = [
    { id: "format", label: "본문" },
    { id: "font", label: "서체" },
    { id: "size", label: "15px" },
  ];

  const formattingButtons: FormattingButton[] = [
    {
      id: "bold",
      content: "B",
      className:
        "relative w-fit mt-[-1.00px] [font-family:'Pretendard-Bold',Helvetica] font-normal text-black text-lg tracking-[0] leading-[18px]",
    },
    {
      id: "italic",
      content: "I",
      className:
        "relative w-fit mt-[-1.00px] [font-family:'Dancing_Script',Helvetica] font-bold text-black text-lg tracking-[0] leading-[27px] whitespace-nowrap",
    },
    {
      id: "strikethrough",
      content: "S",
      className:
        "relative w-fit mt-[-1.00px] [font-family:'Pretendard_Variable-Regular',Helvetica] font-normal text-black text-lg tracking-[0] leading-[27px] line-through whitespace-nowrap",
    },
  ];

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <section
      className="flex flex-col w-[999px] h-[417px] items-start gap-2.5 px-[38px] py-8 absolute top-[471px] left-[391px] rounded-[10px] border border-solid border-[#d6d6d8]"
      aria-label="게시물 콘텐츠 편집 섹션"
    >
      <div className="flex flex-col items-start gap-[51px] relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
          <div
            className="relative flex-[0_0_auto]"
            role="toolbar"
            aria-label="파일 도구"
          >
            <img
              className="relative flex-[0_0_auto]"
              alt="파일 도구 아이콘"
              src="https://c.animaapp.com/mknptopiampEkf/img/frame-427319105.svg"
            />
          </div>

          <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
            <div
              className="inline-flex items-center gap-3.5 relative flex-[0_0_auto]"
              role="group"
              aria-label="텍스트 스타일 선택"
            >
              {toolbarButtons.map((button) => (
                <button
                  key={button.id}
                  className="flex w-[149px] items-center gap-2.5 p-[5px] relative bg-primaryprimary-50 rounded-[5px] hover:bg-primaryprimary-300 focus:outline-none focus:ring-2 focus:ring-primaryprimary-500 transition-colors"
                  aria-label={`${button.label} 선택`}
                  type="button"
                >
                  <span className="w-fit mt-[-1.00px] font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-black text-[length:var(--body-b1-200-font-size)] leading-[var(--body-b1-200-line-height)] whitespace-nowrap relative tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)]">
                    {button.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-[23px] relative flex-[0_0_auto]">
              <div
                className="inline-flex items-center gap-4 relative flex-[0_0_auto]"
                role="group"
                aria-label="텍스트 서식"
              >
                {formattingButtons.map((button) => (
                  <button
                    key={button.id}
                    className={`${button.className} hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-primaryprimary-500 rounded transition-opacity`}
                    aria-label={`${button.id} 서식 적용`}
                    type="button"
                  >
                    {button.id === "bold" ? (
                      <span className="font-[number:var(--body-b1-200-font-weight)] leading-[var(--body-b1-200-line-height)] font-body-b1-200 [font-style:var(--body-b1-200-font-style)] tracking-[var(--body-b1-200-letter-spacing)] text-[length:var(--body-b1-200-font-size)]">
                        {button.content}
                      </span>
                    ) : (
                      button.content
                    )}
                  </button>
                ))}

                <button
                  className="relative flex-[0_0_auto] hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-primaryprimary-500 rounded transition-opacity"
                  aria-label="추가 서식 옵션"
                  type="button"
                >
                  <img
                    alt="추가 서식 옵션"
                    src="https://c.animaapp.com/mknptopiampEkf/img/frame-427319094.svg"
                  />
                </button>
              </div>

              <div
                className="flex w-[60px] items-center justify-between relative"
                role="group"
                aria-label="텍스트 크기 조정"
              >
                <button
                  className="flex flex-col w-[19.64px] items-center relative hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-primaryprimary-500 rounded transition-opacity"
                  aria-label="텍스트 크기 증가"
                  type="button"
                >
                  <div className="relative w-fit mt-[-1.09px] [font-family:'Pretendard-Medium',Helvetica] font-medium text-black text-[19.6px] tracking-[0] leading-[19.6px] whitespace-nowrap">
                    A
                  </div>
                  <div className="relative self-stretch w-full h-[3.27px] bg-gray-scalebk" />
                </button>

                <button
                  className="relative w-[19.64px] hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-primaryprimary-500 rounded transition-opacity"
                  aria-label="텍스트 크기 감소"
                  type="button"
                >
                  <img
                    alt="텍스트 크기 감소"
                    src="https://c.animaapp.com/mknptopiampEkf/img/frame-427319101.svg"
                  />
                </button>
              </div>

              <div
                className="relative w-[122px] mr-[-1.00px]"
                role="group"
                aria-label="텍스트 정렬"
              >
                <img
                  className="relative w-[122px] mr-[-1.00px]"
                  alt="텍스트 정렬 옵션"
                  src="https://c.animaapp.com/mknptopiampEkf/img/frame-427319099.svg"
                />
              </div>
            </div>
          </div>
        </div>

        <label htmlFor="post-content" className="sr-only">
          게시물 본문 입력
        </label>
        <textarea
          id="post-content"
          value={content}
          onChange={handleContentChange}
          className="w-full min-h-[100px] font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-black text-[length:var(--body-b1-200-font-size)] leading-[var(--body-b1-200-line-height)] relative tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)] resize-none focus:outline-none"
          placeholder="본문을 입력해주세요."
          aria-describedby="content-guide"
        />
      </div>

      <div
        className="absolute top-[59px] left-[638px] w-3 h-6 rotate-90"
        aria-hidden="true"
      />
    </section>
  );
};
