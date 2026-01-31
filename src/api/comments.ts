import { apiClient } from './client';
import type { Comment } from '../types';

const parseComment = (raw: any): Comment => ({
  ...raw,
  createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
  replies: raw.replies ? raw.replies.map((r: any) => parseComment(r)) : undefined,
});

export const commentsApi = {
  // Get comments for a specific post
  getComments: async (postId: string): Promise<Comment[]> => {
    const res = await apiClient.get(`/posts/${postId}/comments`);
    const raw = res.data;

    // support shapes: array or { comments: [...] }
    const items = Array.isArray(raw) ? raw : raw?.comments || raw?.data || [];
    return (items || []).map(parseComment);
  },

  // Add a new comment
  addComment: async (postId: string, content: string, parentId?: string): Promise<Comment> => {
    const payload: any = { content };
    if (parentId) payload.parentId = parentId;
    const res = await apiClient.post(`/posts/${postId}/comments`, payload);
    return parseComment(res.data);
  },

  // Delete a comment
  deleteComment: async (commentId: string): Promise<void> => {
    // Try common endpoints: /comments/{id} or /posts/comments/{id}
    try {
      await apiClient.delete(`/comments/${commentId}`);
    } catch (err) {
      // fallback
      await apiClient.delete(`/posts/comments/${commentId}`);
    }
  },
};
