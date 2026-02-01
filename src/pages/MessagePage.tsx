import { useEffect, useMemo, useState } from "react";
import ThreadList from "../components/messages/threadList";
import ChatPanel from "../components/messages/chatPanel";
import { useChatRoom } from "../hooks/useChatRoom";
import { useChatRooms } from "../hooks/useChatRooms";
import type { ChatRoomSummary } from "../types/message";

export default function MessagePage() {
  const currentUserId = Number(import.meta.env.VITE_MOAYO_USER_ID || 1);

  // ✅ 진짜 채팅방 목록
  const { rooms, loading, error } = useChatRooms();

  // ✅ 선택 상태: roomId 기준
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  // rooms가 처음 로드되면 첫 방 자동 선택
  useEffect(() => {
    if (selectedRoomId == null && rooms.length > 0) {
      setSelectedRoomId(rooms[0].roomId);
    }
  }, [rooms, selectedRoomId]);

  const selectedRoom: ChatRoomSummary | undefined = useMemo(
    () => rooms.find((r) => r.roomId === selectedRoomId),
    [rooms, selectedRoomId]
  );

  // ✅ 채팅방 메시지 목록 + STOMP는 roomId로
  const { connected, debug, messages, input, setInput, send } = useChatRoom({
    roomId: selectedRoomId,
  });

  // ====== 기존 scale 로직 유지 ======
  const BASE_WIDTH = 403 + 24 + 904;
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setScale(Math.min(1, (w - 40) / BASE_WIDTH));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  // ==================================

  return (
    <div className="bg-white">
      <main className="w-full flex justify-center">
        <div className="origin-top-left" style={{ transform: `scale(${scale})` }}>
          <h1 className="text-[28px] font-bold leading-[36px] tracking-normal mb-[24px]">
            쪽지함 목록
          </h1>
          <div className="flex flex-row gap-6">
            <aside className="w-[403px] h-[620px] rounded-[10px] border border-[#ADA395] bg-white overflow-hidden p-[31px_24px]">
              <ThreadList
                // ✅ 이제 더미가 아니라 rooms
                threads={rooms}
                selectedRoomId={selectedRoomId}
                onSelectRoom={setSelectedRoomId}
              />
            </aside>

            <section className="w-[904px] h-[620px] rounded-[10px] border border-[#ADA395] bg-white overflow-hidden">
              <ChatPanel
                // ChatHeader가 room summary를 받을 수 있게 나중에 thread 타입 정리 권장
                thread={selectedRoom}
                messages={messages}
                draft={input}
                onDraftChange={setInput}
                onSend={send}
                currentUserId={currentUserId}
                connected={connected}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
