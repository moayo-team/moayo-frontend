import { useState } from "react";
import type { JSX } from "react";


export const Screen = (): JSX.Element => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = () => {
    setIsDeleting(true);
    // Add your delete logic here
  };

  return (
    <div className="inline-flex items-center justify-center gap-2.5 px-[50px] py-10 relative bg-gray-scalegray-scale-50 rounded-[30px]">
      <div className="flex flex-col w-[580px] items-end gap-5 relative">
        <div className="flex items-center justify-around gap-[310px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="inline-flex items-center gap-2.5 relative flex-[0_0_auto]">
            <h1 className="font-heading-h1-200 font-(--heading-h1-200-font-weight) text-gray-scalegray-scale-800 text-[length:var(--heading-h1-200-font-size)] tracking-[var(--heading-h1-200-letter-spacing)] leading-[var(--heading-h1-200-line-height)] relative w-fit mt-[-1.00px] whitespace-nowrap [font-style:var(--heading-h1-200-font-style)]">
              정말로 삭제하시겠습니까?
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col items-start gap-[30px] relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
              <p className="font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-gray-scalegray-scale-600 text-[length:var(--heading-h3-300-font-size)] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] relative w-fit mt-[-1.00px] whitespace-nowrap [font-style:var(--heading-h3-300-font-style)]">
                영구 삭제되며, 되돌릴 수 없습니다.
              </p>
            </div>
          </div>
        </div>

        <button
          className="all-[unset] box-border flex w-[143px] items-center justify-center gap-2.5 p-[15px] relative flex-[0_0_auto] bg-primaryprimary-300 rounded-[10px] cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleConfirm}
          disabled={isDeleting}
          type="button"
          aria-label="삭제 확인"
        >
          <span className="relative w-fit mt-[-1.00px] font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
            확인
          </span>
        </button>
      </div>
    </div>
  );
};
