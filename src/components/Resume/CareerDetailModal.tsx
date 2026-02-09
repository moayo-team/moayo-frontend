import { useEffect, useMemo, useState } from "react";
import PublicToggle from "./PublicToggle";
import { useUploadManager, type LinkItem } from "../../hooks/useUploadManager";
import { FileText, X } from "lucide-react";
import type { AttachedFile, Career, UpdateExperienceRequest } from "../../types/career";
import { formatPeriod, getEndDateFromPeriod, getStartDateFromPeriod } from "../../utils/format";
import { useExperienceDetail, useExperienceFiles, useExperienceLinks, usePublicExperienceDetailQuery, usePublicExperienceFiles, usePublicExperienceLinks, usePublicExperiences } from "../../hooks/useProfileQueries";
import { useExperienceDelete, useExperienceFileAttach, useExperienceLinkDelete, useExperienceUpdate } from "../../hooks/useProfileMutation";
import { deleteProfileDocument, uploadProfileDocument } from "../../api/profile/profile";
import { useQueryClient } from "@tanstack/react-query";
import { addExperienceLink, deleteExperienceFile, getPublicExperiences, postExperienceFile, updateExperienceLink } from "../../api/profile/experiences";
import type { ProfileDocument } from "../../types/profile";

interface CarrerDetailModalProps {
    onClose: () => void;
    data: any; // 카드로부터 전달받은 상세 데이터
    onDelete?: (id: string | number) => void; //삭제 콜백
    onSave?: (updatedData: any) => void; // 저장 콜백
    documents?: ProfileDocument[];
    isReadOnly?: boolean;
    isMyProfile?: boolean;
}
const CarrerDetailModal = ({ data: initialData, onClose, onDelete, onSave, documents, isReadOnly = false, isMyProfile = true }: CarrerDetailModalProps) => {
    const queryClient = useQueryClient();

    //내 프로필용 상세 조회
    const { data: myDetailRes, isLoading: myDetailLoading } = useExperienceDetail(
        isMyProfile ? initialData?.id : null
    );
    const { data: myFilesRes } = useExperienceFiles(
        isMyProfile ? initialData?.id : null
    );
    const { data: myLinksRes } = useExperienceLinks(
        isMyProfile ? initialData?.id : null
    );


    //  타인 프로필용 공개 상세 조회
    const { data: publicDetailRes, isLoading: publicDetailLoading } = usePublicExperienceDetailQuery(
        !isMyProfile ? initialData?.id : null
    );
    const publicFilesQuery = usePublicExperienceFiles(
        !isMyProfile ? initialData?.id : null,
        !isMyProfile
    );
    const publicLinksQuery = usePublicExperienceLinks(
        !isMyProfile ? initialData?.id : null,
        !isMyProfile
    );

    //  조건부로 데이터 선택
    const filesRes = useMemo(() => {
        if (isMyProfile) return myFilesRes;

        return publicFilesQuery.data?.map((f: any) => ({
            fileId: f.fileId,
            fileName: f.fileName
        })) || [];
    }, [isMyProfile, myFilesRes, publicFilesQuery.data]);

    const linksRes = useMemo(() => {
        if (isMyProfile) return myLinksRes;

        return publicLinksQuery.data?.map((l: any) => ({
            linkId: l.linkId,
            url: l.url
        })) || [];
    }, [isMyProfile, myLinksRes, publicLinksQuery.data]);

    //  상세 정보 (타인 이력은 initialData 사용)
    const serverData = useMemo(() => {
        if (isMyProfile) return myDetailRes?.result;
        return publicDetailRes?.result;
    }, [isMyProfile, myDetailRes, publicDetailRes]);

    //수정용
    const { mutate: deleteExp } = useExperienceDelete();
    const { mutateAsync: updateExp } = useExperienceUpdate();
    const { mutateAsync: attachFile } = useExperienceFileAttach();
    const { mutateAsync: deleteLink } = useExperienceLinkDelete();

    const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [filesToDelete, setFilesToDelete] = useState<number[]>([]);
    const [linksToDelete, setLinksToDelete] = useState<number[]>([]);

    {/**기본 정보 폼 상태 */ }
    const [formData, setFormData] = useState({
        title: initialData?.title ?? "",
        organizer: initialData?.organizer ?? "",
        period: initialData?.period ?? "",
        participation: initialData?.participation ?? "",
        role: initialData?.role ?? "",
        intro: initialData?.intro ?? "",
    });

    const {
        selectedFiles, setSelectedFiles, handleFileUpload, removeFile,
        links, setLinks, linkInput, setLinkInput, addLink, removeLink,
        fileInputRef, handleFileDownload
    } = useUploadManager({
        maxFiles: 3,
    });

    {/**외부에서 받은 데이터(텍스트) 로컬 state에 동기화 */ }
    useEffect(() => {
        const currentData = serverData || initialData;
        if (currentData) {
            const safeStart = currentData.startDate?.replace(/-/g, ".") || "";
            const safeEnd = currentData.endDate?.replace(/-/g, ".") || "";

            const period = safeStart
                ? `${safeStart} - ${safeEnd}`
                : (safeEnd ? `- ${safeEnd}` : "");

            setFormData({
                title: currentData.title || currentData.organization || "",
                organizer: currentData.organization || currentData.organizer || "",
                period: period,
                participation: currentData.activity || currentData.participation || "",
                role: currentData.role || "",
                intro: currentData.summary || currentData.intro || "",
            });
            setIsPublic(currentData.visible ?? true);
        }
    }, [serverData, initialData]);

    // 서버 데이터 동기화 (파일 목록)
    useEffect(() => {
        if (Array.isArray(filesRes)) {
            console.log("📥 서버에서 받은 파일 목록:", filesRes);

            const mappedFiles: AttachedFile[] = filesRes
                .filter((f: any) => !filesToDelete.includes(Number(f.fileId)))
                .map((f: any) => {
                    const matchedDoc = documents?.find(doc => doc.id === f.fileId);
                    return {
                        id: f.fileId,
                        name: f.fileName,
                        url: matchedDoc?.fileUrl,
                        type: 'file'
                    };
                });
            setSelectedFiles(prev => {
                if (!isMyProfile) return mappedFiles;

                const newFilesOnly = prev.filter(f => !f.id);
                return [...mappedFiles, ...newFilesOnly];
            });
        }
    }, [filesRes, filesToDelete, documents, setSelectedFiles, isMyProfile]);

    // 서버 데이터 동기화(링크)
    useEffect(() => {
        if (Array.isArray(linksRes)) {
            console.log("🔗 서버에서 받은 링크 목록:", linksRes);
            const activeLinks = linksRes.filter(l => !linksToDelete.includes(Number(l.linkId)));
            setLinks(activeLinks);
        }
    }, [linksRes, linksToDelete, setLinks]);


    const handleFileClick = (file: AttachedFile) => {
        if (isEditMode) return;

        // 새로 업로드한 파일 (File 객체)
        if (isMyProfile && !isReadOnly && file.fileObj) {
            const url = URL.createObjectURL(file.fileObj);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            return;
        }
        const targetFileId = file.id || (file as any).fileId;

        // 서버 파일 - documents에서 URL 찾기
        if (targetFileId && documents) {
            const matchedDoc = documents.find(doc => doc.id === file.id);
            if (matchedDoc?.fileUrl) {
                const fullUrl = matchedDoc.fileUrl.startsWith('/')
                    ? `${import.meta.env.VITE_API_BASE_URL}${matchedDoc.fileUrl}`
                    : matchedDoc.fileUrl;
                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                return;
            }
        }

        alert("파일 다운로드 경로를 찾을 수 없습니다.");
    };

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
    const handleSave = async () => {
        if (isSaving) return;

        try {
            setIsSaving(true);

            // 링크 삭제 
            if (linksToDelete.length > 0) {
                await Promise.all(
                    linksToDelete.map(linkId =>
                        deleteLink({ experienceId: initialData.id, linkId })
                    )
                );
                setLinksToDelete([]);
            }

            if (filesToDelete.length > 0) {
                const uniqueIdsToDelete = Array.from(new Set(filesToDelete));

                console.log("🗑️ 삭제 시도 ID 목록:", uniqueIdsToDelete);

                await Promise.all(
                    uniqueIdsToDelete.map(async (fileId) => {
                        try {
                            // 이력과 파일 연결 끊기
                            await deleteExperienceFile(initialData.id, fileId);

                            //  원본 파일 삭제
                            await deleteProfileDocument(fileId);
                        } catch (error: any) {
                            if (error.response?.status === 404) {
                                console.warn(`⚠️ 파일 ${fileId}이 이미 없습니다.`);
                                return;
                            }
                            throw error;
                        }
                    })
                );
                setFilesToDelete([]);
            }

            //신규 파일 업로드
            const newFilesToUpload = selectedFiles.filter(file => file.fileObj && !file.id);

            if (newFilesToUpload.length > 0) {
                const uploadResults = await Promise.all(
                    newFilesToUpload.map(f => uploadProfileDocument(f.fileObj!))
                );

                const attachPromises = uploadResults.map((res, idx) => {
                    if (res.isSuccess) {
                        return postExperienceFile(initialData.id, {
                            fileId: res.result.id, // 업로드 API에서 받은 id
                            fileName: newFilesToUpload[idx].name // 원본 파일 이름
                        });
                    }
                    return Promise.resolve();
                });
                await Promise.all(attachPromises);
            }

            //이력 생성/수정
            await Promise.all(links.map(async (link: LinkItem) => {
                const linkData = { title: "이력 첨부 링크", url: link.url };
                if (link.linkId) {
                    return updateExperienceLink(initialData.id, link.linkId, linkData);
                } else {
                    return addExperienceLink(initialData.id, linkData);
                }
            }));

            // 이력 텍스트 정보 업데이트
            const start = getStartDateFromPeriod(formData.period);
            const end = getEndDateFromPeriod(formData.period);

            const requestBody: UpdateExperienceRequest = {
                title: formData.title,
                organization: formData.organizer,
                startDate: start,
                endDate: end || start,
                activity: formData.participation,
                role: formData.role,
                summary: formData.intro,
            };

            await updateExp({
                id: initialData.id,
                formData: requestBody,
                visible: isPublic
            });

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["myExperiences"] }),
                queryClient.invalidateQueries({ queryKey: ["experienceDetail", initialData.id] }),
                queryClient.invalidateQueries({ queryKey: ["experienceFiles", initialData.id] }),
                queryClient.invalidateQueries({ queryKey: ["experienceLinks", initialData.id] })
            ]);

            await new Promise(resolve => setTimeout(resolve, 150));
            alert("모든 변경사항이 저장되었습니다.");

            setIsEditMode(false);
            if (onSave) onSave({ ...initialData, ...formData, visible: isPublic });
            onClose();
        } catch (error) {
            console.error("통합 저장 중 오류:", error);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    // 파일 업로드 핸들러 
    const handleMultipleFileUpload = async (files: FileList) => {
        const fileArray = Array.from(files);

        if (selectedFiles.length + fileArray.length > 3) {
            alert("파일은 최대 3개까지 첨부 가능합니다.");
            return;
        }

        //  UI에만 추가
        const newUploadedFiles = fileArray.map(file => ({
            name: file.name,
            fileObj: file,
            type: 'file'
        }));

        setSelectedFiles(prev => [...prev, ...newUploadedFiles]);
    };

    /** 이력 파일 삭제  핸들러 */
    const handleFileRemove = (index: number) => {
        const targetFile = selectedFiles[index];

        if (targetFile.id) {
            setFilesToDelete(prev => [...prev, Number(targetFile.id)]);
        }

        // UI에서 즉시 제거
        removeFile(index);
    };

    /**이력 링크 삭제 핸들러 */
    const handleLinkRemove = (index: number) => {
        const targetLink = links[index];

        // 서버에서 불러온 링크(linkId가 있음)인 경우 삭제 대기 목록에 추가
        if (targetLink.linkId) {
            setLinksToDelete(prev => [...prev, Number(targetLink.linkId)]);
        }

        // UI에서 즉시 제거
        removeLink(index);
    };

    /**이력 삭제 핸들러 */
    const handleDeleteExperience = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            const allLinkIds = links
                .map(l => l.linkId)
                .filter((id): id is number => typeof id === 'number');

            const allFileIds = selectedFiles
                .map(f => f.id)
                .filter((id): id is number => typeof id === 'number');

            // 파일,링크 삭제
            await Promise.all([
                ...allLinkIds.map(linkId => deleteLink({ experienceId: initialData.id, linkId })
                ),
                ...allFileIds.map(async (fileId) => {
                    try {
                        await deleteExperienceFile(initialData.id, fileId);
                        await deleteProfileDocument(fileId);
                    } catch (error: any) {
                        if (error.response?.status !== 404) throw error;
                    }
                })
            ]);

            // 이력 삭제 API 실행
            deleteExp(initialData.id, {
                onSuccess: () => {
                    console.log("✅ 이력 및 원본 파일 삭제 완료");
                    if (onDelete) onDelete(initialData.id);
                    onClose();
                }
            });
        } catch (err) {
            console.error("삭제 중 오류:", err);
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
            handleFileUpload(e.dataTransfer.files);
        }
    };

    if (isMyProfile && myDetailLoading) return null;

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
                                {isReadOnly ? "이력 상세" : "이력 관리"}
                            </span>

                            {!isReadOnly && (
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
                            )}
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
                            <div className="flex flex-col gap-[8px] min-h-[60px]">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        onClick={() => !isEditMode && handleFileClick(file)}
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFileRemove(index);
                                                }}
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
                                            onChange={(e) => {
                                                if (e.target.files) handleMultipleFileUpload(e.target.files);
                                            }}
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
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={link.url}
                                                    onChange={(e) => {
                                                        const newLinks = [...links];
                                                        newLinks[index] = { ...newLinks[index], url: e.target.value };
                                                        setLinks(newLinks);
                                                    }}
                                                    placeholder="링크를 첨부해주세요. (포트폴리오, 깃허브)"
                                                    className="flex-1 bg-transparent outline-none
                                                    text-[14px] font-pretendard text-[#25221D] font-medium leading-[140%]"
                                                />
                                            ) : (
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="max-w-[90%] text-[14px] font-pretendard text-[#25221D] font-medium leading-[140%] 
                                                    outline-noneunderline [text-decoration-skip-ink:auto] underline-offset-auto [text-underline-position:from-font]"
                                                >
                                                    {link.url}
                                                </a>
                                            )}
                                            {isEditMode && (
                                                <X
                                                    size={18}
                                                    className="text-[#7C7160] hover:text-[#1BA07A] cursor-pointer"
                                                    onClick={() => handleLinkRemove(index)}
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
                    {!isReadOnly && (
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
                                        onClick={handleDeleteExperience}>
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
                    )}
                    {isReadOnly && (
                        <div className="flex justify-end mt-8 mb-10 mr-10">
                            <button onClick={onClose} className="px-8 py-3 bg-[#EFEEEB] text-[#5F5749] rounded-[10px] font-medium">
                                닫기
                            </button>
                        </div>
                    )}
                </div>

            </div >
        </>
    )
}

export default CarrerDetailModal
