import type { ChatParticipants } from "../../types/message";

type Props = {
  thread: ChatParticipants;
  active: boolean;
  onClick: () => void;
};

export default function ThreadListItem({ thread, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left rounded-2xl transition-colors",
        "px-4 py-3",
        active ? "bg-zinc-200" : "bg-zinc-100 hover:bg-zinc-150",
        "shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">
              {thread.name}
            </span>
            <span className="text-xs text-zinc-500">{thread.role}</span>
          </div>

          <p className="mt-1 text-xs text-zinc-600 line-clamp-2">
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
