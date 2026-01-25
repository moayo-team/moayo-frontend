import { X, FileText } from "lucide-react";
import { useUploadManager } from "../../hooks/useUploadManager";

interface ModalProps {
    isOpen: boolean;
    isEditing: boolean;
    onClose: () => void;
    onComplete: (files: File[]) => void;
}

const SchoolVerifyModal = ({ isOpen, isEditing, onClose, onComplete }: ModalProps) => {
    const {
        selectedFiles,
        handleFileUpload,
        removeFile,
        fileInputRef
    } = useUploadManager({});

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
                            {selectedFiles.map((file, i) => (
                                <div
                                    key={i}
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

                            {selectedFiles.length === 0 && (
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
                            onChange={(e) => handleFileUpload(e.target.files)}
                        />
                    </div>
                    {isEditing && (
                        <div className="flex w-full justify-end mt-2">
                            <button
                                onClick={() => {
                                    onComplete(selectedFiles);
                                    onClose();
                                }}
                                className="w-full sm:w-[120px] h-[44px] sm:h-[48px]
                                rounded-[10px] bg-[#6EEBC7] text-[#25221D] font-meidum text-[14px] sm:text-[16px]"
                            >
                                등록하기
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SchoolVerifyModal;