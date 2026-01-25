import { useLocation, useNavigate} from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { DUMMY_PROFILE } from "../data/profileData";
import ResumeSection from "../components/Resume/ResumeSection";
import type { Career } from "../types/career";
import InfoSection from "../components/Profile/InfoSection";

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(DUMMY_PROFILE);
  const [isEditing, setIsEditing] = useState(false); 
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [allCareers, setAllCareers] = useState<Career[]>(DUMMY_PROFILE.careers);
  const [isDetailsEmpty, setisDetailsEmpty] = useState(
      profileData.details.every(item => !item.value)
  );  

  useEffect(() => {
    if (isDetailsEmpty) {
      setIsEditing(true);
    }
  }, []);

  //  프로필 정보 변경 핸들러
  const handleProfileChange = useCallback((id: string, value: any) => {
    setProfileData((prev) => {
      if (["name", "profileImage", "introduction", "tags", "school_verified","additionalDetails"].includes(id)) {
        // 이전 값과 새로운 값이 같다면 상태를 업데이트하지 않음
        if (prev[id as keyof typeof prev] === value) return prev;
        return { ...prev, [id]: value };
      }

      const updatedDetails = prev.details.map((item) =>
        item.id === id ? { ...item, value: value } : item
      );

      // 상세 정보 데이터가 실제로 변했는지 확인 
      const isSame = prev.details.find(d => d.id === id)?.value === value;
      if (isSame) return prev;

      return { ...prev, details: updatedDetails };
    });
  }, []);

  //  편집/저장 버튼 클릭 핸들러
  const handleModeChange = () => {
    if (isEditing) {
      setisDetailsEmpty(false)
      setIsEditing(false); 
    } else {
      setIsEditing(true);
    }
  };

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
    <div className="flex flex-col gap-12 w-full">
    
      <InfoSection
        isEditing={isEditing}
        isDetailsEmpty={isDetailsEmpty}
        data={profileData}
        onDataChange={handleProfileChange}
        onModeChange={handleModeChange}/>

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
