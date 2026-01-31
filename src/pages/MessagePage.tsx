import { useEffect, useMemo, useState } from "react";
import ThreadList from "../components/messages/threadList";
import ChatPanel from "../components/messages/chatPanel";
import { useChatRoom } from "../hooks/useChatRoom";
import type { ChatParticipants } from "../types/message";

export default function MessagePage() {
  const currentUserId = "u_me";

  // ✅ 더미 스레드: ChatParticipants + UI 필드(옵션) 교차 타입
  const threads = useMemo(
    () =>
      [
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
      ] as Array<
        ChatParticipants & {
          name?: string;
          role?: string;
          preview?: string;
          unread?: boolean;
        }
      >,
    [currentUserId]
  );

  /**
   * ✅ 중요:
   * ThreadList는 "t.id" 기준으로 선택(active) 처리함.
   * 그런데 STOMP는 "chatRoomId"가 roomId임.
   * → MessagePage에서 두 값을 분리 관리한다.
   */
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>(
    threads[0]?.id ?? ""
  );

  const selectedThread = useMemo(
    () => threads.find((t) => t.id === selectedParticipantId),
    [threads, selectedParticipantId]
  );

  // ✅ STOMP roomId는 chatRoomId
  const selectedRoomId = selectedThread?.chatRoomId ?? "";

  // ✅ useChatRoom은 기존 그대로 사용 (토큰 전달 X)
  const { connected, messages, input, setInput, send, debug } = useChatRoom({
    roomId: selectedRoomId,
    wsUrl: import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws-chat",
    currentUserId,
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

          {/* ✅ 연결/구독 확인용 (원하면 삭제 가능) */}
          <div className="mb-3 text-xs text-gray-500">
            <div>
              상태: {connected ? "✅ connected" : "⏳ connecting..."} / roomId:{" "}
              {selectedRoomId || "-"}
            </div>
            <div>
              lastEvent: {debug?.lastEvent ?? "-"} / lastError:{" "}
              {debug?.lastError ?? "-"} / messages:{" "}
              {debug?.messageCount ?? messages.length}
            </div>
          </div>

          <div className="flex flex-row gap-6">
            <aside className="w-[403px] h-[620px] rounded-[10px] border border-[#ADA395] bg-white overflow-hidden p-[31px_24px]">
              {/* ✅ ThreadList는 id 기준으로 선택 */}
              <ThreadList
                threads={threads}
                selectedThreadId={selectedParticipantId}
                onSelectThread={setSelectedParticipantId}
              />
            </aside>

            <section className="w-[904px] h-[620px] rounded-[10px] border border-[#ADA395] bg-white overflow-hidden">
              <ChatPanel
                thread={selectedThread as any}
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
