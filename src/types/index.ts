export interface JobPosting {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: string | null;
  title: string;
  company: string;
  startDate: Date;
  endDate: Date;
  description: string;
  recruitCount: number;
  positions: string;
  requirements: string;
  category: string;
  viewCount: number;
}

export interface UserProfile {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: string | null;
  university: string;
  department: string;
  bio: string;
}

export type Category = 'All' | 'Planning' | 'Marketing' | 'Design' | 'IT';
