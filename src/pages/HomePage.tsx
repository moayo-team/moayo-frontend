import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import menu from "../assets/menu.svg";
import plane from "../assets/plane.png";

import { useAuth } from "../hooks/useAuth";
import { CircleCheck, Mic } from "lucide-react";
import type { BaseResponse } from "../types/career";

type HomeNotification = {
  unreadCount: number;
  items: any[];
};

type ImminentPosts = {
  postId: number;
  userId: number;
  title: string;
  summary: string;
  categoryLabel: string;
  authorNickname: string;
  profileImageUrl: string;
  role: string;
  content: string;
  totalCount: string;
  dday: string;
};

type RecommendedUsers = {
  userId: number;
  name: string;
  imageUrl: string;
  bio: string;
  matchReason: string;
};

type HomeResult = {
  notifications: HomeNotification;
  imminentPosts: ImminentPosts[];
  recommendedUsers: RecommendedUsers[];
};

export default function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isAIInputOpen, setIsAIInputOpen] = useState(false);
  const [aiText, setAiText] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const [homeLoading, setHomeLoading] = useState(false);
  const [homeError, setHomeError] = useState<string | null>(null);
  const [homeData, setHomeData] = useState<HomeResult | null>(null);

  const myName = useMemo(() => user?.user?.name ?? "사용자", [user]);

  const myAvatar = useMemo(() => {
    const url = user?.profile?.imageUrl;
    if (url && typeof url === "string" && url.trim().length > 0) return url;

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      myName
    )}&background=E9FCEF&color=26E1AC&size=152`;
  }, [user, myName]);
  
  const fetchedRef = useRef(false);

  useEffect(() => {
    console.log("[HOME] effect fired", { isLoggedIn, userId: user?.user?.id });

    if (!isLoggedIn) {
      console.log("[HOME] effect return: not logged in", { isLoggedIn });
      return;
    }

    if (fetchedRef.current) {
      console.log("[HOME] skip: already fetched");
      return;
    }
    fetchedRef.current = true;

    let mounted = true;

    (async () => {
      setHomeLoading(true);
      setHomeError(null);

      try {
        const { apiClient } = await import("../api/client");
        console.log("HOME params userId=", user?.user?.id);
        const { data } = await apiClient.get<BaseResponse<HomeResult>>("/api/v1/home");

        console.log("HOME data=", data);

        if (!mounted) return;

        if (!data?.isSuccess) {
          setHomeData(null);
          setHomeError(`${data?.message ?? "서버 오류"} (${data?.code ?? "UNKNOWN"})`);
          return;
        }

        setHomeData(data.result);
      } catch (e: any) {
        console.log("[HOME] request error raw=", e);
        console.log("[HOME] status=", e?.response?.status);
        console.log("[HOME] data=", e?.response?.data);
        console.log("[HOME] headers=", e?.response?.headers);
        console.log("[HOME] config=", e?.config);

        if (!mounted) return;
        setHomeData(null);
        setHomeError(e?.message ?? "홈 데이터 로드 실패");
      } finally {
        if (mounted) setHomeLoading(false);
      }
    })();
    

    return () => {
      mounted = false;
    };
  }, [isLoggedIn, user?.user?.id]); // userId도 같이 넣는 편이 안전


  const imminentPosts = homeData?.imminentPosts ?? [];
  const recommendedUsers = homeData?.recommendedUsers ?? [];

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiText(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  const handleGoToCareerAdd = () => {
    const prompt = aiText.trim();
    if (!prompt || isAnalysing) return;

    //setIsAnalysing(true);
    navigate("/profile/add-career", { state: { prompt } });
    setAiText("");
    setIsAIInputOpen(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 overflow-hidden">
        <div className="h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="text-center px-6 -translate-y-8 sm:-translate-y-14">
            <h2 className="text-2xl font-heading-h2-300 mb-4">
              로그인이 필요합니다
            </h2>
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
              <CircleCheck
                className="text-[#7C7B80] fill-[#7C7160] shrink-0"
                size={24}
              />
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
                    : "h-[60px] sm:h-[70px] px-4 justify-center cursor-pointer hover:bg-[#d8f5eb]",
                ].join(" ")}
                onClick={() => {
                  if (!isAIInputOpen) setIsAIInputOpen(true);
                }}
              >
                {!isAIInputOpen ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="flex-1 text-[#1BA07A] text-[14px] sm:text-[16px] font-medium leading-[130%]">
                      {myName}님이 했던 경험을 자유롭게 서술해주세요. 모아요 AI가
                      정리해드려요!
                    </span>
                    <Mic size={20} className="text-[#1BA07A] shrink-0" />
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
                    <Mic size={20} className="text-[#1BA07A] shrink-0 pt-1" />
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
                        "opacity-60 cursor-not-allowed hover:bg-[#6EEBC7]",
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
            <h2 className="text-[16px] font-semibold text-[#342F28] mb-3">
              프로필
            </h2>

            <div className="p-5">
              <div className="h-auto sm:h-[258px] items-center justify-center gap-2.5 px-5 py-6 sm:py-[27px] bg-gray-scale30 rounded-[10px] flex flex-col">
                <div className="inline-flex flex-col items-center gap-2.5 relative flex-[0_0_auto] mt-[-7.50px] mb-[-7.50px]">
                  <img
                    className="w-[120px] sm:w-[150px] h-[120px] sm:h-[152px] relative object-cover rounded-full"
                    alt={`${myName} profile`}
                    src={myAvatar}
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
                  className="all-[unset] box-border px-[15px] py-2.5 flex-1 self-stretch w-full grow bg-gray-scale30 rounded-[5px] flex items-center justify-center gap-2.5 relative hover:bg-gray-scalegray-scale-50 transition-colors cursor-pointer"
                >
                  <img className="relative w-5 h-5" alt="" src={plane} aria-hidden="true" />
                  <span className="relative w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-500 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
                    쪽지
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/board")}
                  className="all-[unset] box-border px-[15px] py-2.5 flex-1 self-stretch w-full grow bg-gray-scale30 rounded-[5px] flex items-center justify-center gap-2.5 relative hover:bg-gray-scalegray-scale-50 transition-colors cursor-pointer"
                >
                  <img className="relative w-5 h-5" alt="" src={menu} aria-hidden="true" />
                  <span className="relative w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-500 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
                    게시판으로 돌아가기
                  </span>
                </button>
              </div>
            </div>
          </aside>

          <main className="w-full min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[16px] font-semibold text-[#342F28]">
                마감 임박 게시글
              </h2>
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
                    className="w-full rounded-[14px] bg-[#F7F6F3] p-4 sm:p-5 flex items-center gap-4 cursor-pointer hover:opacity-95 transition"
                    onClick={() => navigate(`/board/${p.postId}`)}
                  >
                    <div className="w-[86px] h-[86px] rounded-[14px] bg-[#E9E6E1] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[16px] sm:text-[18px] font-semibold text-[#2E2A25] truncate">
                            {p.title}
                          </div>
                          <div className="mt-1 text-[13px] sm:text-[14px] text-[#6F6A61]">
                            {p.categoryLabel}
                            {p.role ? ` · ${p.role}` : ""}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-[10px] bg-[#ECE9E4] px-3 py-1 text-[12px] font-semibold text-[#6F6A61]">
                          {p.dday}
                        </span>
                      </div>
                    </div>
                    <div className="text-[#8D877E] text-[22px] leading-none shrink-0">›</div>
                  </article>
                ))
              )}
            </div>
          </main>

          <aside className="w-full">
            <h2 className="text-[16px] font-semibold text-[#342F28] mb-3">
              AI 추천 유저
            </h2>

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
                recommendedUsers.slice(0, 4).map((u) => (
                  <div
                    key={u.userId}
                    className="rounded-[10px] border border-[#ECE7DF] bg-white p-4"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <img
                        className="w-[120px] h-[120px] object-cover rounded-[30px]"
                        alt="profile"
                        src={
                          u.imageUrl && u.imageUrl.trim().length > 0
                            ? u.imageUrl
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                u.name ?? "User"
                              )}&background=E9FCEF&color=26E1AC&size=152`
                        }
                      />
                      <div className="text-center">
                        <div className="font-semibold text-[#342F28]">
                          {u.name}
                        </div>
                        <div className="text-[12px] text-[#7A7368]">
                          {u.bio ?? ""}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[10px] bg-[#E9FCEF] border border-[#BFEDE1] text-[#1F8F76] font-semibold"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => navigate(`/message?to=${u.userId}`)}
                      >
                        <img className="w-5 h-5" alt="" src={plane} aria-hidden="true" />
                        <span className="text-[14px] leading-none">
                          쪽지보내기
                        </span>
                      </button>

                      <button
                        type="button"
                        className="h-10 rounded-[10px] bg-[#F7F6F3] border border-[#ECE7DF] text-[#7A7368] hover:opacity-90"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => navigate(`/profile/${u.userId}`)}
                      >
                        프로필 보러가기
                      </button>
                    </div>

                    <p className="mt-3 text-[11px] text-[#9A948A] leading-4">
                      {u.matchReason ?? ""}
                    </p>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
