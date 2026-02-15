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
	disabled = false
}: Props) {
	const handleSend = () => {
		console.log("[UI] handleSend clicked", { disabled }); // 🟣 디버그 로그
		if (disabled) return;
		onSend();
	};

	return (
		<div className="relative w-full">
			<input
				value={draft}
				onChange={(e) => onDraftChange(e.target.value)}
				onKeyDown={(e) => {
					// 한글 조합 중 Enter는 전송 X
					if ((e as any).isComposing) return;

					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						console.log("[UI] Enter pressed"); // 🟣 디버그 로그
						handleSend();
					}
				}}
				placeholder="입력해주세요"
				disabled={disabled}
				className="w-full h-16 rounded-[5px] border border-gray-200 pl-5 pr-[100px] text-[15px] outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
			/>

			<button
				type="button"
				onClick={handleSend}
				disabled={disabled}
				className={[
					"absolute right-3 top-1/2 -translate-y-1/2",
					"h-[40px] min-w-[70px]",
					"rounded-[10px] px-4",
					"font-pretendard text-[14px] font-medium leading-[145%] tracking-normal",
					disabled
						? "bg-gray-200 text-gray-500 cursor-not-allowed"
						: "bg-[#EFEEEB] text-[#25221D] hover:bg-gray-400 active:bg-gray-400 transition"
				].join(" ")}
			>
				전송
			</button>
		</div>
	);
}
