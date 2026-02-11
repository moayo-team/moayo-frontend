import { X } from "lucide-react";
//import { useEffect, useState, type KeyboardEvent } from "react";
import { useEffect, useState, } from "react";
import type { InterestTag } from "../../types/profile";
import { getAllInterestTag } from "../../api/profile/profile";

interface TagModalProps {
    isOpen: boolean;
    currentTags: InterestTag[];
    onClose: () => void;
    onComplete: (tags: any[]) => void;
}

const TagSelectModal = ({ isOpen, currentTags, onClose, onComplete }: TagModalProps) => {
    const [tempTags, setTempTags] = useState<any[]>(currentTags);

    const [availableTags, setAvailableTags] = useState<InterestTag[]>([]);

    //  전체 태그 목록
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await getAllInterestTag();
                if (response.isSuccess) {
                    const sortedTags = [...response.result].sort(
                        (a, b) => a.id - b.id
                    );

                    setAvailableTags(sortedTags);
                }
            } catch (error) {
                console.error("태그 목록 불러오기 실패:", error);
            }
        };

        fetchTags();
    }, []);

    //모달 열릴때마다 변경된 태그 목록 동기화
    useEffect(() => {
        if (isOpen) {
            setTempTags(currentTags);
        }
    }, [isOpen, currentTags]);

    if (!isOpen) return null;

    // 태그 토글 
    const toggleTag = (tag: InterestTag) => {
        if (tempTags.find(t => t.id === tag.id)) {
            setTempTags(tempTags.filter(t => t.id !== tag.id));
        } else {
            setTempTags([...tempTags, tag]);
        }
    };



    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="flex flex-col w-full max-w-[600px] max-h-[85vh] px-[24px] sm:px-[40px] py-[32px] sm:py-[40px]
                bg-[#FBFAF9] rounded-[20px] sm:rounded-[30px] pointer-events-auto overflow-y-auto custom-scrollbar shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center shrink-0 gap-[20px] sm:gap-[24px] self-stretch">
                    <span className="text-[20px] sm:text-[24px] font-pretendard font-semibold text-[#342F28] leading-[130%] tracking-[-0.01em]">
                        관심있는 태그를 선택해주세요!
                    </span>
                    {/* 선택된 태그 영역 */}
                    {tempTags.length > 0 && (
                        <div className="flex flex-col items-start self-stretch gap-[10px] sm:gap-[12px]">
                            <p className="text-[14px] sm:text-[16px]-medium text-[#25221D] leading-[150%]">
                                선택된 태그
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[8px] sm:gap-[10px] items-center self-stretch">
                                {tempTags.length > 0 && (
                                    tempTags.map((tag, index) => (
                                        <div
                                            key={tag.id}
                                            className="flex justify-center items-center gap-[4px] px-[8px] h-[40px] sm:h-[44px]
                                            bg-[#E9FCF7] text-[#978B78] border border-[#26E1AC] rounded-[10px]">
                                            <span className="flex-1 text-center font-pretendard font-normal text-[13px] sm:text-[15px] truncate leading-[150%]">
                                                {tag.name}
                                            </span>
                                            <X
                                                size={24}
                                                color="#C2BBB0"
                                                className="cursor-pointer"
                                                onClick={() => setTempTags(tempTags.filter((_, i) => i !== index))} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                    {/* 기본 태그 목록 및 자유 입력 */}
                    <div className="flex flex-col gap-[10px] sm:gap-[12px] self-stretch items-start w-full">
                        <p className="self-stretch font-pretendard text-[14px] sm:text-[16px] font-medium text-[#25221D] leading-[150%]">
                            기본 태그 목록
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[8px] sm:gap-[10px] self-stretch w-full">
                            {availableTags.map(tag => {
                                const isSelected = tempTags.some(t => t.id === tag.id);
                                return (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleTag(tag)}
                                        className={`h-[40px] sm:h-[44px] w-full flex items-center justify-center 
                                        rounded-[10px] border font-pretendard text-[13px] sm:text-[15px] transition-all
                                        ${isSelected ? "bg-[#EFEEEB] text-[#ADA395] border-[#EFEEEB]" : "bg-[#EFEEEB] text-[#25221D] border-[#978B78]"}`}
                                    >
                                        {tag.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex w-full justify-end mt-2">
                        <button
                            onClick={() => { onComplete(tempTags); onClose(); }}
                            className="w-full sm:w-[120px] h-[44px] sm:h-[48px] bg-[#6EEBC7] text-[#25221D] font-mediumtext-[14px] sm:text-[16px] rounded-[12px]"
                        >
                            등록하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagSelectModal;