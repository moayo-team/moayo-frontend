import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import ResumeSection from "../components/Resume/ResumeSection";
import type { Career } from "../types/career";
import InfoSection from "../components/Profile/InfoSection";
import { useAuth } from "../hooks/useAuth";

// 커스텀 훅 Import
import { useProfileData } from "../hooks/useProfileQueries";
import { useOtherUserProfile } from "../hooks/useOtherUserProfile";
import { useProfileSave } from "../hooks/useProfileMutation";
import type { ProfileFormData } from "../types/profileForm";

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const viewedUserId = (location.state as { userId?: string | number } | null)?.userId;
  const numericViewedUserId = viewedUserId !== undefined ? Number(viewedUserId) : undefined;
  const isViewingOtherUser = Number.isFinite(numericViewedUserId);

  const [isEditing, setIsEditing] = useState(false);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

  const [initialIndexItemIds, setInitialIndexItemIds] = useState<number[]>([]);
  const [allCareers, setAllCareers] = useState<Career[]>([]);

  const isInitialized = useRef(false);


  // 데이터 조회 훅
  const {
    user, profile, tags, indexItems, isLoading, isError, documents,
    experiences,
  } = useProfileData();

  const otherProfileQuery = useOtherUserProfile(
    isViewingOtherUser ? (numericViewedUserId as number) : undefined
  );


  // 데이터 저장 훅
  const { mutate: saveProfile, isPending: isSaving } = useProfileSave();

  // 서버 데이터 -> 로컬 상태 동기화
  useEffect(() => {
    if (isViewingOtherUser) return;
    if (!user) return;

    const mappedTags = tags?.map((t) => ({
      id: t.id,
      name: t.name,
    })) ?? [];

    const mappedItems =
      indexItems?.map((i) => ({
        id: i.id,
        label: i.indexKey,
        value: i.indexValue,
        type: i.itemType,
        fileObj: null,
      })) ?? [];

    const matchedDoc = documents?.find(
      (doc) => doc.fileUrl === profile?.imageUrl
    );

    setInitialIndexItemIds(mappedItems.map((i) => i.id));

    const formData: ProfileFormData = {
      id: profile?.id ?? null,
      name: user.name,
      profileImage: profile?.imageUrl ?? "",
      imageUrl: profile?.imageUrl ?? "",
      imageId: matchedDoc?.id ?? null,
      introduction: profile?.bio ?? "",

      tags: mappedTags,
      additionalDetails: mappedItems,

      details: [
        { id: "school", label: "학력", value: profile?.university ?? "" },
        { id: "major", label: "학과", value: profile?.major ?? "" },
        { id: "email", label: "이메일", value: user.email ?? "" },
        { id: "phone", label: "전화번호", value: user.phoneNumber ?? "" },
      ],
    };

    setProfileData(formData);
  }, [isViewingOtherUser, user, profile, tags, indexItems]);

  useEffect(() => {
    if (!isViewingOtherUser) return;
    if (!otherProfileQuery.data) return;

    const other = otherProfileQuery.data;

    const mappedTags = other.interestTags?.map((t) => ({
      id: t.id,
      name: t.name,
    })) ?? [];

    const mappedItems =
      other.indexItems?.map((i) => ({
        id: i.id,
        label: i.indexKey,
        value: i.indexValue,
        type: i.itemType,
        fileObj: null,
      })) ?? [];

    setInitialIndexItemIds(mappedItems.map((i) => i.id as number));

    const formData: ProfileFormData = {
      id: null,
      name: other.name,
      profileImage: other.imageUrl ?? "",
      imageUrl: other.imageUrl ?? "",
      imageId: null,
      introduction: other.bio ?? "",

      tags: mappedTags,
      additionalDetails: mappedItems,

      details: [
        { id: "school", label: "학력", value: other.university ?? "" },
        { id: "major", label: "학과", value: other.major ?? "" },
        { id: "email", label: "이메일", value: other.email ?? "" },
        { id: "phone", label: "전화번호", value: other.phoneNumber ?? "" },
      ],
    };

    setProfileData(formData);
    setAllCareers([]);
  }, [isViewingOtherUser, otherProfileQuery.data]);

  //이력 동기화
  useEffect(() => {
    if (experiences) {
      setAllCareers(experiences);
    }
  }, [experiences]);

  useEffect(() => {
    if (!user || isInitialized.current) return;

    if (isViewingOtherUser) {
      setIsEditing(false);
    } else if (!profile?.id) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }

    isInitialized.current = true;
  }, [user, profile]);



  // 이력서 생성 페이지 복귀 처리
  useEffect(() => {
    if (location.state?.newResume) {
      const newResume = location.state.newResume;
      setAllCareers(prev => {
        if (prev.some(c => String(c.id) === String(newResume.id))) return prev;
        return [newResume, ...prev];
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const isDetailsEmpty = useMemo(() => {
    if (!profileData?.details) return true;
    return profileData.details.every((item: any) => !item.value);
  }, [profileData]);

  const handleProfileChange = useCallback((id: string, value: any) => {
    setProfileData((prev: any) => {
      if (["name", "profileImage", "introduction", "tags", "school_verified", "additionalDetails", "imageUrl", "profileFile"].includes(id)) {
        if (prev[id as keyof typeof prev] === value) return prev;
        return { ...prev, [id]: value };
      }
      const updatedDetails = prev.details.map((item: any) =>
        item.id === id ? { ...item, value: value } : item
      );
      return { ...prev, details: updatedDetails };
    });
  }, []);

  const handleModeChange = () => {
    if (isViewingOtherUser) return;
    if (!profileData) return;
    if (isEditing) {
      console.log("💾 저장 시작:", {
        hasProfileFile: !!profileData.profileFile,
        profileFileName: profileData.profileFile?.name,
        profileFileSize: profileData.profileFile?.size,
        imageUrl: profileData.imageUrl,
        imageId: profileData.imageId
      });
      // 유효성 검사
      const inputName = profileData.name || "";
      const rawPhone = profileData.details.find((d: any) => d.id === "phone")?.value || "";
      const cleanPhone = rawPhone.replace(/-/g, "");

      if (inputName.length > 6) return alert("이름은 최대 6글자까지만 입력 가능합니다.");
      if (cleanPhone.length > 11) return alert("전화번호 형식이 올바르지 않습니다.");


      // 저장 요청
      saveProfile(
        {
          profileData,
          initialIndexItemIds,
          profileFile: profileData.profileFile
        },
        {
          onSuccess: async () => {
            await refreshUser();
            setIsEditing(false);
          },
          onError: (error) => {
            console.error("💥 저장 실패:", error);
          }

        }
      );
    } else {
      setIsEditing(true);
    }
  };

  // 이력 수정(저장) 핸들러
  const handleSaveCareer = (updatedData: Career) => {
    setAllCareers((prev) => {
      return prev.map((career) =>
        String(career.id) === String(updatedData.id) ? { ...updatedData } : career
      );
    });
  };

  const handleDeleteCareer = (id: string | number) => {
    setAllCareers((prev) => prev.filter((career) => career.id !== id));
  };

  //  렌더링
  const resolvedIsLoading = isViewingOtherUser
    ? otherProfileQuery.isLoading
    : isLoading;
  const resolvedIsError = isViewingOtherUser
    ? otherProfileQuery.isError
    : isError;

  if (resolvedIsLoading) return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  if (resolvedIsError) return <div className="text-center p-10">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  if (!profileData) return <div className="text-center p-10">프로필 정보를 불러올 수 없습니다.</div>;
  if (!profileData) return <div className="text-center p-10">프로필 정보를 불러올 수 없습니다.</div>;


  return (
    <div className="flex flex-col gap-12 w-full">
      {/* 저장 중 로딩 표시 */}
      {isSaving && (
        <div className="fixed inset-0 bg-black/30 z-50 flex flex-col justify-center items-center cursor-wait">
          <div className="bg-white px-6 py-4 rounded-xl shadow-xl flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#6EEBC7] border-t-transparent rounded-full animate-spin"></div>
            <span className="font-pretendard text-[#342F28] font-medium">저장 중입니다...</span>
          </div>
        </div>
      )}

      <InfoSection
        isEditing={isEditing}
        isDetailsEmpty={isDetailsEmpty}
        data={profileData}
        experienceIds={allCareers.map(c => c.id)}
        showEditButton={!isViewingOtherUser}
        onDataChange={handleProfileChange}
        onModeChange={handleModeChange}      
      />

      <ResumeSection
        carrers={isViewingOtherUser ? [] : allCareers}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onSave={handleSaveCareer}
        onDelete={handleDeleteCareer}
        userName={isViewingOtherUser ? profileData?.name : user?.name}
        documents={isViewingOtherUser ? [] : documents}
      />
    </div>
  );
}

export default ProfilePage
