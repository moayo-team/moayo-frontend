import { useQuery } from "@tanstack/react-query";
import { getUserProfileById } from "../api/profile/profile";
import type { OtherProfileResult } from "../types/profile";

export function useOtherUserProfile(userId?: number) {
	const enabled = typeof userId === "number";

	return useQuery<OtherProfileResult>({
		queryKey: ["other-profile", userId],
		enabled,
		queryFn: () => getUserProfileById(userId as number)
	});
}
