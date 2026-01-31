import { apiClient } from './client';
import type { Post, PostDraft } from '../types';

const parsePost = (raw: any): Post => {
  return {
    ...raw,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
    deadline: raw.deadline ? new Date(raw.deadline) : new Date(),
  } as Post;
};

export const postsApi = {
  // Get posts with optional filters and pagination
  getPosts: async (filters?: {
    category?: string;
    tags?: string[];
    search?: string;
    page?: number;
    pageSize?: number;
    createdByCurrentUser?: boolean;
    sort?: string;
    order?: string;
    limit?: number;
  }): Promise<{ posts: Post[]; total: number; totalPages: number }> => {
    // If requesting current user's posts, call /posts/me
    if (filters?.createdByCurrentUser) {
      const res = await apiClient.get('/posts/me');
      const raw = res.data;
      const posts: Post[] = (raw?.posts || raw?.content || raw || []).map(parsePost);
      const total = raw?.total || raw?.totalElements || posts.length;
      const totalPages = raw?.totalPages ?? Math.ceil(total / (filters?.pageSize || 10));
      return { posts, total, totalPages };
    }

    const params: Record<string, any> = {};
    if (filters?.page) params.page = filters.page;
    if (filters?.pageSize) params.pageSize = filters.pageSize;
    if (filters?.search) params.search = filters.search;
    if (filters?.category) params.category = filters.category;
    if (filters?.tags && filters.tags.length > 0) params.tags = filters.tags.join(',');
    if (filters?.sort) params.sort = filters.sort;
    if (filters?.order) params.order = filters.order;
    if (filters?.limit) params.limit = filters.limit;

    const res = await apiClient.get('/posts', { params });
    const raw = res.data;

    // Support multiple response shapes (Spring pageable or custom)
    let items: any[] = [];
    let total = 0;
    let totalPages = 0;

    if (Array.isArray(raw)) {
      items = raw;
      total = raw.length;
      totalPages = 1;
    } else if (raw.content) {
      items = raw.content;
      total = raw.totalElements ?? raw.total ?? items.length;
      totalPages = raw.totalPages ?? Math.ceil(total / (filters?.pageSize || 10));
    } else if (raw.posts) {
      items = raw.posts;
      total = raw.total ?? items.length;
      totalPages = raw.totalPages ?? Math.ceil(total / (filters?.pageSize || 10));
    } else if (raw.data && Array.isArray(raw.data)) {
      items = raw.data;
      total = items.length;
      totalPages = 1;
    } else {
      items = raw.items || [];
      total = raw.total || items.length;
      totalPages = raw.totalPages ?? Math.ceil(total / (filters?.pageSize || 10));
    }

    const posts: Post[] = (items || []).map(parsePost);
    return { posts, total, totalPages };
  },

  // Get single post
  getPost: async (id: string): Promise<Post> => {
    const res = await apiClient.get(`/posts/${id}`);
    return parsePost(res.data);
  },

  // Create post
  createPost: async (post: PostDraft): Promise<Post> => {
    const payload = {
      ...post,
      deadline: post.deadline instanceof Date ? post.deadline.toISOString() : post.deadline,
    };
    const res = await apiClient.post('/posts', payload);
    return parsePost(res.data);
  },

  // Update post
  updatePost: async (id: string, post: Partial<PostDraft>): Promise<Post> => {
    const payload = { ...post } as any;
    if (payload.deadline instanceof Date) payload.deadline = payload.deadline.toISOString();
    const res = await apiClient.patch(`/posts/${id}`, payload);
    return parsePost(res.data);
  },

  // Delete post
  deletePost: async (id: string): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },
};
