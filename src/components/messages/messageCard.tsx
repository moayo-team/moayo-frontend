import { useOtherUserProfile } from "../../hooks/useOtherUserProfile";
import profilePhoto from "../../assets/profile_photo.svg";
import type { ChatRoomSummary } from "../../types/message";

type Props = {
  thread: ChatRoomSummary;
  active: boolean;
  onClick: () => void;
};

export default function ThreadListItem({ thread, active, onClick }: Props) {
  const textColor = active ? "text-[#25221D]" : "text-[#5F5749]";
  const { data: OtherProfileResult } = useOtherUserProfile(thread.opponentUserId);
  const displayName = OtherProfileResult
		? OtherProfileResult.name
		: thread
		? `User #${thread.opponentUserId}`
		: "-";

  const resolvedAvatar = (() => {
    const url = OtherProfileResult?.imageUrl ?? thread.opponentImageUrl;
    if (!url || url === "default_url") return profilePhoto;
    return url.startsWith("http")
      ? url
      : `${import.meta.env.VITE_API_BASE_URL}${url}`;
  })();

  const title = displayName;
  const preview = thread.lastMessageContent ?? "";
  const unread = thread.hasUnread;

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
      <div className="flex items-start gap-[10px] h-full">
        <img
          src={resolvedAvatar}
          alt={displayName}
          className="h-10 w-10 rounded-full object-cover bg-gray-200 flex-shrink-0"
          onError={(e) => {
            e.currentTarget.src = profilePhoto;
          }}
        />
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex items-baseline gap-2">
            <span
              className={[
                "text-[18px] font-semibold leading-[140%] tracking-[0] truncate",
                textColor,
              ].join(" ")}
            >
              {title}
            </span>

            {/* role은 서버에 없어서 일단 비워둠 */}
            {/* 필요하면 나중에 opponentUserRole 같은 필드가 생길 때 추가 */}
          </div>

          <p
            className={[
              "mt-1 text-[14px] font-medium leading-[145%] tracking-[-0.01em] line-clamp-2",
              textColor,
            ].join(" ")}
          >
            {preview}
          </p>
        </div>

        {unread && (
          <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full bg-red-500" />
        )}
      </div>
    </button>
  );
}
