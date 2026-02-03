import type { ChatMessage } from "../../types/message";

type Props = {
  message: ChatMessage;
  currentUserId: number;
};

function formatHHMM(v: string | Date): string {
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return "--:--";
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
            "inline-block rounded-2xl px-5 py-3 text-sm leading-relaxed text-[#25221D]",
            isMine ? "bg-[#6EEBC7] rounded-tr-xl" : "bg-[#E9FCF7] rounded-tl-xl",
          ].join(" ")}
        >
          {message.isDeleted ? (
            <span className="text-gray-500">삭제된 메시지입니다.</span>
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
