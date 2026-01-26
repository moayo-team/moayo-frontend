import type { Post, PostDraft } from '../types';
import { mockPosts } from '../data/mockPosts';

// Get current user from localStorage
const getCurrentUser = () => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const postsApi = {
  // Get all posts with optional filters and pagination
  getPosts: async (filters?: {
    category?: string;
    tags?: string[];
    search?: string;
    page?: number;
    pageSize?: number;
    createdByCurrentUser?: boolean;
  }): Promise<{ posts: Post[]; total: number; totalPages: number }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    let filteredPosts = [...mockPosts];
    
    // Filter by current user's posts
    if (filters?.createdByCurrentUser) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        filteredPosts = filteredPosts.filter((post) => 
          post.createdByUserId === currentUser.id
        );
      } else {
        // If not logged in, return empty array
        filteredPosts = [];
      }
    }
    
    // Filter by tags (selected job filters)
    if (filters?.tags && filters.tags.length > 0) {
      filteredPosts = filteredPosts.filter((post) =>
        filters.tags!.some((tag) => post.tags.includes(tag))
      );
    }
    
    // Filter by search query
    if (filters?.search) {
      const query = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query)
      );
    }
    
    // Pagination
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    return {
      posts: paginatedPosts,
      total,
      totalPages,
    };
  },

  // Get a single post by ID
  getPost: async (id: string): Promise<Post> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const post = mockPosts.find((p) => p.id === id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  },

  // Create a new post
  createPost: async (post: PostDraft): Promise<Post> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const currentUser = getCurrentUser();
    
    const newPost: Post = {
      ...post,
      id: String(mockPosts.length + 1),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdByUserId: currentUser?.id || null,
      author: currentUser ? {
        name: currentUser.name,
        username: currentUser.email.split('@')[0],
        avatar: currentUser.avatar,
      } : undefined,
    };
    mockPosts.unshift(newPost);
    return newPost;
  },

  // Update an existing post
  updatePost: async (id: string, post: Partial<PostDraft>): Promise<Post> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockPosts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Post not found');
    }
    mockPosts[index] = {
      ...mockPosts[index],
      ...post,
      updatedAt: new Date(),
    };
    return mockPosts[index];
  },

  // Delete a post
  deletePost: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockPosts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Post not found');
    }
    mockPosts.splice(index, 1);
  },
};
