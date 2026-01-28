import type { Comment } from '../types';

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

// Mock comments data
const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    author: {
      name: '익명',
      avatar: 'https://ui-avatars.com/api/?name=익명&background=F2F2F2&color=343436&size=128',
    },
    content: '궁금한 점이 있어서 쪽지 드려도 될까요?',
    createdAt: new Date('2024-02-22'),
    parentId: null,
  },
  {
    id: '2',
    postId: '1',
    author: {
      name: '작성자',
      avatar: 'https://ui-avatars.com/api/?name=작성자&background=E9FCEF&color=26E1AC&size=128',
    },
    content: '네, 언제든지 연락주세요!',
    createdAt: new Date('2024-02-22'),
    parentId: '1',
  },
  {
    id: '3',
    postId: '2',
    author: {
      name: '개발자A',
      avatar: 'https://ui-avatars.com/api/?name=개발자A&background=F2F2F2&color=343436&size=128',
    },
    content: 'React 경험이 얼마나 필요한가요?',
    createdAt: new Date('2024-02-21'),
    parentId: null,
  },
];

export const commentsApi = {
  // Get comments for a specific post
  getComments: async (postId: string): Promise<Comment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const postComments = mockComments.filter(comment => comment.postId === postId);
    
    // Organize comments with replies
    const topLevelComments = postComments.filter(comment => !comment.parentId);
    const repliesMap = new Map<string, Comment[]>();
    
    // Group replies by parent ID
    postComments
      .filter(comment => comment.parentId)
      .forEach(reply => {
        const parentId = reply.parentId!;
        if (!repliesMap.has(parentId)) {
          repliesMap.set(parentId, []);
        }
        repliesMap.get(parentId)!.push(reply);
      });
    
    // Attach replies to their parent comments
    return topLevelComments.map(comment => ({
      ...comment,
      replies: repliesMap.get(comment.id) || [],
    }));
  },

  // Add a new comment
  addComment: async (postId: string, content: string, parentId?: string): Promise<Comment> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const currentUser = getCurrentUser();
    
    const newComment: Comment = {
      id: String(mockComments.length + 1),
      postId,
      author: currentUser ? {
        name: currentUser.name,
        avatar: currentUser.avatar,
      } : {
        name: '익명',
        avatar: 'https://ui-avatars.com/api/?name=익명&background=F2F2F2&color=343436&size=128',
      },
      content,
      createdAt: new Date(),
      parentId: parentId || null,
    };
    
    mockComments.push(newComment);
    return newComment;
  },

  // Delete a comment
  deleteComment: async (commentId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const index = mockComments.findIndex(comment => comment.id === commentId);
    if (index !== -1) {
      mockComments.splice(index, 1);
    }
  },
};
