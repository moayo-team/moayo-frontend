import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../components/profile/ProfileHeader";
import { DUMMY_PROFILE } from "../data/profileData";
import { DUMMY_POST } from "../data/postData";
import latestIcon from "../assets/basil_exchange-outline.svg";
import PostSection from "../components/post/PostSection";

const ProfilePostsPage = () => {
    const navigate = useNavigate();
    const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
    const [activeTab, setActiveTab] = useState<'myPosts' | 'likedPosts'>('myPosts');
    const [posts, setPosts] = useState(DUMMY_POST);
    
    // 정렬 토글 함수
    const toggleSort = () => {
        setSortOrder(prev => (prev === 'latest' ? 'oldest' : 'latest'));
    };

    // 좋아요 토글 함수
    const handleLikeToggle = (id: number) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === id ? { ...post, isLiked: !post.isLiked } : post
            )
        );
    };

    return (
        <div className="flex flex-col gap-[70px]">
            {/* 프로필 헤더 섹션 */}
            <ProfileHeader
                isEditing={false}
                jobTitle={DUMMY_PROFILE.jobTitle}
                profileImage={DUMMY_PROFILE.profileImage}
                tags={DUMMY_PROFILE.tags} 
                onDataChange={() => { }} 
            />

            <div className="flex flex-col gap-[30px]">
                {/* 제목 및 필터 바 */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-[10px]">
                        <span className="font-pretendard text-[32px] font-semibold leading-[130%] tracking-[-0.01em]">
                            작성 게시글 관리
                        </span>
                    </div>

                    <div className="inline-flex justify-end items-center gap-[18px]">
                        <div 
                            className="flex items-center gap-[2px] cursor-pointer" 
                            onClick={toggleSort}
                        >
                            <span className="font-pretendard text-[16px] font-medium leading-[150%] text-[#969599]">
                                {sortOrder === 'latest' ? '최신순' : '오래된순'}
                            </span>
                            <img
                                src={latestIcon}
                                alt="sort icon"
                                className={`w-[24px] h-[24px] transition-transform ${sortOrder === 'oldest' ? 'rotate-180' : ''}`}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => {}}
                            className="flex w-[143px] p-[15px] justify-center items-center gap-[10px] rounded-[10px] bg-[#6EEBC7] cursor-pointer font-pretendard text-[20px] font-medium leading-[140%]" 
                        >
                            게시글 추가
                        </button>
                    </div>
                </div>

                {/*탭 버튼 */}
                <div className="flex items-start gap-[50px]">
                    <button 
                        type="button"
                        onClick={() => setActiveTab('myPosts')}
                        className={`cursor-pointer font-pretendard text-[24px] font-bold leading-[130%] transition-colors ${
                            activeTab === 'myPosts' ? 'text-[#444446]' : 'text-[#A7A7AA]'
                        }`}
                    >
                        내가 쓴 글
                    </button>
                    <button 
                        type="button"
                        onClick={() => setActiveTab('likedPosts')}
                        className={`cursor-pointer font-pretendard text-[24px] font-bold leading-[130%] transition-colors ${
                            activeTab === 'likedPosts' ? 'text-[#444446]' : 'text-[#A7A7AA]'
                        }`}
                    >
                        좋아요
                    </button>
                </div>
                <hr className="border-[#E5E5E7]" />

                {/* 게시글 리스트 영역 */}
                <PostSection 
                    posts={posts} 
                    sortOrder={sortOrder} 
                    activeTab={activeTab} 
                    onLikeToggle={handleLikeToggle}
                />
            </div>
        </div>
    );
};

export default ProfilePostsPage;