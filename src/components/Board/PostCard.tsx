import { useNavigate } from 'react-router-dom';
import type { Post } from '../../types';
import { Badge } from '../common/Badge';
// 서버에서 dday를 제공하면 그 값을 우선 사용하고, 없을 때만 클라이언트 계산을 사용합니다.
// 클라이언트 계산 함수는 utils/dateUtils에서 제공되지만, 여기서는 서버-provided dday를 우선 사용하기 위해 직접 참조합니다.
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../lib/apiClient';
import type { JSX, MouseEvent } from 'react';

const stripHtml = (html: string | undefined | null) => {
  if (!html) return "";
  
  // 1. <br> 태그를 줄바꿈 문자(\n)로 변환
  let formatted = html.replace(/<br\s*\/?>/gi, '\n');
  
  // 2. </p>와 </div> 태그 뒤에도 줄바꿈 추가 (단락 구분)
  formatted = formatted.replace(/<\/p>/gi, '\n').replace(/<\/div>/gi, '\n');
  
  // 3. 나머지 HTML 태그 제거
  const doc = new DOMParser().parseFromString(formatted, "text/html");
  return (doc.body.textContent || "").trim();
};

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps): JSX.Element => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const serverDDay = (post as any).dday as string | undefined;
  // const positionsArray = post.positions.split(',').map(p => p.trim()).filter(Boolean);

  const isOwner = Boolean(
    isLoggedIn &&
      user &&
      (
        String((post as any).userId ?? '') === String(user.user?.id ?? '') ||
        String((post as any).authorId ?? '') === String(user.user?.id ?? '') ||
        String(post.createdByUserId ?? '') === String(user.user?.id ?? '') ||
        String((post as any).author?.id ?? '') === String(user.user?.id ?? '')
      )
  );

  const handleSendMessage = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    const authorId =
      (post as any).userId ??
      (post as any).authorId ??
      post.createdByUserId ??
      (post as any).author?.id ??
      undefined;

    if (!authorId) {
      alert('작성자 정보를 찾을 수 없습니다.');
      return;
    }

    if (String(authorId) === String(user?.user?.id ?? '')) {
      alert('내 게시글에는 쪽지를 보낼 수 없습니다.');
      return;
    }

    const originPostId = Number(post.id);
    const payload: { userBId: number; originPostId?: number } = {
      userBId: Number(authorId)
    };

    if (Number.isFinite(originPostId)) {
      payload.originPostId = originPostId;
    }

    try {
      const res = await apiClient.post<
        { isSuccess: boolean; result: { roomId: number } }
      >('/api/v1/chat/rooms', payload);

      const roomId = res.data?.result?.roomId;
      if (!roomId) {
        alert('쪽지방 생성에 실패했습니다.');
        return;
      }

      navigate('/message', { state: { roomId } });
    } catch (error) {
      console.error('Failed to create chat room:', error);
      alert('쪽지방 생성에 실패했습니다.');
    }
  };
  
  return (
    <article
      className="w-full flex flex-col min-h-[220px] items-start p-5 sm:p-6 relative bg-gray-scalewhite rounded-[10px] border border-solid border-gray-scalegray-scale-300 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/post/${post.id}`)}
    >
      <div className="flex flex-col w-full h-full items-start justify-between relative gap-4">
        <div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
          <header className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex items-center justify-between gap-2 relative self-stretch w-full">
              <h2 className="relative flex-1 mt-[-1.00px] font-heading-h2-100 font-[number:var(--heading-h2-100-font-weight)] text-black text-[18px] tracking-[var(--heading-h2-100-letter-spacing)] leading-[var(--heading-h2-100-line-height)] [font-style:var(--heading-h2-100-font-style)] truncate min-w-0 text-left">
                {post.title}
              </h2>
              <Badge dday={serverDDay} deadline={post.deadline} />
            </div>
              <div className="flex flex-wrap items-center gap-2 relative flex-[0_0_auto]">
              <a
                href="#"
                className="relative w-fit mt-[-1.00px] font-body-b1-100 font-[number:var(--body-b1-100-font-weight)] text-gray-scalegray-scale-400 text-[13px] tracking-[var(--body-b1-100-letter-spacing)] leading-[var(--body-b1-100-line-height)] whitespace-nowrap [font-style:var(--body-b1-100-font-style)]"
              >
                {post.author?.name || '익명'}
              </a>
            </div>
          </header>
          <p className="text-left whitespace-pre-wrap relative self-stretch font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[14px] tracking-[var(--body-b2-300-letter-spacing)] leading-[var(--body-b2-300-line-height)] [font-style:var(--body-b2-300-font-style)] line-clamp-3">
            {stripHtml(post.description)} 
          </p>
        </div>
        
        <footer className="flex items-center justify-end relative self-stretch w-full flex-[0_0_auto] mt-4">
          <div className="flex w-full items-center justify-end gap-2 sm:gap-2.5 relative flex-wrap">
            {isLoggedIn && !isOwner && (
              <button
                onClick={handleSendMessage}
                className="all-[unset] box-border min-w-[120px] sm:w-[143px] px-3 sm:px-[15px] py-2 sm:py-2.5 bg-primaryprimary-50 hover:bg-primaryprimary-100 cursor-pointer rounded-[10px] flex items-center justify-center relative transition-colors"
                type="button"
                aria-label="쪽지 보내기"
              >
                <span className="w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-primaryprimary-800 text-[13px] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap relative tracking-[var(--heading-h3-200-letter-spacing)] [font-style:var(--heading-h3-200-font-style)]">
                  쪽지 보내기
                </span>
              </button>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
};
