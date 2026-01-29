import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleCheck, FileText, Mic, X } from "lucide-react";
import { getDisplayName } from "../utils/name";
import { DUMMY_PROFILE } from "../data/profileData";
import { useUploadManager } from "../hooks/useUploadManager";
import { formatPeriod, getStartDateFromPeriod, validatePeriod } from "../utils/format";

const CareerAddPage = () => {
    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { selectedFiles, handleFileUpload, removeFile,
        links, linkInput, setLinkInput, addLink, removeLink, fileInputRef
    } = useUploadManager({
        maxFiles: 3,
    });
    const [isAIInputOpen, setIsAIInputOpen] = useState(false); // ai입력창 상태
    const [aiText, setAiText] = useState("");// AI 입력창의 텍스트를 관리할 상태
    const [isAnalysing, setIsAnalysing] = useState(false);    // AI 로딩 상태 (버튼 텍스트 변경용)
    const [isToastVisible, setIsToastVisible] = useState(false);// 토스트 상태 추가

    const [newCareer, setNewCareer] = useState({
        title: "",//활동명
        organizer: "", //주최/기관
        period: "", //기간
        startDate: "", //시작일
        role: "", //역할
        participation: "", //참여형태
        fileName: "", //첨부파일 이름
        link: "", //첨부링크 
        intro: "", //활동 소개
        isPublic: true, // 기본값은 공개로 설정
    });

    //map을 위한 필드 설정
    const inputFields = [
        { label: "활동명", field: "title" },
        { label: "주최/기관", field: "organizer" },
        { label: "기간", field: "period" },
        { label: "참여형태", field: "participation" },
        { label: "역할", field: "role" },
    ];

    const handleInputChange = (field: string, value: string, e?: React.ChangeEvent<HTMLInputElement>) => {
        if (field === "period" && e) {
            const input = e.target;
            const start = input.selectionStart || 0;
            const previousValue = newCareer.period;
            const formattedValue = formatPeriod(value);

            if (previousValue !== formattedValue) {
                setNewCareer(prev => ({ ...prev, [field]: formattedValue }));

                // 조건부 커서 보정
                //  글자 수가 줄어들었거나 (삭제)
                //  커서 위치가 문자열 중간에 있을 때만 (수정) 
                const isDeleting = value.length < previousValue.length;
                const isModifiedInMiddle = start < value.length;

                if (isDeleting || isModifiedInMiddle) {
                    setTimeout(() => {
                        if (input) {
                            input.setSelectionRange(start, start);
                        }
                    }, 0);
                }
            }
            return;
        }

        setNewCareer(prev => ({ ...prev, [field]: value }));
    };


    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        //이벤트 전파 방지
        e.stopPropagation();
        //현재 포커스된 요소가 있다면 해제 (커서 생기는 현상 방지)
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        // 기간 형식이 올바른지 체크 (YYYY.MM.DD - YYYY.MM.DD)
        if (newCareer.period && !validatePeriod(newCareer.period)) {
            return;
        }

        // 모든 정보를 하나의 객체로 합침
        const finalData = {
            ...newCareer,
            startDate: getStartDateFromPeriod(newCareer.period),
            id: Date.now(),//임시id
            fileName: selectedFiles.map(f => f.name),
            link: links,
        };

        console.log("최종 전달 데이터:", finalData);

        navigate("/profile", {
            state: { newResume: finalData }
        });
    };

    //  클릭 시 파일 선택창 띄우기
    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    // 파일 선택창에서 선택했을 때
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFileUpload(e.target.files);
        }
    };

    // 드래그 오버 핸들러 (파일을 영역 위로 올렸을 때)
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };


    // 드롭 핸들러 (파일을 놓았을 때)
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            handleFileUpload(e.dataTransfer.files);
        }
    };

    // AI 시뮬레이션 
    const handleAISimulate = () => {
        if (!aiText.trim()) return;

        setIsAnalysing(true);

        // 지금은 1.5초후 AI가 분석 후 채운 것 처럼 함
        setTimeout(() => {
            const simulatedResult = {
                title: "UMC 9th 연합 개발동아리",
                organizer: "",
                period: "",
                participation: "디자이너",
                role: "UI제작",
                intro: ""
            };

            setNewCareer(prev => ({
                ...prev,
                ...simulatedResult
            }));

            setAiText("");
            setIsAnalysing(false);
            setIsAIInputOpen(false); // 분석 완료 후 입력창 닫기
            setIsToastVisible(true);  // 토스트 띄우기
        }, 1500);
    };

    useEffect(() => {
        if (isToastVisible) {
            const timer = setTimeout(() => setIsToastVisible(false), 1000); //1초 띄우기 토스트
            return () => clearTimeout(timer);
        }
    }, [isToastVisible]);

    // 입력 내용에 따라 높이 자동 조절 함수
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAiText(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // 높이 초기화
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 내용 높이에 맞게 설정
        }
    };

    return (
        <>
            <div className="flex flex-col items-center w-full min-h-screen bg-white pb-20">
                <div className="flex px-5 py6 justify-center items-center w-full">
                    <p className="font-pretendard text-[24px] sm:text-[32px] font-bold leading-[120%] tracking-[-0.01em] text-[#342F28]">
                        이력 추가
                    </p>
                </div>

                {/**추가 배경 영역 */}
                <div className="flex flex-col w-full max-w-[800px] px-5 md:px-[40px] py-[40px] md:py-[50px]
                    gap-[40px] rounded-[20px] lg:rounded-[30px] bg-[#FAFAFA]">

                    {/**ai 영역 */}
                    <div className="flex flex-col w-full gap-[16px]">
                        {/* 토스트 알림 (생성 완료 시 노출) */}
                        {isToastVisible && !isAIInputOpen && (
                            <div className="flex w-full p-4 items-center gap-3 
                                border border-[#D6D6D8] rounded-[10px] bg-[#F2F2F2] shadow-sm animate-fadeIn">
                                <CircleCheck
                                    className="text-[#7C7B80] fill-[#7C7160] shrink-0"
                                    size={24} />
                                <span className="font-pretendard text-[#7C7160] text-[14px] sm:text-[16px] font-medium leading-[130%]">
                                    생성이 완료되었습니다! 필요한 부분은 직접 수정해주세요.
                                </span>
                            </div>
                        )}

                        {!isToastVisible && (
                            <>
                                {/* 입력 컨테이너 */}
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
                                        /* 닫혀있을 때 */
                                        <div className="flex items-center justify-between w-full">
                                            <span className="flex-1 font-pretendard text-[#1BA07A] text-[14px] sm:text-[16px] font-medium leading-[130%]">
                                                {getDisplayName(DUMMY_PROFILE.name)}님이 했던 경험을 자유롭게 서술해주세요. 모아요 AI가 정리해드려요!
                                            </span>
                                            <Mic size={20} className="text-[#1BA07A] shrink-0" />
                                        </div>
                                    ) : (
                                        /* 열려있을 때 (텍스트 영역만 포함) */
                                        <div className="flex w-full gap-3 w-full animate-fadeIn">
                                            <textarea
                                                ref={textareaRef}
                                                className="flex-1 max-h-[120px] outline-none resize-none bg-transparent
                                                    font-pretendard text-[15px] sm:text-[16px] font-medium text-[#1BA07A]"
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

                                {/* 버튼 영역  */}
                                {isAIInputOpen && (
                                    <div className="flex justify-end gap-[8px]">
                                        <button
                                            className="bg-[#6EEBC7] px-4 py-2 rounded-[10px] 
                                                font-pretendard font-medium text-[13px] sm:text-[14px] text-[#25221D]
                                                hover:bg-[#5BD9B5] transition-colors shadow-sm hover:brightness-95"
                                            onClick={() => setIsAIInputOpen(false)}
                                        >
                                            닫기
                                        </button>
                                        <button
                                            className="bg-[#6EEBC7] px-4 py-2 rounded-[10px] 
                                                font-pretendard font-medium text-[13px] sm:text-[14px] text-[#25221D]
                                                hover:bg-[#5BD9B5] transition-colors shadow-sm hover:brightness-95"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAISimulate();
                                            }}
                                        >
                                            {isAnalysing ? "분석 중..." : "생성하기"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/**활동 정보 */}
                    <div className="flex flex-col gap-[12px]">
                        {inputFields.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-[8px] h-[48px] sm:h-[52px]">
                                <div className="flex w-[80px] sm:w-[100px] h-full justify-center items-center
                                    rounded-[5px] bg-[#EFEEEB]">
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
                                    className="flex-1 h-full px-[16px] outline-none
                                    border rounded-[10px] border-[#D6D6D8] bg-transparent
                                    font-pretendard text-[14px] sm:text-[16px] font-medium text-[#423C33]
                                    placeholder:text-[#969599]"
                                />
                            </div>
                        ))}
                    </div>

                    {/**활동 소개 */}
                    <div className="flex flex-col gap-[10px]">
                        <span className="self-stretch font-pretendard text-[16px] sm:text-[18px] font-semibold
                            text-[#25221D] leading-[130%] tracking-[-0.01em]">
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

                    {/** 첨부*/}
                    <div className="flex flex-col gap-[10px]">
                        <span className="self-stretch text-[#25221D] font-pretendard text-[16px] sm:text-[18px] font-semibold leading-[130%] tracking-[-0.01em]">
                            파일 첨부
                        </span>

                        <div className="flex flex-col gap-[8px]">
                            {/* 선택된 파일 */}
                            {selectedFiles.map((file, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-center justify-between w-full h-[50px] px-[16px]
                                    bg-[#E9FCF7] rounded-[10px] border border-[#26E1AC]">
                                    <span className="text-[14px] font-medium truncate font-pretendard text-[#25221D] leading-[140%] max-w-[80%]">
                                        {file.name}
                                    </span>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="text-[#7C7160] hover:text-[#1BA07A]"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            ))}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                multiple // 여러 개 선택 가능
                                accept="image/*, .pdf"
                            />

                            <div
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={handleBoxClick}
                                className="flex items-center justify-center h-[60px] sm:h-[80px] gap-[8px]
                                rounded-[20px] boder boder-[#ADA395] bg-[#EFEEEB] cursor-pointer "
                            >
                                <div className="flex items-center justify-center gap-[8px] pointer-events-none">
                                    <FileText size={20} className="text-[#978B78] mb-1" />
                                    <div className="flex flex-col items-center justify-center gap-[4px]">
                                        <span className="text-[13px] sm:text-[14px] font-medium font-pretendard 
                                            leading-[140%] text-center text-[#978B78]">
                                            파일을 첨부해주세요
                                        </span>
                                        <span className="text-[11px] sm:text-[12px] font-normal font-pretendard 
                                            leading-[150%] text-center text-[#978B78]">
                                            (증빙서류, 포트폴리오)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col gap-[10px]">
                        <span className="self-stretch font-pretendard text-[16px] sm:text-[18px] font-semibold
                            leading-[130%] tracking-[-0.01em] text-[#25221D]">
                            링크 첨부
                        </span>
                        {links.length > 0 && (
                            <div className="flex flex-col gap-[8px]">
                                {links.map((link, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between w-full h-[50px] px-[16px]
                                            bg-[#E9FCF7] rounded-[10px]"
                                    >
                                        <a
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[14px] font-pretendard text-[#25221D] font-medium leading-[140%] max-w-[80%] underline
                                            [text-decoration-skip-ink:auto] underline-offset-auto [text-underline-position:from-font]"
                                        >
                                            {link}
                                        </a>
                                        <button
                                            onClick={() => removeLink(index)}
                                            className="cursor-pointer shrink-0 text-[#26E1AC] hover:text-[#1BA07A]"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* 링크 입력창 */}
                        <input
                            type="text"
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addLink(linkInput)}
                            placeholder="링크를 첨부해주세요. (포트폴리오, 깃허브)"
                            className="h-[50px] px-[16px]
                                border border-[#D6D6D8] rounded-[10px] outline-none bg-transparent
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
                        font-pretendard text-[20px] font-medium leading-[140%] text-[#25221D]">
                        등록하기
                    </button>
                </div>
            </div>
        </>
    )
};

export default CareerAddPage;
