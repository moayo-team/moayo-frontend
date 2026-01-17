import type { JobPosting } from '../../../types';
import { calculateDDay, isUrgent, formatDate } from '../../../utils/date';
import { Button } from '../../../components/common/Button';

interface BoardCardProps {
  post: JobPosting;
  onViewDetails: (id: string) => void;
  onApply: (id: string) => void;
}

export const BoardCard = ({ post, onViewDetails, onApply }: BoardCardProps) => {
  const dDay = calculateDDay(post.endDate);
  const urgent = isUrgent(post.endDate);
  const startDateStr = formatDate(post.startDate);
  const endDateStr = formatDate(post.endDate);

  return (
    <article className="flex flex-col w-full items-center justify-center gap-2.5 px-5 py-[19px] bg-gray-scalewhite rounded-[10px] border border-solid border-gray-scalegray-scale-300 hover:shadow-md transition-shadow cursor-pointer">
      <div className="relative self-stretch w-full">
        <div className="flex flex-col w-full items-start gap-[58px]">
          <div className="flex flex-col items-start gap-[21px] relative self-stretch w-full flex-[0_0_auto]">
            <header className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center justify-between relative self-stretch w-full">
                <h2 className="relative flex-1 truncate font-heading-h2-100 font-[number:var(--heading-h2-100-font-weight)] text-black text-[length:var(--heading-h2-100-font-size)] tracking-[var(--heading-h2-100-letter-spacing)] leading-[var(--heading-h2-100-line-height)] [font-style:var(--heading-h2-100-font-style)]">
                  {post.title}
                </h2>
              </div>

              <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
                <span className="relative w-fit font-body-b1-100 font-[number:var(--body-b1-100-font-weight)] text-gray-scalegray-scale-400 text-[length:var(--body-b1-100-font-size)] tracking-[var(--body-b1-100-letter-spacing)] leading-[var(--body-b1-100-line-height)] whitespace-nowrap [font-style:var(--body-b1-100-font-style)]">
                  {post.company}
                </span>

                <img
                  className="relative w-px h-[19.5px]"
                  alt=""
                  src="https://c.animaapp.com/6tEannht/img/vector-203-9.svg"
                  role="presentation"
                />

                <time className="relative w-fit font-body-b1-100 font-[number:var(--body-b1-100-font-weight)] text-gray-scalegray-scale-400 text-[length:var(--body-b1-100-font-size)] tracking-[var(--body-b1-100-letter-spacing)] leading-[var(--body-b1-100-line-height)] whitespace-nowrap [font-style:var(--body-b1-100-font-style)]">
                  {startDateStr} - {endDateStr}
                </time>
              </div>
            </header>

            <p className="relative self-stretch line-clamp-2 font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] tracking-[var(--body-b2-300-letter-spacing)] leading-[var(--body-b2-300-line-height)] [font-style:var(--body-b2-300-font-style)]">
              {post.description}
            </p>
          </div>

          <footer className="flex items-center justify-end gap-2.5 relative self-stretch w-full">
            <div
              className={`relative w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)] ${
                urgent ? 'text-red-500' : 'text-black'
              }`}
              aria-label={dDay}
            >
              {dDay}
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(post.id);
              }}
              aria-label="자세히보기"
            >
              자세히보기
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                onApply(post.id);
              }}
              aria-label="지원하기"
            >
              지원하기
            </Button>
          </footer>
        </div>
      </div>
    </article>
  );
};
