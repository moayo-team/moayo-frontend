import publicIcon from "../assets/eye.svg"
import latestIcon from "../assets/basil_exchange-outline.svg"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { DUMMY_PROFILE } from "../data/profileData";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ResumeSection from "../components/Resume/ResumeSection";

interface LocationState {
    newResume?: {
        title: string;
        organizer: string;
        company: string;
        period: string;
        startDate: string;
        role: string;
        participation: string;
        fileName?: string;
        link?: string;
    };
}

const ProfileHistoryPage = () => {
    const navigate = useNavigate();
    const [allResumes, setAllResumes] = useState(DUMMY_PROFILE.careers);
    const location = useLocation();
    const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

    useEffect(() => {
        if (location.state?.newResume) {
            const newResume = location.state.newResume;
            
            // 중복 추가 방지
            setAllResumes(prev => {
                const isDuplicate = prev.some(item => item.title === newResume.title && item.startDate === newResume.startDate);
                if (isDuplicate) return prev;
                return [newResume, ...prev];
            });
        }
    }, [location.state]);

    //정렬 토글 함수
    const toggleSort = () => {
        setSortOrder(prev => prev === 'latest' ? 'oldest' : 'latest');
    };

    return (
        <div className="flex flex-col gap-[76px]">
    
        <ProfileHeader
            isEditing={false} 
            jobTitle={DUMMY_PROFILE.jobTitle}
            profileImage={DUMMY_PROFILE.profileImage}
            tags={DUMMY_PROFILE.tags}
            onDataChange={() => {}}/>

        <div className="flex flex-col gap-[33px]">
            <div className="flex justify-between">
                <div className="flex items-center gap-[10px]">
                <span className="font-pretendard text-[32px] font-semibold leading-[130%] tracking-[-0.01em]">
                        이력관리
                    </span>
                    <img
                        src={publicIcon}
                        alt="공개"
                        width={36}
                        height={36}
                    />
                </div>

                <div className="inline-flex justify-end items-end gap-[18px]">
                    <div 
                        className="flex items-center gap-[2px]"
                        onClick={toggleSort}>
                        <button className={`font-pretendard text-[16px] font-medium leading-[150%] transition-colors text-[#969599]`}>
                                {sortOrder === 'latest' ? '최신순' : '오래된순'}
                            </button>
                        <img
                            src={latestIcon}
                            className={`w-[24px] h-[24px] aspect-square transition-transform ${sortOrder === 'oldest' ? 'rotate-180' : ''}`}
                            />
                    </div>
                    <button 
                        onClick={() => navigate("/profile/add-resume")}
                        className="flex w-[143px] p-[15px] justify-center items-center gap-[10px]
                        rounded-[10px] bg-[#6EEBC7] cursor-pointer
                        font-pretendard text-[20px] font-meidum leading-[140%]">
                        이력 추가
                    </button>
                </div>
                
            </div>
{/*            <ResumeSection carrers={allResumes} sortOrder={sortOrder}/>*/}        </div>
    </div>
    )
}

export default ProfileHistoryPage