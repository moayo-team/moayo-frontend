import { useEffect, useMemo, useState } from "react";
import ThreadList from "../components/messages/threadList";
import ChatPanel from "../components/messages/chatPanel";
import type { ChatParticipants, Message } from "../types/message";

export default function MessagePage() {
  const currentUserId = "u_me";

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
