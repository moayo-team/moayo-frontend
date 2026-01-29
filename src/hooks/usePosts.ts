import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import type { Post, PostDraft } from '../types';

// Query key factory
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters?: { category?: string; tags?: string[]; search?: string }) =>
    [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

// Hook to fetch all posts with filters and pagination
export const usePosts = (filters?: {
  category?: string;
  tags?: string[];
  search?: string;
  page?: number;
  pageSize?: number;
  createdByCurrentUser?: boolean;
}) => {
  return useQuery({
    queryKey: postKeys.list(filters),
    queryFn: () => postsApi.getPosts(filters),
  });
};

// Hook to fetch a single post
export const usePost = (id: string) => {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsApi.getPost(id),
    enabled: !!id,
  });
};

// Hook to create a post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: PostDraft) => postsApi.createPost(post),
    onSuccess: () => {
      // Invalidate and refetch posts list
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

// Hook to update a post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, post }: { id: string; post: Partial<PostDraft> }) =>
      postsApi.updatePost(id, post),
    onSuccess: (data) => {
      // Invalidate both the list and the specific post detail
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(data.id) });
    },
  });
};

// Hook to delete a post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: () => {
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};
