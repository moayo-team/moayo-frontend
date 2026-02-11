import { create } from "zustand";
import type { BaseResponse } from "../types/career";

type HomeNotification = { unreadCount: number; items: any[] };

type ImminentPosts = {
  postId: number;
  userId: number;
  title: string;
  summary: string;
  categoryLabel: string;
  authorNickname: string;
  profileImageUrl: string;
  role: string;
  content: string;
  totalCount: string;
  dday: string;
};

type RecommendedUsers = {
  userId: number;
  name: string;
  imageUrl: string;
  bio: string;
  matchReason: string;
};

export type HomeResult = {
  notifications: HomeNotification;
  imminentPosts: ImminentPosts[];
  recommendedUsers: RecommendedUsers[];
};

type FetchHomeArgs = {
  userId: number;
  postsLimit?: number;
  recoLimit?: number;
  ttlMs?: number;
};

type HomeState = {
  loading: boolean;
  error: string | null;
  data: HomeResult | null;
  lastFetchedAt: number;
  lastUserId: number | null;
  fetchHome: (args: FetchHomeArgs) => Promise<void>;
};

export const useHomeStore = create<HomeState>((set, get) => ({
  loading: false,
  error: null,
  data: null,
  lastFetchedAt: 0,
  lastUserId: null,

  fetchHome: async ({ userId, postsLimit = 3, recoLimit = 2, ttlMs = 60_000 }) => {
    const { lastFetchedAt, lastUserId, data } = get();

    if (data && lastUserId === userId && Date.now() - lastFetchedAt < ttlMs) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const { apiClient } = await import("../api/client");

      const [similarRes, synergyRes] = await Promise.all([
        apiClient.get<BaseResponse<HomeResult>>("/api/v1/home", {
          params: { userId, postsLimit, recoLimit, recoType: "similar" },
        }),
        apiClient.get<BaseResponse<HomeResult>>("/api/v1/home", {
          params: { userId, postsLimit, recoLimit, recoType: "synergy" },
        }),
      ]);

      const simData = similarRes.data;
      const synData = synergyRes.data;

      if (!simData?.isSuccess && !synData?.isSuccess) {
        set({
          data: null,
          error: `${simData?.message ?? synData?.message ?? "데이터 로드 실패"}`,
          loading: false,
        });
        return;
      }

      const baseResult = simData?.isSuccess ? simData.result : synData.result;

      const combinedUsers = [
        ...(simData?.result?.recommendedUsers ?? []),
        ...(synData?.result?.recommendedUsers ?? []),
      ];

      const uniqUsers = Array.from(
        new Map(combinedUsers.map((u) => [u.userId, u])).values()
      );

      set({
        data: { ...baseResult, recommendedUsers: uniqUsers },
        loading: false,
        error: null,
        lastFetchedAt: Date.now(),
        lastUserId: userId,
      });
    } catch (e: any) {
      set({
        data: null,
        error: e?.message ?? "홈 데이터 로드 실패",
        loading: false,
      });
    }
  },
}));
