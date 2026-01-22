import { useEffect, useState } from "react";
import PublicToggle from "./PublicToggle";
import { useUploadManager } from "../../hooks/useUploadManager";
import { FileText, X } from "lucide-react";
import type { Career } from "../../types/career";
import { formatPeriod } from "../../utils/format";

interface CarrerDetailModalProps {
    onClose: () => void;
    data: any; // 카드로부터 전달받은 상세 데이터
    onDelete?: (id: string | number) => void; //삭제 콜백
    onSave?: (updatedData: any) => void; // 저장 콜백

}
const CarrerDetailModal = ({ data, onClose, onDelete, onSave }: CarrerDetailModalProps) => {
    const [isPublic, setIsPublic] = useState(data?.isPublic ?? true);
    const [isEditMode, setIsEditMode] = useState(false);

    {/**기본 정보 폼 상태 */ }
    const [formData, setFormData] = useState({
        title: data?.title ?? "",
        organizer: data?.organizer ?? "",
        period: data?.period ?? "",
        participation: data?.participation ?? "",
        role: data?.role ?? "",
        intro: data?.intro ?? "",
    });

    const {
        selectedFiles, setSelectedFiles, handleFileUpload, removeFile,
        links, setLinks, linkInput, setLinkInput, addLink, removeLink,
        fileInputRef, handleFileDownload
    } = useUploadManager({
        maxFiles: 3,
    });

    {/**외부에서 받은 데이터 로컬 state에 동기화 */ }
    useEffect(() => {
        if (data) {
            setFormData({
                title: data.title || "",
                organizer: data.organizer || "",
                period: data.period || "",
                participation: data.participation || "",
                role: data.role || "",
                intro: data.intro || "",
            });

            setIsPublic(data.isPublic ?? true);
            // fileName (string[]) -> useUploadManager 포맷 ({name: string}[])으로 변환
            if (data.fileName && Array.isArray(data.fileName)) {
                setSelectedFiles(data.fileName.map((name: string) => ({ name })));
            } else {
                setSelectedFiles([]);
            }

            // link (string[]) -> useUploadManager 포맷으로 변환
            if (data.link && Array.isArray(data.link)) {
                setLinks(data.link);
            } else {
                setLinks([]);
            }
        }
    }, [data, setSelectedFiles, setLinks]);

    //formData의 타입을 추출
    type FormDataKeys = keyof typeof formData;
    // 라벨과 데이터 필드 매칭
    const infoFields: { label: string; name: FormDataKeys }[] = [
        { label: "활동명", name: "title" },
        { label: "주최/기관", name: "organizer" },
        { label: "기간", name: "period" },
        { label: "참여형태", name: "participation" },
        { label: "역할", name: "role" },
        { label: "활동소개", name: "intro" },
    ];


    /** 저장 버튼 클릭 시 */
    const handleSave = () => {
        const updatedData: Career = {
            ...data,
            ...formData,
            isPublic: isPublic,
            fileName: selectedFiles.map(f => f.name),
            link: links,
        };

        if (onSave) onSave(updatedData);
        setIsEditMode(false);
    };


    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 z-40 cursor-pointer"
                onClick={onClose} />


            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                {/* 모달 본체 */}
                {/*스크롤 가능 영역*/}
                <div className="flex flex-col w-full max-w-[720px] max-h-[90vh] 
                    bg-[#FAFAFA] rounded-[20px] lg:rounded-[30px] 
                    shadow-xl overflow-y-auto pointer-events-auto
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/**콘텐츠 컨테이너 */}
                    <div className="flex flex-col gap-8 lg:gap-[41px] px-6 py-8 lg:px-[70px] lg:py-[50px]">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center w-full">
                                <span className="font-pretendard text-2xl lg:text-[32px] font-semibold leading-[130%] tracking-[-0.01em]">
                                    이력관리
                                </span>
                                <div className="flex items-center gap-[9px]">
                                    <span className="font-pretendard text-sm lg:text-[18px] font-normal leading-[150%]">
                                        이력 공개 여부
                                    </span>
                                    <div
                                        className={`flex items-center cursor-pointer ${!isEditMode && "pointer-events-none"}`}
                                        onClick={() => {
                                            if (isEditMode) {
                                                setIsPublic(!isPublic);
                                            }
                                        }} // 클릭 시 상태 반전
                                    >
                                        <PublicToggle
                                            isPublic={isPublic}
                                            onChange={(val) => {
                                                if (isEditMode) setIsPublic(val);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            
                                {/**정보 */}
                                <div className="flex flex-col gap-4 lg:gap-[20px]">
                                    {infoFields.slice(0, 5).map((item, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-[18px]">
                                            <div className="flex md:w-[122px] h-10 md:h-[80px] px-4
                                                md:justify-center items-center
                                                rounded-[5px] bg-[#FAFAFA] whitespace-nowrap
                                                font-pretendard text-base md:text-[20px] text-[#58575B] font-medium leading-[140%]">
                                                {item.label}
                                            </div>
                                            <input
                                                type="text"
                                                readOnly={!isEditMode}
                                                maxLength={item.name === "period" ? 23 : undefined}
                                                value={formData[item.name as keyof typeof formData]}
                                                placeholder="입력해주세요."
                                                onChange={(e) => {
                                                    let val = e.target.value;
                                                    if (item.name === "period") {
                                                        val = formatPeriod(val);
                                                    }
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        [item.name]: val,
                                                    }));
                                                }}
                                                className={`flex-1 h-12 md:h-[80px] px-4 md:px-[20px]
                                                border rounded-[10px] bordr-[#D6D6D8] bg-transparent
                                                font-pretendard text-base md:text-[24px] font-medium leading-[130%] text-[#58575B]                             
                                                placeholder:text-[#969599] placeholder:font-medium 
                                                border border-[#D6D6D8] rounded-[10px] outline-none
                                                ${isEditMode ? "" : "cursor-default"}`}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/**활동 소개 */}
                                <div className="flex flex-col gap-3 lg:gap-[14px]">
                                    <span className="font-pretendard text-lg lg:text-[24px] font-medium leading-[130%]">
                                        활동 소개
                                    </span>
                                    <textarea
                                        readOnly={!isEditMode}
                                        value={formData.intro}
                                        placeholder="입력해주세요."
                                        maxLength={650}
                                        onChange={(e) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                intro: e.target.value,
                                            }))
                                        }
                                        className={`w-full h-32 lg:h-[143px] p-4 lg:p-[30px]
                                        border rounded-[10px] bordr-[#D6D6D8] bg-white outline-none resize-none
                                        font-pretendard text-base lg:text-[20px] font-medium leading-[140%] text-[#58575B]                             
                                        placeholder:text-[#969599] 
                                        ${isEditMode ? "" : "cursor-default"}`}
                                    />
                                </div>

                                {/**첨부 */}
                                <div className="flex flex-col gap-8">
                                    <div className="flex flex-col gap-3 lg:gap-[14px]">
                                        <span className="slef-stretch 
                                            text-lg lg:text-[24px] font-pretendard font-medium leading-[130%]">
                                            파일 첨부
                                        </span>
                                        <div className="flex flex-col gap-3">
                                            {selectedFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => !isEditMode && handleFileDownload(file)}
                                                    className="flex items-center justify-between
                                                    px-5 py-4 lg:px-[40px] lg:py-[30px] 
                                                    rounded-[15px] lg:rounded-[20px] bg-[#E9FCF7] cursor-pointer
                                                    font-pretendard text-[20px] font-medium leading-[140%] text-[#343436]"
                                                >
                                                    <span>{file.name}</span>
                                                    {isEditMode && (
                                                        <button
                                                            onClick={() => removeFile(index)}>
                                                            <X 
                                                                size={24}
                                                                className="text-[#7C7B80] cursor-pointer"/>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {isEditMode && selectedFiles.length < 3 && (
                                                <>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        hidden
                                                        multiple
                                                        onChange={(e) =>
                                                            handleFileUpload(e.target.files)
                                                        }
                                                    />
                                                    <div
                                                        onClick={() =>
                                                            fileInputRef.current?.click()}
                                                        className="flex flex-col items-center justify-center py-6
                                                        rounded-[15px] lg:rounded-[20px] border border-[#A7A7AA] bg-[#F2F2F2] cursor-pointer"
                                                    >
                                                        <div className="flex items-center justify-center gap-[10px]">
                                                            <FileText size={40} color="#969599" />
                                                            <div className="flex flex-col items-center">
                                                                <span className="self-stretch text-[#969599] font-pretendard text-sm lg:text-[20px] font-medium leading-[140%]">
                                                                    파일을 첨부해주세요
                                                                </span>
                                                                <span className="self-stretch text-[#969599] font-pretendard text-xs lg:text-[14px] font-normal leading-[150%]">
                                                                    (증빙서류, 포트폴리오)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>


                                    <div className="flex flex-col gap-3 lg:gap-[14px]">
                                        <span className="self-stretch font-pretendard text-lg lg:text-[24px] font-medium leading-[130%]">
                                            링크 첨부
                                        </span>
                                        <div className="flex flex-col gap-3">
                                            {links.map((link, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-center
                                                    px-5 py-4 lg:px-[40px] lg:py-[30px] 
                                                    rounded-[15px] lg:rounded-[20px] bg-[#E9FCF7]"
                                                >
                                                    <a
                                                        href={link}
                                                        target="_blank"
                                                        className="text-sm lg:text-[20px] font-pretendard text-[#343436] font-medium leading-[140%] outline-none
                                                    underline [text-decoration-skip-ink:auto] underline-offset-auto [text-underline-position:from-font]
                                                    "
                                                    >
                                                        {link}
                                                    </a>
                                                    {isEditMode && (
                                                        <button
                                                            onClick={() => removeLink(index)}>
                                                            <X 
                                                                size={24}
                                                                className="text-[#7C7B80] cursor-pointer"/>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}

                                            {isEditMode && (
                                                <input
                                                    value={linkInput}
                                                    onChange={(e) =>
                                                    setLinkInput(e.target.value)
                                                    }
                                                    onKeyDown={(e) => e.key === "Enter" && addLink(linkInput)}
                                                    placeholder="링크를 첨부해주세요. (포트폴리오, 깃허브)"
                                                    className="w-full h-12 lg:h-[60px] px-4 text-base lg:text-[20px] 
                                                    font-pretendard text-[#343436] font-medium leading-[140%] outline-none
                                                    border rounded-[10px] border-[#D6D6D8] placeholder:text-[#969599]"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/**버튼 */}
                            <div className="flex justify-center md:justify-end gap-3 lg:gap-[17px] mt-4 pt-4">
                                {isEditMode ? (
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 md:flex-none px-8 py-3
                                        bg-[#6EEBC7] rounded-[10px] 
                                        text-base lg:text-[20px] font-pretendard font-medium leading-[140%] text-[@343436]">
                                        저장하기
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-[17px]">
                                        <button
                                            className="flex-1 md:flex-none px-8 py-3
                                            rounded-[10px] bg-[#D6D6D8]
                                            font-pretendard text-base lg:text-[20px] font-medium leading-[140%]"
                                            onClick={() => onDelete?.(data.id)}>
                                            삭제하기
                                        </button>
                                        <button
                                            className="flex-1 md:flex-none px-8 py-3
                                            rounded-[10px] bg-[#D6D6D8]
                                            font-pretendard text-base lg:text-[20px] font-medium leading-[140%]"
                                            onClick={() => setIsEditMode(true)}>
                                            수정하기
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    
                </div>
            </div >
        </>
    )
}

export default CarrerDetailModal