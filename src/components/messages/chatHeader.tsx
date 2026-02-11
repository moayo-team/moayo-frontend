import { useOtherUserProfile } from "../../hooks/useOtherUserProfile";
import profilePhoto from "../../assets/white.svg";
import type { ChatRoomSummary } from "../../types/message";
import { useNavigate } from "react-router-dom";

type Props = {
  thread?: ChatRoomSummary;
};

export default function ChatHeader({ thread }: Props) {
  const opponentId = thread?.opponentUserId;
  const navigate = useNavigate();
  const { data: OtherProfileResult } = useOtherUserProfile(opponentId);

  const displayName = OtherProfileResult
    ? OtherProfileResult.name
    : thread
    ? `User #${thread.opponentUserId}`
    : "-";

  const email = OtherProfileResult?.email ?? "-";

  const rawUrl =
    OtherProfileResult?.imageUrl ?? thread?.opponentImageUrl ?? null;

  const avatarUrl = (() => {
    const url = rawUrl;
    if (!url || url === "default_url") return profilePhoto;
    return url.startsWith("http")
      ? url
      : `${import.meta.env.VITE_API_BASE_URL}${url}`;
  })();

  const isDefaultAvatar = avatarUrl === profilePhoto;

  return (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center">
          <img
            src={avatarUrl}
            alt={displayName}
            className={[
              "h-full w-full",
              isDefaultAvatar ? "object-contain p-2" : "object-cover",
            ].join(" ")}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = profilePhoto;
              e.currentTarget.className = "h-full w-full object-contain p-2";
            }}
          />
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-900">
            {displayName}
          </div>
          <div className="text-xs text-gray-500">{email}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-600">
        <button
          className="hover:text-gray-900"
          type="button"
          onClick={() => {
            if (!thread) return;
            navigate("/profile", { state: { userId: thread.opponentUserId } });
          }}
        >
          프로필 바로가기
        </button>
      </div>
    </div>
  );
}
