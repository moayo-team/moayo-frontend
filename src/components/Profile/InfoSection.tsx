import eduIcon from "../../assets/nimbus_university.svg"
import publicIcon from "../../assets/eye.svg"
import linkIcon from "../../assets/Link.svg"
import attachIcon from "../../assets/attach_file.svg"
import fileIcon from "../../assets/File.svg"
import delIcon from "../../assets/X.svg"
import editIcon from "../../assets/Edit2.svg";
import plusIcon from "../../assets/Plus.svg"
import addFileIcon from "../../assets/File text.svg"
import { useRef } from "react";
import InterestTags from "./InterestTags"


interface InfoProps {
    isEditing: boolean;
    data: any;
    onDataChange: (field: string, value: any) => void;
}

const InfoSection = ({ isEditing, data, onDataChange }: InfoProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const fixedContacts = [
        { label: "이메일", key: "email", value: data.contact.email },
        { label: "연락처", key: "phone", value: data.contact.phone },
        { label: "카톡 ID", key: "kakaoId", value: data.contact.kakaoId },
    ];

    // 저장되어 있는 연락처 변경 함수
    const handleFixedContactChange = (key: string, value: string) => {
        onDataChange("contact", { ...data.contact, [key]: value });
    };

    // 추가된 커스텀 연락처 변경 함수
    const handleCustomContactChange = (index: number, field: "label" | "value", newValue: string) => {
        const updatedCustom = [...(data.contact.custom || [])];
        updatedCustom[index] = { ...updatedCustom[index], [field]: newValue };
        onDataChange("contact", { ...data.contact, custom: updatedCustom });
    };

    // 새 연락처 세트 추가 함수
    const handleAddContact = () => {
        const currentCustom = data.contact.custom || [];
        onDataChange("contact", {
            ...data.contact,
            custom: [...currentCustom, { label: "", value: "" }]
        });
    };

    // 추가된 학력  
    const handleAddEdu = () => {
        const newEdu = {
            id: Date.now(),
            period: "",
            school: "",
            major: "",
            subMajor: "",
            isVerified: false,
            isNew: true
        };
        onDataChange("education", [...data.education, newEdu]);
    };

    // 학력 삭제
    const handleRemoveEdu = (targetId: number) => {
        const updatedEdu = data.education.filter((edu: any) => edu.id !== targetId);
        onDataChange("education", updatedEdu);
    };

    const handleEduChange = (index: number, field: string, value: string) => {
        const updatedEdu = [...data.education];
        updatedEdu[index] = { ...updatedEdu[index], [field]: value };
        onDataChange("education", updatedEdu);
    };

    //학력 저장
    const handleSaveEdu = (index: number) => {
        const updatedEdu = [...data.education];
        updatedEdu[index] = { ...updatedEdu[index], isNew: false };
        onDataChange("education", updatedEdu);
    };

    //추가된 추가정보 
    const handleAddAdditionalInfo = () => {
        const newInfo = {
            id: Date.now(),
            type: "file",
            title: "",
            description: "",
            link: "",
            isNew: true
        };
        onDataChange("additionalInfo", [...data.additionalInfo, newInfo]);
    };

    // 추가정보 삭제 
    const handleRemoveAdditionalInfo = (targetId: number) => {
        const updatedInfo = data.additionalInfo.filter((info: any) => info.id !== targetId);
        onDataChange("additionalInfo", updatedInfo);
    };
    //추가정보 저장
    const handleSaveAdditionalInfo = (index: number) => {
        const updatedInfo = [...data.additionalInfo];
        updatedInfo[index] = { ...updatedInfo[index], isNew: false };
        onDataChange("additionalInfo", updatedInfo);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) processFiles(e.target.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
    };

    // 공통 파일 처리 로직 (상태 관리 등에 연결)
    const processFiles = (files: FileList) => {
        const fileArray = Array.from(files);
        console.log("선택된 파일들:", fileArray);
        
        const newItems = fileArray.map((file) => ({
        id: Date.now() + Math.random(), 
        type: "file",
        title: file.name, 
        description: `${(file.size / 1024).toFixed(1)} KB`, 
        link: URL.createObjectURL(file), // 미리보기나 다운로드를 위한 임시 URL
        isNew: false 
        }));

        onDataChange("additionalInfo", [...data.additionalInfo, ...newItems]);
    };

    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    //태그 삭제 함수
    const handleRemoveTag = (tagId: number) => {
    const updatedTags = data.tags.filter((tag: any) => tag.id !== tagId);
    onDataChange("tags", updatedTags);
    };


    return (
        <div className="flex flex-col gap-[78px]">
            <div className="flex flex-col w-[958px] items-start gap-[37px]">
                {/**연락 정보*/}
                <div className="flex flex-col gap-[19px] self-stretch">
                    {/**기존 정보 */}
                    {fixedContacts.map((contact) => (
                        <div key={contact.key} className="flex h-[74px] items-center self-stretch gap-[12px]">
                            <div className="flex w-[95px] px-[40px] py-[10px] gap-[10px] self-stretch justify-center items-center
                                rounded-l-[10px] bg-[#E9FCF7] whitespace-nowrap
                                font-pretendard text-[24px] font-medium leading-[130%] text-[#58575B]">
                                {contact.label}
                            </div>

                            <div className="relative flex px-[30px] py-[10px] items-center gap-[10px] flex-1 self-stretch
                                    rounded-r-[10px] border border-[#D6D6D8] ">
                                <input
                                    readOnly={!isEditing}
                                    className={`flex flex-col justify-center flex-1 self-stretch
                                        font-pretendard text-[24px] font-medium leading-[130%] text-[#444446]
                                        ${isEditing ? "bg-white border-[#26E1AC]" : "bg-transparent"} // 편집 중일 때 테두리 강조
                                        outline-none w-full`}
                                    value={contact.value}
                                    onChange={(e) => handleFixedContactChange(contact.key, e.target.value)}
                                />
                                {isEditing && (
                                    <img
                                        src={editIcon}
                                        alt="수정"
                                        className="absolute right-[20px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] opacity-40 pointer-events-none"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    {/**추가 연락 정보 */}
                    {data.contact.custom?.map((contact: any, index: number) => (
                        <div key={`custom-${index}`} className="flex h-[74px] items-center self-stretch gap-[12px]">
                            <input
                                placeholder=""
                                className="flex w-[95px] px-[40px] py-[10px] gap-[10px] self-stretch justify-center items-center
                                    rounded-l-[10px] bg-[#E9FCF7] whitespace-nowrap
                                    font-pretendard text-[24px] font-medium leading-[130%] text-[#58575B]"
                                value={contact.label}
                            />
                            <div className="relative flex px-[30px] py-[10px] items-center gap-[10px] flex-1 self-stretch
                                    rounded-r-[10px] border border-[#D6D6D8]">
                                <input
                                    className="flex flex-col justify-center flex-1 self-stretch
                                        font-pretendard text-[24px] font-medium leading-[130%] text-[#444446] outline-none"
                                    placeholder="내용을 입력하세요"
                                    value={contact.value}
                                    onChange={(e) => handleCustomContactChange(index, "value", e.target.value)}
                                />
                                <img
                                    src={editIcon}
                                    alt="수정"
                                    className="absolute right-[20px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] opacity-40 pointer-events-none"
                                />
                            </div>
                        </div>
                    ))}

                    {/** 플러스 버튼*/}
                    {isEditing && (
                        <button
                            onClick={handleAddContact}
                            className="flex h-[54px] w-full items-center justify-center rounded-[10px] bg-[#F2F2F2] 
                            font-pretendard text-[20px] text-[#A7A7AA] cursor-pointer 
                            "
                        >
                            <img
                                src={plusIcon}
                                alt="추가"
                                className="text-[#C3C2C5] w-[24px] h-[24px] aspect-square" />
                        </button>
                    )}
                </div>

                {/**한줄소개 */}
                <div className="flex flex-col h-[160px] p-[25px] items-start gap-[20px] self-stretch relative
                    rounded-[10px] border border-[#D6D6D8]"
                >
                    <span className="font-pretendard text-[24px] font-semibold leading-[130%] text-[#58575B]">
                        한 줄 소개
                    </span>
                    <textarea
                        readOnly={!isEditing}
                        className="font-pretendard text-[18px] font-normal leading-[150%] text-[#444446]
                        outline-none w-full bg-transparent resize-none"
                        value={data.introduction}
                        onChange={(e) => onDataChange("introduction", e.target.value)}
                    />

                    {isEditing && (
                        <img
                            src={editIcon}
                            alt="수정"
                            className="absolute top-[25px] right-[25px] w-[16.524px] h-[16.524px;] 
                            text-[#C3C2C5] opacity-40 pointer-events-none"
                        />
                    )}
                </div>
            </div>

            {/**학력 */}
            <div className="flex w-[963px] flex-col gap-[18px] items-start">
                <div className="flex items-center gap-[10px]">
                    <span className="font-pretendard text-[32px] font-semibold leading-[130%] tracking-[-0.01em]">
                        학력
                    </span>
                    <img
                        src={publicIcon}
                        alt="공개"
                        width={36}
                        height={36}
                    />
                </div>

                <div className="flex flex-col items-start justify-center gap-[32px] self-stretch">
                    {data.education.map((edu: any, index: number) => (
                        <div
                            key={edu.id || index}
                            className="flex flex-col w-[963px] items-start gap[10px] px-[33px] py-[31px]
                            border rounded-[10px] border-[#D6D6D8] relative"
                        >
                            <div className="flex flex-col justify-center items-start gap-[8px] self-stretch">
                                {/*기간 및 인증 뱃지 */}
                                <div className="flex justify-between items-center self-stretch">
                                    <div className="flex items-center gap-[15px]">
                                        <img
                                            src={eduIcon}
                                        />
                                        {isEditing && edu.isNew ? (
                                            <input
                                                className="text-[18px] font-pretendard font-medium leading-[150%] text-[#444446] border-[#D6D6D8] outline-none"
                                                value={edu.period || ""}
                                                onChange={(e) => handleEduChange(index, "period", e.target.value)}
                                            />
                                        ) : (
                                            <span className="text-[18px] font-pretendard font-medium leading-[150%] text-[#A7A7AA]">
                                                ({edu.period})
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-[11px]">
                                        {edu.isVerified && (
                                            <div className="flex items-center gap-[3px] p-[3px] 
                                                bg-[#E9FCF7] rounded-[10px]">
                                                <img
                                                    src={attachIcon}
                                                    alt="인증완료"
                                                    className="w-[24px] h-[24px] aspect-square"
                                                />
                                                <span className="text-[12px] text-[#1BA07A] font-medium font-pretendard leading-[150%] tracking-[-0.01em]">
                                                    학력인증 완료
                                                </span>
                                            </div>
                                        )}

                                        {isEditing && (
                                            <button
                                                onClick={() => handleRemoveEdu(edu.id)}
                                                className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                <img src={delIcon} alt="삭제" className="w-[24px] h-[24px]" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* 학교 및 전공 */}
                                <div className="flex flex-col w-full gap-[3px] items-start">
                                    {isEditing && edu.isNew ? (
                                        <>
                                            <input
                                                className="w-full text-[24px] font-pretendard font-medium leading-[130%] text-[#444446] outline-none "
                                                value={edu.school}
                                                onChange={(e) => handleEduChange(index, "school", e.target.value)}
                                                placeholder="학교명을 입력해주세요"
                                            />
                                            <input
                                                className="w-full text-[24px] font-pretendard font-medium leading-[130%] text-[#444446] outline-none"
                                                value={edu.major}
                                                onChange={(e) => handleEduChange(index, "major", e.target.value)}
                                                placeholder="전공을 입력해주세요"
                                            />
                                            <div className="w-full flex flex-col justify-center items-end self-stretch gap-[3px]">
                                                <input
                                                    className="w-full text-[20px] font-pretendard font-medium text-[#7C7B80] outline-none"
                                                    value={edu.subMajor || ""}
                                                    onChange={(e) => handleEduChange(index, "subMajor", e.target.value)}
                                                    placeholder="ㄴ 복수전공이 있다면 입력해주세요."
                                                />
                                                {/* 저장 버튼*/}
                                                <button
                                                    onClick={() => handleSaveEdu(index)}
                                                    className="flex justify-center items-center  gap-[10px]  w-[143px] p-[15px]
                                                                    rounded-[10px] bg-[#6EEBC7] 
                                                                    font-pretendard text-[20px] font-medium leading-[140%] text-[#343436]"
                                                >
                                                    저장
                                                </button>
                                            </div>

                                        </>
                                    ) : (
                                        /* 저장 완료 후 또는 기존 데이터 */
                                        <>
                                            <p className="self-stretch text-[24px] font-pretendard font-medium leading-[130%] text-[#343436]">
                                                {edu.school}
                                            </p>
                                            <p className="self-stretch font-pretendard text-[20px] font-medium leading-[140%] text-[#343436]">
                                                {edu.major}
                                            </p>
                                            {edu.subMajor && (
                                                <div className="flex w-full items-start gap-[4px]">
                                                    <span className="text-[20px] font-pretendard font-medium text-[#7C7B80] leading-[140%]">ㄴ</span>
                                                    <p className="text-[20px] font-pretendard font-medium text-[#7C7B80] leading-[140%]">
                                                        {edu.subMajor}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isEditing && (
                        <button
                            onClick={handleAddEdu}
                            className="flex h-[54px] w-full items-center justify-center rounded-[10px] bg-[#F2F2F2] 
                            font-pretendard text-[20px] text-[#A7A7AA] cursor-pointer 
                            "
                        >
                            <img
                                src={plusIcon}
                                alt="추가"
                                className="text-[#C3C2C5] w-[24px] h-[24px] aspect-square" />
                        </button>
                    )}
                </div>
            </div>


            {/**추가정보 */}
            <div className="flex flex-col items-start gap-[18px] w-[963px]">
                <div className="flex items-center gap-[10px]">
                    <span className="font-pretendard text-[32px] font-semibold leading-[130%] tracking-[-0.01em]">
                        추가정보
                    </span>
                    <img
                        src={publicIcon}
                        alt="공개"
                        width={36}
                        height={36}
                    />
                </div>

                <div className="flex flex-col gap-[33px] self-stretch items-start">
                    {data.additionalInfo.map((info: any, index: number) => (
                        <div
                            key={info.id || index}
                            className="flex items-center justify-center gap-[10px] self-stretch
                            border border-[#D6D6D8] rounded-[10px] p-[20px]"
                        >
                            <div className="flex w-[963px] flex-col gap-[8px] items-start">
                                {isEditing && info.isNew ? (
                                    <>
                                        <div className="flex w-[898px] gap-[28px] flex-col items-end">
                                            <div className="flex flex-col gap-[16px] self-stretch items-center">
                                                <div className="flex justify-between items-center self-stretch">
                                                    <img
                                                        src={fileIcon}
                                                        className="w-[24px] h-[24px] text-[#A7A7AA]"
                                                    />
                                                </div>
                                                <div className="flex flex-col items-start gap-[10px] self-stretch">
                                                    <input
                                                        className="w-full outline-none
                                                                font-pretendard text-[24px] font-medium leading-[130%] text-[#444446]"
                                                        placeholder="입력하고 싶은 정보를 입력해주세요."
                                                    />
                                                    <div className="flex items-center gap-[12px] self-stretch">
                                                        {["포트폴리오", "깃허브", "블로그", "기타"].map((typeName) => (
                                                            <button
                                                                key={typeName}
                                                                onClick={() => {
                                                                    const updatedInfo = [...data.additionalInfo];
                                                                    updatedInfo[index].type = typeName;
                                                                    onDataChange("additionalInfo", updatedInfo);
                                                                }}
                                                                className={`flex w-[127px] h-[51px] px-[10px] py-[3px] justify-center items-center gap-[5px]
                                                                    border rounded-[10px] 
                                                                    font-pretendard text-[18px] font-normal leading-[150%] text-[#343436] text-center
                                                                        ${info.type === typeName
                                                                        ? "bg-[#6EEBC7] text-[#343436] border-[#6EEBC7]" // 선택됨
                                                                        : "bg-[#F2F2F2] text-[#A7A7AA] border-[#969599]"    // 선택 안됨
                                                                    }`}
                                                            >
                                                                {typeName}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        {/* 파일 첨부 */}
                                                        <div className="flex flex-col items-center w-[898px] h-[102px] px-[159px] py-[24px] gap-[10px] justify-center
                                                            border border-[#D6D6D8] rounded-[30px] bg-white">
                                                            <input
                                                                type="file"
                                                                ref={fileInputRef}
                                                                onChange={handleFileChange}
                                                                className="hidden"
                                                                multiple 
                                                            />
                                                            <div
                                                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}                                                                 
                                                                onDrop={handleDrop}
                                                                onClick={() => fileInputRef.current?.click()}
                                                                className="flex items-center h-[102px] px-[159px] py-[24px]"
                                                            >
                                                                <div className="flex items-center justify-center gap-[10px] pointer-events-none">
                                                                    <img 
                                                                        src={addFileIcon}
                                                                        className="w-[40px] h-[40px] text-[#969599]" 
                                                                    />
                                                                    <div className="flex flex-col gap-[4px] px-[10px] py-[5px] justify-center items-center">
                                                                        <span className={`text-[20px] font-medium font-pretendard text-[#969599] leading-[140%]`}>
                                                                            파일을 첨부해주세요
                                                                        </span>
                                                                        <span className="text-[14px] text-[#969599] font-pretendard font-normal leading-[140%]">
                                                                            (증빙서류, 포트폴리오, Github)
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* 저장 버튼 */}
                                            <button
                                                onClick={() => handleSaveAdditionalInfo(index)}
                                                className="flex justify-center items-center  gap-[10px]  w-[143px] p-[15px]
                                                                rounded-[10px] bg-[#6EEBC7] 
                                                                font-pretendard text-[20px] font-medium leading-[140%] text-[#343436]"
                                            >
                                                저장
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    /* 저장 완료 및 기존 정보 */
                                    <>
                                        {/* 아이콘 영역 */}
                                        <div className="flex justify-between items-center self-stretch ">
                                            {info.type === "file" ? (
                                                <img
                                                    src={fileIcon}
                                                    alt="file"
                                                    className="w-[24px] h-[24px]"
                                                />
                                            ) : (
                                                <img
                                                    src={linkIcon}
                                                    alt="link"
                                                    className="w-[24px] h-[24px]"
                                                />
                                            )}
                                            <div className="flex items-center gap-[11px]">
                                                <div className="flex items-center gap-[3px] p-[5px]">
                                                    <a 
                                                        href={info.link} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-[3px] p-[3px] 
                                                        bg-[#E9FCF7] rounded-[10px]
                                                        text-[12px] font-pretendard font-medium leading-[150%] text-[#1BA07A] tracking-[-0.01em]">
                                                        <img
                                                            src={attachIcon}
                                                            alt="바로가기"
                                                            className="w-[24px] h-[24px] aspect-square"
                                                        />
                                                        {info.type === "file" ? "첨부파일 확인" : "첨부링크 확인"}
                                                    </a>
                                                </div>
                                                {/* 입력 중일 때 우측 상단 삭제 버튼 */}
                                                <button
                                                    onClick={() => handleRemoveAdditionalInfo(info.id)}
                                                    className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <img src={delIcon} alt="삭제" className="w-[24px] h-[24px]" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* 텍스트 영역 */}
                                        <div className="flex flex-col gap-[3px] items-start self-stretch">
                                            <p className="font-pretendard text-[24px] font-semibold leading-[130%] text-[#343436]">
                                                {info.title}
                                            </p>
                                            {info.description && (
                                                <p className="font-pretendard text-[20px] font-semibold leading-[140%] text-[#343436]">
                                                    {info.description}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* 플러스 버튼 (편집 모드일 때만) */}
                    {isEditing && (
                        <button
                            onClick={handleAddAdditionalInfo}
                            className="flex h-[48px] w-full items-center justify-center 
                            border border-[#D6D6D8] rounded-[10px] bg-[#F2F2F2] cursor-pointer"
                        >
                            <img src={plusIcon} alt="추가" className="w-[24px] h-[24px] aspect-squaref" />
                        </button>
                    )}
                </div>
            </div>


            {/**관심사 태그 */}
            <div className="flex flex-col items-start gap-[20px] w-[963px]">
                <p className="font-pretendard text-[24px] font-semibold leading-[130%]">관심사 태그</p>
                <InterestTags interests={data.tags.map((tag: any) => ({
                    id: tag.id,
                    name: tag.title,
                    selected: true
                }))}
                   isEditing={isEditing} 
                    onTagClick={(tagId: number) => {
                        if (isEditing) handleRemoveTag(tagId);
                    }}/>
            </div>
        </div>
    )
}

export default InfoSection