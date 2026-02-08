import { useState } from "react";
import CarrerCard from "./CareerCard";
import CarrerDetailModal from "./CareerDetailModal";
import type { Career } from "../../types/career";
import { useNavigate } from "react-router-dom";
import { ArrowRightLeft } from "lucide-react";
import MascotIcon from "../../assets/white.svg"
import { getDisplayName } from "../../utils/name";
import type { ProfileDocument } from "../../types/profile";

interface ResumeSectionProps {
  carrers: Career[];
  sortOrder: 'latest' | 'oldest';
  userName?: string;
  onSave: (updatedData: Career) => void;
  onDelete: (id: string | number) => void;
  setSortOrder: (order: 'latest' | 'oldest') => void;
  documents?: ProfileDocument[];
}

const ResumeSection = ({
  carrers = [], sortOrder,
  userName,
  onSave,
  onDelete,
  setSortOrder,
  documents
}: ResumeSectionProps) => {
  const [selectedCarrer, setSelectedCareer] = useState<any | null>(null);
  const navigate = useNavigate();

  const hasData = carrers.length > 0; //데이터 유무 판단

  //정렬 로직
  const sortedCarrers = [...carrers].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });



  return (
    <>
      <div className="flex flex-col w-full gap-[24px]">
        {/**타이틀, 정렬, 추가 */}
        <div className="sm:flex-row w-full items-center gap-4 sm:gap-0">
          <span className="flex justify-center text-center text-[#25221D] font-pretendard text-[20px] md:text-[24px] font-semibold leading-[130%] tracking-normal">
            이력 관리
          </span>
          <div className="flex justify-end items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {/* 정렬 버튼 */}
            {hasData && (
              <button
                onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')}
                className="flex items-center gap-1 text-[#978B78] font-pretendard text-[14px] md:text-[16px] font-medium leading-[150%] hover:text-[#343436]"
              >
                {sortOrder === 'latest' ? '최신 순' : '오래된 순'}
                <ArrowRightLeft size={16} color="#978B78" />
              </button>
            )}
            {/* 이력 추가 버튼 */}
            <button
              type="button"
              onClick={() => navigate("/profile/add-career")}
              className="flex w-[100px] sm:w-[120px] h-[44px] sm:h-[48px] justify-center items-center 
              bg-[#6EEBC7] rounded-[10px] hover:bg-[#5BD9B5] transition-colors shadow-sm"
            >
              <span className="text-[#25221D] font-pretendard font-medium text-[14px] sm:text-[16px]">
                이력 추가
              </span>
            </button>
          </div>
        </div>

        {/**메인 콘텐츠 */}
        {hasData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] w-full">
            {sortedCarrers.map((career) => (
              <CarrerCard
                key={career.id}
                data={career} // 이전에 수정한 대로 data 객체 전달
                onDoubleClick={(data) => setSelectedCareer(data)} // 클릭 시 모달 오픈
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center 
              w-full min-h-[200px] sm:min-h-[240px] p-8 gap-4
              border rounded-[10px] border-dashed border-[#5F5749]">
            <div className="flex h-[88px] gap-[20px] justify-center items-center shrink-0 self-stretch">
              <img
                src={MascotIcon}
                className="w-[50px] sm:w-[60px] h-auto object-contain"
                alt="mascot"
              />
              <span className="font-pretendard text-[16px] sm:text-[18px] font-medium leading-[130%] text-[#7C7160]
                text-center md:text-left break-keep">
                {getDisplayName(userName || "사용자")}님의 활동경험을 알려주세요!
              </span>
            </div>
          </div>
        )}
        {/* 상세 모달*/}
        {selectedCarrer && (
          <CarrerDetailModal
            data={selectedCarrer}
            documents={documents}
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
