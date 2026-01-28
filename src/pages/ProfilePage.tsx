import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import ResumeSection from "../components/Resume/ResumeSection";
import type { Career } from "../types/career";
import InfoSection from "../components/Profile/InfoSection";
import { createProfile, getProfile, updateProfile } from "../apis/profile";
import { getExperiences } from "../apis/experiences";
import { getUserMe } from "../apis/user";
import type { ProfileResult } from "../types/profile";

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  //const [profileData, setProfileData] = useState(DUMMY_PROFILE);
  //const [allCareers, setAllCareers] = useState<Career[]>(DUMMY_PROFILE.careers);
  const [profileData, setProfileData] = useState<ProfileResult | any>(null);
  const [allCareers, setAllCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  useEffect(() => {
    // if (isDetailsEmpty) {
    //   setIsEditing(true);
    // }
    const initData = async () => {
      try {
        setLoading(true);
        //프로필정보, 이력 목록 동시에 가져옴
        const [userRes, profileRes, careerRes] = await Promise.all([
          getUserMe(),
          getProfile(),
          getExperiences(sortOrder === 'latest' ? 'LATEST' : 'OLDEST')
        ]);

        if (userRes.isSuccess && profileRes.isSuccess) {
          const u = userRes.result;
          const p = profileRes.result;

          if (!p.id) {
            setIsEditing(true);
          }

          setProfileData({
            id: p.id,
            name: u.name || "사용자",
            profileImage: p.imageUrl,
            introduction: p.bio,
            details: [
              { id: "birth", label: "생년월일", value: "" },
              { id: "school", label: "학력", value: p.university, isVerified: false },
              { id: "major", label: "학과", value: p.major },
              { id: "email", label: "이메일", value: u.email },
              { id: "phone", label: "전화번호", value: "" },
            ],
            additionalDetails: [],
            tags: [
              { id: 1, title: "디자인" },
              { id: 2, title: "기획" },
            ],

          })
        }

        // 이력 목록 매핑 (Careeritems -> Career)
        if (careerRes.items) {
          const mappedCareers: Career[] = careerRes.items.map((item) => ({
            id: item.resumeId,
            title: item.title,
            organizer: item.organization,
            startDate: item.startDate,
            participation: item.summary || "",
            role: item.role || "",
            period: `${item.startDate} - ${item.endDate || "현재"}`,
            intro: item.summary || "",
            isPublic: true,
          }));
          setAllCareers(mappedCareers);
        }

      } catch (error) {
        console.error("데이터 로딩 실패.", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [sortOrder]);

  const isDetailsEmpty = useMemo(() => {
    if (!profileData || !profileData.details) return true;
    return profileData.details.every((item: any) => !item.value);
  }, [profileData]);


  //  프로필 정보 변경 핸들러
  const handleProfileChange = useCallback((id: string, value: any) => {
    setProfileData((prev: any) => {
      if (["name", "profileImage", "introduction", "tags", "school_verified", "additionalDetails"].includes(id)) {
        // 이전 값과 새로운 값이 같다면 상태를 업데이트하지 않음
        if (prev[id as keyof typeof prev] === value) return prev;
        return { ...prev, [id]: value };
      }

      const updatedDetails = prev.details.map((item: any) =>
        item.id === id ? { ...item, value: value } : item
      );

      // 상세 정보 데이터가 실제로 변했는지 확인 
      const isSame = prev.details.find((d: any) => d.id === id)?.value === value;
      if (isSame) return prev;

      return { ...prev, details: updatedDetails };
    });
  }, []);

  //  편집/저장 버튼 클릭 핸들러
  const handleModeChange = async () => {
    if (isEditing) {
      try {
        setLoading(true);

        const requestBody = {
          imageUrl: profileData.profileImage || "",
          bio: profileData.introduction || "",
          university: profileData.details.find((d: any) => d.id === "school")?.value || "",
          major: profileData.details.find((d: any) => d.id === "major")?.value || "",
        };

        if (!profileData.id) {
          const response = await createProfile(requestBody);
          if (response.isSuccess) {
            alert("프로필 생성되었습니다.");
            setProfileData((prev: ProfileResult | any) => ({ ...prev, id: response.result.id }));
          }
        } else {
          // 기존에 만든 updateProfile(PATCH) 호출
          await updateProfile(requestBody);
          alert("프로필이 수정되었습니다.");
        }
      } catch (error: any) {
        const status = error.response?.status;

        if (status === 400) {
          alert("입력 형식이 올바르지 않거나 필수 항목이 누락되었습니다.");
        } else if (status === 409) {
          // 명세서: CONFLICT-409 (이미 생성된 프로필)
          alert("이미 생성된 프로필이 존재합니다.");
        } else {
          alert("서버 통신 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    }
    setIsEditing((prev) => !prev);
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

      navigate(location.pathname, { replace: true, state: {} });
    }

  }, [location.state, navigate, location.pathname]);

  //로딩 및 에러 처리UI
  if (loading) return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  if (!profileData) return <div className="text-center p-10">프로필 정보를 불러올 수 없습니다.</div>;


      const from = location.state?.from || "/profile"

  return (
    <div className="flex flex-col gap-12 w-full">
      <InfoSection
        isEditing={isEditing}
        isDetailsEmpty={isDetailsEmpty}
        data={profileData}
        onDataChange={handleProfileChange}
        onModeChange={handleModeChange} />

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
