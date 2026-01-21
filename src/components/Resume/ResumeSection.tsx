import { useEffect, useState } from "react";
import CarrerCard from "./CareerCard";
import CarrerDetailModal from "./CareerDetailModal";


interface ResumeSectionProps {
  carrers: any[]; 
  sortOrder: 'latest' | 'oldest';
}

const ResumeSection = ({ carrers:initialCarrers = [], sortOrder }: ResumeSectionProps) => {
  const [careerList, setCareerList] = useState<any[]>(initialCarrers);
  const [selectedCarrer, setSelectedCareer] = useState<any | null>(null);

  // 초기 props가 변경될 때 상태 동기화
  useEffect(() => {
    setCareerList(initialCarrers);
  }, [initialCarrers]);
  
  const handleSave = (updatedData: any) => {
    setCareerList((prev) =>
      prev.map((career) => (career.id === updatedData.id ? updatedData : career))
    );
    setSelectedCareer(null); 
  };

  // 삭제 함수 정의
  const handleDelete = (id: string | number) => {
    setCareerList((prev) => prev.filter((career) => career.id !== id));
    setSelectedCareer(null); 
  };

  // 최신순 정렬 (기본)
  const sortedCarrers = Array.isArray(careerList) 
    ? [...careerList].sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
      })
    : []; // 배열이 아니면 빈 배열 반환

  return (
    <div className="grid grid-cols-2 gap-x-[16px] gap-y-[33px] w-full max-w-[1340px]">
        {sortedCarrers.map((carrer, idx) => (
          <div 
          key={carrer.id || idx} 
          onDoubleClick={() => setSelectedCareer(carrer)} 
          className="cursor-pointer">
            <CarrerCard{...carrer} />
          </div>
        ))}
      

      {/* 상세 모달*/}
      {selectedCarrer && (
        <CarrerDetailModal
          data={selectedCarrer} 
          onClose={() => setSelectedCareer(null)} 
          onDelete={handleDelete}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ResumeSection;
