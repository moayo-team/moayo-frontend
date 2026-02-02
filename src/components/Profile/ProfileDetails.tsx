import { useEffect, useState } from "react";
import defaultImage from "../../assets/profile_photo.svg"
import { FileText, ImageIcon, Paperclip, Pencil, Plus, X } from "lucide-react";
import { formatBirthDate } from "../../utils/format";
import { useUploadManager } from "../../hooks/useUploadManager";
import SchoolVerifyModal from "./SchoolVerifyModal";
import TagSelectModal from "./TagSelectModal";
import { getDisplayName } from "../../utils/name";
import MascotIcon from "../../assets/white.svg"
import type { ProfileFormData, ProfileTagItem } from "../../types/profileForm";

interface ProfileDetailsProps {
    isEditing: boolean;
    isDetailsEmpty: boolean;
    data: ProfileFormData;

    onDataChange: (
        id:
            | keyof ProfileFormData
            | "school"
            | "major"
            | "email"
            | "phone"
            | "school_verified",
        value: any
    ) => void;
}

const ProfileDetails = ({ isEditing, isDetailsEmpty, data, onDataChange }: ProfileDetailsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);

    // 학력 인증 상태 확인
    const schoolData = data.details.find((d: any) => d.id === "school");
    const isVerified = schoolData?.isVerified || false;

    //추가 정보 생성을 위한 상태
    const showPlusButton = isEditing && !isDetailsEmpty && (data.additionalDetails?.length || 0) < 4;
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [activeType, setActiveType] = useState<'file' | 'link' | 'text' | null>(null);

    //타입별 상세 입력을 위한 임시 상태
    const [tempLabel, setTempLabel] = useState("");
    const [tempValue, setTempValue] = useState("");

    // 프로필 사진 업도르 전용 훅 
    const profileUpload = useUploadManager({
        maxFiles: 1,
        allowedTypes: ["image/jpeg", "image/png", "image/gif"]
    });
    //추가 정보 업로드 전용 훅
    const uploadManager = useUploadManager({
        maxFiles: 1,
        maxLeftText: 10,
        maxRightText: 20
    });

    const ADD_OPTIONS = [
        { type: 'file', label: '파일' },
        { type: 'link', label: '링크' },
        { type: 'text', label: '텍스트' },
    ] as const;

    // 프로필 사진 드래그 앤 드롭
    const handleProfileDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleProfileDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleProfileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isEditing && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            profileUpload.handleFileUpload(e.dataTransfer.files);
        }
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
            uploadManager.handleFileUpload(e.dataTransfer.files);
        }
    };

    // 타입 버튼 클릭 시 초기화
    const handleTypeSelect = (type: 'file' | 'link' | 'text') => {
        setActiveType(type);
        setTempLabel(type === 'text' ? "텍스트" : "");
        setTempValue("");
        uploadManager.setSelectedFiles([]);
    };

    const handleRemoveSelectedFile = () => {
        uploadManager.setSelectedFiles([]);
        setTempValue(""); // 입력창에 표시되던 파일명도 삭제

    };

    // 파일 교체 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            uploadManager.setSelectedFiles(newFiles);
        }
        e.target.value = "";
    };

    const handleConfirmAdd = () => {
        const isFile = activeType === "file";
        const hasValue = isFile ? uploadManager.selectedFiles.length > 0 : tempValue.trim() !== "";

        if (!activeType || !hasValue || !tempLabel.trim()) return;

        let attachedFile = null;
        if (activeType === 'file' && uploadManager.selectedFiles.length > 0) {
            attachedFile = uploadManager.selectedFiles[0];
        }

        const newField = {
            id: `custom_${Date.now()}`,
            type: activeType,
            label: tempLabel,
            value: isFile ? attachedFile?.name : tempValue,
            fileObj: attachedFile,
            url: activeType === 'link' ? tempValue : null
        };

        onDataChange("additionalDetails", [...(data.additionalDetails || []), newField]);

        // 모든 상태 초기화 및 창 닫기
        setActiveType(null);
        setTempLabel("");
        setTempValue("");
        setShowAddOptions(false);
        uploadManager.setSelectedFiles([]);
    };

    //다운로드/이동 핸들러
    const handleIconClick = (item: any) => {
        if (item.type === 'file' && item.fileObj) {
            uploadManager.handleFileDownload(item.fileObj);
        } else if (item.type === 'link' && item.value) {
            const targetUrl = item.value.startsWith('http') ? item.value : `https://${item.value}`;
            window.open(targetUrl, '_blank');
        }
    };

    // 파일이 선택되었을 때 미리보기를 부모 상태에 반영
    useEffect(() => {
        if (uploadManager.selectedFiles.length > 0) {
            setTempValue(uploadManager.selectedFiles[uploadManager.selectedFiles.length - 1].name);
        }
    }, [uploadManager.selectedFiles]);



    //기존 리스트 수정/삭제 로직
    const updateCustomField = (id: number | string, key: "label" | "value", val: string) => {
        const updated = data.additionalDetails.map((item) =>
            item.id === id ? { ...item, [key]: val } : item
        );
        onDataChange("additionalDetails", updated);
    };


    const getValue = (id: "school" | "major" | "email" | "phone") => {
        return data.details.find((item) => item.id === id)?.value || "";
    };

    //태그 삭제 핸들러
    const handleDeleteTag = (tagId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newTags = data.tags.filter((t: any) => t.id !== tagId);
        onDataChange("tags", newTags);
    };


    const fieldConfig: {
        label: string;
        id: "school" | "major" | "email" | "phone";
        value: string;
        max?: number;
    }[]= [
            { label: "학력", id: "school", value: getValue("school") },
            { label: "학과", id: "major", value: getValue("major") },
            { label: "이메일", id: "email", value: getValue("email"), max: 30 },
            { label: "전화번호", id: "phone", value: getValue("phone"), max: 11 },
        ];

    //프로필 사진 미리보기 및 부모 상태 반영 
    useEffect(() => {
        // 선택된 파일이 있을 때만 실행
        if (profileUpload.selectedFiles.length > 0) {
            const file = profileUpload.selectedFiles[0];
                const previewUrl = URL.createObjectURL(file);

                // 현재 이미지와 새로 선택한 이미지가 다를 때만 부모 상태 업데이트
                if (data.profileImage !== previewUrl) {
                    onDataChange("profileImage", previewUrl);
                }

                // 클린업: 사용 중인(부모에 저장된) previewUrl을 실수로 revoke해서
                // 다른 컴포넌트에서 같은 URL을 사용할 때 ERR_FILE_NOT_FOUND가 발생하지 않게
                // 부모의 profileImage와 다를 경우에만 revoke 합니다.
                return () => {
                    try {
                        if (data.profileImage !== previewUrl) {
                            URL.revokeObjectURL(previewUrl);
                        }
                    } catch (e) {
                        // 안전하게 무시
                        console.debug('Failed to revoke object URL', e);
                    }
                };
        }
    }, [profileUpload.selectedFiles]);


    const handleVerifyComplete = (files: File[]) => {
        console.log("업로드 완료:", files);
        onDataChange("school_verified", true);
    };

    const handleTagComplete = (newTags: ProfileTagItem[]) => {
        onDataChange("tags", newTags);
    };

    const handleBasicInfoChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: "school" | "major" | "email" | "phone",
        currentValue: string
    ) => {
        const input = e.target;
        const newValue = input.value;

        if (id === "phone") {
            const formattedValue = formatBirthDate(newValue);
            onDataChange(id, formattedValue);
        } else {
            onDataChange(id, newValue);
        }
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row w-full gap-[24px]">
                {/**프로필사진, 이름 */}
                <div className="flex flex-col items-center w-full lg:w-[200px] shrink-0">
                    <div
                        onDragOver={handleProfileDragOver}
                        onDragLeave={handleProfileDragLeave}
                        onDrop={handleProfileDrop}
                        onClick={isEditing ? () => {
                            profileUpload.setSelectedFiles([]);
                            profileUpload.fileInputRef.current?.click();
                        } : undefined}
                        className={`relative flex justify-center items-center bg-[#FBFAF9]
                         ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                    >
                        <div className="w-[140px] h-[140px] lg:w-[160px] lg:h-[160px] rounded-full overflow-hidden">
                            <img
                                src={data.profileImage || defaultImage}
                                alt="프로필 이미지"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== defaultImage) {
                                        target.src = defaultImage;
                                    }
                                }}
                            />
                        </div>
                        {isEditing && (
                            <div className="absolute bottom-0 right-1 lg:right-2 flex w-[36px] h-[36px] 
                                    justify-center items-center rounded-full z-20 shadow-md
                                    bg-[#EFEEEB] border border-[#C2BBB0] text-[#C2BBB0]">
                                {isDetailsEmpty && !data.profileImage ? (
                                    <ImageIcon size={16} />
                                ) : (
                                    <Pencil size={16} />
                                )}
                            </div>
                        )}
                        <input
                            type="file"
                            ref={profileUpload.fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => profileUpload.handleFileUpload(e.target.files)}
                        />
                    </div>
                    <input
                        readOnly={!isEditing}
                        maxLength={6}
                        value={data.name}
                        onChange={(e) => onDataChange("name", e.target.value)}
                        className="outline-none bg-transparent
                            text-center self-stretch text-[#25221D] font-pretendard text-[20px] lg:text-[24px] font-bold leading-[130%] tracking-[-0.01em]"
                    />

                </div>
                {/**정보 */}
                <div className="flex flex-col w-full lg:max-w-[440px] gap-[12px] items-start">
                    {/**디폴트 정보 */}
                    {fieldConfig.map((item) => {
                        // 편집 모드가 아닌데 값이 없으면 렌더링 스킵
                        if (!isEditing && !item.value) return null;
                        return (
                            <div
                                key={item.id}
                                className="flex items-center self-stretch gap-[8px]"
                            >
                                <div className="flex w-[70px] lg:w-[85px] h-[50px] lg:h-[56px] justify-center items-center
                                    rounded-l-[10px] bg-[#E9FCF7]"
                                >
                                    <span className="text-center text-[#423C33] font-pretendard text-[14px] lg:text-[16px] font-medium leading-[140%]">
                                        {item.label}
                                    </span>
                                </div>
                                <div className="flex flex-1 h-[50px] lg:h-[56px] px-[15px] items-center justify-between
                                        border border-[#D6D6D8] rounded-r-[10px]">

                                    <input
                                        maxLength={item.max}
                                        readOnly={!isEditing}
                                        value={item.value || ""}
                                        onChange={(e) => handleBasicInfoChange(e, item.id, item.value || "")}
                                        placeholder="입력해주세요."
                                        className="w-full h-full outline-none font-pretendard text-[15px] lg:text-[16px]
                                            placeholder:text-[#978B78] text-[#342F28] font-medium leading-[130%] bg-transparent"
                                    />

                                    {item.id === "school" ? (
                                        <button
                                            // 수정 모드일 때만 클릭 가능하게 설정
                                            onDoubleClick={() => isEditing && setIsModalOpen(true)}
                                            disabled={!isEditing}
                                            className={`flex p-[5px] items-center gap-[3px] rounded-[10px] transition-colors shrink-0 
                                                    ${isVerified
                                                    ? "bg-[#E9FCF7] text-[#1BA07A]"
                                                    : "bg-[#EFEEEB] text-[#5F5749]"
                                                }
                                            ${!isEditing ? "cursor-default" : "cursor-pointer"}
                                        `}
                                        >
                                            <Paperclip size={24} />
                                            <span className={`hidden md:inline text-[12px] font-medium font-pretendard leading-[150%] tracking-[-0.01em] 
                                                ${isVerified ? "text-[#1BA07A]" : "text-[#5F5749]"}`}>
                                                {isVerified ? "첨부파일 확인" : "첨부파일 증빙 전"}
                                            </span>
                                        </button>
                                    ) : (
                                        isEditing && (
                                            <Pencil size={18} color="#C2BBB0" />
                                        )
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <SchoolVerifyModal
                        isOpen={isModalOpen}
                        isEditing={isEditing}
                        onClose={() => setIsModalOpen(false)}
                        onComplete={handleVerifyComplete}
                    />

                    {/* 커스텀 추가 정보 리스트 */}
                    {data.additionalDetails?.map((item: any) => {
                        if (!isEditing && !item.value) return null;

                        return (
                            <div key={item.id} className="flex items-center gap-[8px] h-[50px] lg:h-[56px] w-full animate-in fade-in slide-in-from-top-1">
                                <div className="flex w-[70px] lg:w-[85px] h-full justify-center items-center rounded-l-[10px] bg-[#E9FCF7] shrink-0">
                                    <input
                                        readOnly={!isEditing}
                                        value={item.label}
                                        onChange={(e) => updateCustomField(item.id, 'label', e.target.value)}
                                        className={`bg-transparent w-full text-center outline-none text-[#423C33] font-medium text-[14px] lg:text-[16px] 
                                            ${isEditing ? "cursor-text" : "cursor-default"}`} />
                                </div>
                                <div className="flex flex-1 h-full px-[15px] md:px-[30px] items-center justify-between border border-[#D6D6D8] 
                                    rounded-r-[10px] bg-white relative overflow-hidden ">
                                    {item.type === 'file' || item.type === "link" ? (
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-[#25221D] text-[14px] lg:text-[16px] truncate">
                                                {item.value}
                                            </span>
                                            <button
                                                onClick={() => handleIconClick(item)}
                                                className={`${isEditing ? "cursor-default" : "cursor-pointer"}`}>
                                                <Paperclip size={18} className="text-[#5F5749]" />
                                            </button>
                                        </div>
                                    ) : (
                                        <input
                                            readOnly={!isEditing}
                                            value={item.value}
                                            onChange={(e) => updateCustomField(item.id, 'value', e.target.value)}
                                            className={`w-full h-full outline-none text-[#25221D] text-[14px] lg:text-[16px] bg-transparent 
                                                ${isEditing ? "cursor-text" : "cursor-default"}`} />
                                    )}
                                    {isEditing && (
                                        <X size={18} className="absolute right-2 text-[#7C7160] cursor-pointer"
                                            onClick={() => onDataChange("additionalDetails", data.additionalDetails.filter((d: any) => d.id !== item.id))} />
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* [+] 버튼 및 옵션창 */}
                    {showPlusButton && (
                        <div className="mt-2 w-full">
                            {!showAddOptions ? (
                                <button
                                    onClick={() => setShowAddOptions(true)}
                                    className="flex w-full h-[48px] justify-center items-center
                                    rounded-[10px] bg-[#EFEEEB] text-[#978B78] border border-[#D9D5CE] cursor-pointer"
                                >
                                    <Plus size={20} className="aspect-ratio shrink-0" color="#C2BBB0" />
                                </button>
                            ) : (
                                <div className="flex flex-col items-center w-full max-w-[720px] px-[20px] py-[30px] 
                                    shadow-sm animate-in fade-in zoom-in-95 gap-[16px]
                                    bg-[#FBFAF9] rounded-[20px] md:rounded-[30px]">
                                    <p className="font-pretendard text-[18px] font-semibold text-[#342F28] text-center">
                                        추가하고 싶은 정보를 선택하세요.
                                    </p>
                                    <div className="flex gap-[8px] justify-center w-full">
                                        {ADD_OPTIONS.map((option) => {
                                            const isSelected = activeType === option.type;

                                            return (
                                                <button
                                                    key={option.type}
                                                    onClick={() => handleTypeSelect(option.type)}
                                                    className={`
                                                        flex items-center justify-center w-[70px] h-[40px] cursor-pointer
                                                        rounded-[10px] border text-center text-[#25221D] font-[pretendard] text-[14px]
                                                        ${isSelected
                                                            ? "bg-[#E9FCF7] border-[#26E1AC]"
                                                            : "bg-[#EFEEEB] border-[#978B78]"
                                                        }
                                                        `}
                                                >
                                                    <span>{option.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {activeType && (
                                        <div className="w-full flex flex-col gap-3">
                                            {/* 텍스트 타입 UI */}
                                            {activeType === 'text' ? (
                                                <div className="flex items-center self-stretch gap-[8px] h-[48px]">
                                                    <div className="flex w-[70px] h-full justify-center items-center rounded-[10px] bg-[#E9FCF7] shrink-0">
                                                        <input
                                                            onChange={(e) => setTempLabel(e.target.value)}
                                                            placeholder="텍스트"
                                                            className="w-full bg-transparent text-center
                                                            rounded-l-[10px] bg-[#E9FCF7] outline-none
                                                            font-pretendard leading-[140%] text-[#423C33] font-medium text-[14px]"
                                                        />
                                                    </div>
                                                    <input
                                                        value={tempValue}
                                                        onChange={(e) => setTempValue(e.target.value)}
                                                        placeholder="입력해주세요"
                                                        className="flex-1 h-full px-[15px]
                                                        bg-transparent border rounded-r-[10px] border-[#D9D5CE] outline-none 
                                                        text-[15px] font-pretendard leading-[130%] font-medium text-[#342F28]"
                                                    />
                                                </div>
                                            ) : (
                                                /* 파일/링크 타입 UI */
                                                <div className="flex flex-col gap-3 w-full">
                                                    <input
                                                        value={tempLabel}
                                                        onChange={(e) => setTempLabel(e.target.value)}
                                                        placeholder={`${activeType === 'file' ? '파일' : '링크'} 제목을 입력해주세요`}
                                                        className="h-[48px] px-[15px]
                                                        bg-transparent border rounded-[10px] border-[#D9D5CE] outline-none 
                                                        font-pretendard text-[15px] font-medium leading-[130%] text-[#978B78]"
                                                    />
                                                    {activeType === "file" ? (
                                                        <div
                                                            onDragOver={handleAddFileDragOver}
                                                            onDragLeave={handleAddFileDragLeave}
                                                            onDrop={handleAddFileDrop}
                                                            onClick={() => uploadManager.fileInputRef.current?.click()}
                                                            className="flex flex-col justify-center items-center 
                                                                    bg-white rounded-[30px] cursor-pointer"
                                                        >
                                                            {uploadManager.selectedFiles.length > 0 ? (
                                                                <div className="h-[60px] w-full flex items-center justify-between px-4 bg-[#E9FCF7] rounded-[20px]">
                                                                    <span className="text-[#25221D] text-[15px] font-medium truncate max-w-[80%]">
                                                                        {tempValue}
                                                                    </span>
                                                                    <button onClick={() => handleRemoveSelectedFile()} className="text-[#7C7160] hover:text-[#342F28]">
                                                                        <X size={24} />
                                                                    </button>
                                                                    <input
                                                                        type="file"
                                                                        ref={uploadManager.fileInputRef}
                                                                        className="hidden"
                                                                        onChange={handleFileChange}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="flex justify-center items-center gap-[8px] bg-white">
                                                                    <FileText size={28} color="#978B78" />
                                                                    <div className="flex flex-col items-center gap-2">
                                                                        <span className="self-stretch text-center text-[#978B78] font-pretendard text-[14px] font-medium leading-[140%] whitespace-nowrap">
                                                                            파일을 첨부해주세요
                                                                        </span>
                                                                        <span className="self-stretch text-center text-[#978B78] font-pretendard text-[12px] font-normal leading-[150%]">
                                                                            (증빙서류, 포트폴리오)
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <input
                                                                type="file"
                                                                ref={uploadManager.fileInputRef}
                                                                className="hidden"
                                                                onChange={(e) => uploadManager.handleFileUpload(e.target.files)}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <input
                                                            value={tempValue}
                                                            onChange={(e) => setTempValue(e.target.value)}
                                                            placeholder="링크를 첨부해주세요. (Github, Behance)"
                                                            className="h-[48px] px-[15px] text-[#978B78]
                                                            bg-white border rounded-[10px] border-[#D9D5CE] outline-none text-[15px]"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex justify-end w-full">
                                                <button
                                                    onClick={handleConfirmAdd}
                                                    className="px-5 py-2 bg-[#6EEBC7] text-[#25221D] rounded-lg font-medium text-[14px]">
                                                    추가하기
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setShowAddOptions(false)}
                                        className="text-[#25221D] text-[13px] underline">
                                        취소
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/**태그, 자기소개 */}
                <div className="flex flex-col gap-[24px] w-full xl:flex-1">
                    {/* 관심 태그 섹션 */}
                    <div className="flex flex-col gap-[8px] w-full">
                        <span className="text-[#423C33] font-pretendard text-[18px] lg:text-[20px] font-semibold leading-[130%]">
                            관심 태그
                        </span>

                        {/* 태그 영역 클릭 시 모달 오픈 */}
                        <div
                            onClick={() => {
                                if (isEditing) setIsTagModalOpen(true);
                            }}
                            className={`flex w-full justify-center min-h-[auto]
                                ${isEditing ? "cursor-pointer" : "cursor-default"}
                                ${data.tags && data.tags.length > 0
                                    ? "justify-start items-start p-0 border-none"
                                    : "min-h-[120px] lg:min-h-[140px] justify-center items-center p-[30px] rounded-[10px] border-dashed border-[#5F5749] border"
                                }`}
                        >
                            {data.tags && data.tags.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[8px] w-full">
                                    {data.tags.map((tag: any) => (
                                        <div
                                            key={tag.id}
                                            className={`flex justify-center items-center px-3 py-2
                                            min-h-[44px] h-auto text-center
                                            bg-[#E9FCF7] rounded-[10px] border border-[#26E1AC] 
                                            font-normal font-pretendard  text-[12px] lg:text-[14px]
                                            ${tag.title.length <= 6
                                                    ? "whitespace-nowrap"
                                                    : "whitespace-normal break-words"}
                                            ${isEditing ? "text-[#978B78] pr-[8px]" : "text-[#342F28]"}                                    
                                            `}
                                        >
                                            {tag.title}

                                            {isEditing && (
                                                <div
                                                    onClick={(e) => handleDeleteTag(tag.id, e)}
                                                    className="flex items-center justify-center w-[18px] h-[18px] 
                                                rounded-full hover:bg-[#26E1AC]/20 transition-colors cursor-pointer"
                                                >
                                                    <X size={14} className="text-[#C2BBB0] hover:text-[#1BA07A]" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col md:flex-row gap-[12px] items-center text-center">
                                        <img
                                            src={MascotIcon}
                                            className="w-[40px] lg:w-[50px] h-auto"
                                        />
                                        <span className="text-[#7C7160] font-pretendard text-[14px] lg:text-[16px] font-medium ">
                                            {getDisplayName(data.name)}님의 관심사를 알려주세요!
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {/* 관심 태그 선택 모달 */}
                    <TagSelectModal
                        isOpen={isTagModalOpen}
                        currentTags={data.tags || []}
                        onClose={() => setIsTagModalOpen(false)}
                        onComplete={handleTagComplete}
                    />
                    {/* 자기소개  */}
                    <div className="flex flex-col gap-[12px] w-full">
                        <span className="text-[#423C33] font-pretendard text-[18px] lg:text-[20px] font-semibold leading0[130%]">자기소개</span>
                        <textarea
                            readOnly={!isEditing}
                            value={data.introduction || ""}
                            maxLength={500}
                            onChange={(e) => onDataChange("introduction", e.target.value)}
                            placeholder="입력해주세요."
                            className={`flex flex-col items-start gap-[10px] shrink-0 w-full h-[140px] lg:h-[180px] px-[15px] py-[20px]
                                bg-transparent rounded-[10px] border-[#D9D5CE] border placeholder:text-[#D9D5CE] text-[#342F28]
                                outline-none resize-none font-pretendard text-[16px] md:text-[18px] 
                                ${isEditing
                                    ? "cursor-text"
                                    : "cursor-default"
                                }`}
                        />
                    </div>
                </div>
            </div>

        </>
    )
}

export default ProfileDetails