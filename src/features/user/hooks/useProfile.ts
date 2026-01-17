import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/userApi';
import { mockUserProfiles } from '@/api/mockData';
import type { UserProfile } from '@/types';

// Query keys for cache management
export const profileKeys = {
  all: ['profiles'] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (userId: string) => [...profileKeys.details(), userId] as const,
};

/**
 * Custom hook for fetching user profile
 */
export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: profileKeys.detail(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      // For development: use mock data
      // In production: uncomment the line below
      // return await userApi.getProfile(userId);
      
      const profile = mockUserProfiles.find(p => p.createdByUserId === userId);
      if (!profile) throw new Error('Profile not found');
      return profile;
    },
    enabled: !!userId,
  });
};

/**
 * Custom hook for user profile mutations
 */
export const useProfileMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newProfile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'createdByUserId'>) => {
      // For development: mock implementation
      // In production: uncomment the line below
      // return userApi.createProfile(newProfile);
      
      return Promise.resolve({
        ...newProfile,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByUserId: 'current-user-id',
      } as UserProfile);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: profileKeys.detail(data.createdByUserId || '') 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<UserProfile> }) => {
      // For development: mock implementation
      // In production: uncomment the line below
      // return userApi.updateProfile(userId, data);
      
      const profile = mockUserProfiles.find(p => p.createdByUserId === userId);
      if (!profile) throw new Error('Profile not found');
      return Promise.resolve({ ...profile, ...data, updatedAt: new Date() });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: profileKeys.detail(variables.userId) 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => {
      // For development: mock implementation
      // In production: uncomment the line below
      // return userApi.deleteProfile(userId);
      
      return Promise.resolve();
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ 
        queryKey: profileKeys.detail(userId) 
      });
    },
  });

  return {
    createProfile: createMutation.mutateAsync,
    updateProfile: (userId: string, data: Partial<UserProfile>) => 
      updateMutation.mutateAsync({ userId, data }),
    deleteProfile: deleteMutation.mutateAsync,
    isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  };
};
