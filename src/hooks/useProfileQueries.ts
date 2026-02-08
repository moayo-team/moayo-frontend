import { useQuery } from "@tanstack/react-query";
import { getOtherProfile, getProfile, getUserProfileById } from "../api/profile/profile";
import axios from "axios";
import { getExperienceDetail, getExperienceFiles, getExperienceLinks, getMyExperiences, getPublicExperiences } from "../api/profile/experiences";
import type { Career, ExperienceSummary } from "../types/career";
import { useMemo } from "react";

//프로필, 이력
export const useProfileData = () => {
  const profileQuery = useQuery({
    queryKey: ["myProfile"],
    queryFn: getProfile,
    retry: false,
  });

  const experienceQuery = useQuery({
    queryKey: ["myExperiences"],
    queryFn: getMyExperiences,
    retry: false,
  });

  const mappedExperiences = useMemo(() => {
    const res = experienceQuery.data?.result; 
    
    if (!Array.isArray(res)) return [];
    return res.map((exp: ExperienceSummary) => ({
      id: exp.experienceId,
      title: exp.title,
      organizer: exp.organization,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate,
      period: `${exp.startDate.replace(/-/g, ".")} - ${exp.endDate.replace(/-/g, ".")}`,
      participation: exp.activity,
      intro: exp.summary || "", 
      visible: exp.visible,
      isPublic: exp.visible,
      fileName: [],
      link: [],
    }));
  }, [experienceQuery.data?.result]);

  const isProfileRealError =
    profileQuery.isError &&
    axios.isAxiosError(profileQuery.error) &&
    profileQuery.error.response?.data?.code !== "PROFILE404_1";

  return {
    user: profileQuery.data?.result.user,
    profile: profileQuery.data?.result.profile,
    tags: profileQuery.data?.result.interestTags,
    indexItems: profileQuery.data?.result.indexItems,
    documents: profileQuery.data?.result.documents,

    experiences: mappedExperiences,

    isLoading: profileQuery.isLoading,
    isError: isProfileRealError,

    refetch: () => {
      profileQuery.refetch();
      experienceQuery.refetch();
    },
  };
};

//상세 이력조회
export const useExperienceDetail = (experienceId: number | null) => {
  return useQuery({
    queryKey: ["experienceDetail", experienceId],
    queryFn: () => getExperienceDetail(experienceId!),
    enabled: !!experienceId, 
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });
};

//이력 첨부파일 조회
export const useExperienceFiles = (experienceId: number | null) => {
    return useQuery({
        queryKey: ["experienceFiles", experienceId],
        queryFn: () => getExperienceFiles(experienceId!),
        enabled: !!experienceId,
    });
};

//이력 링크 조회
export const useExperienceLinks = (experienceId: number | null) => {
    return useQuery({
        queryKey: ["experienceLinks", experienceId],
        queryFn: () => getExperienceLinks(experienceId!),
        enabled: !!experienceId,
    });
};

//특정 사용자 공개 이력 조회
export const usePublicExperiences = (targetUserId: number | null) => {
  const publicExpQuery = useQuery({
    queryKey: ["publicExperiences", targetUserId],
    queryFn: () => getPublicExperiences(targetUserId!),
    enabled: !!targetUserId, 
    retry: false,
  });

  // 데이터 가공 
  const mappedPublicExperiences = useMemo(() => {
    const res = publicExpQuery.data?.result;
    if (!Array.isArray(res)) return [];

    return res.map((exp: ExperienceSummary) => ({
      id: exp.experienceId,
      title: exp.title,
      organizer: exp.organization,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate,
      period: `${exp.startDate.replace(/-/g, ".")} - ${exp.endDate.replace(/-/g, ".")}`,
      participation: exp.activity,
      intro: exp.summary || "", 
      visible: exp.visible,
      isPublic: exp.visible,
      files:[],
      //files: exp.files || [],
      link: [],
    }));
  }, [publicExpQuery.data?.result]);

  return {
    experiences: mappedPublicExperiences,
    isLoading: publicExpQuery.isLoading,
    isError: publicExpQuery.isError,
    refetch: publicExpQuery.refetch,
  };
};

// 타인 프로필 정보 조회 
export const getOtherUserProfile = (userId: number | null) => {
  const query = useQuery({
    queryKey: ["otherUserProfile", userId],
    queryFn: () => getOtherProfile(userId!),
    enabled: !!userId,
    retry: false,
  });

  return {
    data: query.data?.result, 
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};