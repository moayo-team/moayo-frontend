import { axiosInstance } from './axios';
import type { UserProfile } from '../types';

export const userApi = {
  // Get user profile
  getProfile: async (userId: string): Promise<UserProfile> => {
    const { data } = await axiosInstance.get(`/users/${userId}/profile`);
    return data;
  },

  // Create user profile
  createProfile: async (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'createdByUserId'>): Promise<UserProfile> => {
    const { data } = await axiosInstance.post('/users/profile', profile);
    return data;
  },

  // Update user profile
  updateProfile: async (userId: string, profile: Partial<UserProfile>): Promise<UserProfile> => {
    const { data } = await axiosInstance.patch(`/users/${userId}/profile`, profile);
    return data;
  },

  // Delete user profile
  deleteProfile: async (userId: string): Promise<void> => {
    await axiosInstance.delete(`/users/${userId}/profile`);
  },
};
