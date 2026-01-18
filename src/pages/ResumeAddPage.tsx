import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import fileIcon from "../assets/File text.svg"
import delIcon from "../assets/X.svg"

const ResumeAddPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [links, setLinks] = useState<string[]>([]); // 링크 리스트 상태
    const [linkInput, setLinkInput] = useState(""); // 현재 인풋창 값

    const [newCareer, setNewCareer] = useState({
        title: "",
        organizer: "",
        company: "",
        period: "",
        startDate: "",
        role: "",
        participation: "",
        fileName: "",
        link: "",
        intro: ""
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
        setNewCareer(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
       // 모든 정보를 하나의 객체로 합침
        const finalData = {
            ...newCareer, 
            fileName: selectedFiles.length > 0 ? selectedFiles[0].name : "",
            fileList: selectedFiles.map(f => f.name), 
            link: links.length > 0 ? links[0] : "", 
            allLinks: links 
        };

        console.log("최종 전달 데이터:", finalData);

        navigate("/profile/history", {
            state: { newResume: finalData }
        });
    };

    // 파일 처리 공통 로직
    const handleFileProcess = (files: FileList) => {
        const newFiles = Array.from(files);
        setSelectedFiles((prev) => [...prev, ...newFiles]);

        if (newFiles.length > 0) {
            handleInputChange("fileName", newFiles[0].name);
        }
    };

    //  클릭 시 파일 선택창 띄우기
    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    // 파일 선택창에서 선택했을 때
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFileProcess(e.target.files);
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
            handleFileProcess(e.dataTransfer.files);
        }
    };

    // 선택된 파일 삭제
    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const addLink = () => {
        if (!linkInput.trim()) return;
        
        // http:// 또는 https:// 가 없는 경우 자동으로 붙여줌
        const formattedLink = linkInput.startsWith("http") 
            ? linkInput 
            : `https://${linkInput}`;

        setLinks((prev) => [...prev, formattedLink]);
        setLinkInput(""); // 인풋창 초기화
    };
    //링크 삭제
    const removeLink = (index: number) => {
        setLinks((prev) => prev.filter((_, i) => i !== index));
    };
    return (
        <>
            <div className="inline-flex px-[20px] py-[10px] gap-[10px] justify-center items-center w-full">
                <p className="font-pretendard text-[48px] font-bold leading-[120%] tracking-[-0.01em] text-[#444446]">
                    이력 추가
                </p>
            </div>

            <div className="flex w-[1340px] px-[70px] py-[50px] justify-center items-center gap-[10px]
            rounded-[30px] bg-[#FAFAFA]">
                <div className="flex flex-col items-start flex-1 gap-[60px] self-stretch">

                    {/**활동 정보 */}
                    <div className="flex flex-col items-start gap-[24px] self-stretch">
                        {inputFields.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-[18px]">
                                <div className="flex w-[122px] h-[100px] px-[15px] py-[10px] 
                            justify-center items-center gap-[10px]
                            rounded-[5px] bg-[#F2F2F2] whitespace-nowrap
                            font-pretendard text-[24px] text-[#58575B] font-semidold leading-[130%]">
                                    {item.label}
                                </div>
                                <input
                                    type="text"
                                    value={(newCareer as any)[item.field]}
                                    onChange={(e) => handleInputChange(item.field, e.target.value)}
                                    placeholder="입력해주세요."
                                    className="flex flex-col justify-center items-start
                            w-[1051px] h-[100px] p-[20px]
                            border rounded-[10px] border-[#D6D6D8] 
                            font-pretendard text-[24px] font-medium leading-[130%] text-[#58575B] 
                            placeholder:text-[#969599] placeholder:font-medium placeholder:text-[24px]
                            placeholder:leading-[130%] outline-none "
                                />
                            </div>
                        ))}
                    </div>

                    {/**활동 소개 */}
                    <div className="felx flex-col items-start gap-[14px] self-stretch">
                        <span className="self-stretch font-pretendard text-[32px] font-semibold
                        leading-[130%] tracking-[-0.01em]">
                            활동 소개
                        </span>

                        <textarea
                            placeholder="자유롭게 입력해주세요."
                            value={newCareer.intro}
                            onChange={(e) => handleInputChange("intro", e.target.value)}
                            className="
                        flex flex-col w-full h-[281px] items-start self-stretch gap-[30px] p-[30px]
                        rounded-[10px] bg-white border border-[#D6D6D8]
                        outline-none resize-none
                        text-[20px] font-pretendard font-medium leading-[140%] text-[#58575B]
                    "
                        />
                    </div>

                    {/** 첨부*/}
                    <div className="flex flex-col items-start gap-[50px] self-stretch">
                        <div className="flex flex-col items-start gap-[20px] self-stretch">
                            <span className="text-[24px] font-pretendard font-semibold leading-[130%]">
                                파일 첨부
                            </span>

                            <div className="flex flex-col gap-[10px] w-full">
                            {/* 선택된 파일 */}
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="flex flex-col items-start justify-center h-[91px] px-[40px] py-[30px] self-stretch gap-[10px]
                                                bg-[#E9FCF7] rounded-[20px]">
                                    <div className="flex justify-between items-center flex-1 self-stretch">
                                        <span className="flex-1 text-[20px] font-pretendard text-[#343436] font-medium leading-[140%]">
                                            {file.name}
                                        </span>
                                        <img
                                            src={delIcon}
                                            className="w-[24px] h-[24px] cursor-pointer"
                                            alt="delete"
                                            onClick={() => removeFile(index)}
                                        />
                                    </div>
                                    
                                </div>
                            ))}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                multiple // 여러 개 선택 가능
                            />

                            <div
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={handleBoxClick}
                                className="flex flex-col items-center justify-center self-stretch
                                h-[102px] px-[159px] py-[24px]
                                rounded-[30px] bg-white cursor-pointer "
                            >
                                <div className="flex items-center justify-center gap-[10px] pointer-events-none">
                                        <img
                                            src={fileIcon}
                                            className="w-[40px] h-[40px]"
                                        />
                                    <div className="flex flex-col items-center justify-center gap-[4px] 
                                    px-[10px] py-[5px]">
                                        <span className={`self-stretch text-[20px] font-medium font-pretendard 
                                            leading-[140%] text-center text-[#969599]`}>
                                            파일을 첨부해주세요
                                        </span>
                                        <span className="self-stretch text-[14px] font-normal font-pretendard 
                                            leading-[150%] text-center text-[#969599]">
                                            (증빙서류, 포트폴리오, Github)
                                        </span>
                                    </div>
                                </div>
                            </div>
                         </div>
                         </div>

                        <div className="flex flex-col gap-[20px] items-start self-stretch">
                            <span className="text-[24px] font-pretendard font-semibold leading-[130%]">
                                링크 첨부
                            </span>
                            {links.length > 0 && (
                            <div className="flex flex-col gap-[10px] w-full">
                                {links.map((link, index) => (
                                    <div key={index} className="flex items-center justify-between w-full h-[80px] px-[30px] bg-[#E9FCF7] rounded-[10px] border border-[#26E1AC]">
                                        <a 
                                            href={link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[20px] font-pretendard text-[#26E1AC] font-medium underline break-all"
                                        >
                                            {link}
                                        </a>
                                        <img
                                            src={delIcon}
                                            className="w-[24px] h-[24px]"
                                            onClick={() => removeLink(index)}
                                        />
                                    </div>
                                ))}
                            </div>
                            )}
                            {/* 링크 입력창 */}
                            <input
                                type="text"
                                value={linkInput}
                                onChange={(e) => setLinkInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addLink()} 
                                placeholder="링크를 첨부해주세요. (포트폴리오, 깃허브)"
                                className="flex flex-col h-[71px] justify-center items-start gap-[10px] self-stretch p-[20px]
                                border-[#D6D6D8] rounded-[10px] outline-none bg-transparent
                                font-pretendard text-[24px] font-semibold leading-[130%] text-[#969599]"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center ">
                <button 
                    onClick={handleSave}
                    className="flex w-[227px] h-[71px] px-[15px] py-[10px] gap-[10px] justify-center items-center
                    rounded-[10px] bg-[#26E1AC]
                    font-pretendard text-[20px] font-medium leading-[140%]">
                    등록하기
                </button>
            </div>
        </>
    )
};

export default ResumeAddPage;
