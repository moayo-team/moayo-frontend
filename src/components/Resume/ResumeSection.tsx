import { useState } from "react";
import ResumeCard from "./ResumeCard";
import ResumeDetailModal from "./ResumeDetailModal";

interface ResumeSectionProps {
  resumes: any[]; 
}

const ResumeSection = ({ resumes }: ResumeSectionProps) => {
  const [selectedResume, setSelectedResume] = useState<any | null>(null);
  
  // 최신순 정렬 (기본)
  const latestResumes = [...resumes].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="flex w-[1337px] flex-col items-start gap-[33px]">
      <div className="flex items-center gap-[16px] self-stretch flex-wrap">
        {latestResumes.map((resume, idx) => (
          <div 
          key={idx} 
          onDoubleClick={() => setSelectedResume(resume)} 
          className="cursor-pointer">
            <ResumeCard{...resume} />
          </div>
        ))}
      </div>

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
