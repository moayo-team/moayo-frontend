import { useLocation, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { DUMMY_PROFILE } from "../data/profileData";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ResumeSection from "../components/Resume/ResumeSection";
import type { Career } from "../types/career";

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(DUMMY_PROFILE);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [allCareers, setAllCareers] = useState<Career[]>(DUMMY_PROFILE.careers);

  // 이력 수정(저장) 핸들러
  const handleSaveCareer = (updatedData: Career) => {
    setAllCareers((prev) =>
      prev.map((career) => (career.id === updatedData.id ? updatedData : career))
    );
  };
  
  // 이력 삭제 핸들러
  const handleDeleteCareer = (id: string | number) => {
    setAllCareers((prev) => prev.filter((career) => career.id !== id));
  };

  useEffect(() => {
    // 프로필 수정 정보 반영
    if (location.state?.updatedProfile) {
      setProfileData(location.state.updatedProfile);
      // 반영 후 state 초기화
    navigate(location.pathname, { replace: true, state: { ...location.state, updatedProfile: null } });
    }

    //  CareerAddPage에서 넘어온 신규 이력 반영
    if (location.state?.newResume) {
      const newCareer = location.state.newResume;

      // 최신 상태와 중복을 체크
      setAllCareers((prev) => {
        const isExist = prev.some(item => item.id === newCareer.id);
        if (isExist) return prev; // 이미 존재하면 기존 리스트 반환
        return [newCareer, ...prev]; // 존재하지 않으면 추가
      });

      // 데이터 반영 후 즉시 state를 비워주어 useEffect 재실행 시 데이터가 없도록 합니다.
      navigate(location.pathname, { replace: true, state: {} });
    }
      
  }, [location.state, navigate, location.pathname]);

  return (
    <div className="flex flex-col gap-[33px]">
    
      <ProfileHeader
        isEditing={false} 
        jobTitle={profileData.jobTitle}
        profileImage={profileData.profileImage}
        tags={profileData.tags || []}
        onDataChange={() => {}}/>

      <ResumeSection 
        carrers={allCareers} 
        sortOrder={sortOrder}
        setSortOrder={setSortOrder} 
        onSave={handleSaveCareer}
        onDelete={handleDeleteCareer}
        />
    </div>
  );
}

export default ProfilePage
