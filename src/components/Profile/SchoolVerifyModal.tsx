import { X, FileText, Loader2 } from "lucide-react";
import { useUploadManager } from "../../hooks/useUploadManager";
import { deleteProfileDocument, getProfileDocuments, uploadProfileDocument } from "../../api/profile/profile";
import { useEffect, useState } from "react";
import type { ProfileDocument } from "../../types/profile";
import { getExperienceFiles } from "../../api/profile/experiences";

interface ModalProps {
    isOpen: boolean;
    isEditing: boolean;
    onClose: () => void;
    onComplete: (files: File[]) => void;
    currentProfileImage?: string;
    experienceIds: number[];
}

const SchoolVerifyModal = ({ isOpen, isEditing, onClose, onComplete, currentProfileImage, experienceIds }: ModalProps) => {
    const {
        selectedFiles,
        handleFileUpload,
        removeFile,
        fileInputRef,
        setSelectedFiles
    } = useUploadManager({ maxFiles: 3 });

    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedDocuments, setUploadedDocuments] = useState<ProfileDocument[]>([]);

    // ✅ [추가] 파일 선택 시 전체 개수를 체크하는 래퍼 함수
    const handleFileSelection = (files: FileList | null) => {
        if (!files) return;

        const totalCount = uploadedDocuments.length + selectedFiles.length + files.length;

        if (totalCount > 3) {
            alert("증빙 서류는 이미 등록된 파일을 포함하여 최대 3개까지만 가능합니다.");
            return;
        }

        handleFileUpload(files);
    };

    // 목록 조회 
    const fetchDocuments = async () => {
        try {
            // 1. 전체 문서 가져오기
            const response = await getProfileDocuments();

            if (response.isSuccess) {
                // 2. [핵심] 모든 이력서에 연결된 파일 ID들 수집하기
                // 모든 이력서 ID에 대해 병렬로 파일 목록 조회
                const expFilesResults = await Promise.all(
                    experienceIds.map(id => getExperienceFiles(id))
                );

                // 이력서 파일 ID들만 모아서 Set으로 만듦
                const expFileIds = new Set(
                    expFilesResults.flatMap(res => res.result?.map(f => f.fileId) || [])
                );

                // 3. 필터링 (프사 제외 + 이력서 파일 제외)
                const onlyVerifyDocs = response.result.filter((doc: ProfileDocument) => {
                    const isNotProfileImg = doc.fileUrl !== currentProfileImage;
                    const isNotExpFile = !expFileIds.has(doc.id);
                    return isNotProfileImg && isNotExpFile;
                });

                setUploadedDocuments(onlyVerifyDocs);
            }
        } catch (error) {
            console.error("서류 조회 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchDocuments();
    }, [isOpen]);

    // 서버 파일 삭제
    const handleDeleteServerFile = async (documentId: number) => {

        try {
            const response = await deleteProfileDocument(documentId);
            if (response.isSuccess) {
                const updatedDocs = uploadedDocuments.filter(doc => doc.id !== documentId);
                setUploadedDocuments(updatedDocs);
                alert("파일이 삭제되었습니다.");
            }
        } catch (error) {
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 신규 파일 업로드
    const handleSubmit = async () => {
        if (selectedFiles.length === 0) return;
        // ✅ [체크 강화] 등록 버튼 누를 때 다시 한 번 최종 확인
        if (uploadedDocuments.length + selectedFiles.length > 3) {
            alert("이미 등록된 서류를 포함하여 최대 3개까지만 유지할 수 있습니다. 기존 파일을 삭제해 주세요.");
            return;
        }

        try {
            setIsUploading(true);
            const uploadPromises = selectedFiles.map(file => {
                if (file.fileObj) {
                    return uploadProfileDocument(file.fileObj);
                }
                return Promise.resolve({ isSuccess: true });
            });
            const results = await Promise.all(uploadPromises);

            const allSuccess = results.every(res => res.isSuccess);

            if (allSuccess) {
                alert(`${selectedFiles.length}개의 파일이 성공적으로 등록되었습니다.`);
                await fetchDocuments();
                setSelectedFiles([]);
                onComplete([]);
            } else {
                alert("일부 파일 업로드에 실패했습니다. 목록을 확인해 주세요.");
                await fetchDocuments();
            }
        } catch (error) {
            alert("파일 업로드 중 오류가 발생했습니다.");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/20 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col w-full max-w-[600px] px-[24px] sm:px-[40px] py-[32px] sm:py-[40px]
                bg-[#FBFAF9] rounded-[30px] shadow-xl pointer-events-auto w-full max-w-[700px]"
            >
                <div className="flex flex-col w-full gap-[24px] self-stretch mx-auto">
                    <span className="text-[20px] sm:text-[24px] font-semibold text-[#342F28] leading-[130%] tracking-[-0.01em]">
                        학력
                    </span>

                    <div className="flex flex-col w-full items-start gap-[12px] self-stretch">
                        <p className="self-stretch text-[14px] sm:text-[16px] font-medium leading-[130%]">
                            파일 첨부
                        </p>
                        <div className="space-y-3 w-full">
                            {isLoading && <div className="flex justify-center py-2"><Loader2 className="animate-spin text-[#6EEBC7]" /></div>}

                            {/**서버에 이미 저장된 파일들 */}
                            {!isLoading && uploadedDocuments.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between w-full h-[50px] sm:h-[60px] px-[16px] sm:px-[20px]
                                    bg-[#E9FCF7] rounded-[15px]"
                                >
                                    <span
                                        onClick={() => {
                                            if (!isEditing) {
                                                const fullUrl = doc.fileUrl.startsWith('/')
                                                    ? `${import.meta.env.VITE_API_BASE_URL}${doc.fileUrl}`
                                                    : doc.fileUrl;
                                                window.open(fullUrl, '_blank');
                                            }
                                        }}
                                        className="cursor-pointer flex-1 text-[14px] sm:text-[16px] text-[#25221D] font-medium leading-[140%]">
                                        {doc.fileName}
                                    </span>
                                    {isEditing && (
                                        <button
                                            onClick={() => handleDeleteServerFile(doc.id)}
                                            className="cursor-pointer text-[#7C7160]"
                                        >
                                            <X size={24} />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/**새로 선택한 파일들 (업로드 전) */}
                            {isEditing && selectedFiles.map((file, i) => (
                                <div
                                    key={`new-${i}`}
                                    className="flex items-center justify-between w-full h-[50px] sm:h-[60px] px-[16px] sm:px-[20px]
                                    bg-[#E9FCF7] rounded-[15px]"
                                >
                                    <span className="flex-1 text-[14px] sm:text-[16px] text-[#25221D] font-medium leading-[140%]">
                                        {file.name}
                                    </span>
                                    <button
                                        onClick={() => removeFile(i)}
                                        className="cursor-pointer text-[#7C7160]"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            ))}

                            {/**파일 추가 버튼 (3개 미만일 때만) */}
                            {isEditing && (uploadedDocuments.length + selectedFiles.length) < 3 && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center justify-center w-full h-[70px] sm:h-[80px] gap-[10px] sm:gap-[12px]
                                    bg-[#EFEEEB] rounded-[15px] cursor-pointer border border-[#ADA395]"
                                >
                                    <FileText size={24} color="#978B78" />
                                    <div className="flex flex-col justify-center items-center">
                                        <span className="self-stretch text-center text-[#978B78] font-pretendard text-[14px] sm:text-[16px] font-medium leading-[140%]">
                                            파일을 첨부해주세요
                                        </span>
                                        <span className="self-stretch text-center text-[#978B78] font-pretendard text-[11px] sm:text-[12px] font-normal leading-[150%]">
                                            (학력 증빙서류)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept=".pdf, image/*"
                            onChange={(e) => handleFileSelection(e.target.files)}
                        />
                    </div>

                    {/**하단 버튼 */}
                    <div className="flex w-full justify-end mt-2 gap-2">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-[#EFEEEB] text-[#5F5749] rounded-[10px] font-medium text-[14px] sm:text-[16px]"
                        >
                            닫기    
                        </button>

                        {isEditing && selectedFiles.length > 0 && (
                            <button
                                onClick={handleSubmit}
                                disabled={isUploading || selectedFiles.length === 0}
                                className="w-full sm:w-[120px] h-[44px] sm:h-[48px]
                                rounded-[10px] bg-[#6EEBC7] text-[#25221D] font-meidum text-[14px] sm:text-[16px]"
                            >
                                {isUploading ? "업로드 중..." : "등록하기"}
                            </button>

                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SchoolVerifyModal;