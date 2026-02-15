import { useEffect, useRef } from "react";
import ChatHeader from "./chatHeader";
import MessageList from "./messageList";
import MessageComposer from "./messageinput";
import type { ChatMessage, ChatRoomSummary } from "../../types/message";

type Props = {
	thread?: ChatRoomSummary;
	messages: ChatMessage[];
	draft: string;
	onDraftChange: (v: string) => void;
	onSend: () => void;
	currentUserId: number;
	connected?: boolean;
};

export default function ChatPanel({
	thread,
	messages,
	draft,
	onDraftChange,
	onSend,
	currentUserId,
	connected = true
}: Props) {
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);
	const bottomRef = useRef<HTMLDivElement | null>(null);

	// ✅ 메시지 리스트 변경되면 항상 아래로 "딱" 고정 (애니메이션 X)
	useEffect(() => {
		const container = scrollAreaRef.current;
		if (!container) return;

		// 스크롤을 컨테이너 제일 아래로
		container.scrollTop = container.scrollHeight;
	}, [messages.length, thread?.roomId]);

	return (
		<div className="h-full min-h-0 flex flex-col">
			<ChatHeader thread={thread} />

			<div
				ref={scrollAreaRef}
				className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 sm:px-6 py-5"
			>
				<div className="space-y-4">
					<MessageList messages={messages} currentUserId={currentUserId} />
					<div ref={bottomRef} />
				</div>
			</div>

			<div className="px-5 py-4 border-t border-gray-200">
				<MessageComposer
					draft={draft}
					onDraftChange={onDraftChange}
					onSend={onSend}
					disabled={!connected || !thread}
				/>
			</div>
		</div>
	);
}
