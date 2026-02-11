import { Eye, EyeOff } from "lucide-react";
import type { Career } from "../../types/career";

interface CarrerCardProps {
  data: Career; // 전체 데이터를 객체로 받음
  onDoubleClick?: (data: Career) => void; // 클릭 시 상세 모달을 띄우기 위한 함수
}

const CarrerCard = ({ data, onDoubleClick }: CarrerCardProps) => {
  const { title, period, organizer, participation, role, visible } = data;

  return (
    <>
      <div
        onDoubleClick={() => onDoubleClick?.(data)}
        className="flex flex-col w-full min-h-[260px] p-[24px] justify-between
      rounded-[20px] border border-[#ADA395] bg-white shadow-[0_0_2px_0_#AFAFAF]
      transition-all duration-200 hover:shadow-md cursor-pointer hover:border-[#26E1AC]">
        <div className="flex flex-col gap-[16px] w-full">
          <div className="flex justify-between items-start w-full">
            <span className="text-right font-pretendard text-[13px] md:text-[14px] font-medium leading-[150%] tracking-[-0.01em] text-[#ADA395] truncate">
              {organizer || "주최 없음"}
            </span>
            <div className="text-[#ADA395]">
              {visible ? (
                <Eye size={20} strokeWidth={2} />
              ) : (
                <EyeOff size={20} strokeWidth={2} />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-[6px]">
            <div className="flex-1 self-stretch text-[20px] md:text-[22px] font-pretendard text-[#25221D] font-bold leading-[130%] line-clamp-2">
              {title || "활동명 없음"}
            </div>
            <div className="flex-1 self-stretch text-[20px] md:text-[22px] font-pretendard font-normal leading-[150%] text-[#423C33]">
              {period || "기간 없음"}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[16px] w-full mt-4">
          <div className="flex flex-col gap-[6px] items-start w-full">
            <span className="flex py-[4px] px-[10px] justify-center items-center 
              rounded-[10px] bg-[#EFEEEB] 
              font-pretendard text-[12px] md:text-[13px] font-normal leading-[150%] text-[#423C33]">
              참여 형태
            </span>
            <span className="self-stretch font-pretendard text-[15px] md:text-[16px] text-[#25221D] font-normal leading-[150%]">
              {participation || "-"}
            </span>
          </div>
          <div className="flex flex-col gap-[6px] items-start w-full">
            <span className="flex py-[4px] px-[10px] justify-center items-center 
              rounded-[10px] bg-[#EFEEEB] 
              font-pretendard text-[12px] md:text-[13px] font-normal leading-[150%] text-[#423C33]">
              역할
            </span>
            <span className="self-stretch font-pretendard text-[15px] md:text-[16px] text-[#25221D] font-normal leading-[150%]">
              {role || "-"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarrerCard;
