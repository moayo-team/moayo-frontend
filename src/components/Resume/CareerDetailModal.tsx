import { useEffect, useState } from "react";
import PublicToggle from "./PublicToggle";
import { useUploadManager } from "../../hooks/useUploadManager";
import { FileText, X } from "lucide-react";
import type { Career } from "../../types/career";
import { formatPeriod, getStartDateFromPeriod } from "../../utils/format";

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
        if (!data) return;
        setFormData({
            title: data.title || "",
            organizer: data.organizer || "",
            period: data.period || "",
            participation: data.participation || "",
            role: data.role || "",
            intro: data.intro || "",
        });
        setIsPublic(data.isPublic ?? true);
        setSelectedFiles(data.fileName?.map((name: string) => ({ name })) || []);
        setLinks(data.link || []);
    }, [data, setSelectedFiles, setLinks]);

    // 커서 튕김 방지 로직이 포함된 핸들러
    const handleInputChange = (name: string, value: string, e?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let finalValue = value;

        if (name === "period" && e) {
            const input = e.target as HTMLInputElement;
            const start = input.selectionStart || 0;
            const previousValue = formData.period;
            finalValue = formatPeriod(value);

            if (previousValue !== finalValue) {
                setFormData(prev => ({ ...prev, [name]: finalValue }));

                // 수정 중이거나 삭제 중일 때 커서 위치 고정
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

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

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
            startDate: getStartDateFromPeriod(formData.period),
            isPublic: isPublic,
            fileName: selectedFiles.map(f => f.name),
            link: links,
        };

        if (onSave) onSave(updatedData);
        setIsEditMode(false);
    };


     // 추가 정보(파일) 드래그 앤 드롭
    const handleAddFileDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleAddFileDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleAddFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files);
        }
    };


    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            >


                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
                {/* 모달 본체 */}
                {/*스크롤 가능 영역*/}
                <div className="relative flex flex-col w-full max-w-[600px] max-h-[90vh]
                    bg-[#FBFAF9] rounded-[20px] sm:rounded-[30px] 
                    shadow-2xl overflow-y-auto pointer-events-auto
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/**콘텐츠 컨테이너 */}
                    <div className="flex flex-col gap-[24px] px-[24px] py-[32px] sm:px-[40px] sm:py-[40px]">

                        <div className="flex justify-between items-center w-full">
                            <span className="text-[#25221D] font-pretendard text-[20px] sm:text-[24px] font-semibold leading-[130%] tracking-[-0.01em]">
                                이력관리
                            </span>
                            <div className="flex items-center gap-[8px]">
                                <span className="text-[#25221D] font-pretendard text-[13px] sm:text-[14px] font-normal leading-[150%]">
                                    이력 공개 여부
                                </span>
                                <div
                                    className={`flex items-center cursor-pointer ${!isEditMode && "pointer-events-none opacity-80"}`}
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
                        <div className="flex flex-col gap-[12px]">
                            {infoFields.slice(0, 5).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-[8px] h-[48px] sm:h-[52px]">
                                    <div className="flex w-[80px] sm:w-[100px] h-full
                                                justify-center items-center
                                                rounded-[5px] bg-[#FBFAF9] whitespace-nowrap
                                                font-pretendard text-[14px] sm:text-[15px] text-[#58575B] font-medium leading-[140%]">
                                        {item.label}
                                    </div>
                                    <input
                                        type="text"
                                        readOnly={!isEditMode}
                                        maxLength={item.name === "period" ? 23 : undefined}
                                        value={formData[item.name as keyof typeof formData]}
                                        placeholder="입력해주세요."
                                        onChange={(e) => handleInputChange(item.name, e.target.value, e)}
                                        className={`flex-1 h-full px-[16px] outline-none
                                                border rounded-[10px] bordr-[#D9D5CE] bg-transparent
                                                font-pretendard text-[14px] sm:text-[16px] font-medium leading-[130%] text-[#423C33]                             
                                                placeholder:text-[#978B78] placeholder:font-medium 
                                                border border-[#D6D6D8] rounded-[10px] 
                                                ${isEditMode ? "" : "cursor-default"}`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/**활동 소개 */}
                        <div className="flex flex-col gap-[10px]">
                            <span className="text-[#25221D] font-pretendard text-[16px] sm:text-[18px] font-medium leading-[130%]">
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
                                        border rounded-[10px] bordr-[#D9D5CE] bg-white 
                                        font-pretendard text-[14px] sm:text-[16px] font-medium leading-[140%] text-[#423C33]                             
                                        placeholder:text-[#978B78] 
                                        ${isEditMode ? "" : "cursor-default"}`}
                            />
                        </div>

                        {/**첨부 */}
                        <div className="flex flex-col gap-[8px]">
                            <span className="text-[#25221D] 16px] sm:text-[18px] font-pretendard font-medium leading-[130%]">
                                파일 첨부
                            </span>
                            <div className="flex flex-col gap-[8px]">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        onClick={() => !isEditMode && handleFileDownload(file)}
                                        className="flex items-center justify-between
                                                    w-full h-[50px] px-[16px]
                                                    rounded-[15px] lg:rounded-[20px] bg-[#E9FCF7] cursor-pointer"
                                    >
                                        <span className="font-pretendard text-[14px] font-medium font-medium leading-[140%] text-[#25221D]">
                                            {file.name}
                                        </span>
                                        {isEditMode && (
                                            <X
                                                size={18}
                                                className="text-[#7C7160] hover:text-[#1BA07A]"
                                                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                            />
                                        )}
                                    </div>
                                ))}
                                {isEditMode && selectedFiles.length < 3 && (
                                    <div
                                        onDragOver={handleAddFileDragOver}
                                        onDragLeave={handleAddFileDragLeave}
                                        onDrop={handleAddFileDrop}
                                        onClick={() =>
                                            fileInputRef.current?.click()}
                                        className="flex items-center justify-center h-[50px] gap-[8px]
                                        rounded-[10px] border border-[#ADA395] bg-[#EFEEEB] cursor-pointer"
                                    >
                                        <div className="flex items-center justify-center gap-[5px]">
                                            <FileText size={25} color="#978B78" />
                                            <div className="flex flex-col items-center">
                                                <span className="self-stretch text-[#978B78] font-pretendard text-[14px] sm:text-[16px] font-medium leading-[140%]">
                                                    파일을 첨부해주세요
                                                </span>
                                                <span className="self-stretch text-[#978B78] font-pretendard text-[11px] sm:text-[12px] font-normal leading-[150%]">
                                                    (증빙서류, 포트폴리오)
                                                </span>
                                            </div>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            hidden
                                            multiple
                                            onChange={(e) =>
                                                handleFileUpload(e.target.files)
                                            }
                                        />
                                    </div>
                                )}
                            </div>


                            <div className="flex flex-col gap-[10px]">
                                <span className="text-[#25221D] self-stretch font-pretendard text-[16px] sm:text-[18px] font-medium leading-[130%]">
                                    링크 첨부
                                </span>
                                <div className="flex flex-col gap-[8px]">
                                    {links.map((link, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center
                                                    h-[50px] px-[16px] 
                                                    rounded-[15px] lg:rounded-[20px] bg-[#E9FCF7]"
                                        >
                                            <a
                                                href={link}
                                                target="_blank"
                                                className="max-w-[90%] text-[14px] font-pretendard text-[#25221D] font-medium leading-[140%] 
                                                outline-noneunderline [text-decoration-skip-ink:auto] underline-offset-auto [text-underline-position:from-font]"
                                            >
                                                {link}
                                            </a>
                                            {isEditMode && (
                                               <X 
                                                size={18} 
                                                className="text-[#7C7160] hover:text-[#1BA07A] cursor-pointer" 
                                                onClick={() => removeLink(index)}
                                            />
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
                                            className="h-[50px] px-[16px] text-[14px] bg-transparent
                                                    font-pretendard text-[#978B78] font-medium leading-[140%] outline-none
                                                    border rounded-[10px] border-[#ADA395] placeholder:text-[#969599]"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/**버튼 */}
                    <div className="flex justify-end gap-[12px] mt-8 mb-10 mr-10">
                        {isEditMode ? (
                            <button
                                onClick={handleSave}
                                className="px-8 py-3
                                        bg-[#6EEBC7] rounded-[10px] 
                                        text-[#25221D] text-[16px] font-pretendard font-medium leading-[140%]">
                                저장하기
                            </button>
                        ) : (
                            <>
                                <button
                                    className="px-6 py-3
                                            rounded-[10px] bg-[#EFEEEB]
                                            text-[#5F5749] font-pretendard text-[16px] font-medium leading-[140%]"
                                    onClick={() => onDelete?.(data.id)}>
                                    삭제하기
                                </button>
                                <button
                                    className="px-6 py-3
                                            rounded-[10px] bg-[#EFEEEB]
                                            text-[#5F5749] font-pretendard text-[16px] font-medium leading-[140%]"
                                    onClick={() => setIsEditMode(true)}>
                                    수정하기
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </div >
        </>
    )
}

export default CarrerDetailModal