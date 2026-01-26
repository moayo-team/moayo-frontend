type Props = {
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
};

export default function MessageComposer({ draft, onDraftChange, onSend }: Props) {
  return (
    <div className="relative w-full">
      <input
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSend();
        }}
        placeholder="입력해주세요"

        className="w-full h-16 rounded-[5px] border border-gray-200 pl-4 pr-[120px] text-sm outline-none focus:ring-2 focus:ring-gray-200"
      />

      <button
        type="button"
        onClick={onSend}
        className={[
          "absolute right-5 top-1/2 -translate-y-1/2",
          "h-[43px] min-w-[72px]",
          "rounded-[10px] px-[20px] py-[8px]",
          "font-pretendard text-[18px] font-medium leading-[145%] tracking-normal",
          "bg-[#EFEEEB] text-[#25221D]",
          "hover:bg-gray-400 active:bg-gray-400 transition",
        ].join(" ")}
      >
        전송
      </button>
    </div>
  );
}
