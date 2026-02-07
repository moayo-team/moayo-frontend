import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationBar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { usePosts, useDeletePost } from '../hooks/usePosts';
import { Badge } from '../components/common/Badge';
import { DeleteConfirmationModal } from '../components/common/DeleteConfirmationModal';
// formatDateRange is not used here because we prefer server-provided dday; keep utils for other pages
import type { JSX } from 'react';
import leftarr from '../assets/leftarr.svg';
import rightarr from '../assets/rightarr.svg';
import menu from '../assets/menu.svg';
import profile_photo from '../assets/profile_photo.svg'

interface PostCardProps {
  post: {
    id: string;
    title: string;
    description: string;
    deadline: Date;
    createdAt: Date;
    positions: string;
    author?: {
      name: string;
      username: string;
      avatar: string;
    };
  };
  authorNameFallback?: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  isDeleting: boolean;
}

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

const PostCard = ({ post, authorNameFallback, onDelete, onEdit, isDeleting }: PostCardProps): JSX.Element => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const serverDDay = (post as any).dday as string | undefined;

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(post.id);
    setShowDeleteModal(false);
  };

  return (
    <article className="flex flex-col w-full min-h-[220px] p-6 relative bg-white rounded-[10px] border border-solid border-gray-scalegray-scale-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col w-full min-h-[212px] items-center justify-between relative">
        <div className="flex flex-col items-start gap-[21px] relative self-stretch w-full flex-[0_0_auto]">
          <header className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex min-h-[31px] items-center justify-between gap-2 relative self-stretch w-full">
              <h2 className="relative flex-1 mt-[-1.00px] font-heading-h2-100 font-[number:var(--heading-h2-100-font-weight)] text-black text-[length:var(--heading-h2-100-font-size)] tracking-[var(--heading-h2-100-letter-spacing)] leading-[var(--heading-h2-100-line-height)] [font-style:var(--heading-h2-100-font-style)] truncate min-w-0">
                {post.title}
              </h2>
              <Badge dday={serverDDay} deadline={post.deadline} />
            </div>
            <div className="inline-flex items-center gap-4 relative flex-[0_0_auto] flex-wrap">
              <p className="relative w-fit mt-[-1.00px] [font-family:'Pretendard-Medium',Helvetica] font-normal text-gray-scalegray-scale-400 text-lg tracking-[0] leading-[18px]">
                <span className="font-[number:var(--body-b1-100-font-weight)] leading-[var(--body-b1-100-line-height)] font-body-b1-100 [font-style:var(--body-b1-100-font-style)] tracking-[var(--body-b1-100-letter-spacing)] text-[length:var(--body-b1-100-font-size)]">
                  {post.author?.name || authorNameFallback || '익명'}
                </span>
              </p>
               {/* Removed time display */}
            </div>
          </header>
          <p className="whitespace-pre-wrap relative self-stretch font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] tracking-[var(--body-b2-300-letter-spacing)] leading-[var(--body-b2-300-line-height)] [font-style:var(--body-b2-300-font-style)] line-clamp-3">
              {stripHtml(post.description)}
          </p>
        </div>
        <div className="flex items-center justify-end gap-2.5 relative self-stretch w-full flex-[0_0_auto] mt-4">
          <button
            className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 relative flex-[0_0_auto] bg-gray-scalegray-scale-50 rounded-[10px] cursor-pointer hover:bg-gray-scalegray-scale-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            type="button"
            aria-label={`${post.title} 삭제하기`}
          >
            <span className="relative w-fit mt-[-1.00px] font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-400 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
              삭제하기
            </span>
          </button>
          <button
            className="all-[unset] box-border w-[143px] px-[15px] py-2.5 bg-primaryprimary-50 rounded-[10px] flex items-center justify-center gap-2.5 relative cursor-pointer hover:bg-primaryprimary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onEdit(post.id)}
            disabled={isDeleting}
            type="button"
            aria-label={`${post.title} 수정하기`}
          >
            <span className="relative w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-primaryprimary-800 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
              수정하기
            </span>
          </button>
        </div>

        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </div>
    </article>
  );
};

export const MyPostsPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch only posts created by current user
  const { data, isPending, error } = usePosts({ 
    page: currentPage, 
    pageSize,
    createdByCurrentUser: true
  });

  const deletePostMutation = useDeletePost();

  const handleDelete = async (id: string) => {
    try {
      await deletePostMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit post:", id);
    // Navigate to edit page
    navigate(`/edit/${id}`);
  };

  const handleAddPost = () => {
    navigate('/create');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="relative w-full min-h-screen bg-white">
        <NavigationBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-heading-h2-300 mb-4">로그인이 필요합니다</h2>
            <p className="text-gray-scalegray-scale-500 mb-6">내가 쓴 게시글을 보려면 로그인해주세요.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primaryprimary-300 rounded-[10px] font-heading-h3-200 text-gray-scalegray-scale-900 hover:bg-primaryprimary-400 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Generate pagination pages
  const getPaginationPages = () => {
    const totalPages = data?.totalPages || 1;
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const paginationPages = getPaginationPages();
  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="relative w-full min-h-screen bg-white pb-20">
      <NavigationBar />
      
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar - Left Column */}
          <aside className="w-full lg:w-[280px] flex-shrink-0 order-2 lg:order-1">
            <div className="flex flex-col gap-[15px]">
              <div className="h-auto sm:h-[258px] items-center justify-center gap-2.5 px-5 py-6 sm:py-[27px] bg-gray-scale30 rounded-[10px] flex flex-col">
                <div className="inline-flex flex-col items-center gap-2.5 relative flex-[0_0_auto] mt-[-7.50px] mb-[-7.50px]">
                  <img
                    className="w-[120px] sm:w-[150px] h-[120px] sm:h-[152px] relative object-cover rounded-full"
                    alt={`${user?.name || '사용자'} profile`}
                    src={user?.avatar || profile_photo}
                  />
                  <div className="flex flex-col w-full items-center gap-0.5 relative flex-[0_0_auto]">
                    <h2 className="relative self-stretch mt-[-1.00px] font-heading-h2-300 font-[number:var(--heading-h2-300-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--heading-h2-300-font-size)] text-center tracking-[var(--heading-h2-300-letter-spacing)] leading-[var(--heading-h2-300-line-height)] [font-style:var(--heading-h2-300-font-style)]">
                      {user?.name || '사용자'}
                    </h2>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/board')}
                className="all-[unset] box-border px-[15px] py-2.5 flex-1 self-stretch w-full grow bg-gray-scale30 rounded-[5px] flex items-center justify-center gap-2.5 relative hover:bg-gray-scalegray-scale-50 transition-colors cursor-pointer"
                type="button"
                aria-label="게시판으로 돌아가기"
              >
                <img
                  className="relative w-5 h-5"
                  alt=""
                  src={menu}
                  aria-hidden="true"
                />
                <span className="relative w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-500 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
                  게시판으로 돌아가기
                </span>
              </button>
            </div>
          </aside>

          {/* Main Content - Right Column */}
          <main className="flex-1 order-1 lg:order-2">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h1 className="relative w-fit font-heading-h1-200 font-[number:var(--heading-h1-200-font-weight)] text-black text-2xl sm:text-[length:var(--heading-h1-200-font-size)] tracking-[var(--heading-h1-200-letter-spacing)] leading-[var(--heading-h1-200-line-height)] whitespace-nowrap [font-style:var(--heading-h1-200-font-style)]">
                내가 쓴 게시글
              </h1>

              <button
                className="all-[unset] box-border w-full sm:w-[143px] p-3 sm:p-[15px] bg-primaryprimary-300 rounded-[10px] flex items-center justify-center gap-2.5 relative cursor-pointer hover:bg-primaryprimary-400 focus:outline-none focus:ring-2 focus:ring-primaryprimary-500 focus:ring-offset-2 transition-colors"
                onClick={handleAddPost}
                type="button"
                aria-label="게시글 추가"
              >
                <span className="relative w-fit mt-[-1.00px] font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
                  게시글 추가
                </span>
              </button>
            </header>

            {/* Loading State */}
            {isPending && (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-lg font-heading-h2-300 text-gray-scalegray-scale-500">
                  게시글을 불러오는 중...
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-lg font-heading-h2-300 text-red-600">
                  오류: {error.message}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isPending && !error && posts.length === 0 && (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-lg font-heading-h2-300 text-gray-scalegray-scale-500 mb-4">
                    작성한 게시글이 없습니다
                  </div>
                  <button
                    onClick={handleAddPost}
                    className="px-6 py-3 bg-primaryprimary-300 rounded-[10px] font-heading-h3-200 text-gray-scalegray-scale-900 hover:bg-primaryprimary-400 transition-colors"
                  >
                    첫 게시글 작성하기
                  </button>
                </div>
              </div>
            )}

            {/* Posts List */}
            {!isPending && !error && posts.length > 0 && (
              <>
                <section className="w-full mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-[19px]">
                    {posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        authorNameFallback={user?.name}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        isDeleting={deletePostMutation.isPending}
                      />
                    ))}
                  </div>
                </section>

                {/* Pagination */}
                {totalPages > 0 && (
                  <nav
                    className="flex justify-center items-center mt-8 sm:mt-12"
                    role="navigation"
                    aria-label="Pagination"
                  >
                    <button
                      className="items-start p-1.5 inline-flex relative flex-[0_0_auto] rounded-sm overflow-hidden hover:bg-gray-scalegray-scale-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      type="button"
                    >
                      <img
                        className="relative w-3 h-3"
                        alt="Left"
                        src={leftarr}
                      />
                    </button>

                    {paginationPages.map((page) => (
                      <button
                        key={page}
                        className={`${
                          currentPage === page
                            ? "inline-flex flex-col items-center gap-2.5 px-2 py-px relative flex-[0_0_auto] rounded-sm overflow-hidden border border-solid border-[#26e1ac]"
                            : "flex-col items-center gap-2.5 px-2 py-px inline-flex relative flex-[0_0_auto] rounded-sm overflow-hidden hover:bg-gray-scalegray-scale-50 transition-colors"
                        }`}
                        onClick={() => handlePageChange(page)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                        type="button"
                      >
                        <div
                          className={`relative ${
                            currentPage === page ? "w-2" : "w-fit"
                          } mt-[-1.00px] ${
                            currentPage === page
                              ? "font-body-medium font-[number:var(--body-medium-font-weight)] text-primaryprimary-500 text-[length:var(--body-medium-font-size)]"
                              : "font-body-regular font-[number:var(--body-regular-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--body-regular-font-size)]"
                          } text-center tracking-[${
                            currentPage === page
                              ? "var(--body-medium-letter-spacing)"
                              : "var(--body-regular-letter-spacing)"
                          }] leading-[${
                            currentPage === page
                              ? "var(--body-medium-line-height)"
                              : "var(--body-regular-line-height)"
                          }] ${
                            currentPage === page ? "" : "whitespace-nowrap"
                          } [font-style:${
                            currentPage === page
                              ? "var(--body-medium-font-style)"
                              : "var(--body-regular-font-style)"
                          }]`}
                        >
                          {page}
                        </div>
                      </button>
                    ))}

                    <button
                      className="items-start p-1.5 inline-flex relative flex-[0_0_auto] rounded-sm overflow-hidden hover:bg-gray-scalegray-scale-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      type="button"
                    >
                      <img
                        className="relative w-3 h-3"
                        alt="Right"
                        src={rightarr}
                      />
                    </button>
                  </nav>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
