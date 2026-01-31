import { useEffect, useRef } from "react";
import ChatHeader from "./chatHeader";
import MessageList from "./messageList";
import MessageComposer from "./messageinput";
import type { ChatParticipants, Message } from "../../types/message";

type Props = {
  thread?: ChatParticipants;
  messages: Message[];
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  currentUserId: string;
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
  }, [messages.length, thread?.chatRoomId]);

  return (
    <div className="h-full min-h-0 flex flex-col">
      <ChatHeader thread={thread as any} />

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
          disabled={!connected}
        />
      </div>
    </div>
  );
}
