export type Post = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: string | null;
  title: string;
  description: string;
  content?: string;
  deadline: Date;
  category: string;
  tags: string;
  recruitCount: number;
  positions: string;
  requirements: string;
  viewCount?: number;
  author?: {
    name: string;
    username: string;
    avatar: string;
  };
}

export type PostDraft = {
  title: string;
  description: string;
  content?: string;
  deadline: Date;
  category: string;
  tags: string;
  recruitCount: number;
  positions: string;
  requirements: string;
  viewCount?: number;
}

export type UserProfile = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: string | null;
  university?: string;
  department?: string;
  bio?: string;
}

export type User = {
  id: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: Date;
  parentId: string | null;
  replies?: Comment[];
}
