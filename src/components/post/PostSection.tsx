import PostCard from "./PostCard";


interface PostSectionProps {
    posts: any[];
    sortOrder: 'latest' | 'oldest';
    activeTab: 'myPosts' | 'likedPosts'; 
    onLikeToggle: (id: number) => void;
}

const PostSection = ({ posts, sortOrder, activeTab, onLikeToggle }: PostSectionProps) => {
    const filteredPosts = posts.filter(post => {
        if (activeTab === 'likedPosts') return post.isLiked === true;
        return true;
    });

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        return sortOrder === 'latest' ? b.id - a.id : a.id - b.id;
    });

    return(
        <div className="flex w-[963px] flex-col items-start gap-[33px]">
           {sortedPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-x-[22px] gap-y-[50px] w-full">
                    {sortedPosts.map((post) => (
                        <PostCard 
                            key={post.id} 
                            data={post} 
                            onLikeToggle={() => onLikeToggle(post.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="w-full py-[100px] text-center text-[#969599] font-pretendard text-[18px]">
                    {activeTab === 'likedPosts' ? "좋아요를 표시한 게시글이 없습니다." : "작성한 게시글이 없습니다."}
                </div>
            )}
        </div>
    )
}

export default PostSection