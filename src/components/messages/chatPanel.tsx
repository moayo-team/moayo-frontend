import { useEffect, useRef } from "react";
import ChatHeader from "./chatHeader";
import MessageList from "./messageList";
import MessageComposer from "./messageinput";
import type { ChatMessage, ChatRoomSummary } from "../../types/message";

type Props = {
  thread?: ChatRoomSummary;      // ✅ rooms API 기반으로 통일
  messages: ChatMessage[];       // ✅ 명확히
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
  connected = true,
}: Props) {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, thread?.roomId]); // ✅ chatRoomId -> roomId

  return (
    <div className="h-full min-h-0 flex flex-col">
      <ChatHeader thread={thread} />

      <div
        ref={scrollAreaRef}
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-6 py-5"
      >
        <div className="space-y-4">
          <MessageList messages={messages} currentUserId={currentUserId} />
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <MessageComposer
          draft={draft}
          onDraftChange={onDraftChange}
          onSend={onSend}
          disabled={!connected || !thread} // ✅ 방 선택 안되면 비활성화
        />
      </div>
    </div>
  );
}
