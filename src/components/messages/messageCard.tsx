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
        "w-full text-left rounded-[10px] border transition",
        active ? "border-transparent bg-emerald-200/70" : "border-gray-200 bg-gray-50 hover:bg-gray-100",
      ].join(" ")}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{thread.name}</span>
              <span className="text-xs text-gray-500">{thread.role}</span>
            </div>
            <p className="mt-1 text-xs text-gray-700 line-clamp-2">{thread.preview}</p>
          </div>

          {thread.unread && <span className="mt-1 inline-block h-2 w-2 rounded-full bg-red-500" />}
        </div>
      </div>
    </button>
  );
}
