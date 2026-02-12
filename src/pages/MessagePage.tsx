import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ThreadList from "../components/messages/threadList";
import ChatPanel from "../components/messages/chatPanel";
import { useChatRoom } from "../hooks/useChatRoom";
import { useChatRooms } from "../hooks/useChatRooms";
import { apiClient } from "../lib/apiClient";
import type { ChatRoomSummary, ChatMessage } from "../types/message";

export default function MessagePage() {
  const location = useLocation();
  const currentUserId = Number(import.meta.env.VITE_MOAYO_USER_ID || 0);
  const initialRoomId = (location.state as { roomId?: number } | null)?.roomId;
  const initialRoomAppliedRef = useRef(false);

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const { rooms: roomSummaries, loading, error, setRooms } = useChatRooms(selectedRoomId);

  useEffect(() => {
    if (initialRoomAppliedRef.current) return;
    if (!Number.isFinite(initialRoomId)) return;

    setSelectedRoomId(Number(initialRoomId));
    initialRoomAppliedRef.current = true;
  }, [initialRoomId]);

  useEffect(() => {
    if (selectedRoomId == null && roomSummaries.length > 0) {
      setSelectedRoomId(roomSummaries[0].roomId);
    }
  }, [roomSummaries, selectedRoomId]);

  const selectedRoom: ChatRoomSummary | undefined = useMemo(
    () => roomSummaries.find((r) => r.roomId === selectedRoomId),
    [roomSummaries, selectedRoomId]
  );

  const { connected, sending, meId, messages, input, setInput, send } = useChatRoom({
    roomId: selectedRoomId,
    currentUserId: currentUserId || undefined
  });

  const myId = meId ?? currentUserId ?? 0;

  const handleSelectRoom = (roomId: number) => {
    setSelectedRoomId(roomId);

    setRooms((prev) =>
      prev.map((room) => (room.roomId === roomId ? { ...room, hasUnread: false } : room))
    );

    apiClient.patch(`/api/v1/chat/rooms/${roomId}/read`).catch((e) => {
      console.error("[CHAT] read current room error", e);
    });
  };

  useEffect(() => {
    if (!selectedRoomId) return;
    if (!messages.length) return;

    const last: ChatMessage = messages[messages.length - 1];
    const lastRoomId = Number(
      (last as any).chatRoomId ?? (last as any).roomId ?? (last as any).chatRoomID
    );

    if (Number.isFinite(lastRoomId) && lastRoomId !== selectedRoomId) return;

    setRooms((prev) =>
      prev.map((room) =>
        room.roomId === selectedRoomId
          ? {
              ...room,
              lastMessageContent: last.content,
              lastMessageCreatedAt: last.createdAt,
              hasUnread: false
            }
          : room
      )
    );

    apiClient.patch(`/api/v1/chat/rooms/${selectedRoomId}/read`).catch((e) => {
      console.error("[CHAT] read on message change error", e);
    });
  }, [messages, selectedRoomId, setRooms]);

  if (loading && roomSummaries.length === 0) {
    return (
      <div className="bg-white">
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-[12px] border border-[#ECE7DF] bg-[#FBFAF9] p-5 text-sm text-[#7A7368]">
            쪽지함 목록 불러오는 중…
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white">
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-[12px] border border-[#F3C6C6] bg-[#FFF5F5] p-5 text-sm text-[#D14B4B]">
            쪽지함 목록 로드 실패: {String(error)}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <main className="w-full">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-end justify-between mb-5 sm:mb-6">
            <h1 className="text-[22px] sm:text-[26px] xl:text-[28px] font-bold leading-[1.3] text-[#25221D]">
              쪽지함
            </h1>
          </div>

          <div
            className="
              grid grid-cols-1 md:grid-cols-[380px_1fr] gap-4 md:gap-6
              h-[calc(100vh-190px)] min-h-[600px]
              xl:h-[680px]
            "
          >
            <aside
              className="
                order-2 md:order-1
                h-full
                rounded-[12px] border border-[#ECE7DF] bg-[#FBFAF9]
                overflow-hidden
                flex flex-col
              "
            >
              <div className="px-5 py-4 border-b border-[#ECE7DF] bg-white">
                <div className="text-[14px] font-semibold text-[#342F28]">대화 목록</div>
              </div>

              <div className="h-full overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
                <ThreadList
                  threads={roomSummaries}
                  selectedRoomId={selectedRoomId}
                  onSelectRoom={handleSelectRoom}
                />
              </div>
            </aside>

            <section
              className="
                order-1 md:order-2
                h-full
                rounded-[12px] border border-[#ECE7DF] bg-white
                overflow-hidden
                flex flex-col
              "
            >
              <div className="h-full">
                <ChatPanel
                  thread={selectedRoom as any}
                  messages={messages}
                  draft={input}
                  onDraftChange={setInput}
                  onSend={send}
                  currentUserId={myId}
                  connected={connected && !sending}
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
