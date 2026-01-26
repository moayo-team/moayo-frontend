import { useState } from "react";
import CarrerCard from "./CareerCard";
import CarrerDetailModal from "./CareerDetailModal";
import type { Career } from "../../types/career";
import { useNavigate } from "react-router-dom";
import { ArrowRightLeft } from "lucide-react";
import MascotIcon from "../../assets/white.svg"
import { DUMMY_PROFILE } from "../../data/profileData";
import { getDisplayName } from "../../utils/name";

interface ResumeSectionProps {
  carrers: Career[];
  sortOrder: 'latest' | 'oldest';
  onSave: (updatedData: Career) => void;
  onDelete: (id: string | number) => void;
  setSortOrder: (order: 'latest' | 'oldest') => void;
}

const ResumeSection = ({ carrers = [], sortOrder, onSave, onDelete, setSortOrder }: ResumeSectionProps) => {
  const [selectedCarrer, setSelectedCareer] = useState<any | null>(null);
  const navigate = useNavigate();

  const hasData = carrers.length > 0; //데이터 유무 판단

  const sortedCarrers = [...carrers].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });



  return (
    <>
      <div className="flex flex-col w-full max-w-[1340px] mx-auto gap-[20px] md:gap-[30px] px-4">
        {/**타이틀, 정렬, 추가 */}
        <div className="flex flex-col w-full relative gap-4 md:gap-0">
          <span className="text-center text-[#343436] font-pretendard text-[24px] md:text-[32px] font-semibold leading-[130%] tracking-[-0.01em]">
            이력 관리
          </span>
          <div className="flex justify-end items-center gap-[12px] md:gap-[20px] md:right-0 md:bottom-0">

            {/* 정렬 버튼 */}
            {hasData && (
              <button
                onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')}
                className="flex items-center gap-[4px] text-[#969599] font-pretendard text-[14px] md:text-[16px] font-medium leading-[150%]"
              >
                {sortOrder === 'latest' ? '최신 순' : '오래된 순'}
                <ArrowRightLeft size={24} className="aspect-ratio" color="#969599" />
              </button>
            )}
            {/* 이력 추가 버튼 */}
            <button
              onClick={() => navigate("/profile/add-career")}
              className="flex w-[100px] md:w-[143px] py-[8px] md:py-[15px] justify-center items-center 
            bg-[#6EEBC7] rounded-[10px]"
            >
              <span className="text-[#343436] font-pretendard font-medium text-[16px] md:text-[20px]">
                이력 추가
              </span>
            </button>
          </div>
        </div>

        {/**메인 콘텐츠 */}
        {hasData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[24px] w-full max-w-[1340px] mx-auto">
            {sortedCarrers.map((career) => (
              <CarrerCard
                key={career.id}
                data={career} // 이전에 수정한 대로 data 객체 전달
                onDoubleClick={(data) => setSelectedCareer(data)} // 클릭 시 모달 오픈
              />
            ))}
          </div>
        ):(
          <div className="flex flex-col justify-center items-center 
              w-full min-h-[200px] md:min-h-[300px] p-6 md:py-[40px]
              border rounded-[10px] border-dashed border-[#717074]">
              <div className="flex h-[88px] gap-[20px] justify-center items-center shrink-0 self-stretch">
                <img
                  src={MascotIcon}
                  className="w-[60px] md:w-[80px] h-auto object-contain"
                  alt="mascot"
                />
                <span className="font-pretendard text-[18px] md:text-[24px] font-medium leading-[130%] text-[#444446]
                text-center md:text-left break-keep">
                  {getDisplayName(DUMMY_PROFILE.name)}님의 활동경험을 알려주세요!
                </span>
              </div>
          </div>
        )}
            {/* 상세 모달*/}
            {selectedCarrer && (
              <CarrerDetailModal
                data={selectedCarrer}
                onClose={() => setSelectedCareer(null)}
                onDelete={(id) => {
                  onDelete(id);
                  setSelectedCareer(null);
                }}
                onSave={(updatedData) => {
                  onSave(updatedData);
                  setSelectedCareer(null);
                }}
              />
            )}
    </div>
    </>

  );
};

export default ResumeSection;
