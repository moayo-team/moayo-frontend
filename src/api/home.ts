import { apiClient } from "./client"; 

export type HomeResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  timestamp: string;
  result: {
    notifications: {
      unreadCount: number;
      items: Array<Record<string, any>>;
    };
    imminentPosts: Array<{
      postId: number;
      userId: number;
      title: string;
      summary: string;
      categoryLabel: string;
      authorNickname: string;
      profileImageUrl: string | null;
      role: string;
      content: string;
      totalCount: string;
      dday: string;
    }>;
    recommendedUsers: Array<{
      userId: number;
      name: string;
      imageUrl: string | null;
      bio: string;
      matchReason: string;
    }>;
  };
};

export async function getHome(): Promise<HomeResponse> {
  const res = await apiClient.get<HomeResponse>("/api/v1/home");
  return res.data;
}
