import { Eye, EyeOff} from "lucide-react";
import type { Career } from "../../types/career";

interface CarrerCardProps {
  data: Career; // 전체 데이터를 객체로 받음
  onDoubleClick?: (data: Career) => void; // 클릭 시 상세 모달을 띄우기 위한 함수
}

const CarrerCard = ({ data, onDoubleClick }: CarrerCardProps) => {
  const { title, period, organizer, participation, role, isPublic } = data;

  return (
    <>
    <div 
      onDoubleClick={() => onDoubleClick?.(data)}
      className="flex flex-col gap-[10px] w-full min-h-[280px] py-[20px] px-[24px] justify-center items-center 
      rounded-[16px] border border-[#a7a7aa] bg-white shadow-[0_0_2px_0_#AFAFAF]">
      <div className="flex flex-col flex-1 items-start gap-[30px] self-stretch">
        <div className="flex flex-col items-start self-stretch gap-[5px]">
          <div className="flex justify-between items-center self-stretch">
            <span className="text-right font-pretendard text-[12px] font-medium leading-[150%] tracking-[-0.01em] text-[#a7a7aa] truncate">
                {organizer}
            </span>
            <div className="flex items-center gap-1">
              {isPublic ? (
                  <Eye size={22} strokeWidth={2} className="text-[#A7A7AA]"/>
              ) : (                
                  <EyeOff size={20} strokeWidth={2} className="text-[#A7A7AA]"/>
              )}
            </div>
          </div>
            <div className="flex flex-col gap-[8px] self-stretch">
                <div className="flex-1 self-stretch text-[24px] font-pretendard text-[#343436] font-bold leading-[130%] line-clamp-2">
                    {title}
                </div>
                <div className="flex-1 self-stretch text-[16px] font-pretendard font-normal leading-[150%] text-[#58575b]">
                    {period}
                </div>
            </div>
        </div>
      
        <div className="flex flex-col items-start gap-[20px] self-stretch">
          <div className="flex self-stretch flex-col gap-[4px] items-start">
            <span className="flex py-[3px] px-[10px] justify-center items-center gap-[5px] 
              rounded-[10px] bg-[#F2F2F2] 
              font-pretendard text-[14px] font-normal leading-[150%] text-[#58575b]">
            참여 형태
            </span>
            <span className="self-stretch font-pretendard text-[16px] text-[#343436] font-normal leading-[150%]">
              {participation}
            </span>
          </div>
          <div className="flex w-[198px] flex-col gap-[4px] items-start">
            <span className="flex py-[3px] px-[10px] justify-center items-center gap-[5px] 
              rounded-[10px] bg-[#F2F2F2] 
              font-pretendard text-[14px] font-normal leading-[150%] text-[#58575b]">
            역할
            </span>
            <span className="self-stretch font-pretendard text-[16px] text-[#343436] font-normal leading-[150%]">
              {role}
            </span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CarrerCard;
