import { useOtherUserProfile } from "../../hooks/useOtherUserProfile";
import profilePhoto from "../../assets/white.svg";
import type { ChatRoomSummary } from "../../types/message";

type Props = {
  thread: ChatRoomSummary;
  active: boolean;
  onClick: () => void;
};

export default function ThreadListItem({ thread, active, onClick }: Props) {
  const textColor = active ? "text-[#25221D]" : "text-[#5F5749]";
  const { data: OtherProfileResult } = useOtherUserProfile(thread.opponentUserId);

  const displayName = OtherProfileResult?.name ?? `User #${thread.opponentUserId}`;

  const resolvedAvatar = (() => {
    const url = OtherProfileResult?.imageUrl ?? thread.opponentImageUrl;
    if (!url || url === "default_url") return profilePhoto;

    if (url.startsWith("http") || url.startsWith("blob:")) return url;

    const base = String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${base}${path}`;
  })();

  const isDefaultAvatar = resolvedAvatar === profilePhoto;

  const preview = thread.lastMessageContent ?? "";
  const unread = thread.hasUnread;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full min-w-0 h-[93px] text-left rounded-[10px] transition-colors",
        "px-[14px] py-[12px]",
        active ? "bg-[#EFEEEB]" : "bg-[#FBFAF9] hover:bg-[#F3F2F0]",
        "shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-start gap-[10px] h-full min-w-0">
        <img
          src={resolvedAvatar}
          alt={displayName}
          className={[
            "h-10 w-10 rounded-full shrink-0",
            isDefaultAvatar ? "object-contain p-1" : "object-cover",
          ].join(" ")}
          onError={(e) => {
            e.currentTarget.src = profilePhoto;
          }}
        />

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex items-baseline gap-2 min-w-0">
            <span
              className={[
                "text-[16px] font-semibold leading-[140%] truncate min-w-0",
                textColor,
              ].join(" ")}
            >
              {displayName}
            </span>
          </div>

          <p
            className={[
              "mt-1 text-[13px] font-medium leading-[145%] tracking-[-0.01em] line-clamp-2",
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
