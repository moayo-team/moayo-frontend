import { useState } from "react";
import ResumeCard from "./ResumeCard";
import ResumeDetailModal from "./ResumeDetailModal";


interface ResumeSectionProps {
  resumes: any[]; 
  sortOrder: 'latest' | 'oldest';
}

const ResumeSection = ({ resumes, sortOrder }: ResumeSectionProps) => {
  const [selectedResume, setSelectedResume] = useState<any | null>(null);

  // 최신순 정렬 (기본)
  const sortedResumes = [...resumes].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="grid grid-cols-2 gap-x-[16px] gap-y-[33px] w-[963px]">
        {sortedResumes.map((resume, idx) => (
          <div 
          key={idx} 
          onDoubleClick={() => setSelectedResume(resume)} 
          className="cursor-pointer">
            <ResumeCard{...resume} />
          </div>
        ))}
      

      {/* 상세 모달*/}
      {selectedResume && (
        <ResumeDetailModal
          data={selectedResume} 
          onClose={() => setSelectedResume(null)} 
        />
      )}
    </div>
  );
};

export default ResumeSection;
