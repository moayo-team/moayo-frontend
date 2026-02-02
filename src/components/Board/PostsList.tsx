import { usePosts } from '../../hooks/usePosts';
import { PostCard } from './PostCard';
import type { JSX } from 'react';

interface PostsListProps {
  filters?: {
    category?: string;
    tags?: string[];
    search?: string;
    page?: number;
    pageSize?: number;
  };
}

export const PostsList = ({ filters }: PostsListProps): JSX.Element => {
  const { data, isPending, error } = usePosts(filters);
  const posts = data?.posts;

  if (isPending) {
    return (
      <section className="flex flex-col w-full max-w-[1023px] mx-auto items-center justify-center gap-6 px-4 sm:px-6 lg:px-0 py-12 min-h-[500px]">
        <div className="text-lg sm:text-xl font-heading-h2-300 font-[number:var(--heading-h2-300-font-weight)] text-gray-scalegray-scale-500">
          게시글을 불러오는 중...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col w-full max-w-[1023px] mx-auto items-center justify-center gap-6 px-4 sm:px-6 lg:px-0 py-12 min-h-[500px]">
        <div className="text-lg sm:text-xl font-heading-h2-300 font-[number:var(--heading-h2-300-font-weight)] text-red-600">
          오류: {error.message}
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="flex flex-col w-full max-w-[1023px] mx-auto items-center justify-center gap-6 px-4 sm:px-6 lg:px-0 py-12 min-h-[500px]">
        <div className="text-lg sm:text-xl font-heading-h2-300 font-[number:var(--heading-h2-300-font-weight)] text-gray-scalegray-scale-500">
          게시글이 없습니다
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1023px] mx-auto px-4 sm:px-6 lg:px-0 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-[19px]">
        {posts.map((post, idx) => (
          // Use server id when available; fall back to index-based key to guarantee uniqueness
          <PostCard key={post.id ?? `post-${idx}`} post={post} />
        ))}
      </div>
    </section>
  );
};
