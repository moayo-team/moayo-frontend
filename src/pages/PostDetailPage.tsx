import { useParams, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { usePost } from '../hooks/usePosts';
import { NavigationBar } from '../components/Navbar';
import { Badge } from '../components/common/Badge';
import { CommentSection } from '../components/common/CommentSection';
// 서버에서 제공하는 dday 값이 있으면 우선 사용합니다.
import { formatDateRange } from '../utils/dateUtils';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../lib/apiClient';
import { useOtherUserProfile } from '../hooks/useOtherUserProfile';
import type { JSX } from 'react';
import like from '../assets/like.svg';
import send from '../assets/send.svg';
import menu from '../assets/menu.svg';
import 'react-quill-new/dist/quill.snow.css';
import profile_photo from '../assets/profile_photo.svg'

export const PostDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { data: post, isPending, error } = usePost(id || '');


  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);



  const handleLikeToggle = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  if (isPending) {
    return (
      <div className="relative w-full min-h-screen bg-white">
        <NavigationBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg font-heading-h2-300">게시글을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="relative w-full min-h-screen bg-white">
        <NavigationBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg font-heading-h2-300 text-red-600">
            게시글을 찾을 수 없습니다.
          </div>
        </div>
      </div>
    );
  }

  const postDetails = [
    { label: "모집인원", value: `${post.recruitCount}` },
    { label: "모집포지션", value: post.positions },
    { label: "마감일", value: (post as any).dday ?? formatDateRange(post.createdAt, post.deadline).split(' - ')[1] },
  ];

  const authorId =
    (post as any).userId ??
    (post as any).authorId ??
    post.createdByUserId ??
    (post as any).author?.id ??
    undefined;

  const isOwner = Boolean(
    isLoggedIn &&
      user &&
      (
        String(authorId ?? '') === String(user.user?.id ?? '')
      )
  );

  const numericAuthorId = Number(authorId);
  const { data: authorProfile } = useOtherUserProfile(
    Number.isFinite(numericAuthorId) ? numericAuthorId : undefined
  );

  const handleGoToProfile = () => {
    if (!authorId) {
      alert('작성자 정보를 찾을 수 없습니다.');
      return;
    }

    navigate('/profile', { state: { userId: authorId } });
  };

  const handleSendMessage = async () => {
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
    <div className="relative w-full min-h-screen bg-white pb-20">
      <NavigationBar />
      
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar - Left Column */}
          <aside className="w-full lg:w-[280px] flex-shrink-0 order-2 lg:order-1">
            <div className="flex flex-col gap-[15px]">
              <div className="h-auto sm:h-[258px] items-center justify-center gap-2.5 px-5 py-6 sm:py-[27px] bg-gray-scale30 rounded-[10px] flex flex-col">
                <div className="inline-flex flex-col items-center gap-2.5 relative flex-[0_0_auto] mt-[-7.50px] mb-[-7.50px]">
                  <img
                    className="w-[120px] sm:w-[150px] h-[120px] sm:h-[152px] relative object-cover rounded-full"
                    alt="Profile"
                    src={(() => {
                      const url = user?.profile?.imageUrl;
                      if (!url || url === 'default_url') return profile_photo;
                      return url.startsWith('http')
                        ? url
                        : `${import.meta.env.VITE_API_BASE_URL}${url}`;
                    })()}
                    onError={(e) => {
                      e.currentTarget.src = profile_photo;
                    }}
                  />
                  <div className="flex flex-col w-full items-center gap-0.5 relative flex-[0_0_auto]">
                    <div className="self-stretch mt-[-1.00px] font-heading-h2-300 font-[number:var(--heading-h2-300-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--heading-h2-300-font-size)] text-center leading-[var(--heading-h2-300-line-height)] relative tracking-[var(--heading-h2-300-letter-spacing)] [font-style:var(--heading-h2-300-font-style)]">
                      {user?.user?.name || '사용자'}
                    </div>
                    {user?.profile?.major && (
                      <div className="flex items-center justify-center gap-[11px] relative self-stretch w-full flex-[0_0_auto]">
                        <div className="w-fit mt-[-1.00px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--body-b2-300-font-size)] text-center leading-[var(--body-b2-300-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)]">
                          {user.profile.major}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/board')}
                className="all-[unset] box-border flex items-center justify-center gap-2.5 px-[15px] py-2.5 relative flex-1 self-stretch w-full grow bg-gray-scale30 rounded-[5px] hover:bg-gray-scalegray-scale-50 transition-colors cursor-pointer"
              >
                <img
                  className="relative w-5 h-5"
                  alt="List icon"
                  src={menu}
                />
                <span className="w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-500 text-[length:var(--heading-h3-200-font-size)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap relative tracking-[var(--heading-h3-200-letter-spacing)] [font-style:var(--heading-h3-200-font-style)]">
                  게시판으로 돌아가기
                </span>
              </button>
            </div>
          </aside>

          {/* Main Content - Right Column */}
          <main className="flex-1 order-1 lg:order-2">
            <article className="w-full">
              {/* Author Profile Section */}
              <div className="flex w-full items-start justify-center gap-[100px] px-5 py-2.5 bg-gray-scale30 rounded-[5px] shadow-[0px_0px_4px_#0000004c] mb-6">
                <div className="flex items-center gap-[15px] relative flex-1 self-stretch grow">
                  <img
                    className="w-[62px] h-[63px] relative object-cover rounded-full"
                    alt="작성자 프로필 이미지"
                    src={(() => {
                      const ownerUrl = isOwner ? user?.profile?.imageUrl : undefined;
                      const otherUrl = authorProfile?.imageUrl;
                      const url = ownerUrl || otherUrl || (post as any).profileImageUrl || post.author?.avatar;
                      if (!url || url === 'default_url') return profile_photo;
                      return url.startsWith('http')
                        ? url
                        : `${import.meta.env.VITE_API_BASE_URL}${url}`;
                    })()}
                    onError={(e) => {
                      e.currentTarget.src = profile_photo;
                    }}
                  />
                  <div className="flex flex-col items-start gap-[3px] relative self-stretch">
                    <div className="mt-[-1.00px] font-heading-h2-100 font-[number:var(--heading-h2-100-font-weight)] text-black text-[length:var(--heading-h2-100-font-size)] leading-[var(--heading-h2-100-line-height)] relative tracking-[var(--heading-h2-100-letter-spacing)] [font-style:var(--heading-h2-100-font-style)]">
                      {post.author?.name || '익명'}
                    </div>
                    <div className="relative font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-black text-[length:var(--body-b1-200-font-size)] tracking-[var(--body-b1-200-letter-spacing)] leading-[var(--body-b1-200-line-height)] [font-style:var(--body-b1-200-font-style)]">
                      {""}
                    </div>
                  </div>
                </div>
                {!isOwner && (
                  <button
                    type="button"
                    onClick={handleGoToProfile}
                    className="w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-black text-base leading-4 relative tracking-[0] hover:opacity-80"
                    aria-label="프로필 바로가기"
                  >
                    <span className="leading-[var(--body-b2-300-line-height)] underline font-body-b2-300 [font-style:var(--body-b2-300-font-style)] font-[number:var(--body-b2-300-font-weight)] tracking-[var(--body-b2-300-letter-spacing)] text-[length:var(--body-b2-300-font-size)]">
                      프로필 바로가기
                    </span>
                  </button>
                )}
              </div>

              {/* Post Title and D-Day */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="flex-1 font-heading-h1-100 font-[number:var(--heading-h1-100-font-weight)] text-black text-[length:var(--heading-h1-100-font-size)] tracking-[var(--heading-h1-100-letter-spacing)] leading-[var(--heading-h1-100-line-height)] [font-style:var(--heading-h1-100-font-style)]">
                  {post.title}
                </h1>
                <Badge dday={(post as any).dday} deadline={post.deadline} />
              </div>

              {/* Post Details */}
              <div className="w-full items-start gap-5 mb-6 flex flex-col">
                {postDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 relative self-stretch w-full flex-[0_0_auto]"
                  >
                    <div className="flex w-[129px] h-[74px] items-center justify-center gap-2.5 px-10 py-2.5 relative bg-gray-scalegray-scale-50 rounded-[10px_0px_0px_10px]">
                      <div className="flex items-center justify-center w-fit font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-gray-scalegray-scale-700 text-[length:var(--heading-h3-300-font-size)] text-center leading-[var(--heading-h3-300-line-height)] whitespace-nowrap relative tracking-[var(--heading-h3-300-letter-spacing)] [font-style:var(--heading-h3-300-font-style)]">
                        {detail.label}
                      </div>
                    </div>
                    <div className="flex h-[74px] items-center gap-2.5 px-[30px] py-2.5 relative flex-1 grow rounded-[0px_10px_10px_0px] border border-solid border-[#d6d6d8]">
                      <div className="relative flex items-center justify-center flex-1 self-stretch mt-[-1.00px] font-heading-h2-300 font-[number:var(--heading-h2-300-font-weight)] text-gray-scalegray-scale-400 text-[length:var(--heading-h2-300-font-size)] tracking-[var(--heading-h2-300-letter-spacing)] leading-[var(--heading-h2-300-line-height)] [font-style:var(--heading-h2-300-font-style)]">
                        {detail.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Post Content */}
              <div className="flex flex-col w-full min-h-[400px] items-start justify-start gap-2.5 p-6 mb-6 rounded-[3px] border border-solid border-[#a7a7aa]">
                <div className="w-full ql-snow">
                  <div 
                      className="ql-editor !p-0 text-[17px] leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: post.content || post.description }} 
                    />
                  </div>
                {post.requirements && (
                  <div className="w-full mt-4">
                    <h3 className="font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-black text-[length:var(--heading-h3-200-font-size)] mb-2">
                      요구사항:
                    </h3>
                    <p className="font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-gray-scalegray-scale-700 text-[length:var(--body-b2-300-font-size)]">
                      {post.requirements}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="inline-flex items-center gap-[13px] mb-8 flex-wrap">
                {/* Edit Button - Only show if it's the user's post */}
                {isOwner && (
                  <button
                    onClick={() => navigate(`/edit/${post.id}`)}
                    className="flex w-[83px] h-[33px] items-center justify-center gap-[5px] px-2 py-[5px] relative bg-primaryprimary-50 hover:bg-primaryprimary-100 cursor-pointer rounded-[5px] transition-colors border-2 border-primaryprimary-500"
                    aria-label="게시글 수정"
                  >
                    <span className="w-fit mt-[-1.00px] font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-primaryprimary-700 text-[length:var(--body-b2-200-font-size)] leading-[var(--body-b2-200-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-200-letter-spacing)] [font-style:var(--body-b2-200-font-style)]">
                      수정하기
                    </span>
                  </button>
                )}

                <button
                  onClick={handleLikeToggle}
                  className={`flex w-[83px] h-[33px] items-center justify-center gap-[5px] px-2 py-[5px] relative ${
                    isLiked
                      ? 'bg-primaryprimary-50 border-2 border-primaryprimary-500'
                      : 'bg-gray-scalegray-scale-50 border-2 border-transparent'
                  } ${
                    isLoggedIn 
                      ? 'hover:bg-primaryprimary-100 cursor-pointer' 
                      : 'cursor-not-allowed opacity-60'
                  } rounded-[5px] transition-all`}
                  aria-label={`공감 ${likes}개`}
                  aria-pressed={isLiked}
                  disabled={!isLoggedIn}
                >
                  <img
                    className={`relative w-5 h-5 transition-transform ${isLiked ? 'scale-110' : 'scale-100'}`}
                    alt="Thumbs up"
                    src={like}
                  />
                  <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                    <span className={`w-fit mt-[-1.00px] font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] ${
                      isLiked ? 'text-primaryprimary-700' : 'text-gray-scalegray-scale-300'
                    } text-[length:var(--body-b2-200-font-size)] leading-[var(--body-b2-200-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-200-letter-spacing)] [font-style:var(--body-b2-200-font-style)]`}>
                      공감
                    </span>
                    <span className={`relative w-fit mt-[-1.00px] font-body-b2-100 font-[number:var(--body-b2-100-font-weight)] ${
                      isLiked ? 'text-primaryprimary-700' : 'text-gray-scalegray-scale-300'
                    } text-[length:var(--body-b2-200-font-size)] tracking-[var(--body-b2-200-letter-spacing)] leading-[var(--body-b2-200-line-height)] whitespace-nowrap [font-style:var(--body-b2-200-font-style)]`}>
                      {likes}
                    </span>
                  </div>
                </button>
                {!isOwner && (
                  <button 
                    onClick={handleSendMessage}
                    className={`flex w-[83px] items-center justify-center gap-[5px] px-2 py-[5px] relative ${
                      isLoggedIn
                        ? 'bg-gray-scalegray-scale-50 hover:bg-gray-scalegray-scale-100 cursor-pointer' 
                        : 'bg-gray-scalegray-scale-50 cursor-not-allowed opacity-60'
                    } rounded-[5px] transition-colors`}
                    disabled={!isLoggedIn}
                  >
                    <img
                      className="relative w-5 h-5"
                      alt="Send message"
                      src={send}
                    />
                    <div className="inline-flex items-center gap-[9px] relative flex-[0_0_auto]">
                      <span className="w-fit mt-[-1.00px] font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-gray-scalegray-scale-300 text-[length:var(--body-b2-200-font-size)] leading-[var(--body-b2-200-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-200-letter-spacing)] [font-style:var(--body-b2-200-font-style)]">
                        쪽지
                      </span>
                    </div>
                  </button>
                )}
              </div>

              {/* Comments Section */}
              <CommentSection postId={post.id} />
            </article>
          </main>
        </div>
      </div>
    </div>
  );
};
