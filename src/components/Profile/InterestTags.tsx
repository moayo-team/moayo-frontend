import type { Interest } from "../../types/interest";

interface InterestTagsProps {
  interests: Interest[];
  isEditing?: boolean;  
  onTagClick?: (tagId: number) => void; 
}

const InterestTags = ({ interests, isEditing, onTagClick}: InterestTagsProps) => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      {interests.map((tag) => (
        <button
          key={tag.id}
          type="button"
          disabled={!isEditing}
          onClick={() => onTagClick?.(tag.id)}
          className={`flex w-[115px] h-[51px] px-[10px] py-[3px] 
          justify-center items-center gap-[5px]
          border rounded-[10px] border-[#26E1AC] bg-[#E9FCF7]
          text-[18px] font-pretendard font-normal leading-[150%] 
          align-center flex-1 
          ${isEditing ? "text-[#C3C2C5]" : "text-[#343436]"}
          `}
        >
          <span>{tag.name}</span>
          
          {/* 편집 모드일 때*/}
          {isEditing && (
            <span className="text-[#C3C2C5] ml-1 ">✕</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default InterestTags;
