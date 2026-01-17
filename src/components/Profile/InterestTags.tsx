// src/components/InterestTags.tsx
import type { Interest } from "../../types/interest";

interface InterestTagsProps {
  interests: Interest[];
  isEditing?: boolean;  
  onTagClick?: (tagId: number) => void; 
}

const InterestTags = ({ interests, isEditing, onTagClick}: InterestTagsProps) => {
  const rows: Interest[][] = [];
  for (let i = 0; i < interests.length; i += 4) {
    rows.push(interests.slice(i, i + 4));
  }

  return (
    <div className="flex flex-col gap-[15px] self-stretch">
      {rows.map((row, rowIndex) => (
        /* 태그 한 줄 div */
        <div
          key={rowIndex}
          className="flex items-center gap-[12px] self-stretch"
        >
          {row.map(tag => (
            <button
              key={tag.id}
              type="button"
              disabled={!isEditing}
              onClick={() => onTagClick?.(tag.id)}
              className={`
                flex w-[115px] h-[51px] px-[10px] py-[3px]
                justify-center items-center gap-[5px]
                rounded-[10px] border
                font-pretendard text-[18px] font-normal leading-[150%]
                transition-all 
                ${
                  tag.selected
                    ? "bg-[#6EEBC7] border-[#23CD9D] text-[#343436]"
                    : "bg-[#E9FCF7] border-[#26E1AC] text-[#343436]"
                }
                ${isEditing ? "cursor-pointer hover:opacity-80" : "cursor-default"}
              `}
            >
              {tag.name}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default InterestTags;
