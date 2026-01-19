import { useMemo, useState } from "react";
import ThreadList from "../components/messages/threadList";
import ChatPanel from "../components/messages/chatPanel";
import type { ChatParticipants, Message } from "../types/message";

export default function MessagePage() {
  // 임시 사용자 ID
  const currentUserId = "u_me";

  // 더미 데이터
  const threads: ChatParticipants[] = useMemo(
    () => [
      {
        id: "t1",
        name: "김주연",
        role: "디자이너",
        preview: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다.",
        unread: true,
      },
      { id: "t2", name: "김주연", role: "디자이너", preview: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다." },
      { id: "t3", name: "김주연", role: "디자이너", preview: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다." },
      { id: "t4", name: "김주연", role: "디자이너", preview: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다." },
      { id: "t5", name: "김주연", role: "디자이너", preview: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다." },
    ],
    []
  );

  const initialMessages: Message[] = useMemo(
    () => [
      {
        id: "m1",
        chatRoomId: "t1",
        senderId: "u_other",
        content: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다.",
        is_deleted: false,
        createdAt: new Date(),
      },
      {
        id: "m2",
        chatRoomId: "t1",
        senderId: currentUserId,
        content: "네, 안녕하세요. 어떤 내용일까요?",
        is_deleted: false,
        createdAt: new Date(),
      },
    ],
    [currentUserId]
  );

  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.id ?? "");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");

  const selectedThread = useMemo(
    () => threads.find((t) => t.id === selectedThreadId),
    [threads, selectedThreadId]
  );

  const chatMessages = useMemo(
    () => messages.filter((m) => m.chatRoomId === selectedThreadId),
    [messages, selectedThreadId]
  );

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      chatRoomId: selectedThreadId,
      senderId: currentUserId,
      content: text,
      is_deleted: false,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setDraft("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 min-h-0">
        <div className="mx-auto w-full max-w-screen-2xl h-full px-4 sm:px-6 lg:px-12">
          <h1 className="mt-6 mb-6 text-[28px] font-bold leading-[36px] tracking-normal">
            쪽지함 목록
          </h1>

          <div className="flex flex-col md:flex-row gap-6 min-h-0 h-[calc(100%-72px)]">
            <aside className="md:w-[clamp(280px,28vw,403px)] w-full border border-gray-200 rounded-[10px] overflow-hidden min-h-0 bg-white">
              <ThreadList
                threads={threads}
                selectedThreadId={selectedThreadId}
                onSelectThread={setSelectedThreadId}
              />
            </aside>

            <section className="flex-1 border border-gray-200 rounded-[10px] overflow-hidden min-h-0 bg-white">
              <ChatPanel
                thread={selectedThread}
                messages={chatMessages}
                draft={draft}
                onDraftChange={setDraft}
                onSend={handleSend}
                currentUserId={currentUserId}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
