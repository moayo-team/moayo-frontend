import MessageBubble from "./messageBubble";
import type { Message } from "../../types/message";

type Props = {
  messages: Message[];
  currentUserId: string;
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
