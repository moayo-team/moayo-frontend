// src/components/InterestTags.tsx
import type { Interest } from "../../types/interest";

interface InterestTagsProps {
  interests: Interest[];
  isEditing?: boolean;  
  onTagClick?: (tagId: number) => void; 
}

const InterestTags = ({ interests, isEditing, onTagClick}: InterestTagsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {interests.map(tag => (
        <button
          key={tag.id}
          type="button"
          disabled={!isEditing} // 수정 모드가 아니면 클릭 비활성화
          onClick={() => onTagClick?.(tag.id)}
          className={`
            flex w-[115px] h-[51px] px-[10px] py-[3px] justify-center items-center gap-[5px] 
            rounded-[30px] border 
            text-center font-pretendard text-[18px] font-normal leading-[150%] transition-all
            whitespace-nowrap 
            ${tag.selected
              ? "bg-[#6EEBC7] border-[#23CD9D] text-[#343436]" 
              : "bg-[#E9FCF7] border-[#26E1AC] text-[#343436]"
            }
            ${isEditing ? "cursor-pointer hover:opacity-80 shadow-sm" : "cursor-default"}
          `}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
};

export default InterestTags;
