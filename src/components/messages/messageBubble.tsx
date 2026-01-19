import type { Message } from "../../types/message";

type Props = {
  message: Message;
  currentUserId: string;
};

function formatHHMM(date: Date): string {
  const d = date instanceof Date ? date : new Date(date);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function MessageBubble({ message, currentUserId }: Props) {
  const isMine = message.senderId === currentUserId;

  return (
    <div className={isMine ? "flex justify-end" : "flex justify-start"}>
      <div className={isMine ? "max-w-[70%] text-right" : "max-w-[70%]"}>
        <div
          className={[
            "inline-block rounded-2xl px-5 py-3 text-sm leading-relaxed",
            isMine
              ? "bg-primary-300 text-gray-900 rounded-tr-xl"
              : "bg-primary-50 text-gray-900 rounded-tl-xl",
          ].join(" ")}
        >
          {message.is_deleted ? (
            <span className="text-gray-400">삭제된 메시지입니다.</span>
          ) : (
            message.content
          )}
        </div>

        <div className="mt-1 text-[11px] text-gray-400">
          {formatHHMM(message.createdAt)}
        </div>
      </div>
    </div>
  );
}
