import { useOtherUserProfile } from "../../hooks/useOtherUserProfile";
import type { ChatRoomSummary } from "../../types/message";

type Props = {
  thread?: ChatRoomSummary;
};

export default function ChatHeader({ thread }: Props) {
  const opponentId = thread?.opponentUserId;

	const { data: OtherProfileResult } = useOtherUserProfile(opponentId);

	const displayName = OtherProfileResult
		? OtherProfileResult.name
		: thread
		? `User #${thread.opponentUserId}`
		: "-";


  const avatarUrl = thread?.opponentImageUrl ?? null;

  return (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* 아바타 */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-10 w-10 rounded-full object-cover bg-gray-200"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
            {displayName.slice(0, 1)}
          </div>
        )}

        <div>
          <div className="text-sm font-semibold text-gray-900">{displayName}</div>

          {/* 더미 텍스트 대신 roomId 표시 (원하면 삭제 가능) */}
          <div className="text-xs text-gray-500">
            {thread ? `roomId: ${thread.roomId}` : ""}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-600">
        <button
          className="hover:text-gray-900"
          type="button"
          onClick={() => {
            if (!thread) return;
            // TODO: 상대 프로필 페이지 라우팅이 생기면 여기 연결
            console.log("go profile:", thread.opponentUserId);
          }}
        >
          프로필 바로가기
        </button>
      </div>
    </div>
  );
}
