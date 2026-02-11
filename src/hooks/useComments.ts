import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments';
//import type { Comment } from '../types';

// Query key factory for comments
export const commentKeys = {
  all: ['comments'] as const,
  byPost: (postId: string) => [...commentKeys.all, 'post', postId] as const,
};

// Hook to fetch comments for a post
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => commentsApi.getComments(postId),
    enabled: !!postId,
  });
};

// Hook to add a comment
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content, parentId }: { 
      postId: string; 
      content: string; 
      parentId?: string;
    }) => commentsApi.addComment(postId, content, parentId),
    onSuccess: (newComment) => {
      // Invalidate and refetch comments for this post
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.byPost(newComment.postId) 
      });
    },
  });
};

// Hook to delete a comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentsApi.deleteComment(commentId),
    onSuccess: () => {
      // Invalidate all comment queries
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
};
