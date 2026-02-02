import axiosInstance from './axios';
import type { Comment } from '../types';

const parseComment = (raw: any): Comment => ({
  ...raw,
  createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
  replies: raw.replies ? raw.replies.map((r: any) => parseComment(r)) : undefined,
});

export const commentsApi = {
  // Get comments for a specific post
  getComments: async (postId: string): Promise<Comment[]> => {
  const res = await axiosInstance.get(`/posts/${postId}/comments`);
    let raw = res.data;
    // unwrap BaseResponse wrapper if present
    if (raw && raw.result !== undefined) raw = raw.result;

    // support shapes: array or { comments: [...] }
    const items = Array.isArray(raw) ? raw : raw?.comments || raw?.data || raw?.items || [];
    return (items || []).map(parseComment);
  },

  // Add a new comment
  addComment: async (postId: string, content: string, parentId?: string): Promise<Comment> => {
    const payload: any = { content };
    if (parentId) payload.parentId = parentId;
  const res = await axiosInstance.post(`/posts/${postId}/comments`, payload);
  let raw = res.data;
  if (raw && raw.result !== undefined) raw = raw.result;
  return parseComment(raw);
  },

  // Delete a comment
  deleteComment: async (commentId: string): Promise<void> => {
    // Try common endpoints: /comments/{id} or /posts/comments/{id}
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
    } catch (err) {
      // fallback
      await axiosInstance.delete(`/posts/comments/${commentId}`);
    }
  },
};
