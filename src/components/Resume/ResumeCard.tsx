interface ResumeCardProps {
  title: string;          // UMC 9th 앱 개발 동아리
  period: string;         // 24.08.13 ~ 24.10.02
  organizer?: string;     // 한국 ○○ 해커톤
  participation: string; // 참여 형태
  role: string;           // 역할
}

const ResumeCard = ({ title, period, organizer, participation, role }: ResumeCardProps) => {
  return (
    <div className="flex flex-col gap-[12px] w-[434px] py-[20px] px-[24px] justify-center items-center 
          rounded-[16px] border border-[#a7a7aa] bg-white shadow-[0_0_2px_0_#AFAFAF]">
      <div className="flex flex-col items-start gap-[30px] self-stretch">
        <div className="flex flex-col self-stretch">
            <span className="text-right font-pretendard text-[12px] font-medium leading-[150%] tracking-[-0.12em] text-[#a7a7aa] ">
                {organizer}
            </span>
            <div className="flex flex-col gap-[8px] flex-1 shrink-0 basis-0 self-stretch">
                <div className="text-[24px] font-pretendard font-bold leading-[130%]">
                    {title}
                </div>
                <div className="text-[16px] font-pretendard font-normal leading-[150%] text-[#58575b]">
                    {period}
                </div>
            </div>
        </div>
      
        <div className="flex flex-col items-start gap-[20px] self-stretch">
            <p className="flex py-[3px] px-[10px] justify-center items-center gap-[5px] 
              rounded-[10px] bg-gray-50 text-[#58575b]">
            참여 형태
            </p>
            <p className="font-pretendard text-[16px] font-normal leading-[150%]">
              {participation}
            </p>

            <p className="flex py-[3px] px-[10px] justify-center items-center gap-[5px] 
                rounded-[10px] bg-gray-50 text-[#58575b]">
            역할
            </p>
            <p className="font-pretendard text-[16px] font-normal leading-[150%]">
              {role}
            </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
