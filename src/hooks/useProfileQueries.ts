import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/profile/profile";
import axios from "axios";

export const useProfileData = () => {
  const profileQuery = useQuery({
    queryKey: ["myProfile"],
    queryFn: getProfile,
    retry: false,
  });

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

    isLoading: profileQuery.isLoading,
    isError: isProfileRealError,

    refetch: profileQuery.refetch,
  };
};
