import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircleCheck, FileText, Mic, X } from "lucide-react";

import { getDisplayName } from "../utils/name";
import { useUploadManager, type LinkItem } from "../hooks/useUploadManager";

import { formatPeriod, getEndDateFromPeriod, getStartDateFromPeriod, validatePeriod } from "../utils/format";
//import { uploadProfileDocument } from "../api/profile/profile";
import { addExperienceLink, postExperienceFile } from "../api/profile/experiences";
//import type { UploadDocumentResponse } from "../types/profile";

import { createExperienceSession, createAIDraft, patchExperience } from "../api/profile/session";
import { useQueryClient } from "@tanstack/react-query";
import { useFileUpload } from "../hooks/useProfileMutation";
import type { AttachedFile } from "../types/career";
import { useProfileData } from "../hooks/useProfileQueries";

// --------------------
// types (페이지 내부 상태용)
// --------------------
type DraftAiResult = Partial<{
  draft?: string;
}>;

const CareerAddPage = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { mutateAsync: uploadFile } = useFileUpload();


  // ✅ HomePage에서 넘긴 prompt
  const initialPrompt = (location.state as any)?.prompt as string | undefined;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    selectedFiles,
    removeFile,
    setSelectedFiles,
    links,
    linkInput,
    setLinkInput,
    addLink,
    removeLink,
    fileInputRef
  } = useUploadManager({ maxFiles: 3 });

  const { user } = useProfileData(); 
  const userName = user?.name || "사용자";
  
  const [isAIInputOpen, setIsAIInputOpen] = useState(false);
  const [aiText, setAiText] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);

  // ✅ 서버 세션 experienceId
  //const [experienceId, setExperienceId] = useState<number | null>(null);
  const experienceIdRef = useRef<number | null>(null);

  // ✅ autosave debounce
  const autosaveTimerRef = useRef<number | null>(null);
  const autosaveEnabledRef = useRef(false); // 세션 생긴 이후 true

  const [newCareer, setNewCareer] = useState({
    title: "",
    organizer: "",
    period: "",
    startDate: "",
    role: "",
    participation: "",
    fileName: "",
    link: "",
    intro: "",
    isPublic: true
  });

  const inputFields = useMemo(
    () => [
      { label: "활동명", field: "title" },
      { label: "주최/기관", field: "organizer" },
      { label: "기간", field: "period" },
      { label: "참여형태", field: "participation" },
      { label: "역할", field: "role" }
    ],
    []
  );

  function normalizeDraftToIntro(draft: string): string {
    const lines = draft
      .split(/\r?\n/)
      .map((v) => v.trim())
      .filter(Boolean)
      // 앞에 붙는 불릿/번호 제거
      .map((v) => v.replace(/^([•\-*]|(\d+[\.\)]))\s*/g, "").trim())
      .filter(Boolean);

    return lines.join("\n"); //줄바꿈 유지
  }

  useEffect(() => {
    if (!initialPrompt || initialPrompt.trim().length === 0) return;

    // AI 입력창에 prompt 표시
    setAiText(initialPrompt);
    setIsAIInputOpen(true);

    // textarea 높이 반영
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
    });

    let cancelled = false;

    const run = async () => {
      try {
        setIsAnalysing(true);

        // (A) experience 세션 생성
        const created = await createExperienceSession();
        if (!created?.isSuccess) throw new Error(created?.message ?? "experience 생성 실패");

        const id = Number(created.result);
        if (!Number.isFinite(id)) throw new Error("experienceId가 올바르지 않습니다.");

        if (cancelled) return;
        //setExperienceId(id);
        experienceIdRef.current = id;

        // 세션 생성되었으니 autosave 활성화
        autosaveEnabledRef.current = true;

        // (B) ai draft 호출 (experienceId 필요)
        // ⚠️ DraftRequest 키가 다르면 여기만 수정
        const draftRes = await createAIDraft(id, { prompt: initialPrompt } as any);

        if (cancelled) return;

        if (!draftRes?.isSuccess) {
          // ai draft 실패해도 세션은 생성됨 → 사용자가 직접 작성 가능
          setIsToastVisible(false);
          return;
        }

        const draftObj: DraftAiResult = (draftRes.result ?? {}) as any;
        const rawDraft = typeof draftObj?.draft === "string" ? draftObj.draft : "";

        if (rawDraft) {
          const introText = normalizeDraftToIntro(rawDraft);

          setNewCareer((prev) => ({
            ...prev,
            intro: introText
          }));
        }


        // 토스트 노출
        setIsAIInputOpen(false);
        setIsToastVisible(true);
      } catch (e) {
        // 실패해도 사용자가 수동 작성 가능하게만 둠
        console.error("[CareerAddPage] init AI flow error:", e);
      } finally {
        if (!cancelled) setIsAnalysing(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [initialPrompt]);

  // --------------------
  // 2) 토스트 자동 종료
  // --------------------
  useEffect(() => {
    if (!isToastVisible) return;
    const t = window.setTimeout(() => setIsToastVisible(false), 1000);
    return () => window.clearTimeout(t);
  }, [isToastVisible]);

  // --------------------
  // 3) 입력 변경: period 포맷 유지
  // --------------------
  const handleInputChange = (field: string, value: string, e?: React.ChangeEvent<HTMLInputElement>) => {
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

  // --------------------
  // 4) Autosave: newCareer 변경 시 debounce로 PATCH
  //    - experienceId가 있어야만 작동
  // --------------------
  useEffect(() => {
    const id = experienceIdRef.current;
    if (!id) return;
    if (!autosaveEnabledRef.current) return;

    // debounce clear
    if (autosaveTimerRef.current) {
      window.clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = window.setTimeout(async () => {
      try {
        // period → start/end 파싱
        let startDate: string | null = null;
        let endDate: string | null = null;

        if (newCareer.period && validatePeriod(newCareer.period)) {
          startDate = getStartDateFromPeriod(newCareer.period) ?? null;
          endDate = getEndDateFromPeriod(newCareer.period) ?? null;
        }

        await patchExperience(id, {
          title: newCareer.title,
          organization: newCareer.organizer,
          startDate,
          endDate,
          activity: newCareer.participation,
          role: newCareer.role,
          summary: newCareer.intro,
          isPublic: newCareer.isPublic
        });
      } catch (e) {
        console.warn("[CareerAddPage] autosave failed:", e);
      }
    }, 800);

    return () => {
      if (autosaveTimerRef.current) window.clearTimeout(autosaveTimerRef.current);
    };
  }, [newCareer]);

  // --------------------
  // 5) textarea auto height
  // --------------------
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  //  파일 업로드 핸들러 (실제 서버 업로드)
  const handleMultipleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);

    if (selectedFiles.length + fileArray.length > 3) {
      alert("파일은 최대 3개까지 첨부 가능합니다.");
      return;
    }

    try {
      console.log("📤 파일 업로드 시작:", fileArray.map(f => f.name));

      const uploadedFiles: AttachedFile[] = [];

      for (const file of fileArray) {
        console.log(`🔄 업로드 중: ${file.name}`);
        const res = await uploadFile(file);
        console.log(`✅ 업로드 완료: ${file.name}, ID: ${res.result.fileId}`);

        uploadedFiles.push({
          id: res.result.fileId,
          name: file.name,
          fileObj: file,
          type: 'file'
        });
      }

      console.log("✅ 모든 파일 업로드 완료:", uploadedFiles);
      setSelectedFiles(prev => [...prev, ...uploadedFiles]);

    } catch (error: any) {
      console.error("❌ 파일 업로드 실패:", error);
      const errorMsg = error.response?.data?.message || error.message || "알 수 없는 오류";
      alert(`파일 업로드 실패:\n${errorMsg}`);
    }
  };


  // --------------------
  // 6) 파일 선택 시 UI 추가
  // --------------------
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    handleMultipleFileUpload(files);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  const handleBoxClick = () => fileInputRef.current?.click();
  {/*
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (selectedFiles.length + e.target.files.length > 3) {
      alert("파일은 최대 3개까지만 첨부할 수 있습니다.");
      return;
    }
    handleFileUpload(e.target.files);
  };
   */}

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (!files) return;

    if (selectedFiles.length + files.length > 3) {
      alert("파일은 최대 3개까지만 첨부할 수 있습니다.");
      return;
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      handleMultipleFileUpload(e.dataTransfer.files);
    }
  };

  // --------------------
  // 7) (선택) 페이지 내부에서 “생성하기” 버튼을 눌러도 draft 호출 가능하게
  //    - 이미 experienceId가 있으면 draft만 다시 호출
  //    - 없으면 세션 먼저 만들고 호출
  // --------------------
  const handleAIDraft = async () => {
    const prompt = aiText.trim();
    if (!prompt) return;

    try {
      setIsAnalysing(true);

      let id = experienceIdRef.current;

      if (!id) {
        const created = await createExperienceSession();
        if (!created?.isSuccess) throw new Error(created?.message ?? "experience 생성 실패");
        id = Number(created.result);
        if (!Number.isFinite(id)) throw new Error("experienceId가 올바르지 않습니다.");
        //setExperienceId(id);
        experienceIdRef.current = id;
        autosaveEnabledRef.current = true;
      }

      const draftRes = await createAIDraft(id, { prompt } as any);
      if (!draftRes?.isSuccess) {
        alert(draftRes?.message ?? "AI 초안 생성에 실패했습니다.");
        return;
      }

      const draftObj: DraftAiResult = (draftRes.result ?? {}) as any;
      const rawDraft = typeof draftObj?.draft === "string" ? draftObj.draft : "";

      if (!rawDraft) {
        alert("AI 초안이 비어있습니다.");
        return;
      }

      const introText = normalizeDraftToIntro(rawDraft);

      setNewCareer((prev) => ({
        ...prev,
        intro: introText
      }));


      setAiText("");
      setIsAIInputOpen(false);
      setIsToastVisible(true);
    } catch (e) {
      console.error("[CareerAddPage] AI draft error:", e);
      alert("AI 초안 생성 중 오류가 발생했습니다.");
    } finally {
      setIsAnalysing(false);
    }
  };

  // --------------------
  // 8) 등록하기(최종 확정): 기존 experienceId 있으면 PATCH + 첨부 연결
  //    - 없다면 (AI 없이 직접 작성 케이스) 세션 생성 후 PATCH
  // --------------------
  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

    //모든 필드가 비어있는지 
    const isAllEmpty = !newCareer.title.trim() &&
      !newCareer.organizer.trim() &&
      !newCareer.period.trim() &&
      !newCareer.participation.trim() &&
      !newCareer.role.trim() &&
      !newCareer.intro.trim();

    if (isAllEmpty) {
      alert("입력된 내용이 없습니다. 내용을 작성한 후 등록해주세요.");
      return;
    }

    if (!newCareer.title || newCareer.title.trim() === "") {
      alert("활동명은 필수 입력 항목입니다. 등록을 위해 활동명을 입력해주세요!");
      return;
    }

    let start = "";
    let end = "";

    if (newCareer.period && newCareer.period.trim() !== "") {
      if (!validatePeriod(newCareer.period)) {
        alert("날짜 형식이 올바르지 않습니다.\n예: 2024.01.01 - 2024.12.31");
        return;
      }
      start = getStartDateFromPeriod(newCareer.period);
      end = getEndDateFromPeriod(newCareer.period);

      const startYear = parseInt(start.split("-")[0]);
      if (startYear < 1900 || startYear > 2100) {
        alert("연도를 정확히 입력해주세요. (예: 2024)");
        return;
      }

      if (end) {
        const endYear = parseInt(end.split("-")[0]);
        if (endYear < 1900 || endYear > 2100) {
          alert("종료 연도를 정확히 입력해주세요.");
          return;
        }
        if (new Date(start) > new Date(end)) {
          alert("시작일이 종료일보다 늦을 수 없습니다.");
          return;
        }
      }
    }
    try {
      let id = experienceIdRef.current;

      // experience 세션이 없으면 생성
      if (!id) {
        const created = await createExperienceSession();
        if (!created?.isSuccess) throw new Error(created?.message ?? "experience 생성 실패");
        id = Number(created.result);
        if (!Number.isFinite(id)) throw new Error("experienceId가 올바르지 않습니다.");
        //setExperienceId(id);
        experienceIdRef.current = id;
        autosaveEnabledRef.current = true;
      }

      // 최종 PATCH (작성 완료 확정)
      await patchExperience(id, {
        title: newCareer.title,
        organization: newCareer.organizer,
        startDate: start ?? null,
        endDate: end ?? null,
        activity: newCareer.participation,
        role: newCareer.role,
        summary: newCareer.intro,
        isPublic: newCareer.isPublic
      });

      // 파일 업로드 + experience 연결
      // if (selectedFiles.length > 0) {
      //   try {
      //     const uploadResults: UploadDocumentResponse[] = await Promise.all(
      //       selectedFiles.map((file) => {
      //         if (file.fileObj) return uploadProfileDocument(file.fileObj);
      //         return Promise.resolve({ isSuccess: false, result: null } as any);
      //       })
      //     );

      //     const attachPromises: Promise<any>[] = [];
      //     uploadResults.forEach((res, idx) => {
      //       if (res.isSuccess && res.result) {
      //         attachPromises.push(
      //           postExperienceFile(id!, {
      //             fileId: res.result.id,
      //             fileName: selectedFiles[idx].name
      //           })
      //         );
      //       }
      //     });

      //     await Promise.all(attachPromises);
      //   } catch (error) {
      //     console.error("❌ 파일 업로드 중 오류:", error);
      //     alert("이력은 저장되었으나 일부 파일 업로드에 실패했습니다.");
      //   }
      // }
      if (selectedFiles.length > 0) {
        try {
          console.log("🛰️ 서버 ID로 파일 연결 시작...", selectedFiles);

          await Promise.all(
            selectedFiles.map((file) => {
              return postExperienceFile(id!, {
                fileId: Number(file.id), // ✅ 서버에서 받은 진짜 ID
                fileName: file.name
              });
            })
          );
          console.log("✅ 파일 연결 완료");
        } catch (error) {
          console.error("❌ 파일 연결 중 오류:", error);
          alert("이력 정보는 저장되었으나, 파일 연결에 실패했습니다.");
        }
      }
      // 링크 연결
      if (links.length > 0) {
        try {
          const linkPromises = links.map(async (link: LinkItem) =>
            addExperienceLink(id!, { title: "", url: link.url })
          );
          await Promise.all(linkPromises);
        } catch (error) {
          console.error("❌ 링크 등록 중 오류:", error);
          alert("이력은 저장되었으나 일부 링크 등록에 실패했습니다.");
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["myExperiences"] });
      await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      navigate("/profile");
    } catch (error) {
      console.error("등록 중 오류:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  // --------------------
  // UI
  // --------------------
  return (
    <>
      <div className="flex flex-col items-center w-full min-h-screen bg-white pb-20">
        <div className="flex px-5 py6 justify-center items-center w-full">
          <p className="font-pretendard text-[24px] sm:text-[32px] font-bold leading-[120%] tracking-[-0.01em] text-[#342F28]">
            이력 추가
          </p>
        </div>

        <div className="flex flex-col w-full max-w-[800px] px-5 md:px-[40px] py-[40px] md:py-[50px]
          gap-[40px] rounded-[20px] lg:rounded-[30px] bg-[#FAFAFA]">

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
                        {userName}님이 했던 경험을 자유롭게 서술해주세요. 모아요 AI가 정리해드려요!
                      </span>
                      <Mic size={20} className="text-[#1BA07A] shrink-0" />
                    </div>
                  ) : (
                    <div className="flex w-full gap-3 w-full animate-fadeIn">
                      <textarea
                        ref={textareaRef}
                        className="flex-1 max-h-[120px] outline-none resize-none bg-transparent
                          font-pretendard text-[15px] sm:text-[16px] font-medium text-[#1BA07A]"
                        placeholder={`${userName}님이 했던 경험을 자유롭게 서술해주세요.`}
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
                      className="bg-[#6EEBC7] px-4 py-2 rounded-[10px]
                        font-pretendard font-medium text-[13px] sm:text-[14px] text-[#25221D]
                        hover:bg-[#5BD9B5] transition-colors shadow-sm hover:brightness-95"
                      onClick={() => setIsAIInputOpen(false)}
                      type="button"
                    >
                      닫기
                    </button>

                    <button
                      className="bg-[#6EEBC7] px-4 py-2 rounded-[10px]
                        font-pretendard font-medium text-[13px] sm:text-[14px] text-[#25221D]
                        hover:bg-[#5BD9B5] transition-colors shadow-sm hover:brightness-95
                        disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAIDraft();
                      }}
                      disabled={isAnalysing || !aiText.trim()}
                      type="button"
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
                  placeholder={item.field === "period" ? "2025.07.01 - 2026.01.31" : "입력해주세요."}
                  className="flex-1 h-full px-[16px] outline-none border rounded-[10px] border-[#D6D6D8] bg-transparent
                    font-pretendard text-[14px] sm:text-[16px] font-medium text-[#423C33]
                    placeholder:text-[#969599]"
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
              className="w-full h-[160px] p-[16px] resize-none outline-none
                rounded-[10px] bg-white border border-[#D6D6D8] placeholder:text-[#969599]
                text-[14px] sm:text-[16px] font-pretendard font-medium leading-[140%] text-[#423C33]"
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
                  className="flex items-center justify-between w-full h-[50px] px-[16px]
                    bg-[#E9FCF7] rounded-[10px] border border-[#26E1AC]"
                >
                  <span className="text-[14px] font-medium truncate font-pretendard text-[#25221D] leading-[140%] max-w-[80%]">
                    {file.name}
                  </span>
                  <button onClick={() => removeFile(index)} className="text-[#7C7160] hover:text-[#1BA07A]" type="button">
                    <X size={24} />
                  </button>
                </div>
              ))}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept="image/*, .pdf"
              />

              {selectedFiles.length < 3 && (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleBoxClick}
                  className="flex items-center justify-center h-[60px] sm:h-[80px] gap-[8px]
                    rounded-[20px] boder boder-[#ADA395] bg-[#EFEEEB] cursor-pointer"
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
              )}
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
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] font-pretendard text-[#25221D] font-medium leading-[140%] max-w-[80%] underline"
                    >
                      {link.url}
                    </a>
                    <button
                      onClick={() => removeLink(index)}
                      className="cursor-pointer shrink-0 text-[#26E1AC] hover:text-[#1BA07A]"
                      type="button"
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
            className="w-[140px] sm:w-[160px] h-[48px] sm:h-[52px]
              bg-[#26E1AC] rounded-[10px] text-[16px] sm:text-[18px]
              font-pretendard font-medium leading-[140%] text-[#25221D]"
          >
            등록하기
          </button>
        </div>
      </div>
    </>
  );
};

export default CareerAddPage;
