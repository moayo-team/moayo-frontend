import { useNavigate } from 'react-router-dom';
import { NavigationBar } from '../components/Navbar';
import { PostsList } from '../components/Board/PostsList';
import { JobFilter } from '../components/Board/JobFilter';
import { useFilters } from '../hooks/useFilters';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';
import { useHomeStore } from '../store/homeStore';
import type { JSX } from 'react';
import { useEffect } from 'react';
import menu from '../assets/menu.svg';
import grayplane from "../assets/grayplane.png"
import remove from '../assets/delete.svg';
import leftarr from '../assets/leftarr.svg';
import rightarr from '../assets/rightarr.svg';
import profile_photo from '../assets/default_profile.svg'

export const BoardPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { isLoggedIn, login, user } = useAuth();
  const {
    selectedJobFilters,
    currentPage,
    toggleJobFilter,
    removeJobFilter,
    setCurrentPage,
  } = useFilters();

  const { data } = usePosts({ tags: selectedJobFilters, page: currentPage, pageSize: 10 });
  const totalPages = data?.totalPages || 5;

  const homeData = useHomeStore((s) => s.data);
  const fetchHome = useHomeStore((s) => s.fetchHome);
  const unreadCount = homeData?.notifications?.unreadCount ?? 0;

  const profileImageUrl = user?.profile?.imageUrl;
  const resolvedProfileImage =
    profileImageUrl && profileImageUrl !== 'default_url'
      ? (profileImageUrl.startsWith('http')
        ? profileImageUrl
        : `${import.meta.env.VITE_API_BASE_URL}${profileImageUrl}`)
      : profile_photo;

  useEffect(() => {
    const userId = Number(user?.user?.id);
    if (!isLoggedIn || !Number.isFinite(userId)) return;

    fetchHome({
      userId,
      postsLimit: 1,
      recoLimit: 1,
      ttlMs: 30_000,
    });
  }, [isLoggedIn, user?.user?.id, fetchHome]);

  // Generate pagination pages array
  const getPaginationPages = () => {
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

  return (
    <div
      className="relative w-full min-h-screen bg-white pb-20"
      data-model-id="927:9601"
    >
      <NavigationBar />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar - Left Column */}
          <aside className="w-full lg:w-[280px] flex-shrink-0 order-2 lg:order-1 pt-20">
            <div className="flex flex-col gap-[15px]">
              {isLoggedIn ? (
                <section className="inline-flex flex-col items-start gap-4 relative w-full">

                  <div className="flex flex-col w-full items-start gap-4 relative">
                    <article className="flex flex-col items-center justify-center gap-2.5 px-5 py-[27px] relative self-stretch w-full bg-[#fbfaf9] rounded-[10px]">
                      <div className="inline-flex flex-col items-center gap-3 relative">
                        <img
                          className={`w-[120px] h-[121px] rounded-[10px] ${
                            resolvedProfileImage === profile_photo ? "object-contain p-2" : "object-cover"
                          }`}
                          alt={`Profile picture of ${user?.user?.name || '사용자'}`}
                          src={resolvedProfileImage}
                          onError={(e) => {
                            e.currentTarget.src = profile_photo;
                          }}
                        />

                        <div className="inline-flex flex-col items-center gap-1.5 relative">
                          <h3 className="self-stretch mt-[-1.03px] [font-family:'Pretendard-Bold',Helvetica] font-bold text-warm-gray-scalegray-scale-900 text-[24.6px] text-center leading-[32.0px] relative tracking-[0]">
                            {user?.user?.name || '사용자'}
                          </h3>
                        </div>
                      </div>
                    </article>

                    <nav className="flex items-center gap-1 self-stretch w-full relative">
                      <button
                        className="flex h-16 items-center justify-center gap-2.5 px-[15px] py-2.5 relative flex-1 grow bg-gray-scale30 rounded-[5px] hover:bg-gray-scalegray-scale-50 transition-colors"
                        aria-label="쪽지"
                        onClick={() => navigate('/message')}
                      >
                        <img className="relative w-6 h-6" alt="message" src={grayplane} />
                        <span className="w-fit font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-gray-scalegray-scale-500 text-[length:var(--heading-h3-300-font-size)] leading-[var(--heading-h3-300-line-height)] whitespace-nowrap relative tracking-[var(--heading-h3-300-letter-spacing)] [font-style:var(--heading-h3-300-font-style)]">
                          쪽지
                        </span>
                        {unreadCount > 0 && (
                          <span className="font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-gray-scalegray-scale-500 text-[length:var(--heading-h3-300-font-size)] leading-[var(--heading-h3-300-line-height)] tracking-[var(--heading-h3-300-letter-spacing)] [font-style:var(--heading-h3-300-font-style)]">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </button>
                    </nav>

                    <button
                      onClick={() => navigate('/my-posts')}
                      className="flex h-16 items-center justify-center gap-2.5 px-[15px] py-2.5 relative self-stretch w-full bg-gray-scale30 rounded-[5px] hover:bg-gray-scalegray-scale-50 transition-colors"
                      aria-label="내가 쓴 게시글"
                    >
                      <img className="relative w-5 h-5" alt="menu icon" src={menu} />
                      <span className="w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-500 text-[length:var(--heading-h3-200-font-size)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap relative tracking-[var(--heading-h3-200-letter-spacing)] [font-style:var(--heading-h3-200-font-style)]">
                        내가 쓴 게시글
                      </span>
                    </button>
                  </div>
                </section>
              ) : (
                <button
                  onClick={login}
                  className="flex flex-col h-auto sm:h-[258px] items-center justify-center gap-4 px-5 py-6 sm:py-[27px] bg-gray-scale30 rounded-[10px] hover:bg-gray-scalegray-scale-50 transition-colors cursor-pointer w-full"
                >
                  <div className="text-center">
                    <h3 className="font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-700 text-[length:var(--heading-h3-200-font-size)] mb-2">
                      로그인이 필요합니다
                    </h3>
                    <p className="font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-gray-scalegray-scale-500 text-[length:var(--body-b2-300-font-size)] mb-4">
                      프로필을 보려면 로그인하세요
                    </p>
                  </div>
                </button>
              )}
            </div>

            <JobFilter
              selectedFilters={selectedJobFilters}
              onToggleFilter={toggleJobFilter}
            />
          </aside>

          {/* Main Content - Right Column */}
          <main className="flex-1 order-1 lg:order-2">
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h1 className="relative w-fit font-heading-h1-200 font-[number:var(--heading-h1-200-font-weight)] text-black text-2xl sm:text-[length:var(--heading-h1-200-font-size)] tracking-[var(--heading-h1-200-letter-spacing)] leading-[var(--heading-h1-200-line-height)] whitespace-nowrap [font-style:var(--heading-h1-200-font-style)]">
                게시판
              </h1>

              {isLoggedIn && (
                <button
                  onClick={() => navigate('/create')}
                  className="all-[unset] box-border w-full sm:w-[143px] p-3 sm:p-[15px] bg-primaryprimary-300 hover:bg-primaryprimary-400 active:bg-primaryprimary-500 cursor-pointer rounded-[10px] flex items-center justify-center gap-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primaryprimary-500 focus:ring-offset-2"
                  type="button"
                  aria-label="게시글 추가"
                >
                  <span className="relative w-fit mt-[-1.00px] font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
                    게시글 추가
                  </span>
                </button>
              )}
            </header>

            {selectedJobFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
                {selectedJobFilters.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => removeJobFilter(tag)}
                    className="flex min-w-[90px] sm:w-[110px] h-[45px] sm:h-[51px] px-2.5 py-[3px] bg-primaryprimary-50 rounded-[10px] border border-solid border-primaryprimary-500 items-center justify-center gap-[5px] hover:bg-primaryprimary-100 transition-colors"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <div className="relative flex-1 font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-gray-scalegray-scale-800 text-sm sm:text-[length:var(--body-b1-200-font-size)] text-center tracking-[var(--body-b1-200-letter-spacing)] leading-[var(--body-b1-200-line-height)] [font-style:var(--body-b1-200-font-style)]">
                      {tag}
                    </div>
                    <img
                      className="relative w-5 h-5 sm:w-6 sm:h-6"
                      alt="Remove"
                      src={remove}
                    />
                  </button>
                ))}
              </div>
            )}

            <PostsList filters={{ tags: selectedJobFilters, page: currentPage, pageSize: 10 }} />

            {data && data.posts && data.posts.length > 0 && (
              <nav className="flex justify-center items-center mt-8 sm:mt-12" aria-label="Pagination">
                <button
                  className="inline-flex items-start p-1.5 rounded-sm overflow-hidden hover:bg-gray-scalegray-scale-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <img
                    className="relative w-3 h-3"
                    alt="Previous"
                    src={leftarr}
                  />
                </button>
                {paginationPages.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex flex-col items-center gap-2.5 px-2 sm:px-3 py-1 rounded-sm overflow-hidden hover:bg-gray-scalegray-scale-50 transition-colors ${currentPage === page ? "border border-solid border-primaryprimary-500" : ""
                      }`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    <div className={`relative mt-[-1.00px] ${currentPage === page
                      ? "font-body-medium font-[number:var(--body-medium-font-weight)] text-primaryprimary-500 text-[length:var(--body-medium-font-size)] tracking-[var(--body-medium-letter-spacing)] leading-[var(--body-medium-line-height)] [font-style:var(--body-medium-font-style)]"
                      : "font-body-regular font-[number:var(--body-regular-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--body-regular-font-size)] tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] [font-style:var(--body-regular-font-style)]"
                      } text-center whitespace-nowrap`}>
                      {page}
                    </div>
                  </button>
                ))}

                <button
                  className="inline-flex items-start p-1.5 rounded-sm overflow-hidden hover:bg-gray-scalegray-scale-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <img
                    className="relative w-3 h-3"
                    alt="Next"
                    src={rightarr}
                  />
                </button>
              </nav>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
