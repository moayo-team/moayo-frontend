import { useEffect, useMemo, useState } from 'react';
import type { Comment } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import defaultAvatar from '../../assets/profile_photo.svg';

interface CommentSectionProps {
  postId: string;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string, parentAuthor: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  isDeleting: boolean;
  isReply?: boolean;
}

const CommentItem = ({ comment, onReply, onEdit, onDelete, isDeleting, isReply = false }: CommentItemProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\./g, '.').replace(/ /g, '');
  };

  const isMyComment = user && comment.author.name === user.user?.name;

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit(comment.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(comment.id);
    setShowDeleteModal(false);
  };

  return (
    <div
      className={`${
        isReply
          ? "gap-2.5 p-2.5 bg-gray-scalegray-scale-50 rounded-lg"
          : "gap-[11px]"
      } ${
        isMyComment
          ? "bg-primaryprimary-50 border-l-4 border-primaryprimary-500 pl-4 py-2 rounded-r-lg"
          : ""
      } flex flex-col w-full items-start relative flex-[0_0_auto]`}
    >
      <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
        <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
          <img
            className="relative w-[35px] h-[35.36px] object-cover rounded-full"
            alt={`${comment.author.name} avatar`}
            src={comment.author.avatar || defaultAvatar}
          />
          <div className="relative w-fit font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-black text-[length:var(--body-b2-200-font-size)] tracking-[var(--body-b2-200-letter-spacing)] leading-[var(--body-b2-200-line-height)] whitespace-nowrap [font-style:var(--body-b2-200-font-style)]">
            {comment.author.name}
          </div>
        </div>
        <div className="inline-flex items-center gap-2.5 relative flex-[0_0_auto]">
          {isMyComment ? (
            <>
              <button 
                onClick={() => onReply(comment.id, comment.author.name)}
                className="w-fit mt-[-1.00px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] leading-[var(--body-b2-300-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)] hover:opacity-70 transition-opacity"
              >
                대댓글
              </button>
              <span className="text-gray-scalegray-scale-300">|</span>
              <button 
                onClick={() => setIsEditing(true)}
                disabled={isDeleting}
                className="w-fit mt-[-1.00px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] leading-[var(--body-b2-300-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)] hover:opacity-70 transition-opacity disabled:opacity-50"
              >
                수정
              </button>
              <span className="text-gray-scalegray-scale-300">|</span>
              <button 
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="w-fit mt-[-1.00px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] leading-[var(--body-b2-300-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)] hover:opacity-70 transition-opacity disabled:opacity-50"
              >
                삭제
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onReply(comment.id, comment.author.name)}
                className="w-fit mt-[-1.00px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] leading-[var(--body-b2-300-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)] hover:opacity-70 transition-opacity"
              >
                대댓글
              </button>
              <span className="text-gray-scalegray-scale-300">|</span>
              <button className="w-fit mt-[-1.00px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] leading-[var(--body-b2-300-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)] hover:opacity-70 transition-opacity">
                쪽지
              </button>
              <span className="text-gray-scalegray-scale-300">|</span>
              <button className="w-fit mt-[-1.00px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] leading-[var(--body-b2-300-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)] hover:opacity-70 transition-opacity">
                신고
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full items-start relative flex-[0_0_auto] mt-2">
        {isEditing ? (
          <div className="flex flex-col gap-2 w-full">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[80px] p-3 border border-solid border-gray-scalegray-scale-300 rounded-[5px] font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-black text-[length:var(--body-b2-200-font-size)] leading-[var(--body-b2-200-line-height)] tracking-[var(--body-b2-200-letter-spacing)] [font-style:var(--body-b2-200-font-style)] resize-none focus:outline-none focus:border-primaryprimary-500"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-scalegray-scale-100 rounded-[5px] font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-gray-scalegray-scale-700 hover:bg-gray-scalegray-scale-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-primaryprimary-300 rounded-[5px] font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-gray-scalegray-scale-900 hover:bg-primaryprimary-400 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="self-stretch mt-[-1.00px] font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-black text-[length:var(--body-b2-200-font-size)] leading-[var(--body-b2-200-line-height)] relative tracking-[var(--body-b2-200-letter-spacing)] [font-style:var(--body-b2-200-font-style)]">
              {comment.content}
            </p>
            <time className="relative self-stretch font-body-b3-200 font-[number:var(--body-b3-200-font-weight)] text-gray-scalegray-scale-500 text-[length:var(--body-b3-200-font-size)] tracking-[var(--body-b3-200-letter-spacing)] leading-[var(--body-b3-200-line-height)] [font-style:var(--body-b3-200-font-style)] mt-1">
              {formatDate(comment.createdAt)}
            </time>
          </>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="댓글을 삭제하시겠습니까?"
        message="삭제된 댓글은 복구할 수 없습니다."
        isDeleting={isDeleting}
      />
    </div>
  );
};

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const { isLoggedIn, user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const initialComments = useMemo<Comment[]>(
    () => [
      {
        id: `c-${postId}-1`,
        postId,
        author: { name: '모아요', avatar: defaultAvatar },
        content: '이 게시글 너무 흥미롭네요! 같이 하고 싶어요.',
        createdAt: new Date(),
        parentId: null,
        replies: [
          {
            id: `c-${postId}-1-1`,
            postId,
            author: { name: '작성자', avatar: defaultAvatar },
            content: '관심 가져주셔서 감사합니다! 쪽지로 알려주세요.',
            createdAt: new Date(),
            parentId: `c-${postId}-1`,
          },
        ],
      },
      {
        id: `c-${postId}-2`,
        postId,
        author: { name: '익명', avatar: defaultAvatar },
        content: '좋은 프로젝트네요.',
        createdAt: new Date(),
        parentId: null,
      },
    ],
    [postId]
  );

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleCommentSubmit = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    if (commentText.trim()) {
      const newComment: Comment = {
        id: `c-${postId}-${Date.now()}`,
        postId,
        author: { name: user?.user?.name || '나', avatar: defaultAvatar },
        content: commentText.trim(),
        createdAt: new Date(),
        parentId: replyingTo?.id ?? null,
      };

      setComments((prev) => {
        if (!replyingTo) return [newComment, ...prev];
        return prev.map((c) =>
          c.id === replyingTo.id
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c
        );
      });
      setCommentText('');
      setReplyingTo(null);
    }
  };

  const handleReply = (parentId: string, parentAuthor: string) => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    setReplyingTo({ id: parentId, author: parentAuthor });
    setCommentText(`@${parentAuthor} `);
    // Focus on the input
    const input = document.getElementById('main-comment-input') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentText('');
  };

  const handleEditComment = async (commentId: string, content: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) return { ...c, content };
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) => (r.id === commentId ? { ...r, content } : r)),
          };
        }
        return c;
      })
    );
  };

  const handleDeleteComment = async (commentId: string) => {
    setComments((prev) =>
      prev
        .filter((c) => c.id !== commentId)
        .map((c) => ({
          ...c,
          replies: c.replies?.filter((r) => r.id !== commentId),
        }))
    );
  };

  return (
    <div className="w-full">
      {/* Comments List */}
      <section className="flex flex-col w-full items-start gap-[17px] mb-8">
        {comments.map((comment) => (
          <div key={comment.id} className="w-full">
            <CommentItem 
              comment={comment} 
              onReply={handleReply}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              isDeleting={false}
            />

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-12 mt-4 space-y-4">
                {comment.replies.map((reply) => (
                  <CommentItem 
                    key={reply.id} 
                    comment={reply} 
                    onReply={handleReply}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                    isDeleting={false}
                    isReply={false}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Main Comment Input */}
      <div className="flex flex-col w-full gap-3">
        {/* Reply indicator */}
        {replyingTo && (
          <div className="flex items-center justify-between px-4 py-2 bg-primaryprimary-50 rounded-[5px] border border-solid border-primaryprimary-300">
            <span className="text-sm font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-gray-scalegray-scale-700">
              {replyingTo.author}님에게 답글 작성 중
            </span>
            <button
              onClick={handleCancelReply}
              className="text-sm font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-gray-scalegray-scale-500 hover:text-gray-scalegray-scale-700 transition-colors"
            >
              취소
            </button>
          </div>
        )}

        <div className="flex w-full items-center gap-5">
          <input
            id="main-comment-input"
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={isLoggedIn ? (replyingTo ? "답글 쓰기" : "댓글 쓰기") : "로그인 후 댓글을 작성할 수 있습니다"}
            disabled={!isLoggedIn}
            className={`flex flex-1 h-14 items-center gap-2.5 px-5 py-2.5 relative bg-gray-scalewhite rounded-[5px] border border-solid border-[#a7a7aa] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-gray-scalegray-scale-300 text-[length:var(--body-b2-300-font-size)] leading-[var(--body-b2-300-line-height)] tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)] focus:border-primaryprimary-500 focus:outline-none ${
              !isLoggedIn ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCommentSubmit();
              }
            }}
          />
          <button
            onClick={handleCommentSubmit}
            disabled={!isLoggedIn}
            className={`flex h-14 items-center justify-center gap-2.5 px-6 py-2.5 relative ${
              isLoggedIn 
                ? 'bg-primaryprimary-50 hover:bg-primaryprimary-100 cursor-pointer' 
                : 'bg-gray-scalegray-scale-100 cursor-not-allowed'
            } rounded-[5px] border border-solid border-[#23cd9d] transition-colors disabled:opacity-50`}
          >
            <span className="w-fit font-body-b1-100 font-[number:var(--body-b1-100-font-weight)] text-primaryprimary-600 text-[length:var(--body-b1-100-font-size)] leading-[var(--body-b1-100-line-height)] whitespace-nowrap relative tracking-[var(--body-b1-100-letter-spacing)] [font-style:var(--body-b1-100-font-style)]">
            등록
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
