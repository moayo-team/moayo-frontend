import { useEffect } from 'react';
import type { JSX } from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isDeleting?: boolean;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "정말로 삭제하시겠습니까?",
  message = "영구 삭제되며, 되돌릴 수 없습니다.",
  isDeleting = false
}: DeleteConfirmationModalProps): JSX.Element | null => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackgroundClick}
    >
      <div className="inline-flex items-center justify-center gap-2.5 px-[50px] py-10 relative bg-gray-scalegray-scale-50 rounded-[30px] shadow-lg">
        <div className="flex flex-col w-[580px] items-start gap-5 relative">
          <div className="flex items-center justify-start relative self-stretch w-full flex-[0_0_auto]">
            <h1 className="font-heading-h1-200 font-[number:var(--heading-h1-200-font-weight)] text-gray-scalegray-scale-800 text-[length:var(--heading-h1-200-font-size)] tracking-[var(--heading-h1-200-letter-spacing)] leading-[var(--heading-h1-200-line-height)] relative w-fit mt-[-1.00px] [font-style:var(--heading-h1-200-font-style)]">
              {title}
            </h1>
          </div>

          <div className="flex flex-col items-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-[30px] relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
                <p className="font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-gray-scalegray-scale-600 text-[length:var(--heading-h3-300-font-size)] tracking-[var(--heading-h3-300-letter-spacing)] leading-[var(--heading-h3-300-line-height)] relative w-fit mt-[-1.00px] [font-style:var(--heading-h3-300-font-style)]">
                  {message}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 relative self-stretch w-full">
            <button
              className="all-[unset] box-border flex w-[143px] items-center justify-center gap-2.5 p-[15px] relative flex-[0_0_auto] bg-gray-scalegray-scale-100 rounded-[10px] cursor-pointer hover:bg-gray-scalegray-scale-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onClose}
              disabled={isDeleting}
              type="button"
              aria-label="취소"
            >
              <span className="relative w-fit mt-[-1.00px] font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-700 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
                취소
              </span>
            </button>
            <button
              className="all-[unset] box-border flex w-[143px] items-center justify-center gap-2.5 p-[15px] relative flex-[0_0_auto] bg-primaryprimary-300 rounded-[10px] cursor-pointer hover:bg-primaryprimary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleConfirm}
              disabled={isDeleting}
              type="button"
              aria-label="삭제 확인"
            >
              <span className="relative w-fit mt-[-1.00px] font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
                {isDeleting ? '삭제 중...' : '확인'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
