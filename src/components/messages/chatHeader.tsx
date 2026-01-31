import type { ChatParticipants } from "../../types/message";

type Props = {
  thread?: ChatParticipants & { name?: string };
};

export default function ChatHeader({ thread }: Props) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
          {thread?.name?.slice(0, 1) ?? "?"}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{thread?.name ?? "-"}</div>
          <div className="text-xs text-gray-500">rwd4533</div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-600">
        <button className="hover:text-gray-900">프로필 바로가기</button>
      </div>
    </div>
  );
}
