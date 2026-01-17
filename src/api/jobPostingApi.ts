import { axiosInstance } from './axios';
import type { JobPosting } from '@/types';

export const jobPostingApi = {
  // Get all job postings with optional filters
  getAll: async (params?: {
    category?: string;
    searchQuery?: string;
  }): Promise<JobPosting[]> => {
    const { data } = await axiosInstance.get('/job-postings', { params });
    return data;
  },

  // Get a single job posting by ID
  getById: async (id: string): Promise<JobPosting> => {
    const { data } = await axiosInstance.get(`/job-postings/${id}`);
    return data;
  },

  // Create a new job posting
  create: async (posting: Omit<JobPosting, 'id' | 'createdAt' | 'updatedAt' | 'createdByUserId'>): Promise<JobPosting> => {
    const { data } = await axiosInstance.post('/job-postings', posting);
    return data;
  },

  // Update an existing job posting
  update: async (id: string, posting: Partial<JobPosting>): Promise<JobPosting> => {
    const { data } = await axiosInstance.patch(`/job-postings/${id}`, posting);
    return data;
  },

  // Delete a job posting
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/job-postings/${id}`);
  },

  // Increment view count
  incrementViewCount: async (id: string): Promise<JobPosting> => {
    const { data } = await axiosInstance.post(`/job-postings/${id}/view`);
    return data;
  },
};
