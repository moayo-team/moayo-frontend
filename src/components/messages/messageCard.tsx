import type { ChatParticipants } from "../../types/message";

type Props = {
  thread: ChatParticipants;
  active: boolean;
  onClick: () => void;
};

export default function ThreadListItem({ thread, active, onClick }: Props) {
  const textColor = active ? "text-[#25221D]" : "text-[#5F5749]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-[355px] h-[93px] text-left rounded-[10px] transition-colors",
        "px-[15px] py-[16px]",
        active ? "bg-[#EFEEEB]" : "bg-[#FBFAF9] hover:bg-[#F3F2F0]",
        "shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-[10px] h-full">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex items-baseline gap-2">
            <span
              className={[
                "text-[18px] font-semibold leading-[140%] tracking-[0] truncate",
                textColor,
              ].join(" ")}
            >
              {thread.name}
            </span>
            <span
              className={[
                "text-[12px] font-bold leading-[145%] tracking-[-0.01em] shrink-0",
                textColor,
              ].join(" ")}
            >
              {thread.role}
            </span>
          </div>

          <p
            className={[
              "mt-1 text-[14px] font-medium leading-[145%] tracking-[-0.01em] line-clamp-2",
              textColor,
            ].join(" ")}
          >
            {thread.preview}
          </p>
        </div>

        {thread.unread && (
          <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full bg-red-500" />
        )}
      </div>
    </button>
  );
}
