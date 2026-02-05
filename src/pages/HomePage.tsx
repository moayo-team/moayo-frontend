// src/pages/HomePage.tsx
import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import menu from "../assets/menu.svg";
import plane from "../assets/plane.png";

import { useAuth } from "../hooks/useAuth";
import { CircleCheck, Mic } from "lucide-react";

import { getDisplayName } from "../utils/name";
import { DUMMY_PROFILE } from "../data/profileData";

export default function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  // =========================
  // AI UI State (Home 전용)
  // =========================
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isAIInputOpen, setIsAIInputOpen] = useState(false);
  const [aiText, setAiText] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    if (!isToastVisible) return;
    const t = setTimeout(() => setIsToastVisible(false), 1200);
    return () => clearTimeout(t);
  }, [isToastVisible]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiText(e.target.value);

    // autosize (최대 120px)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  // ✅ 핵심: "생성하기" 누르면 CareerAddPage로 이동 + prompt 전달
  const handleGoToCareerAdd = () => {
    const prompt = aiText.trim();
    if (!prompt || isAnalysing) return;

    // 굳이 로딩 넣고 싶으면 아래 2줄 유지해도 됨 (바로 이동하니까 없어도 OK)
    setIsAnalysing(true);

    navigate("/profile/add-career", {
      state: { prompt },
    });
  };

  // =========================
  // Render
  // =========================
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
      {/* 상단: 모아요 AI */}
      <section className="pt-6">
        <h1 className="text-[22px] font-bold text-[#342F28] mb-3">모아요 AI</h1>

        <div className="flex flex-col w-full gap-4">
          {/* 토스트 */}
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
              {/* 입력 컨테이너 */}
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
                  /* 닫힘 */
                  <div className="flex items-center justify-between w-full">
                    <span className="flex-1 text-[#1BA07A] text-[14px] sm:text-[16px] font-medium leading-[130%]">
                      {getDisplayName(DUMMY_PROFILE.name)}님이 했던 경험을 자유롭게
                      서술해주세요. 모아요 AI가 정리해드려요!
                    </span>
                    <Mic size={20} className="text-[#1BA07A] shrink-0" />
                  </div>
                ) : (
                  /* 열림 */
                  <div className="flex w-full gap-3">
                    <textarea
                      ref={textareaRef}
                      className="flex-1 max-h-[120px] outline-none resize-none bg-transparent text-[15px] sm:text-[16px] font-medium text-[#1BA07A]"
                      placeholder={`${getDisplayName(
                        DUMMY_PROFILE.name
                      )}님이 했던 경험을 자유롭게 서술해주세요.`}
                      autoFocus
                      value={aiText}
                      onChange={handleTextareaChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Mic size={20} className="text-[#1BA07A] shrink-0 pt-1" />
                  </div>
                )}
              </div>

              {/* 버튼 영역 */}
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

      {/* 본문 3열 */}
      <section className="pt-10 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_520px] gap-8 lg:gap-10">
          {/* 좌측: 프로필 카드 */}
          <aside className="w-full">
            <h2 className="text-[16px] font-semibold text-[#342F28] mb-3">
              프로필
            </h2>

            <div className="p-5">
              <div className="h-auto sm:h-[258px] items-center justify-center gap-2.5 px-5 py-6 sm:py-[27px] bg-gray-scale30 rounded-[10px] flex flex-col">
                <div className="inline-flex flex-col items-center gap-2.5 relative flex-[0_0_auto] mt-[-7.50px] mb-[-7.50px]">
                  <img
                    className="w-[120px] sm:w-[150px] h-[120px] sm:h-[152px] relative object-cover rounded-full"
                    alt={`${user?.name || "사용자"} profile`}
                    src={
                      user?.avatar ||
                      "https://ui-avatars.com/api/?name=User&background=E9FCEF&color=26E1AC&size=152"
                    }
                  />
                  <div className="flex flex-col w-full items-center gap-0.5 relative flex-[0_0_auto]">
                    <h2 className="relative self-stretch mt-[-1.00px] font-heading-h2-300 font-[number:var(--heading-h2-300-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--heading-h2-300-font-size)] text-center tracking-[var(--heading-h2-300-letter-spacing)] leading-[var(--heading-h2-300-line-height)] [font-style:var(--heading-h2-300-font-style)]">
                      {user?.name || "사용자"}
                    </h2>
                    <div className="flex items-center justify-center gap-[11px] relative self-stretch w-full flex-[0_0_auto]">
                      <p className="relative w-fit mt-[-1.00px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--body-b2-300-font-size)] text-center tracking-[var(--body-b2-300-letter-spacing)] leading-[var(--body-b2-300-line-height)] whitespace-nowrap [font-style:var(--body-b2-300-font-style)]">
                        디자이너
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

          {/* 가운데 */}
          <main className="w-full min-w-0">
            <h2 className="text-[16px] font-semibold text-[#342F28] mb-3">
              마감 임박 게시글
            </h2>
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <article
                  key={idx}
                  className="w-full rounded-[10px] border border-[#ECE7DF] bg-white p-4 flex items-center gap-4"
                >
                  <div className="w-[92px] h-[62px] rounded-[8px] bg-[#F2F2F2] border border-[#EEE]" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#342F28] truncate">
                      2026 로레알 브랜드스톰 공모전
                    </div>
                    <div className="text-[13px] text-[#7A7368] mt-1">
                      디자인 · 기획
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2">
                      <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#F7F6F3] border border-[#ECE7DF] text-[#7A7368]">
                        2월 11일까지
                      </span>
                      <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#F7F6F3] border border-[#ECE7DF] text-[#7A7368]">
                        태그
                      </span>
                    </div>
                  </div>
                  <div className="text-[#9A948A] text-xl">›</div>
                </article>
              ))}
            </div>
          </main>

          {/* 우측 */}
          <aside className="w-full">
            <h2 className="text-[16px] font-semibold text-[#342F28] mb-3">
              AI 추천 유저
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-[10px] border border-[#ECE7DF] bg-white p-4"
                >
                  <div className="flex flex-col items-center gap-3">
                    <img
                      className="w-[120px] h-[120px] object-cover rounded-[30px]"
                      alt="profile"
                      src={
                        user?.avatar ||
                        "https://ui-avatars.com/api/?name=User&background=E9FCEF&color=26E1AC&size=152"
                      }
                    />
                    <div className="text-center">
                      <div className="font-semibold text-[#342F28]">김주연</div>
                      <div className="text-[12px] text-[#7A7368]">디자이너</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[10px] bg-[#E9FCEF] border border-[#BFEDE1] text-[#1F8F76] font-semibold"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <img className="w-5 h-5" alt="" src={plane} aria-hidden="true" />
                      <span className="text-[14px] leading-none">쪽지보내기</span>
                    </button>

                    <button
                      type="button"
                      className="h-10 rounded-[10px] bg-[#F7F6F3] border border-[#ECE7DF] text-[#7A7368] hover:opacity-90"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      프로필 보러가기
                    </button>
                  </div>

                  <p className="mt-3 text-[11px] text-[#9A948A] leading-4">
                    주변님께서 새롭게 볼 수 있는 유저를 추천해드려요!
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
