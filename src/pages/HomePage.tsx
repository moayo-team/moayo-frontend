import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import menu from "../assets/UnorderedList.svg";
import send from "../assets/send.svg";
import send_brown from "../assets/send_brown.svg";
import defaultImage from "../assets/default_profile.svg";
import tablerPencil from "../assets/tabler_pencil.svg";

import { useAuth } from "../hooks/useAuth";
import { CircleCheck } from "lucide-react";
import { useHomeStore } from "../store/homeStore";
import { apiClient } from "../api/client";


export default function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isAIInputOpen, setIsAIInputOpen] = useState(false);
  const [aiText, setAiText] = useState("");
  const [isAnalysing, _setIsAnalysing] = useState(false);
  const [isToastVisible, _setIsToastVisible] = useState(false);

  const homeLoading = useHomeStore((s) => s.loading);
  const homeError = useHomeStore((s) => s.error);
  const homeData = useHomeStore((s) => s.data);
  const fetchHome = useHomeStore((s) => s.fetchHome);

  const myName = useMemo(() => user?.user?.name ?? "사용자", [user]);

  const getAvatarUrl = (url?: string | null) => {
    if (url && typeof url === "string" && url.trim().length > 0) {
      // 절대 URL / blob은 그대로
      if (url.startsWith("http") || url.startsWith("blob:")) return url;

      // 상대경로면 baseUrl 붙이기 (슬래시 중복 방지)
      const base = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
      const path = url.startsWith("/") ? url : `/${url}`;
      return `${base}${path}`;
    }
    return defaultImage;
  };

  const myAvatar = useMemo(() => getAvatarUrl(user?.profile?.imageUrl), [user?.profile?.imageUrl]);
  const isMyDefaultImage = myAvatar === defaultImage;

  useEffect(() => {
    const userId = Number(user?.user?.id);
    if (!isLoggedIn || !userId) return;

    fetchHome({
      userId,
      postsLimit: 3,
      recoLimit: 2,
      ttlMs: 60_000
    });
  }, [isLoggedIn, user?.user?.id, fetchHome]);

  const imminentPosts = homeData?.imminentPosts ?? [];
  const recommendedUsers = homeData?.recommendedUsers ?? [];

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiText(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleGoToCareerAdd = () => {
    const prompt = aiText.trim();
    if (!prompt || isAnalysing) return;

    navigate("/profile/add-career", { state: { prompt } });
    setAiText("");
    setIsAIInputOpen(false);
  };
  const handleSendMessageToUser = async (targetUserId: number) => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    const myId = Number(user?.user?.id);
    if (!Number.isFinite(myId) || myId <= 0) {
      alert("내 사용자 정보를 찾을 수 없습니다.");
      return;
    }

    const otherId = Number(targetUserId);
    if (!Number.isFinite(otherId) || otherId <= 0) {
      alert("대상 사용자 정보를 찾을 수 없습니다.");
      return;
    }

    if (String(otherId) === String(myId)) {
      alert("자기 자신에게는 쪽지를 보낼 수 없습니다.");
      return;
    }

    const payload: { userBId: number } = { userBId: otherId };

    try {
      const res = await apiClient.post<{ isSuccess: boolean; result: { roomId: number } }>(
        "/api/v1/chat/rooms",
        payload
      );

      const roomId = res.data?.result?.roomId;

      if (!roomId) {
        alert("쪽지방 생성에 실패했습니다.");
        return;
      }

      navigate("/message", { state: { roomId } });
    } catch (e: any) {
      alert("쪽지방 생성에 실패했습니다.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 overflow-hidden">
        <div className="h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="text-center px-6 -translate-y-8 sm:-translate-y-14">
            <h2 className="text-2xl font-heading-h2-300 mb-4">로그인이 필요합니다</h2>
            <p className="text-gray-scalegray-scale-500 mb-6">
              내가 쓴 게시글을 보려면 로그인해주세요.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-primaryprimary-300 rounded-[10px] font-heading-h3-200 text-gray-scalegray-scale-900 hover:bg-primaryprimary-400 transition-colors"
            >
              로그인 하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
      <section className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[22px] font-bold text-[#342F28]">모아요 AI</h1>
        </div>

        <div className="flex flex-col w-full gap-4">
          {isToastVisible && !isAIInputOpen && (
            <div className="flex w-full p-4 items-center gap-3 border border-[#D6D6D8] rounded-[10px] bg-[#F2F2F2] shadow-sm">
              <CircleCheck className="text-[#7C7B80] fill-[#7C7160] shrink-0" size={24} />
              <span className="text-[#7C7160] text-[14px] sm:text-[16px] font-medium leading-[130%]">
                생성이 완료되었습니다! 필요한 부분은 직접 수정해주세요.
              </span>
            </div>
          )}

          {!isToastVisible && (
            <>
              <div
                className={[
                  "flex flex-col w-full border border-[#BCF6E5] rounded-[10px] bg-[#E9FCF7] transition-all duration-200",
                  isAIInputOpen
                    ? "p-4"
                    : "h-[60px] sm:h-[70px] px-4 justify-center cursor-pointer hover:bg-[#d8f5eb]"
                ].join(" ")}
                onClick={() => {
                  if (!isAIInputOpen) setIsAIInputOpen(true);
                }}
              >
                {!isAIInputOpen ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="flex-1 text-[#1BA07A] text-[14px] sm:text-[16px] font-medium leading-[130%]">
                      {myName}님이 했던 경험을 자유롭게 서술해주세요. 모아요 AI가 정리해드려요!
                    </span>
                    <img
                      src={tablerPencil}
                      alt="edit"
                      className="shrink-0 w-5 h-5"
                    />
                  </div>
                ) : (
                  <div className="flex w-full gap-3">
                    <textarea
                      ref={textareaRef}
                      className="flex-1 max-h-[120px] outline-none resize-none bg-transparent text-[15px] sm:text-[16px] font-medium text-[#1BA07A]"
                      placeholder={`${myName}님이 했던 경험을 자유롭게 서술해주세요.`}
                      autoFocus
                      value={aiText}
                      onChange={handleTextareaChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <img
                      src={tablerPencil}
                      alt="edit"
                      className="shrink-0 pt-1 w-5 h-5"
                    />
                  </div>
                )}
              </div>

              {isAIInputOpen && (
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="bg-[#6EEBC7] px-4 py-2 rounded-[10px] text-[13px] sm:text-[14px] text-[#25221D] font-medium hover:bg-[#5BD9B5] transition-colors shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAIInputOpen(false);
                    }}
                  >
                    닫기
                  </button>

                  <button
                    type="button"
                    disabled={isAnalysing || !aiText.trim()}
                    className={[
                      "bg-[#6EEBC7] px-4 py-2 rounded-[10px] text-[13px] sm:text-[14px] text-[#25221D] font-medium transition-colors shadow-sm",
                      "hover:bg-[#5BD9B5]",
                      (isAnalysing || !aiText.trim()) &&
                        "opacity-60 cursor-not-allowed hover:bg-[#6EEBC7]"
                    ].join(" ")}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGoToCareerAdd();
                    }}
                  >
                    {isAnalysing ? "분석 중..." : "생성하기"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="pt-10 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_520px] gap-8 lg:gap-10">
          <aside className="w-full">
            <h2 className="text-[16px] font-semibold text-[#342F28] mb-3">프로필</h2>

            <div className="p-5">
              <div className="h-auto sm:h-[258px] items-center justify-center gap-2.5 px-5 py-6 sm:py-[27px] bg-[#FBFAF9] rounded-[10px] flex flex-col">
                <div className="inline-flex flex-col items-center gap-2.5 relative flex-[0_0_auto] mt-[-7.50px] mb-[-7.50px]">
                  <img
                    className={`w-[120px] sm:w-[150px] h-[120px] sm:h-[152px] rounded-[10px] ${
                      isMyDefaultImage ? "object-contain p-2" : "object-cover"
                    }`}
                    alt={`${myName} profile`}
                    src={myAvatar}
                    onError={(e) => {
                      e.currentTarget.src = defaultImage;
                    }}
                  />

                  <div className="flex flex-col w-full items-center gap-0.5 relative flex-[0_0_auto]">
                    <h2 className="relative self-stretch mt-[-1.00px] font-heading-h2-300 font-[number:var(--heading-h2-300-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--heading-h2-300-font-size)] text-center tracking-[var(--heading-h2-300-letter-spacing)] leading-[var(--heading-h2-300-line-height)] [font-style:var(--heading-h2-300-font-style)]">
                      {myName}
                    </h2>

                    <div className="flex items-center justify-center gap-[11px] relative self-stretch w-full flex-[0_0_auto]">
                      <p className="relative w-fit mt-[-1.00px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--body-b2-300-font-size)] text-center tracking-[var(--body-b2-300-letter-spacing)] leading-[var(--body-b2-300-line-height)] whitespace-nowrap [font-style:var(--body-b2-300-font-style)]">
                        {user?.profile?.major ?? "전공"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/message")}
                  className="all-[unset] box-border px-[15px] py-2.5 flex-1 self-stretch w-full grow bg-[#FBFAF9] rounded-[5px] flex items-center justify-center gap-2.5 relative hover:bg-gray-scalegray-scale-50 transition-colors cursor-pointer"
                >
                  <img className="relative w-5 h-5" alt="" src={send_brown} aria-hidden="true" />
                  <span className="relative w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-[#7C7160] text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
                    쪽지
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/board")}
                  className="all-[unset] box-border px-[15px] py-2.5 flex-1 self-stretch w-full grow bg-[#FBFAF9] rounded-[5px] flex items-center justify-center gap-2.5 relative hover:bg-gray-scalegray-scale-50 transition-colors cursor-pointer"
                >
                  <img className="relative w-5 h-5" alt="" src={menu} aria-hidden="true" />
                  <span className="relative w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-[#7C7160] text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
                    게시판으로 돌아가기
                  </span>
                </button>
              </div>
            </div>
          </aside>

          <main className="w-full min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[16px] font-semibold text-[#342F28]">마감 임박 게시글</h2>
            </div>

            <div className="flex flex-col gap-4">
              {homeLoading ? (
                <div className="w-full rounded-[10px] border border-[#ECE7DF] bg-white p-4 text-[#7A7368] text-[14px]">
                  불러오는 중...
                </div>
              ) : homeError ? (
                <div className="w-full rounded-[10px] border border-[#F3C6C6] bg-[#FFF5F5] p-4 text-[#D14B4B] text-[14px]">
                  {homeError}
                </div>
              ) : imminentPosts.length === 0 ? (
                <div className="w-full rounded-[10px] border border-[#ECE7DF] bg-white p-4 text-[#7A7368] text-[14px]">
                  마감 임박 게시글이 없습니다.
                </div>
              ) : (
                imminentPosts.slice(0, 3).map((p) => (
                  <article
                    key={p.postId}
                    className="w-full max-w-[475px] mx-auto rounded-[14px] border border-[#D9D5CE] bg-[#FBFAF9] px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 cursor-pointer hover:opacity-95 transition"
                    onClick={() => navigate(`/post/${p.postId}`)}
                  >
                    <div className="min-w-0">
                      <span className="inline-flex items-center rounded-[8px] bg-[#EFEEEB] px-2.5 py-1 text-[12px] font-semibold text-[#5F5749]">
                        {p.dday}
                      </span>

                      <div className="mt-3 text-[20px] sm:text-[22px] font-semibold text-[#25221D] leading-[120%] truncate">
                        {p.title}
                      </div>
                      <div className="mt-2 text-[14px] text-[#342F28] font-semibold">
                        <span>{p.categoryLabel}</span>
                        {p.role ? <span className="text-[#342F28]">{` · ${p.role}`}</span> : null}
                      </div>
                    </div>
                    <div className="shrink-0 flex w-[24px] h-[24px] justify-center items-center text-[#25221D]">
                      <span className="text-[24px] leading-none">›</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </main>

          <aside className="w-full">
            <h2 className="text-[16px] font-semibold text-[#342F28] mb-3">AI 추천 유저</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {homeLoading ? (
                <div className="col-span-1 sm:col-span-2 rounded-[10px] border border-[#ECE7DF] bg-white p-4 text-[#7A7368] text-[14px]">
                  불러오는 중...
                </div>
              ) : homeError ? (
                <div className="col-span-1 sm:col-span-2 rounded-[10px] border border-[#F3C6C6] bg-[#FFF5F5] p-4 text-[#D14B4B] text-[14px]">
                  {homeError}
                </div>
              ) : recommendedUsers.length === 0 ? (
                <div className="col-span-1 sm:col-span-2 rounded-[10px] border border-[#ECE7DF] bg-white p-4 text-[#7A7368] text-[14px]">
                  추천 유저가 없습니다.
                </div>
              ) : (
                recommendedUsers.slice(0, 4).map((u) => {
                  const userAvatar = getAvatarUrl((u as any).imageUrl);
                  const isDefault = userAvatar === defaultImage;

                  return (
                    <div key={u.userId} className="rounded-[10px] border border-[#ECE7DF] bg-white p-4">
                      <div className="flex flex-col items-center gap-3">
                        <img
                          className={`w-[120px] h-[120px] rounded-[10px] ${
                            isDefault ? "object-contain p-2" : "object-cover"
                          }`}
                          alt="profile"
                          src={userAvatar}
                          onError={(e) => {
                            e.currentTarget.src = defaultImage;
                          }}
                        />
                        <div className="text-center">
                          <div className="font-semibold text-[#342F28]">{u.name}</div>
                          <div className="text-[12px] text-[#7A7368]">{u.bio ?? ""}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[10px] bg-[#E9FCF7] border border-[#BFEDE1] text-[#1BA07A] font-semibold"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSendMessageToUser(u.userId)}
                        >
                          <img className="w-5 h-5" alt="" src={send} aria-hidden="true" />
                          <span className="font-pretendard text-[16px] font-normal leading-[27px] text-[#1BA07A]">
                            쪽지보내기
                          </span>
                        </button>
                        <button
                          type="button"
                          className="h-10 rounded-[10px] bg-[#EFEEEB] hover:opacity-90 inline-flex items-center justify-center"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => navigate(`/profile/${u.userId}`)}
                        >
                          <span className="font-pretendard text-[16px] font-normal leading-[27px] text-[#7C7160]">
                            프로필 보러가기
                          </span>
                        </button>
                      </div>
                      <p className="mt-3 font-pretendard text-[10px] font-normal text-[#5F5749] leading-[15px] tracking-[-0.1px]">
                        {u.matchReason ?? ""}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
