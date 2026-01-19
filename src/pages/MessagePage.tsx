import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";

type Thread = {
  id: string;
  name: string;
  role: string;
  preview: string;
  unread?: boolean;
};

type ChatMessage = {
  id: string;
  threadId: string;
  side: "left" | "right";
  text: string;
  createdAt: string; // "18:15" 형태
  readAt?: string;   // "18:15" 형태 (오른쪽 말풍선 아래 표기용)
};

export default function MessagePage() {
  // 더미 데이터
  const threads: Thread[] = useMemo(
    () => [
      {
        id: "t1",
        name: "김주연",
        role: "디자이너",
        preview: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다.",
        unread: true,
      },
      {
        id: "t2",
        name: "김주연",
        role: "디자이너",
        preview: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다.",
      },
      {
        id: "t3",
        name: "김주연",
        role: "디자이너",
        preview: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다.",
      },
      {
        id: "t4",
        name: "김주연",
        role: "디자이너",
        preview: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다.",
      },
      {
        id: "t5",
        name: "김주연",
        role: "디자이너",
        preview: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다.",
      },
    ],
    []
  );

  const initialMessages: ChatMessage[] = useMemo(
    () => [
      {
        id: "m1",
        threadId: "t1",
        side: "left",
        text: "안녕하세요. 이번 팀원 모집 관련해서 연락드립니다.",
        createdAt: "18:10",
      },
      {
        id: "m2",
        threadId: "t1",
        side: "right",
        text: "네, 안녕하세요. 어떤 내용일까요?",
        createdAt: "18:12",
        readAt: "18:15",
      },
    ],
    []
  );

  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.id ?? "");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");

  const selectedThread = useMemo(
    () => threads.find((t) => t.id === selectedThreadId),
    [threads, selectedThreadId]
  );

  const chatMessages = useMemo(
    () => messages.filter((m) => m.threadId === selectedThreadId),
    [messages, selectedThreadId]
  );

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const time = `${hh}:${mm}`;

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      threadId: selectedThreadId,
      side: "right",
      text,
      createdAt: time,
      readAt: time,
    };

    setMessages((prev) => [...prev, newMsg]);
    setDraft("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 min-h-0">
        {/* 컨테이너 */}
        <div className="mx-auto w-full max-w-screen-2xl h-full px-4 sm:px-6 lg:px-12">
          {/* 타이틀 */}
          <h1 className="mt-6 mb-6 text-[28px] font-bold leading-[36px] tracking-normal">
            쪽지함 목록
          </h1>

          {/* 2열 레이아웃 */}
          <div className="flex flex-col md:flex-row gap-6 min-h-0 h-[calc(100%-72px)]">
            {/* 좌측: 쪽지함 목록 */}
            <aside className="md:w-[clamp(280px,28vw,403px)] w-full border border-gray-200 rounded-[10px] overflow-hidden min-h-0 bg-white">
              <div className="h-full min-h-0 overflow-y-auto p-4 space-y-3">
                {threads.map((t) => {
                  const active = t.id === selectedThreadId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedThreadId(t.id)}
                      className={[
                        "w-full text-left rounded-[10px] border transition",
                        active
                          ? "border-transparent bg-emerald-200/70"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100",
                      ].join(" ")}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                              <span className="text-xs text-gray-500">{t.role}</span>
                            </div>
                            <p className="mt-1 text-xs text-gray-700 line-clamp-2">
                              {t.preview}
                            </p>
                          </div>

                          {/* 빨간 점(읽지 않음 표시) */}
                          {t.unread && (
                            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-red-500" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* 우측: 채팅 패널 */}
            <section className="flex-1 border border-gray-200 rounded-[10px] overflow-hidden min-h-0 bg-white">
              <div className="h-full min-h-0 flex flex-col">
                {/* 채팅 헤더 */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* 아바타 */}
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                      {selectedThread?.name?.slice(0, 1) ?? "?"}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {selectedThread?.name ?? "-"}
                      </div>
                      <div className="text-xs text-gray-500">rwd4533</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <button className="hover:text-gray-900">프로필 바로가기</button>
                    <button className="hover:text-gray-900">신고</button>
                  </div>
                </div>

                {/* 메시지 리스트 */}
                <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-4">
                  {chatMessages.map((m) => {
                    const isLeft = m.side === "left";
                    return (
                      <div
                        key={m.id}
                        className={isLeft ? "flex justify-start" : "flex justify-end"}
                      >
                        <div className={isLeft ? "max-w-[70%]" : "max-w-[70%] text-right"}>
                          <div
                            className={[
                              "inline-block rounded-2xl px-5 py-3 text-sm leading-relaxed",
                              isLeft
                                ? "bg-gray-300 text-gray-900 rounded-tl-xl"
                                : "bg-gray-100 text-gray-900 rounded-tr-xl",
                            ].join(" ")}
                          >
                            {m.text}
                          </div>

                          {/* 읽음 시간 (우측만) */}
                          {!isLeft && m.readAt && (
                            <div className="mt-1 text-[11px] text-gray-400">
                              읽음: {m.readAt}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 입력 영역 */}
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 relative w-full">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                      }}
                      placeholder="입력해주세요"
                      className="w-full flex-1 h-16 rounded-[5px] border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      className={[
                        "absolute right-5 top-1/2 -translate-y-1/2",
                        "h-[43px] min-w-[72px]",
                        "rounded-[10px] px-[20px] py-[8px]",
                        "font-pretendard text-[18px] font-medium leading-[150%] tracking-normal",
                        "bg-gray-300 text-gray-800",
                        "active:bg-gray-400 active:bg-gray-400 transition",
                      ].join(" ")}
                    >
                      전송
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
