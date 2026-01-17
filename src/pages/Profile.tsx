import { useState } from "react";
import UserInfo from "../components/Profile/UserInfo"
import ResumeSection from "../components/Resume/ResumeSection"
import ResumeAddModal from "../components/Resume/ResumeAddModal";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resumes, setResumes] = useState([
    {
      id:1,
      title: "UMC 9th 앱 개발 동아리",
      period: "23.08.13 ~ 23.10.02",
      startDate: "2023-08-13",
      organizer: "한국 너디너리 해커톤..",
      participation: "전반적인 기획과 ui디자인 참여",
      role: "디자이너",
      files: [
      { name: "UMC_포트폴리오_최종.pdf" },
      { name: "증빙서류.jpg" }
      ],
      links: [
      "https://github.com/example/project",
      "https://www.figma.com/design/example"
    ],
      isPublic: true
    },
    {
      id:2,
      title: "UMC 9th 앱 개발 동아리",
      period: "23.09.13 ~ 23.10.02",
      startDate: "2023-09-13",
      organizer: "한국 너디너리 해커톤..",
      participation: "전반적인 기획과 ui디자인 참여",
      role: "디자이너",
    },
    {
      id:3,
      title: "UMC 9th 앱 개발 동아리",
      period: "24.10.13 ~ 25.1.02",
      startDate: "2024-10-13",
      organizer: "한국 너디너리 해커톤..",
      participation: "전반적인 기획과 ui디자인 참여",
      role: "디자이너",
    },
    {
      id:4,
      title: "UMC 9th 앱 개발 동아리",
      period: "24.11.13 ~ 25.10.02",
      startDate: "2024-11-13",
      organizer: "한국 너디너리 해커톤..",
      participation: "전반적인 기획과 ui디자인 참여",
      role: "디자이너",
    },
    {
      id:5,
      title: "UMC 9th 앱 개발 동아리",
      period: "24.12.13 ~ 25.10.02",
      startDate: "2024-12-13",
      organizer: "한국 너디너리 해커톤..",
      participation: "전반적인 기획과 ui디자인 참여",
      role: "디자이너",
    },
    {
      id:6,
      title: "UMC 9th 앱 개발 동아리",
      period: "25.01.13 ~ 25.10.02",
      startDate: "2025-01-13",
      organizer: "한국 너디너리 해커톤..",
      participation: "전반적인 기획과 ui디자인 참여",
      role: "디자이너",
    },
    {
      id:7,
      title: "UMC 9th 앱 개발 동아리",
      period: "25.02.13 ~ 25.10.02",
      startDate: "2025-02-13",
      organizer: "한국 너디너리 해커톤..",
      participation: "전반적인 기획과 ui디자인 참여",
      role: "디자이너",
    },
    {
      id:8,
      title: "UMC 9th 앱 개발 동아리",
      period: "25.03.13 ~ 25.10.02",
      startDate: "2025-03-13",
      organizer: "한국 너디너리 해커톤..",
      participation: "전반적인 기획과 ui디자인 참여",
      role: "디자이너",
      files: [
      { name: "UMC_포트폴리오_최종.pdf" },
      { name: "증빙서류.jpg" }
      ],
      links: [
      "https://devpost.com/software/example"
    ],
      isPublic: true
    },
  
    ]);
    //데이터 추가 함수
    const handleAddResume = (newResume: any) => {
            setResumes((prev) => [...prev, newResume]);
    };
    return(
        <div className="flex flex-col items-center w-full"> {/* 전체 중앙 정렬을 위한 부모 */}
            
            {/** 유저 정보 영역 */}
            <div className="w-full max-w-[1337px] px-6"> 
                <div className="relative flex justify-center mt-[101px] h-[42px] items-center">
                    {!isEditing && (
                        <div className="text-[32px] font-pretendard font-semibold leading-[130%] tracking-[-0.01em] text-[#444446]">
                            프로필
                        </div>
                    )}

                    {isEditing && (
                        <button 
                            onClick={() => setIsEditing(false)} 
                            className="absolute right-0 flex px-[40px] py-[10px] justify-center items-center rounded-[10px] bg-[#26E1AC] 
                            font-pretendard text-[24px] font-semibold leading-[130%] text-[#343436] cursor-pointer"
                        >
                            저장
                        </button>
                    )}
                </div>
                <div className="flex justify-center w-full mt-[40px]">
                    <UserInfo isEditing={isEditing} setIsEditing={setIsEditing} />
                </div>
            </div>

            {/** 이력 관리 영역 */}
            <div className="w-full max-w-[1337px] px-4 mt-[120px]">
                <div className="relative flex justify-center items-center mb-[24px]">
                    <div className="font-pretendard text-[32px] font-semibold leading-[130%] tracking-[-0.32px] text-[#444446]">
                        이력 관리
                    </div>
                    
                    {/* 이력 추가 버튼 */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="absolute right-0 flex w-[143px] px-[15px] py-[10px] justify-center items-center gap-[10px] 
                        rounded-[10px] bg-[#26E1AC] 
                        font-pretendard text-[20px] font-medium leading-[140%] text-[#343436]"
                    >
                        이력 추가
                    </button>
                </div>

                {/* 이력 리스트 */}
                <div className="w-full">
                    <ResumeSection 
                        resumes={resumes} 
                    />
                </div>
            </div>

            {isModalOpen && (
                <ResumeAddModal 
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddResume} 
                />
            )}
        </div>
    );
}

export default Profile