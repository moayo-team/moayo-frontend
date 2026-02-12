import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ThreadList from "../components/messages/threadList";
import ChatPanel from "../components/messages/chatPanel";
import { useChatRoom } from "../hooks/useChatRoom";
import { useChatThreadListPolling } from "../hooks/useChatThreadListPolling";
import { apiClient } from "../lib/apiClient";
import type { ChatRoomSummary, ChatMessage } from "../types/message";

export default function MessagePage() {
  const location = useLocation();
  const currentUserId = Number(import.meta.env.VITE_MOAYO_USER_ID || 0);
  const initialRoomId = (location.state as { roomId?: number } | null)?.roomId;
  const initialRoomAppliedRef = useRef(false);

  const { threads: polledRooms, loading, error } = useChatThreadListPolling({
    intervalMs: 1500
  });

  const [roomSummaries, setRoomSummaries] = useState<ChatRoomSummary[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  useEffect(() => {
    if (initialRoomAppliedRef.current) return;
    if (!Number.isFinite(initialRoomId)) return;

    setSelectedRoomId(Number(initialRoomId));
    initialRoomAppliedRef.current = true;
  }, [initialRoomId]);

  useEffect(() => {
    if (!polledRooms.length) return;

    setRoomSummaries((prev) => {
      if (!prev.length) return polledRooms;

      const prevMap = new Map<number, ChatRoomSummary>(
        prev.map((r) => [r.roomId, r])
      );

      const next: ChatRoomSummary[] = [];

      for (const item of polledRooms) {
        const prevItem = prevMap.get(item.roomId);

        if (!prevItem) {
          next.push(item);
          continue;
        }

        if (item.roomId === selectedRoomId) {
          next.push({ ...prevItem, hasUnread: false });
          continue;
        }

        const messageChanged =
          prevItem.lastMessageCreatedAt !== item.lastMessageCreatedAt ||
          prevItem.lastMessageContent !== item.lastMessageContent ||
          prevItem.hasUnread !== item.hasUnread;

        if (!messageChanged) {
          next.push(prevItem);
        } else {
          next.push({
            ...prevItem,
            lastMessageContent: item.lastMessageContent,
            lastMessageCreatedAt: item.lastMessageCreatedAt,
            hasUnread: item.hasUnread
          });
        }
      }

      return next;
    });
  }, [polledRooms, selectedRoomId]);

  useEffect(() => {
    if (selectedRoomId == null && roomSummaries.length > 0) {
      setSelectedRoomId(roomSummaries[0].roomId);
    }
  }, [roomSummaries, selectedRoomId]);

  const selectedRoom: ChatRoomSummary | undefined = useMemo(
    () => roomSummaries.find((r) => r.roomId === selectedRoomId),
    [roomSummaries, selectedRoomId]
  );

  const { connected, sending, meId, messages, input, setInput, send } =
    useChatRoom({
      roomId: selectedRoomId,
      currentUserId: currentUserId || undefined
    });

  const myId = meId ?? currentUserId ?? 0;

  const handleSelectRoom = (roomId: number) => {
    setSelectedRoomId(roomId);

    setRoomSummaries((prev) =>
      prev.map((room) =>
        room.roomId === roomId ? { ...room, hasUnread: false } : room
      )
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

    setRoomSummaries((prev) =>
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
  }, [messages, selectedRoomId]);

  if (loading && roomSummaries.length === 0) {
    return (
      <div className="bg-white p-6">
        <div className="text-sm text-gray-500">쪽지함 목록 불러오는 중…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6">
        <div className="text-sm text-red-600">
          쪽지함 목록 로드 실패: {String(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <main className="w-full">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-[22px] sm:text-[26px] xl:text-[28px] font-bold leading-[1.3] mb-4 sm:mb-6">
            쪽지함 목록
          </h1>
          <div
            className="
              flex flex-col md:flex-row gap-4 md:gap-6
              h-[calc(100vh-170px)] min-h-[560px]
              xl:h-[620px]
            "
          >
            <aside
              className="
                order-2 md:order-1
                w-full
                md:w-[360px] lg:w-[403px]
                h-full
                rounded-[10px] border border-[#ADA395] bg-white overflow-hidden
                flex flex-col
              "
            >
              <div className="h-full overflow-y-auto p-4 sm:p-6 xl:p-[31px_24px]">
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
                w-full
                h-full
                md:flex-1
                rounded-[10px] border border-[#ADA395] bg-white overflow-hidden
                flex flex-col
                xl:w-[904px] xl:flex-none
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
