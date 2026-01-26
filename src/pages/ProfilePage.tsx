import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState, useMemo } from "react";
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

  // [개선] 별도의 state 대신 useMemo를 사용하여 데이터로부터 직접 유도
  const isDetailsEmpty = useMemo(() => 
    profileData.details.every(item => !item.value), 
    [profileData.details]
  );

  // 초기 로딩 시 비어있으면 편집 모드로 전환
  useEffect(() => {
    if (isDetailsEmpty) {
      setIsEditing(true);
    }
  }, []); // 최초 마운트 시에만 실행

  // 프로필 정보 변경 핸들러
  const handleProfileChange = useCallback((id: string, value: any) => {
    setProfileData((prev) => {
      const topLevelKeys = ["name", "profileImage", "introduction", "tags", "school_verified", "additionalDetails"];
      
      if (topLevelKeys.includes(id)) {
        if (prev[id as keyof typeof prev] === value) return prev;
        return { ...prev, [id]: value };
      }

      // 상세 정보(details 배열) 업데이트
      const updatedDetails = prev.details.map((item) =>
        item.id === id ? { ...item, value: value } : item
      );

      // 실제 값이 변경되었는지 확인하여 불필요한 리렌더링 방지
      const hasChanged = prev.details.some(d => d.id === id && d.value !== value);
      if (!hasChanged) return prev;

      return { ...prev, details: updatedDetails };
    });
  }, []);

  const handleModeChange = () => {
    setIsEditing(prev => !prev);
  };

  const handleSaveCareer = (updatedData: Career) => {
    setAllCareers((prev) =>
      prev.map((career) => (career.id === updatedData.id ? updatedData : career))
    );
  };
  
  const handleDeleteCareer = (id: string | number) => {
    setAllCareers((prev) => prev.filter((career) => career.id !== id));
  };

  // [오류 해결] location.state 처리를 위한 단일 useEffect
  useEffect(() => {
    const { updatedProfile, newResume } = location.state || {};

    if (updatedProfile) {
      setProfileData(updatedProfile);
    }

    if (newResume) {
      setAllCareers((prev) => {
        if (prev.some(item => item.id === newResume.id)) return prev;
        return [newResume, ...prev];
      });
    }

    // 데이터 처리 후 state 초기화 (replace: true로 히스토리 관리)
    if (updatedProfile || newResume) {
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
        onModeChange={handleModeChange}
      />

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

export default ProfilePage;