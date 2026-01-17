import type { JobPosting } from '../../../types';
import { BoardCard } from './BoardCard';
import { Spinner } from '../../../components/common/Spinner';

interface BoardListProps {
  posts: JobPosting[];
  isLoading: boolean;
  onViewDetails: (id: string) => void;
  onApply: (id: string) => void;
}

export const BoardList = ({ posts, isLoading, onViewDetails, onApply }: BoardListProps) => {
  if (isLoading) {
    return <Spinner />;
  }

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="font-body-b1-200 text-gray-scalegray-scale-400">
          게시글이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col w-full items-start gap-[19px]">
      {posts.map((post) => (
        <BoardCard
          key={post.id}
          post={post}
          onViewDetails={onViewDetails}
          onApply={onApply}
        />
      ))}
    </section>
  );
};
