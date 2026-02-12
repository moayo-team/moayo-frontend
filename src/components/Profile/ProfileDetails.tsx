import { useEffect, useState } from "react";
import defaultImage from "../../assets/white2.png"
import { FileText, Paperclip, Pencil, Plus, X } from "lucide-react";
import { formatPhoneNumber } from "../../utils/format";
import { useUploadManager } from "../../hooks/useUploadManager";
import SchoolVerifyModal from "./SchoolVerifyModal";
import TagSelectModal from "./TagSelectModal";
import MascotIcon from "../../assets/white2.png"
import type { ProfileFormData } from "../../types/profileForm";
import type { InterestTag } from "../../types/profile";
//import MinLayoutContainer from './layouts/MinWidthLayout';

interface ProfileDetailsProps {
    isEditing: boolean;
    isReadOnly: boolean;
    isDetailsEmpty: boolean;
    data: ProfileFormData;
    experienceIds: number[];
    onDataChange: (
        id:
            | keyof ProfileFormData
            | "school"
            | "major"
            | "email"
            | "phone"
            | "school_verified"
            | "imageUrl"
            | "profileFile",
        value: any
    ) => void;
}

const ProfileDetails = ({ isEditing, isReadOnly, isDetailsEmpty, data, experienceIds, onDataChange }: ProfileDetailsProps) => {
    const canEdit = isEditing && !isReadOnly;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);

    // 학력 인증 상태 확인
    //const schoolData = data.details.find((d: any) => d.id === "school");
    //    const isVerified = schoolData?.isVerified || false;

    const additionalDetails = data.additionalDetails || [];
    const tags = data.tags || [];
    //    const documents = data.documents || [];

    //추가 정보 생성을 위한 상태
    //    const showPlusButton = isEditing && !isDetailsEmpty && (additionalDetails.length || 0) < 4;
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [activeType, setActiveType] = useState<'file' | 'link' | 'text' | null>(null);

    //타입별 상세 입력을 위한 임시 상태
    const [tempLabel, setTempLabel] = useState("");
    const [tempValue, setTempValue] = useState("");
    const [isUploading, _setIsUploading] = useState(false);
    //   const [isAddingFile, setIsAddingFile] = useState(false);

    // 프로필 사진 업도르 전용 훅 
    const profileUpload = useUploadManager({
        maxFiles: 1,
        allowedTypes: ["image/jpeg", "image/png", "image/gif"]
    });
    //추가 정보 업로드 전용 훅
    const uploadManager = useUploadManager({
        maxFiles: 3,
        maxLeftText: 10,
        maxRightText: 20,
        maxLinkLength: 40,
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

    //이미지 압축
    const compressImage = (file: File, maxSizeMB: number = 1): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // 최대 너비 제한 (큰 이미지 축소)
                    const maxWidth = 1920;
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Canvas context not available'));
                        return;
                    }

                    ctx.drawImage(img, 0, 0, width, height);

                    // 품질을 조절하며 압축
                    let quality = 0.9;
                    const tryCompress = () => {
                        canvas.toBlob(
                            (blob) => {
                                if (!blob) {
                                    reject(new Error('Compression failed'));
                                    return;
                                }

                                const compressedFile = new File(
                                    [blob],
                                    file.name,
                                    { type: file.type || 'image/jpeg' }
                                );

                                // 목표 크기보다 작으면 성공
                                if (compressedFile.size <= maxSizeMB * 1024 * 1024) {
                                    resolve(compressedFile);
                                } else if (quality > 0.5) {
                                    // 아직 크면 품질을 더 낮춰서 재시도
                                    quality -= 0.1;
                                    tryCompress();
                                } else {
                                    // 더 이상 압축할 수 없으면 실패
                                    reject(new Error(`이미지를 ${maxSizeMB}MB 이하로 압축할 수 없습니다.`));
                                }
                            },
                            file.type || 'image/jpeg',
                            quality
                        );
                    };

                    tryCompress();
                };

                img.onerror = () => reject(new Error('Image load failed'));
                img.src = e.target?.result as string;
            };

            reader.onerror = () => reject(new Error('File read failed'));
            reader.readAsDataURL(file);
        });
    };

    //  프로필 이미지 변경 전용 핸들러
    const handleProfileImageChange = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        // 파일 타입 검증
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            alert('JPG, PNG, GIF 형식의 이미지만 업로드 가능합니다.');
            return;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB

        let finalFile = file;
        // 10MB 초과 시 자동 압축
        if (file.size > maxSize) {

            try {
                finalFile = await compressImage(file, 1);
                //alert(`이미지가 1MB를 초과하여 자동으로 압축되었습니다.\n원본: ${(file.size / 1024).toFixed(0)}KB → 압축: ${(finalFile.size / 1024).toFixed(0)}KB`);
            } catch (error: any) {
                //alert(`이미지 압축 실패: ${error.message}\n1MB 이하의 이미지를 선택해주세요.`);
                return;
            }
        }
        const previewUrl = URL.createObjectURL(finalFile);

        // 미리보기 주소 저장
        onDataChange("profileImage", previewUrl);
        //onDataChange("profileFile", finalFile);
        onDataChange("profileFile", finalFile);

    };

    const handleConfirmAddDetail = async () => {
        const isFile = activeType === "file";
        const isLink = activeType === "link";

        const selectedFile = uploadManager.selectedFiles[0] as unknown as File;

        const hasValue = isFile ? uploadManager.selectedFiles.length > 0 : tempValue.trim() !== "";

        if (!activeType || !hasValue || !tempLabel.trim()) return;
        if (isFile && !selectedFile) return alert("파일을 선택해주세요.");

        let displayValueForServer = tempValue;
        if (isLink && tempValue.length > 20) {
            displayValueForServer = tempLabel.substring(0, 20);
        } else if (isFile) {
            displayValueForServer = uploadManager.selectedFiles[0]?.name.substring(0, 20);
        }

        // 리스트에 들어갈 객체 구성
        const newField = {
            id: `new_${Date.now()}`,
            type: activeType,
            label: tempLabel,
            value: isFile ? selectedFile.name : displayValueForServer,
            // ERD 필수 컬럼들 매핑 준비
            linkUrl: activeType === "link" ? tempValue : null,
            fileName: isFile ? selectedFile.name : null,
            fileType: isFile ? selectedFile.type : null,
            fileSize: isFile ? selectedFile.size : null,
            fileObj: isFile ? selectedFile : null,
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

        const targetUrl = item.type === 'file'
            ? (item.linkUrl || item.fileUrl || item.url || item.value)
            : (item.linkUrl || item.url || item.value);

        if (!targetUrl) {
            alert("URL을 찾을 수 없습니다.");
            return;
        }

        let fullUrl: string;

        if (item.type === 'file') {
            if (targetUrl.startsWith('http')) {
                fullUrl = targetUrl;
            } else {
                const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
                const cleanPath = targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`;
                fullUrl = `${baseUrl}${cleanPath}`;
            }

            // PDF 툴바 숨김
            if (fullUrl.toLowerCase().endsWith('.pdf')) {
                fullUrl += '#toolbar=0';
            }
        } else {
            // 링크: http 프로토콜 추가
            fullUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
        }

        window.open(fullUrl, '_blank', 'noopener,noreferrer');
    };

    //기존 리스트 수정/삭제 로직
    const updateCustomField = (id: number | string, key: "label" | "value", val: string) => {
        const updated = additionalDetails.map((item) => {
            if (item.id !== id) return item;

            if (key === 'value' && item.type === 'link') {
                return {
                    ...item,
                    value: val,
                    linkUrl: val,
                    url: val
                };
            }

            if (key === 'value' && item.type === 'file') {
                return {
                    ...item,
                    value: val
                };
            }

            return { ...item, [key]: val };
        });
        onDataChange("additionalDetails", updated);
    };


    const getValue = (id: "school" | "major" | "email" | "phone") => {
        return data.details.find((item) => item.id === id)?.value || "";
    };

    //태그 삭제 핸들러
    const handleDeleteTag = (tagId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newTags = tags.filter((t: InterestTag) => t.id !== tagId);
        onDataChange("tags", newTags);
    };


    const fieldConfig: {
        label: string;
        id: "school" | "major" | "email" | "phone";
        value: string;
        max?: number;
    }[] = [
            { label: "학력", id: "school", value: getValue("school") },
            { label: "학과", id: "major", value: getValue("major") },
            { label: "이메일", id: "email", value: getValue("email"), max: 30 },
            { label: "전화번호", id: "phone", value: getValue("phone"), max: 13 },
        ];

    // 파일이 선택되었을 때 미리보기를 부모 상태에 반영
    useEffect(() => {
        if (uploadManager.selectedFiles.length > 0) {
            setTempValue(uploadManager.selectedFiles[uploadManager.selectedFiles.length - 1].name);
        }
    }, [uploadManager.selectedFiles]);

    const handleVerifyComplete = (_files: File[]) => {
        onDataChange("school_verified", true);
    };

    const handleTagComplete = (newTags: InterestTag[]) => {
        onDataChange("tags", newTags);
    };

    const handleBasicInfoChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: "school" | "major" | "email" | "phone",
        _currentValue: string
    ) => {
        const input = e.target;
        const newValue = input.value;

        if (id === "phone") {
            const formattedValue = formatPhoneNumber(newValue);
            onDataChange(id, formattedValue);
        } else {
            onDataChange(id, newValue);
        }
    };

    const getFullImageUrl = (url: string) => {
        if (!url) return defaultImage;
        if (url.startsWith('blob:')) return url;
        if (url.startsWith('/uploads')) return `${import.meta.env.VITE_API_BASE_URL}${url}`;
        return url;
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row w-full gap-[24px]">
                {/**프로필사진, 이름 */}
                <div className="flex flex-col gap-[10px] items-center w-full lg:w-[220px] shrink-0">
                    <div
                        onDragOver={handleProfileDragOver}
                        onDragLeave={handleProfileDragLeave}
                        onDrop={handleProfileDrop}
                        onClick={canEdit ? () => {
                            profileUpload.fileInputRef.current?.click();
                        } : undefined}
                        className={`relative flex justify-center items-center bg-[#FBFAF9]
                         ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                    >
                        <div className="w-[180px] h-[200px] lg:w-[200px] lg:h-[220px] rounded-[10px] overflow-hidden flex justify-center items-center">
                            <img
                                src={getFullImageUrl(data.profileImage)}
                                alt="프로필 이미지"
                                className={`rounded-[10px]
                                    ${!data.profileImage ? "w-[100px] h-[80px] object-contain p-2" : "w-[140px] h-[140px] object-cover"}
                                `}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== defaultImage) {
                                        target.src = defaultImage;
                                        target.className = "w-full h-full object-contain p-2";
                                    }
                                }}
                            />
                        </div>
                        
                        <input
                            type="file"
                            ref={profileUpload.fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleProfileImageChange(e.target.files)}
                        />
                    </div>
                    <div className="flex items-center justify-center relative w-fit mx-auto group">
                        <input
                            readOnly={!canEdit}
                            maxLength={6}
                            value={data.name}
                            onChange={(e) => onDataChange("name", e.target.value)}
                            className={`outline-none bg-transparent
                            text-center self-stretch text-[#25221D] font-pretendard text-[20px] lg:text-[24px] font-bold leading-[130%] tracking-[-0.01em]
                            w-full max-w-[120px] ${!canEdit ? "cursor-default" : "cursor-text"}`}
                        />

                    </div>
                </div>
                {/**정보 */}
                <div className="flex flex-col w-full lg:max-w-[400px] gap-[12px] items-start">
                    {/**디폴트 정보 */}
                    {fieldConfig.map((item) => {
                        // 편집 모드가 아닌데 값이 없으면 렌더링 스킵
                        if (isReadOnly && !item.value) return null;
                        return (
                            <div
                                key={item.id}
                                className="flex items-center self-stretch gap-[8px]"
                            >
                                <div className="flex w-[70px] lg:w-[85px] h-[50px] lg:h-[56px] justify-center items-center
                                    rounded-l-[10px] bg-[#E9FCF7]"
                                >
                                    <span className="text-center text-[#423C33] font-pretendard text-[14px] lg:text-[16px] font-normal leading-[140%]">
                                        {item.label}
                                    </span>
                                </div>
                                <div className="flex flex-1 h-[50px] lg:h-[56px] px-[15px] items-center justify-between
                                        border border-[#D6D6D8] rounded-r-[10px]">

                                    <input
                                        maxLength={item.max}
                                        readOnly={item.id === "email" || !canEdit}
                                        value={item.id === "phone" ? formatPhoneNumber(item.value || "") : (item.value || "")}
                                        onChange={(e) => {
                                            if (item.id === "email") return;
                                            handleBasicInfoChange(e, item.id, item.value || "")
                                        }}
                                        placeholder={item.id === "school" || item.id === "major" ? "필수 입력 항목입니다." : "입력해주세요."}
                                        className={`w-full h-full outline-none font-pretendard text-[15px] lg:text-[16px]
                                            placeholder:text-[#978B78] text-[#342F28] font-medium leading-[130%] bg-transparent
                                            ${!canEdit ? "cursor-default" : "cursor-text"}
                                            ${item.id === "school" && (!data.documents || data.documents.length === 0)
                                                ? "text-[#978B78]" // 학교인데 증빙 서류가 없으면 이 색상 적용
                                                : "text-[#342F28]" // 그 외(증빙 완료 또는 타 필드) 기본 색상
                                            }
                                            `}
                                    />

                                    {item.id === "school" ? (
                                        (item.value || canEdit) && (
                                            <div className="flex items-center gap-2 shrink-0">

                                                <button
                                                    // 수정 모드일 때만 클릭 가능하게 설정
                                                    onDoubleClick={() => setIsModalOpen(true)}
                                                    className={`flex py-[4px] px-[8px] items-center gap-[4px] rounded-[8px] transition-colors shrink-0
                                                    cursor-pointer hover:opacity-80
                                                    ${data.documents && data.documents.length > 0
                                                            ? "bg-[#E9FCF7] text-[#1BA07A]" // 파일 있을 때: 민트색 테마
                                                            : "bg-[#EFEEEB] text-[#5F5749]" // 파일 없을 때: 회색 테마 
                                                        }
                                                `}
                                                >
                                                    <Paperclip size={18} />
                                                    <span className="hidden md:inline text-[11px] font-medium font-pretendard leading-[140%] tracking-[-0.01em]">
                                                        {data.documents && data.documents.length > 0
                                                            ? "첨부파일 확인"
                                                            : "학력 파일 증빙 전"
                                                        }
                                                    </span>
                                                </button>
                                            </div>
                                        )
                                    ) : (
                                        canEdit && item.id !== "email" && (
                                            <Pencil size={16} color="#C2BBB0" />
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
                        currentProfileImage={data.imageUrl}
                        documents={data.documents}
                        experienceIds={experienceIds}
                        isMyProfile={!isReadOnly}
                    />

                    {/* 커스텀 추가 정보 리스트 */}
                    {data.additionalDetails?.map((item: any) => {
                        if (isReadOnly && !item.value) return null;

                        return (
                            <div key={item.id} className="flex items-center gap-[8px] h-[50px] lg:h-[56px] w-full animate-in fade-in slide-in-from-top-1">
                                <div className="flex w-[70px] lg:w-[85px] h-full justify-center items-center rounded-l-[10px] bg-[#E9FCF7] shrink-0">
                                    <input
                                        readOnly={!canEdit}
                                        value={item.label}
                                        onChange={(e) => updateCustomField(item.id, 'label', e.target.value)}
                                        className={`bg-transparent w-full text-center outline-none text-[#423C33] font-medium text-[14px] lg:text-[16px] 
                                            ${isEditing ? "cursor-text" : "cursor-default"}`} />
                                </div>
                                <div className="flex flex-1 h-[50px] lg:h-[56px] px-[15px] items-center justify-between border border-[#D6D6D8] 
                                    rounded-r-[10px] bg-white relative overflow-hidden">

                                    <div className="relative flex items-center w-full h-full">
                                        <input
                                            readOnly={!canEdit}
                                            value={item.type === 'link' ? (item.url || item.value) : item.value}
                                            onChange={(e) => updateCustomField(item.id, 'value', e.target.value)}
                                            placeholder="내용을 입력해주세요."
                                            className={`w-full h-full outline-none text-[#25221D] text-[15px] lg:text-[16px] font-medium bg-transparent
                                                ${!canEdit ? "cursor-default pr-[40px]" : "cursor-text pr-[30px]"} 
                                                truncate`}
                                        />

                                        {/* 아이콘 영역 */}
                                        <div className="absolute right-0 flex items-center gap-1 shrink-0 bg-white/80 h-full pl-2">
                                            {canEdit ? (
                                                <button
                                                    onClick={() => onDataChange("additionalDetails", additionalDetails.filter((d: any) => d.id !== item.id))}
                                                    className="p-1 text-[#7C7160] hover:text-red-500"
                                                >
                                                    <X size={18} />
                                                </button>
                                            ) : (
                                                (item.type === 'file' || item.type === 'link') && (
                                                    <button
                                                        onClick={() => !canEdit && handleIconClick(item)}
                                                        className={`${canEdit ? "cursor-default opacity-30" : "cursor-pointer"} p-1 transition-opacity`}
                                                    >
                                                        <Paperclip size={18} className="text-[#5F5749]" />
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* [+] 버튼 및 옵션창 */}
                    {canEdit && !isDetailsEmpty && (data.additionalDetails?.length || 0) < 4 && (
                        <div className="mt-2 w-full">
                            {!showAddOptions ? (
                                <button
                                    onClick={() => setShowAddOptions(true)}
                                    className="flex w-full h-[48px] justify-center items-center
                                    rounded-[10px] bg-[#FBFAF9] text-[#978B78] border border-[#D9D5CE] cursor-pointer"
                                >
                                    <Plus size={20} className="aspect-ratio shrink-0" color="#C2BBB0" />
                                </button>

                            ) : (

                                <div className="flex flex-col items-start w-full max-w-[720px] px-[20px] py-[30px] 
                                    shadow-sm animate-in fade-in zoom-in-95 gap-[16px]
                                    bg-[#FBFAF9] rounded-[20px] md:rounded-[30px]">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddOptions(false)}
                                        aria-label="닫기"
                                        className="absolute top-[16px] right-[16px] p-2 rounded-full hover:bg-black/5 transition"
                                        >
                                        <X size={20} className="text-[#7C7160]" />
                                    </button>
                                    <p className="font-pretendard text-[18px] font-semibold text-[#342F28] text-left">
                                        추가하고 싶은 정보를 선택하세요.
                                    </p>
                                    <div className="flex gap-[8px] justify-start w-full">
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
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (uploadManager.isInputValidByType(val, 'text', 'left')) {
                                                                    setTempLabel(val);
                                                                }
                                                            }}
                                                            placeholder="텍스트"
                                                            className="w-full bg-transparent text-center
                                                            rounded-l-[10px] bg-[#E9FCF7] outline-none
                                                            font-pretendard leading-[140%] text-[#423C33] font-medium text-[14px]"
                                                        />
                                                    </div>
                                                    <input
                                                        value={tempValue}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (uploadManager.isInputValidByType(val, 'text', 'right')) {
                                                                setTempValue(val);
                                                            }
                                                        }}
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
                                                    {activeType === "file" &&
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
                                                                <div className="flex justify-center items-center gap-[8px] bg-white w-full px-4">
                                                                    <FileText size={28} color="#978B78" />
                                                                    <div className="flex flex-col items-center gap-2">
                                                                        <span className=" text-center text-[#978B78] font-pretendard text-[14px] font-medium leading-[140%] whitespace-nowrap">
                                                                            파일을 첨부해주세요
                                                                        </span>
                                                                        <span className=" text-center text-[#978B78] font-pretendard text-[12px] font-normal leading-[150%]">
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
                                                    }{activeType === "link" &&
                                                        <input
                                                            value={tempValue}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (uploadManager.isInputValidByType(val, 'link')) {
                                                                    setTempValue(val);
                                                                }
                                                            }}
                                                            maxLength={40}
                                                            placeholder="링크를 첨부해주세요. (Github, Behance)"
                                                            className="h-[48px] px-[15px] text-[#978B78]
                                                            bg-white border rounded-[10px] border-[#D9D5CE] outline-none text-[15px]"
                                                        />
                                                    }
                                                </div>
                                            )}
                                            <div className="flex justify-end w-full">
                                                <button
                                                    onClick={handleConfirmAddDetail}
                                                    className="px-5 py-2 bg-[#6EEBC7] text-[#25221D] rounded-lg font-medium text-[14px]">
                                                    {isUploading ? "업로드 중..." : "추가하기"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/**태그, 자기소개 */}
                <div className="flex flex-col gap-[24px] w-full xl:flex-1 xl:max-w-[560px]">
                    {/* 관심 태그 섹션 */}
                    <div className="flex flex-col gap-[8px] w-full">
                        <span className="text-[#423C33] font-pretendard text-[18px] lg:text-[20px] font-semibold leading-[130%]">
                            관심 태그
                        </span>

                        {/* 태그 영역 클릭 시 모달 오픈 */}
                        <div
                            onClick={() => {
                                if (canEdit) setIsTagModalOpen(true);
                            }}
                            className={`flex w-full justify-center min-h-[96px] lg:min-h-[110px]  p-0
                                ${isEditing
                                    ? "cursor-pointer"
                                    : "cursor-default"
                                }
                                ${data.tags && data.tags.length > 0
                                    ? "justify-start items-start border-none"
                                    : "justify-center items-center rounded-[10px] border-dashed border-[#D9D5CE] border-2"
                                }`}
                        >
                            {data.tags && data.tags.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[8px] w-full">
                                    {data.tags.map((tag: InterestTag, index: number) => (
                                        <div
                                            key={`${tag.id}-${index}`}
                                            className={`flex justify-center items-center px-3 py-2
                                            min-h-[44px] h-auto text-center
                                            bg-[#E9FCF7] rounded-[10px] border border-[#26E1AC] 
                                            font-normal font-pretendard  text-[12px] lg:text-[14px]
                                            ${tag.name.length <= 6
                                                    ? "whitespace-nowrap"
                                                    : "whitespace-normal break-words"}
                                            ${isEditing ? "text-[#978B78] pr-[8px]" : "text-[#342F28]"}                                    
                                            `}
                                        >
                                            {tag.name}

                                            {canEdit && (
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
                                <div className="flex flex-col md:flex-row gap-[12px] items-center text-center">
                                    <img
                                        src={MascotIcon}
                                        className="w-[40px] lg:w-[50px] h-auto"
                                    />
                                    <span className="text-[#7C7160] font-pretendard text-[14px] lg:text-[16px] font-medium ">
                                        {data.name}님의 관심사를 알려주세요!
                                    </span>
                                </div>
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
                        <div className="flex items-center gap-1">
                            <span className="text-[#423C33] font-pretendard text-[18px] lg:text-[20px] font-semibold leading0[130%]">
                                자기소개
                            </span>
                        </div>
                        <div className="relative w-full">
                            <textarea
                                readOnly={!canEdit}
                                value={isReadOnly && !data.introduction ? "등록된 자기소개가 없습니다." : (data.introduction || "")}
                                maxLength={500}
                                onChange={(e) => onDataChange("introduction", e.target.value)}
                                placeholder="자기소개는 필수 입력 입니다."
                                className={`flex flex-col items-start gap-[10px] shrink-0 w-full h-[140px] lg:h-[180px] px-[15px] py-[20px]
                                bg-transparent rounded-[10px] border-[#D9D5CE] border placeholder:text-[#D9D5CE] text-[#342F28]
                                outline-none resize-none font-pretendard text-[12px] md:text-[16px]
                                ${isEditing ? "cursor-text" : "cursor-default"}`}
                            />
                            {canEdit && (
                                <div className="absolute bottom-3 right-4 flex items-center">
                                    <span className={`font-pretendard text-[12px] font-medium 
                                    ${(data.introduction?.length || 0) >= 500 ? "text-red-500" : "text-[#978B78]"}`}>
                                        {(data.introduction?.length || 0)}
                                    </span>
                                    <span className="font-pretendard text-[12px] font-medium text-[#C2BBB0]">
                                        /500
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ProfileDetails