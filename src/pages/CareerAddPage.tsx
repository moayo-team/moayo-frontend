import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleCheck, FileText, Mic, X } from "lucide-react";
import { getDisplayName } from "../utils/name";
import { DUMMY_PROFILE } from "../data/profileData";
import { useUploadManager } from "../hooks/useUploadManager";
import { formatPeriod, validatePeriod } from "../utils/format";

const CareerAddPage = () => {
    const navigate = useNavigate();

   // 커스텀 훅 도입 (파일 3개, 링크 4개 등 제한사항 주입)
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
        intro: "" //활동 소개
    });

    //map을 위한 필드 설정
    const inputFields = [
        { label: "활동명", field: "title" },
        { label: "주최/기관", field: "organizer" },
        { label: "기간", field: "period" },
        { label: "참여형태", field: "participation" },
        { label: "역할", field: "role" },
    ];

    const handleInputChange = (field: string, value: string) => {
        let finalValue = value;
        
        // 기간 필드인 경우 숫자만 쳐도 자동으로 포맷을 잡아줌
        if (field === "period") {
            finalValue = formatPeriod(value);
        }

        setNewCareer(prev => ({ ...prev, [field]: finalValue }));
    };
    

    const handleSave = () => {
        // 기간 형식이 올바른지 체크 (YYYY.MM.DD - YYYY.MM.DD)
        if (newCareer.period && !validatePeriod(newCareer.period)) {
            return;
        }
        
        // 모든 정보를 하나의 객체로 합침
        const finalData = {
            ...newCareer,
            fileName: selectedFiles.length > 0 ? selectedFiles[0].name : "",
            fileList: selectedFiles.map(f => f.name),
            link: links.length > 0 ? links[0] : "",
            allLinks: links
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

    

    return (
        <>
        <div className="flex flex-col items-center w-full min-h-screen bg-white pb-20">
            <div className="flex px-5 py-4 lg:py-[10px] justify-center items-center w-full">
                <p className="font-pretendard md:text-[40px] lg:text-[48px] font-bold leading-[120%] tracking-[-0.01em] text-[#444446]">
                    이력 추가
                </p>
            </div>

            {/**추가 배경 영역 */}
            <div className="flex w-full max-w-[1340px] px-5 md:px-10 lg:px-[70px] py-10 lg:py-[50px] justify-center items-center mt-6 lg:mt-[60px] 
                rounded-[20px] lg:rounded-[30px] bg-[#FAFAFA]">

                {/**추가 영역 */}
                <div className="flex flex-col items-start flex-1 gap-10 lg:gap-[60px] w-full">

                    {/**ai 영역 */}
                    <div className="flex flex-col w-full overflow-hidden items-end gap-6 lg:gap-[33px]">

                        {/* 토스트 알림 (생성 완료 시 노출) */}
                        {isToastVisible && !isAIInputOpen && (
                            <div className="flex w-full h-auto min-h-[80px] lg:h-[105px] py-4 lg:py-[20px] px-6 lg:px-[30px] items-center gap-3 
                                border border-[#D6D6D8] rounded-[10px] bg-[#F2F2F2] shadow-sm animate-fadeIn">
                                <div className="flex fustify-center items-center gap-[10px]">
                                    <CircleCheck
                                        className="text-[#7C7B80] fill-[#E9FCF7] shrink-0"
                                        strokeWidth={2.5}
                                        size={40} />
                                    <span className="font-pretendard text-[#58575B] text-lg lg:text-[24px] font-medium leading-[130%]">
                                        생성이 완료되었습니다! 필요한 부분은 직접 수정해주세요.
                                    </span>
                                </div>
                            </div>
                        )}
                        {!isToastVisible && (
                            <div className="flex flex-col items-start w-full overflow-hidden ">
                                {/** 상단 가이드 바 (클릭 영역) */}
                                <div
                                    className="flex h-auto min-h-[80px] lg:h-[105px] p-4 lg:p-[20px] items-center w-full gap-3 
                                    border border-[#BCF6E5] rounded-[10px] bg-[#E9FCF7] cursor-pointer"
                                    onClick={() => setIsAIInputOpen(!isAIInputOpen)}
                                >
                                    <span className="flex-1 font-pretendard text-[#1BA07A] text-lg lg:text-[24px] font-medium leading-[130%]">
                                        {getDisplayName(DUMMY_PROFILE.name)}님이 했던 경험을 자유롭게 서술해주세요. 모아요 AI가 정리해드려요!
                                    </span>
                                    <div className="text-[#1BA07A] shrink-0">
                                        <Mic size="36" />
                                    </div>
                                </div>

                                {/** 펼쳐지는 입력 영역 */}
                                {isAIInputOpen && (
                                    <div className="flex flex-col h-[200px] lg:h-[244px] p-4 lg:p-[30px] w-full rounded-[10px] border border-[#D6D6D8] bg-white">
                                        <textarea
                                            className="w-full h-full outline-none resize-none bg-transparent 
                                            font-pretendard text-lg lg:text-[24px] font-medium text-[#58575B] placeholder:text-[#969599]"
                                            placeholder="UMC 0기에서 디자이너로 활동하였고, UI 제작을 담당하였습니다."
                                            autoFocus
                                            maxLength={500}
                                            value={aiText}
                                            onChange={(e) => setAiText(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        {isAIInputOpen && (<div className="flex justify-end">
                            <button
                                className="bg-[#6EEBC7] px-6 py-3 lg:p-[15px] rounded-[10px] 
                                font-pretendard font-medium text-lg lg:text-[20px] text-[#343436]"
                                onClick={handleAISimulate}>
                                생성하기
                            </button>
                        </div>
                        )}
                    </div>

                    {/**활동 정보 */}
                    <div className="flex flex-col items-start gap-4 lg:gap-[24px] w-full">
                        {inputFields.map((item, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row items-stretch md:items-center w-full gap-2 md:gap-[18px]">
                                <div className="flex md:w-[122px] h-[60px] md:h-[100px] px-4 justify-start md:justify-center items-center 
                                    rounded-[5px] bg-[#F2F2F2] 
                                    font-pretendard text-lg md:text-[24px] text-[#58575B] font-semibold whitespace-nowrap">
                                    {item.label}
                                </div>
                                <input
                                    type="text"
                                    maxLength={item.field === "period" ? 23 : undefined}
                                    value={(newCareer as any)[item.field]}
                                    onChange={(e) => handleInputChange(item.field, e.target.value)}
                                    placeholder="입력해주세요."
                                    className="flex-1 h-[60px] md:h-[100px] p-4 md:p-[20px] 
                                    border rounded-[10px] border-[#D6D6D8] 
                                    font-pretendard text-lg md:text-[24px] font-medium text-[#58575B] outline-none
                                    placeholder:text-[#969599] outline-none "
                                />
                            </div>
                        ))}
                    </div>

                    {/**활동 소개 */}
                    <div className="flex flex-col items-start gap-3 lg:gap-[14px] w-full">
                        <span className="self-stretch font-pretendard text-xl lg:text-[32px] font-semibold
                            leading-[130%] tracking-[-0.01em]">
                            활동 소개
                        </span>

                        <textarea
                            placeholder="자유롭게 입력해주세요."
                            value={newCareer.intro}
                            onChange={(e) => handleInputChange("intro", e.target.value)}
                            className="w-full h-[200px] lg:h-[281px] p-4 lg:p-[30px] 
                            rounded-[10px] bg-white border border-[#D6D6D8]
                            outline-none resize-none placeholder:text-[#969599]
                            text-base lg:text-[20px] font-pretendard font-medium leading-[140%] text-[#58575B]"
                        />
                    </div>

                    {/** 첨부*/}
                    <div className="flex flex-col items-start gap-10 w-full">
                        <div className="flex flex-col gap-4 w-full">
                            <span className="self-stretch font-pretendard text-xl lg:text-[32px] font-semibold
                            leading-[130%] tracking-[-0.01em]">
                                파일 첨부
                            </span>

                            {/* 선택된 파일 */}
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-[#E9FCF7] rounded-[15px] lg:rounded-[20px]">
                                    <div className="flex justify-between items-center flex-1 self-stretch">
                                        <span className="text-base lg:text-[20px] font-medium truncate pr-4 font-pretendard text-[#343436] leading-[140%]">
                                            {file.name}
                                        </span>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="shrink-0 cursor-pointer"
                                        >
                                            <X size={24}/>
                                        </button>
                                    </div>

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
                                className="flex flex-col items-center justify-center w-full h-[100px] lg:h-[150px]
                                rounded-[20px] boder boder-[#A7A7AA] bg-[#F2F2F2] cursor-pointer "
                            >
                                <div className="flex items-center justify-center gap-[10px] pointer-events-none">
                                    <FileText size={40} className="text-[#969599] mb-1"/>
                                    <div className="flex flex-col items-center justify-center gap-[4px] 
                                    px-[10px] py-[5px]">
                                        <span className={`self-stretch text-sm lg:text-lg font-medium font-pretendard 
                                            leading-[140%] text-center text-[#969599]`}>
                                            파일을 첨부해주세요
                                        </span>
                                        <span className="self-stretch text-xs lg:text-sm font-normal font-pretendard 
                                            leading-[150%] text-center text-[#969599]">
                                            (증빙서류, 포트폴리오)
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="flex flex-col gap-4 w-full">
                            <span className="self-stretch font-pretendard text-xl lg:text-[32px] font-semibold
                            leading-[130%] tracking-[-0.01em]">
                                링크 첨부
                            </span>
                            {links.length > 0 && (
                                <div className="flex flex-col gap-[10px] w-full">
                                    {links.map((link, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center justify-between p-4 
                                            bg-[#E9FCF7] rounded-[15px] lg:rounded-[20px]"
                                        >
                                            <a
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 text-[20px] font-pretendard text-[#343436] font-medium leading-[140%] 
                                                underline [text-decoration-skip-ink:auto] underline-offset-auto [text-underline-position:from-font]"
                                            >
                                                {link}
                                            </a>
                                            <button
                                            onClick={() => removeLink(index)}
                                            className="cursor-pointer shrink-0"
                                            >
                                            <X size={24}/>
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
                                className="w-full h-14 lg:h-[71px] p-4
                                border border-[#D6D6D8] rounded-[10px] outline-none bg-transparent
                                font-pretendard text-base lg:text-[24px] font-medium leading-[130%] text-[#58575B] placeholder:text-[#969599]"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center w-full mt-10">
                <button
                    onClick={handleSave}
                    className="w-[200px] lg:w-[227px] h-14 lg:h-[71px] 
                    bg-[#26E1AC] rounded-[10px] text-lg lg:text-[20px]
                    font-pretendard text-[20px] font-medium leading-[140%]">
                    등록하기
                </button>
            </div>
        </div>
        </>
    )
};

export default CareerAddPage;
