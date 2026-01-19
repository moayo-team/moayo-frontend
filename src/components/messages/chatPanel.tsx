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
};

export default function ChatPanel({
  thread,
  messages,
  draft,
  onDraftChange,
  onSend,
  currentUserId,
}: Props) {
  return (
    <div className="h-full min-h-0 flex flex-col">
      <ChatHeader thread={thread} />

      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-4">
        <MessageList messages={messages} currentUserId={currentUserId} />
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <MessageComposer draft={draft} onDraftChange={onDraftChange} onSend={onSend} />
      </div>
    </div>
  );
}
