import { useEffect, useMemo, useState } from "react";
import ThreadList from "../components/messages/threadList";
import ChatPanel from "../components/messages/chatPanel";
import { useChatRoom } from "../hooks/useChatRoom";
import type { ChatParticipants } from "../types/message";

type ThreadUI = {
  id: string; // 이 값을 roomId로 사용(=chatRoomId)
  name: string;
  role: string;
  preview: string;
  unread?: boolean;
};

export default function MessagePage() {
  const currentUserId = "u_me";

  // UI용 더미 스레드
  const threads: ChatParticipants[] = useMemo(
    () => [
      {
        id: "p1",               
        chatRoomId: "101",        
        userId: currentUserId,
        lastReadMessageId: "",
        createdAt: new Date(),

        name: "김주연",
        role: "디자이너",
        preview: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다.",
        unread: true,
      },
      {
        id: "p2",
        chatRoomId: "102",
        userId: currentUserId,
        lastReadMessageId: "",
        createdAt: new Date(),

        name: "김주연",
        role: "디자이너",
        preview: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다.",
      },
      {
        id: "p3",
        chatRoomId: "103",
        userId: currentUserId,
        lastReadMessageId: "",
        createdAt: new Date(),

        name: "김주연",
        role: "디자이너",
        preview: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다.",
      },
    ],
    [currentUserId]
  );

  // 선택된 스레드(UI 데이터)
  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.chatRoomId ?? "");

  const selectedThread = useMemo(
    () => threads.find((t) => t.chatRoomId === selectedThreadId),
    [threads, selectedThreadId]
  );

  // ✅ STOMP는 roomId = chat_room_id
  const { connected, messages, input, setInput, send } = useChatRoom({
    roomId: selectedThreadId,
    wsUrl: "http://15.164.218.67.nip.io/ws-chat",
    // SockJS면 wsUrl을 http://15.166.111.nip.io/ws-chat 로 바꾸고 client를 SockJS 모드로
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
                threads={threads}
                selectedThreadId={selectedThreadId}
                onSelectThread={setSelectedThreadId}
              />
            </aside>

            <section className="w-[904px] h-[620px] rounded-[10px] border border-[#ADA395] bg-white overflow-hidden">
              <ChatPanel
                thread={selectedThread}
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