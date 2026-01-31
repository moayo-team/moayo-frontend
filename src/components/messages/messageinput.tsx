type Props = {
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export default function MessageComposer({
  draft,
  onDraftChange,
  onSend,
  disabled = false,
}: Props) {
  const handleSend = () => {
    if (disabled) return;
    onSend();
  };

  return (
    <div className="relative w-full">
      <input
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => {
          // 한글 조합 중 Enter는 전송으로 처리하면 안 됨
          if ((e as any).isComposing) return;

          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="입력해주세요"
        disabled={disabled}
        className="w-full h-16 rounded-[5px] border border-gray-200 pl-4 pr-[120px] text-sm outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
      />

      <button
        type="button"
        onClick={handleSend}
        disabled={disabled}
        className={[
          "absolute right-5 top-1/2 -translate-y-1/2",
          "h-[43px] min-w-[72px]",
          "rounded-[10px] px-[20px] py-[8px]",
          "font-pretendard text-[18px] font-medium leading-[145%] tracking-normal",
          disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-[#EFEEEB] text-[#25221D] hover:bg-gray-400 active:bg-gray-400 transition",
        ].join(" ")}
      >
        전송
      </button>
    </div>
  );
}
