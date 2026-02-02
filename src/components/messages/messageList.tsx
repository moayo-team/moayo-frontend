import MessageBubble from "./messageBubble";
import type { ChatMessage } from "../../types/message";

type Props = {
  messages: ChatMessage[];
  currentUserId: number;
};

export default function MessageList({ messages, currentUserId }: Props) {
  return (
    <>
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} currentUserId={currentUserId} />
      ))}
    </>
  );
}
