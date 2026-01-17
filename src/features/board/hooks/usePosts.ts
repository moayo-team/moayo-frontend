import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobPostingApi } from '@/api/jobPostingApi';
import { mockJobPostings } from '@/api/mockData';
import type { JobPosting } from '@/types';

// Query keys for cache management
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters?: { category?: string; searchQuery?: string }) => 
    [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

/**
 * Custom hook for fetching job postings with filters
 */
export const usePosts = (filters?: {
  category?: string;
  searchQuery?: string;
}) => {
  return useQuery({
    queryKey: postKeys.list(filters),
    queryFn: async () => {
      // For development: use mock data
      // In production: uncomment the line below
      // return await jobPostingApi.getAll(filters);
      
      // Mock implementation with client-side filtering
      let posts = [...mockJobPostings];
      
      if (filters?.category && filters.category !== 'All') {
        posts = posts.filter(post => post.category === filters.category);
      }
      
      if (filters?.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        posts = posts.filter(post =>
          post.title.toLowerCase().includes(query) ||
          post.company.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query)
        );
      }
      
      return posts;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Custom hook for fetching a single job posting by ID
 */
export const usePost = (id: string) => {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: async () => {
      // For development: use mock data
      // In production: uncomment the line below
      // return await jobPostingApi.getById(id);
      
      const post = mockJobPostings.find(p => p.id === id);
      if (!post) throw new Error('Post not found');
      return post;
    },
    enabled: !!id,
  });
};

/**
 * Custom hook for job posting mutations
 */
export const usePostMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newPost: Omit<JobPosting, 'id' | 'createdAt' | 'updatedAt' | 'createdByUserId'>) => {
      // For development: mock implementation
      // In production: uncomment the line below
      // return jobPostingApi.create(newPost);
      
      return Promise.resolve({
        ...newPost,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByUserId: 'current-user-id',
      } as JobPosting);
    },
    onSuccess: () => {
      // Invalidate and refetch posts list
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobPosting> }) => {
      // For development: mock implementation
      // In production: uncomment the line below
      // return jobPostingApi.update(id, data);
      
      const post = mockJobPostings.find(p => p.id === id);
      if (!post) throw new Error('Post not found');
      return Promise.resolve({ ...post, ...data, updatedAt: new Date() });
    },
    onSuccess: (_, variables) => {
      // Invalidate specific post and lists
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      // For development: mock implementation
      // In production: uncomment the line below
      // return jobPostingApi.delete(id);
      
      return Promise.resolve();
    },
    onSuccess: () => {
      // Invalidate posts list
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });

  return {
    createPost: createMutation.mutateAsync,
    updatePost: (id: string, data: Partial<JobPosting>) => 
      updateMutation.mutateAsync({ id, data }),
    deletePost: deleteMutation.mutateAsync,
    isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  };
};
