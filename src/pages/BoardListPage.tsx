import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { SearchBar } from '../features/board/components/SearchBar';
import { CategoryFilter } from '../features/board/components/CategoryFilter';
import { RoleFilter } from '../features/board/components/RoleFilter';
import { BoardList } from '../features/board/components/BoardList';
import { Button } from '../components/common/Button';
import { usePosts } from '../features/board/hooks/usePosts';
import type { Category } from '../types';

export const BoardListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedRole, setSelectedRole] = useState<string>('기획');

  // Use TanStack Query hook for fetching posts with filters
  const { data: filteredPosts = [], isPending, error } = usePosts({
    category: activeCategory,
    searchQuery
  });

  const handleViewDetails = (id: string) => {
    console.log('View details:', id);
    // Navigate to detail page
  };

  const handleApply = (id: string) => {
    console.log('Apply to:', id);
    // Navigate to apply page
  };

  const handleCreatePost = () => {
    console.log('Create new post');
    // Navigate to create page
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center p-12">
          <p className="text-red-500 font-body-b1-200">
            오류가 발생했습니다: {error?.message || '알 수 없는 오류'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-[1440px] mx-auto px-[50px] py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="flex flex-col gap-6">
            {/* 분야 Title */}
            <h1 className="font-heading-h1-200 font-[number:var(--heading-h1-200-font-weight)] text-black text-[length:var(--heading-h1-200-font-size)] tracking-[var(--heading-h1-200-letter-spacing)] leading-[var(--heading-h1-200-line-height)] [font-style:var(--heading-h1-200-font-style)]">
              분야
            </h1>

            {/* AI Matching Box */}
            <aside
              className="flex flex-col w-[281px] items-center justify-center gap-2.5 p-2.5 bg-primaryprimary-50 rounded-[10px]"
              aria-label="AI 매칭 정보"
            >
              <div className="flex flex-col w-full items-start gap-5">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  aria-label="AI 매칭 결과 보기"
                >
                  AI 매칭 결과보기
                </Button>

                <p className="font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-black text-[length:var(--body-b1-200-font-size)] tracking-[var(--body-b1-200-letter-spacing)] leading-[var(--body-b1-200-line-height)] [font-style:var(--body-b1-200-font-style)]">
                  지원역할: 디자이너
                  <br />
                  지원기간 : 24/05/31&nbsp;&nbsp;~ 24/06/01
                </p>
              </div>
            </aside>

            {/* Role Filter */}
            <RoleFilter onRoleSelect={setSelectedRole} />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Header with Category Filter and Create Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[22px]">
                <h1 className="font-heading-h1-200 font-[number:var(--heading-h1-200-font-weight)] text-black text-[length:var(--heading-h1-200-font-size)] tracking-[var(--heading-h1-200-letter-spacing)] leading-[var(--heading-h1-200-line-height)] [font-style:var(--heading-h1-200-font-style)]">
                  게시판
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <CategoryFilter
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreatePost}
                  aria-label="게시글 추가"
                >
                  게시글 추가
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="입력해주세요"
            />

            {/* Board List */}
            <BoardList
              posts={filteredPosts}
              isLoading={isPending}
              onViewDetails={handleViewDetails}
              onApply={handleApply}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
