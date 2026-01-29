import { useNavigate } from 'react-router-dom';
import type { Post } from '../../types';
import { Badge } from '../common/Badge';
import { formatDateRange } from '../../utils/dateUtils';
import { useAuth } from '../../hooks/useAuth';
import type { JSX } from 'react';

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
  const { isLoggedIn } = useAuth();
  const dateRange = formatDateRange(post.createdAt, post.deadline);
  // const positionsArray = post.positions.split(',').map(p => p.trim()).filter(Boolean);
  
  return (
    <article
      className="w-full flex flex-col min-h-[276px] items-center justify-center gap-2.5 p-4 sm:p-5 lg:p-6 relative bg-gray-scalewhite rounded-[10px] border border-solid border-gray-scalegray-scale-300 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/post/${post.id}`)}
    >
      <div className="flex flex-col w-full min-h-[212px] items-center justify-between relative">
        <div className="flex flex-col items-start gap-[21px] relative self-stretch w-full flex-[0_0_auto]">
          <header className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex min-h-[31px] items-center justify-between gap-2 relative self-stretch w-full">
              <h2 className="relative flex-1 mt-[-1.00px] font-heading-h2-100 font-[number:var(--heading-h2-100-font-weight)] text-black text-[length:var(--heading-h2-100-font-size)] tracking-[var(--heading-h2-100-letter-spacing)] leading-[var(--heading-h2-100-line-height)] [font-style:var(--heading-h2-100-font-style)] truncate min-w-0">
                {post.title}
              </h2>
              <Badge deadline={post.deadline} />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 relative flex-[0_0_auto]">
              <a
                href="#"
                className="relative w-fit mt-[-1.00px] font-body-b1-100 font-[number:var(--body-b1-100-font-weight)] text-gray-scalegray-scale-400 text-[length:var(--body-b1-100-font-size)] tracking-[var(--body-b1-100-letter-spacing)] leading-[var(--body-b1-100-line-height)] underline whitespace-nowrap [font-style:var(--body-b1-100-font-style)] text-sm sm:text-base"
              >
                {post.author?.name || '익명'}
              </a>
              <img
                className="relative w-px h-[19.5px] hidden sm:block"
                alt=""
                src="https://c.animaapp.com/ThzHYGdj/img/vector-203-7.svg"
                aria-hidden="true"
              />
              <time className="relative w-fit mt-[-1.00px] font-body-b1-100 font-[number:var(--body-b1-100-font-weight)] text-gray-scalegray-scale-400 text-[length:var(--body-b1-100-font-size)] tracking-[var(--body-b1-100-letter-spacing)] leading-[var(--body-b1-100-line-height)] whitespace-nowrap [font-style:var(--body-b1-100-font-style)] text-sm sm:text-base">
                {dateRange}
              </time>
            </div>
          </header>
          <p className="whitespace-pre-wrap relative self-stretch font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] tracking-[var(--body-b2-300-letter-spacing)] leading-[var(--body-b2-300-line-height)] [font-style:var(--body-b2-300-font-style)] line-clamp-3">
            {stripHtml(post.description)} 
          </p>
        </div>
        
        <footer className="flex items-center justify-end relative self-stretch w-full flex-[0_0_auto] mt-4">
          <div className="flex w-full items-center justify-end gap-2 sm:gap-2.5 relative flex-wrap">
            {isLoggedIn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // 쪽지 보내기 기능 구현
                }}
                className="all-[unset] box-border min-w-[120px] sm:w-[143px] px-3 sm:px-[15px] py-2 sm:py-2.5 bg-primaryprimary-50 hover:bg-primaryprimary-100 cursor-pointer rounded-[10px] flex items-center justify-center gap-2 sm:gap-2.5 relative transition-colors"
                type="button"
                aria-label="쪽지 보내기"
              >
                <span className="w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-primaryprimary-800 text-[length:var(--heading-h3-200-font-size)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap relative tracking-[var(--heading-h3-200-letter-spacing)] [font-style:var(--heading-h3-200-font-style)] text-sm sm:text-base">
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
