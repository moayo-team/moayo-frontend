import { useEffect, useMemo, useState } from "react";
import ThreadList from "../components/messages/threadList";
import ChatPanel from "../components/messages/chatPanel";
import { useChatRoom } from "../hooks/useChatRoom";
import { useChatRooms } from "../hooks/useChatRooms";
import type { ChatRoomSummary } from "../types/message";

export default function MessagePage() {
  const currentUserId = Number(import.meta.env.VITE_MOAYO_USER_ID || 0);

  const { rooms, loading, error } = useChatRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedRoomId == null && rooms.length > 0) {
      setSelectedRoomId(rooms[0].roomId);
    }
  }, [rooms, selectedRoomId]);

  const selectedRoom: ChatRoomSummary | undefined = useMemo(
    () => rooms.find((r) => r.roomId === selectedRoomId),
    [rooms, selectedRoomId]
  );

  const { connected, sending, debug, meId, messages, input, setInput, send } = useChatRoom({
    roomId: selectedRoomId,
    currentUserId: currentUserId || undefined,
  });

  const myId = meId ?? currentUserId ?? 0;

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

  if (loading) {
    return (
      <div className="bg-white p-6">
        <div className="text-sm text-gray-500">쪽지함 목록 불러오는 중…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6">
        <div className="text-sm text-red-600">쪽지함 목록 로드 실패: {String(error)}</div>
      </div>
    );
  }

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
                threads={rooms as any}
                selectedRoomId={selectedRoomId}
                onSelectRoom={setSelectedRoomId}
              />
            </aside>

            <section className="w-[904px] h-[620px] rounded-[10px] border border-[#ADA395] bg-white overflow-hidden">
              <ChatPanel
                thread={selectedRoom as any}
                messages={messages}
                draft={input}
                onDraftChange={setInput}
                onSend={send}
                currentUserId={myId}
                connected={connected && !sending}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
