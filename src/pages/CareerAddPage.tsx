// src/pages/CareerAddPage.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircleCheck, FileText, Mic, X } from "lucide-react";

import { getDisplayName } from "../utils/name";
import { DUMMY_PROFILE } from "../data/profileData";
import { useUploadManager } from "../hooks/useUploadManager";
import { formatPeriod, validatePeriod } from "../utils/format";

import {
  createAIDraft,
  createExperience,
  type Visibility,
} from "../api/experiences";

type CareerAddLocationState = {
  prompt?: string;
};

const CareerAddPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    selectedFiles,
    handleFileUpload,
    removeFile,
    links,
    linkInput,
    setLinkInput,
    addLink,
    removeLink,
    fileInputRef,
  } = useUploadManager({
    maxFiles: 3,
  });

  const [isAIInputOpen, setIsAIInputOpen] = useState(false);
  const [aiText, setAiText] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);

  // ✅ 저장(API) 진행 상태
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const [newCareer, setNewCareer] = useState({
    title: "", // 활동명 (※ 여기서 /experiences 생성에 사용)
    organizer: "", // 주최/기관
    period: "", // 기간(입력 UX 유지용)
    startDate: "", // (기존 코드 유지)
    role: "",
    participation: "",
    fileName: "",
    link: "",
    intro: "", // summary로 매핑 가능
    isPublic: true, // visibility로 매핑
    // 필요하면 아래 추가 가능: endDate: ""
  });

  // HomePage에서 넘어온 prompt 자동 세팅
  useEffect(() => {
    const navState = (location.state ?? {}) as CareerAddLocationState;
    const prompt = navState.prompt?.trim();
    if (!prompt) return;

    setIsAIInputOpen(true);
    setAiText(prompt);

    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
      textareaRef.current.focus();
    });
  }, [location.state]);

  const inputFields = [
    { label: "활동명", field: "title" },
    { label: "주최/기관", field: "organizer" },
    { label: "기간", field: "period" },
    { label: "참여형태", field: "participation" },
    { label: "역할", field: "role" },
  ];

  const handleInputChange = (
    field: string,
    value: string,
    e?: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (field === "period" && e) {
      const input = e.target;
      const start = input.selectionStart || 0;
      const previousValue = newCareer.period;
      const formattedValue = formatPeriod(value);

      if (previousValue !== formattedValue) {
        setNewCareer((prev) => ({ ...prev, [field]: formattedValue }));

        const isDeleting = value.length < previousValue.length;
        const isModifiedInMiddle = start < value.length;

        if (isDeleting || isModifiedInMiddle) {
          setTimeout(() => {
            input.setSelectionRange(start, start);
          }, 0);
        }
      }
      return;
    }

    setNewCareer((prev) => ({ ...prev, [field]: value }));
  };

  // 파일 업로드 UX
  const handleBoxClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFileUpload(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
  };

  // 입력 autosize
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

  // ✅ 핵심: 등록하기 클릭 시 API 플로우
  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setApiError("");

    // blur (커서 테두리)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // 기간 검증은 유지
    if (newCareer.period && !validatePeriod(newCareer.period)) {
      setApiError("기간 형식이 올바르지 않습니다. (YYYY.MM.DD - YYYY.MM.DD)");
      return;
    }

    // 활동명 필수(= experiences 생성에 필요)
    const title = newCareer.title.trim();
    if (!title) {
      setApiError("활동명을 입력해주세요.");
      return;
    }

    const visibility: Visibility = newCareer.isPublic ? "PUBLIC" : "PRIVATE";

    try {
      setIsSaving(true);

      // 1) experiences 생성
      const created = await createExperience({ title, visibility });

      if (!created.isSuccess) {
        throw new Error(created.message || "이력 생성에 실패했습니다.");
      }

      // 서버가 experienceId로 줄 수도, id로 줄 수도 있어서 방어적으로 처리
      const experienceId = created.result;

      if (!experienceId || typeof experienceId !== "number") {
        throw new Error("experienceId를 응답에서 찾을 수 없습니다.");
      }

      // 2) AI 입력이 없으면 여기서 끝 → profile로 이동
      const prompt = aiText.trim();
      if (!prompt) {
        navigate("/profile", {
          state: {
            newResume: {
              ...newCareer,
              id: experienceId,
              visibility,
              fileName: selectedFiles.map((f) => f.name),
              link: links,
            },
          },
        });
        return;
      }

      // 3) AI draft 생성
      setIsAnalysing(true);
      const draft = await createAIDraft(experienceId, { prompt });

      if (!draft.isSuccess) {
        throw new Error(draft.message || "AI 초안 생성에 실패했습니다.");
      }

      // 4) 응답 매핑해서 폼 자동 채움
      const r = draft.result;

      setNewCareer((prev) => ({
        ...prev,
        organizer: r.organization ?? prev.organizer,
        title: r.title ?? prev.title, // 서버가 title을 다시 정리해줄 수 있으니 덮어씌움
        role: r.role ?? prev.role,
        participation: r.activity ?? prev.participation, // activity → participation에 우선 매핑
        intro: r.summary ?? prev.intro,
        // period는 네 입력 UX용이라 유지. (원하면 start/end로 표시 문자열 만들어서 넣어도 됨)
      }));

      setAiText("");
      setIsAIInputOpen(false);
      setIsToastVisible(true);

      // 여기서 "자동 저장 후 profile로 이동"까지 하고 싶으면 아래 주석 해제
      // navigate("/profile", { state: { newResume: { ...newCareer, id: experienceId } } });

    } catch (err: any) {
      setApiError(err?.message ?? "요청 처리 중 오류가 발생했습니다.");
    } finally {
      setIsAnalysing(false);
      setIsSaving(false);
    }
  };

  // 토스트 자동 닫기
  useEffect(() => {
    if (!isToastVisible) return;
    const timer = setTimeout(() => setIsToastVisible(false), 1000);
    return () => clearTimeout(timer);
  }, [isToastVisible]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white pb-20">
      <div className="flex px-5 py6 justify-center items-center w-full">
        <p className="font-pretendard text-[24px] sm:text-[32px] font-bold leading-[120%] tracking-[-0.01em] text-[#342F28]">
          이력 추가
        </p>
      </div>

      <div
        className="flex flex-col w-full max-w-[800px] px-5 md:px-[40px] py-[40px] md:py-[50px]
        gap-[40px] rounded-[20px] lg:rounded-[30px] bg-[#FAFAFA]"
      >
        {/* 에러 메시지 */}
        {apiError && (
          <div className="w-full p-3 rounded-[10px] border border-[#E3B7B7] bg-[#FFF3F3] text-[#8B2C2C] text-[14px]">
            {apiError}
          </div>
        )}

        {/* AI 영역 */}
        <div className="flex flex-col w-full gap-[16px]">
          {isToastVisible && !isAIInputOpen && (
            <div className="flex w-full p-4 items-center gap-3 border border-[#D6D6D8] rounded-[10px] bg-[#F2F2F2] shadow-sm animate-fadeIn">
              <CircleCheck className="text-[#7C7B80] fill-[#7C7160] shrink-0" size={24} />
              <span className="font-pretendard text-[#7C7160] text-[14px] sm:text-[16px] font-medium leading-[130%]">
                생성이 완료되었습니다! 필요한 부분은 직접 수정해주세요.
              </span>
            </div>
          )}

          {!isToastVisible && (
            <>
              <div
                className={`flex flex-col w-full border border-[#BCF6E5] rounded-[10px] bg-[#E9FCF7] transition-all duration-300
                  ${isAIInputOpen ? "p-4" : "h-[60px] sm:h-[70px] px-4 justify-center cursor-pointer hover:bg-[#d8f5eb]"}`}
                onClick={(e) => {
                  if (!isAIInputOpen) {
                    e.stopPropagation();
                    setIsAIInputOpen(true);
                  }
                }}
              >
                {!isAIInputOpen ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="flex-1 font-pretendard text-[#1BA07A] text-[14px] sm:text-[16px] font-medium leading-[130%]">
                      {getDisplayName(DUMMY_PROFILE.name)}님이 했던 경험을 자유롭게 서술해주세요. 모아요 AI가 정리해드려요!
                    </span>
                    <Mic size={20} className="text-[#1BA07A] shrink-0" />
                  </div>
                ) : (
                  <div className="flex w-full gap-3 w-full animate-fadeIn">
                    <textarea
                      ref={textareaRef}
                      className="flex-1 max-h-[120px] outline-none resize-none bg-transparent font-pretendard text-[15px] sm:text-[16px] font-medium text-[#1BA07A]"
                      placeholder={`${getDisplayName(DUMMY_PROFILE.name)}님이 했던 경험을 자유롭게 서술해주세요.`}
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
                <div className="flex justify-end gap-[8px]">
                  <button
                    type="button"
                    className="bg-[#6EEBC7] px-4 py-2 rounded-[10px] font-pretendard font-medium text-[13px] sm:text-[14px] text-[#25221D]
                      hover:bg-[#5BD9B5] transition-colors shadow-sm hover:brightness-95"
                    onClick={() => setIsAIInputOpen(false)}
                  >
                    닫기
                  </button>

                  <button
                    type="button"
                    className="bg-[#6EEBC7] px-4 py-2 rounded-[10px] font-pretendard font-medium text-[13px] sm:text-[14px] text-[#25221D]
                      hover:bg-[#5BD9B5] transition-colors shadow-sm hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isAnalysing || isSaving}
                    onClick={(e) => {
                      e.stopPropagation();
                      // ✅ 여기서는 서버 호출이 아니라, “등록하기”에서 함께 처리하는 흐름이므로
                      // 버튼을 유지하고 싶으면 그냥 입력창 닫기 정도로만 써도 됨.
                      // 지금은 UX상: 등록하기를 누르게 두는 게 맞아서, 여기서는 아무것도 안 해도 됨.
                    }}
                  >
                    {isAnalysing ? "분석 중..." : "생성하기"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 활동 정보 */}
        <div className="flex flex-col gap-[12px]">
          {inputFields.map((item, idx) => (
            <div key={idx} className="flex items-center gap-[8px] h-[48px] sm:h-[52px]">
              <div className="flex w-[80px] sm:w-[100px] h-full justify-center items-center rounded-[5px] bg-[#EFEEEB]">
                <span className="text-[#423C33] font-pretendard text-[14px] sm:text-[15px] font-semibold">
                  {item.label}
                </span>
              </div>
              <input
                type="text"
                maxLength={item.field === "period" ? 23 : undefined}
                value={(newCareer as any)[item.field]}
                onChange={(e) => handleInputChange(item.field, e.target.value, e)}
                placeholder="입력해주세요."
                className="flex-1 h-full px-[16px] outline-none border rounded-[10px] border-[#D6D6D8] bg-transparent
                  font-pretendard text-[14px] sm:text-[16px] font-medium text-[#423C33] placeholder:text-[#969599]"
              />
            </div>
          ))}
        </div>

        {/* 활동 소개 */}
        <div className="flex flex-col gap-[10px]">
          <span className="self-stretch font-pretendard text-[16px] sm:text-[18px] font-semibold text-[#25221D] leading-[130%] tracking-[-0.01em]">
            활동 소개
          </span>

          <textarea
            placeholder="자유롭게 입력해주세요."
            value={newCareer.intro}
            onChange={(e) => handleInputChange("intro", e.target.value)}
            className="w-full h-[160px] p-[16px] resize-none outline-none rounded-[10px] bg-white border border-[#D6D6D8]
              placeholder:text-[#969599] text-[14px] sm:text-[16px] font-pretendard font-medium leading-[140%] text-[#423C33]"
          />
        </div>

        {/* 파일 첨부 */}
        <div className="flex flex-col gap-[10px]">
          <span className="self-stretch text-[#25221D] font-pretendard text-[16px] sm:text-[18px] font-semibold leading-[130%] tracking-[-0.01em]">
            파일 첨부
          </span>

          <div className="flex flex-col gap-[8px]">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full h-[50px] px-[16px] bg-[#E9FCF7] rounded-[10px] border border-[#26E1AC]"
              >
                <span className="text-[14px] font-medium truncate font-pretendard text-[#25221D] leading-[140%] max-w-[80%]">
                  {file.name}
                </span>
                <button type="button" onClick={() => removeFile(index)} className="text-[#7C7160] hover:text-[#1BA07A]">
                  <X size={24} />
                </button>
              </div>
            ))}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/*, .pdf"
            />

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleBoxClick}
              className="flex items-center justify-center h-[60px] sm:h-[80px] gap-[8px] rounded-[20px] boder boder-[#ADA395] bg-[#EFEEEB] cursor-pointer"
            >
              <div className="flex items-center justify-center gap-[8px] pointer-events-none">
                <FileText size={20} className="text-[#978B78] mb-1" />
                <div className="flex flex-col items-center justify-center gap-[4px]">
                  <span className="text-[13px] sm:text-[14px] font-medium font-pretendard leading-[140%] text-center text-[#978B78]">
                    파일을 첨부해주세요
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-normal font-pretendard leading-[150%] text-center text-[#978B78]">
                    (증빙서류, 포트폴리오)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 링크 첨부 */}
        <div className="flex flex-col gap-[10px]">
          <span className="self-stretch font-pretendard text-[16px] sm:text-[18px] font-semibold leading-[130%] tracking-[-0.01em] text-[#25221D]">
            링크 첨부
          </span>

          {links.length > 0 && (
            <div className="flex flex-col gap-[8px]">
              {links.map((link, index) => (
                <div key={index} className="flex items-center justify-between w-full h-[50px] px-[16px] bg-[#E9FCF7] rounded-[10px]">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] font-pretendard text-[#25221D] font-medium leading-[140%] max-w-[80%] underline"
                  >
                    {link}
                  </a>
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="cursor-pointer shrink-0 text-[#26E1AC] hover:text-[#1BA07A]"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="text"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addLink(linkInput)}
            placeholder="링크를 첨부해주세요. (포트폴리오, 깃허브)"
            className="h-[50px] px-[16px] border border-[#D6D6D8] rounded-[10px] outline-none bg-transparent
              font-pretendard text-[14px] font-medium leading-[130%] text-[#978B78] placeholder:text-[#969599]"
          />
        </div>
      </div>

      <div className="flex justify-center w-full mt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-[140px] sm:w-[160px] h-[48px] sm:h-[52px] bg-[#26E1AC] rounded-[10px]
            text-[16px] sm:text-[18px] font-pretendard font-medium leading-[140%] text-[#25221D]
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? "저장 중..." : "등록하기"}
        </button>
      </div>
    </div>
  );
};

export default CareerAddPage;
