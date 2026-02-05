import { useEffect, useMemo, useState } from "react";
import ThreadList from "../components/messages/threadList";
import ChatPanel from "../components/messages/chatPanel";
import { useChatRoom } from "../hooks/useChatRoom";
import { useChatThreadListPolling } from "../hooks/useChatThreadListPolling";
import { apiClient } from "../lib/apiClient";
import type { ChatRoomSummary, ChatMessage } from "../types/message";

export default function MessagePage() {
  const currentUserId = Number(import.meta.env.VITE_MOAYO_USER_ID || 0);

  // 1) 채팅방 목록 polling
  const { threads: polledRooms, loading, error } = useChatThreadListPolling({
    intervalMs: 1500,
  });

  // 2) UI에서 쓸 채팅방 목록 상태
  const [roomSummaries, setRoomSummaries] = useState<ChatRoomSummary[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  // ✅ 방별 메시지 캐시(전환 자연화)
  const [messageCache, setMessageCache] = useState<Record<number, ChatMessage[]>>(
    {}
  );

  // 2-1) polling 결과 diff 반영
  useEffect(() => {
    if (!polledRooms.length) return;

    setRoomSummaries((prev) => {
      if (!prev.length) return polledRooms;

      const prevMap = new Map<number, ChatRoomSummary>(prev.map((r) => [r.roomId, r]));
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

        if (!messageChanged) next.push(prevItem);
        else {
          next.push({
            ...prevItem,
            lastMessageContent: item.lastMessageContent,
            lastMessageCreatedAt: item.lastMessageCreatedAt,
            hasUnread: item.hasUnread,
          });
        }
      }

      return next;
    });
  }, [polledRooms, selectedRoomId]);

  // 3) 첫 진입 시 첫 번째 방 자동 선택
  useEffect(() => {
    if (selectedRoomId == null && roomSummaries.length > 0) {
      setSelectedRoomId(roomSummaries[0].roomId);
    }
  }, [roomSummaries, selectedRoomId]);

  const selectedRoom: ChatRoomSummary | undefined = useMemo(
    () => roomSummaries.find((r) => r.roomId === selectedRoomId),
    [roomSummaries, selectedRoomId]
  );

  // 4) 선택한 방 메시지(STOMP + 과거)
  const {
    connected,
    sending,
    meId,
    messages,
    input,
    setInput,
    send,
  } = useChatRoom({
    roomId: selectedRoomId,
    currentUserId: currentUserId || undefined,
  });

  const myId = meId ?? currentUserId ?? 0;

  // ✅ 메시지 업데이트될 때 캐시에 저장 (방 전환 시 “빈 화면” 방지)
  useEffect(() => {
    if (!selectedRoomId) return;
    setMessageCache((prev) => ({
      ...prev,
      [selectedRoomId]: messages,
    }));
  }, [messages, selectedRoomId]);

  // ✅ 화면에 보여줄 메시지: 훅 messages가 비면 캐시를 보여줌
  const displayMessages = useMemo(() => {
    if (!selectedRoomId) return [];
    if (messages.length > 0) return messages;
    return messageCache[selectedRoomId] ?? [];
  }, [messages, messageCache, selectedRoomId]);

  // 5) 방 선택
  const handleSelectRoom = (roomId: number) => {
    setSelectedRoomId(roomId);

    // UI 빨간 점 제거
    setRoomSummaries((prev) =>
      prev.map((room) =>
        room.roomId === roomId ? { ...room, hasUnread: false } : room
      )
    );

    // 서버 읽음 처리
    apiClient.patch(`/api/v1/chat/rooms/${roomId}/read`).catch((e) => {
      console.error("[CHAT] read current room error", e);
    });
  };

  // 6) 선택된 방 messages 변할 때 최근 메시지 반영 + 읽음 처리
  useEffect(() => {
    if (!selectedRoomId) return;
    if (!messages.length) return;

    const last: ChatMessage = messages[messages.length - 1];

    setRoomSummaries((prev) =>
      prev.map((room) =>
        room.roomId === selectedRoomId
          ? {
              ...room,
              lastMessageContent: last.content,
              lastMessageCreatedAt: last.createdAt,
              hasUnread: false,
            }
          : room
      )
    );

    apiClient.patch(`/api/v1/chat/rooms/${selectedRoomId}/read`).catch((e) => {
      console.error("[CHAT] read on message change error", e);
    });
  }, [messages, selectedRoomId]);

  // ---- 상태 UI ----
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
    <div className="w-full bg-white overflow-x-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-5">
        <h1 className="text-[28px] font-bold leading-[36px] tracking-normal mb-6">
          쪽지함 목록
        </h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <aside
            className="
              w-full lg:w-[403px]
              h-[620px]
              rounded-[10px] border border-[#ADA395] bg-white overflow-hidden
              p-[31px_24px]
              transition-[width] duration-200
            "
          >
            <ThreadList
              threads={roomSummaries}
              selectedRoomId={selectedRoomId}
              onSelectRoom={handleSelectRoom}
            />
          </aside>

          <section
            className="
              w-full lg:flex-1
              h-[620px]
              rounded-[10px] border border-[#ADA395] bg-white overflow-hidden
              min-w-0
              transition-[width] duration-200
            "
          >
            <ChatPanel
              thread={selectedRoom as any}
              messages={displayMessages}   // ✅ 전환 자연화 포인트
              draft={input}
              onDraftChange={setInput}
              onSend={send}
              currentUserId={myId}
              connected={connected && !sending}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
