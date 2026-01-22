import { useState } from "react";
import type { JSX } from "react";

interface Post {
  id: number;
  title: string;
  author: string;
  dateRange: string;
  description: string;
  daysRemaining: string;
}

const postsData: Post[] = [
  {
    id: 1,
    title: "@@@@활동 팀원 모집합니다.",
    author: "김주연",
    dateRange: "2025.01.07 - 2025.01.21",
    description: "팀원 2명 모집합니다.팀원 2명 모집합니다.팀원 2명 모집합니다.",
    daysRemaining: "D-4",
  },
  {
    id: 2,
    title: "@@@@활동 팀원 모집합니다.",
    author: "김주연",
    dateRange: "2025.01.07 - 2025.01.21",
    description: "팀원 2명 모집합니다.팀원 2명 모집합니다.팀원 2명 모집합니다.",
    daysRemaining: "D-4",
  },
  {
    id: 3,
    title: "@@@@활동 팀원 모집합니다.",
    author: "김주연",
    dateRange: "2025.01.07 - 2025.01.21",
    description: "팀원 2명 모집합니다.팀원 2명 모집합니다.팀원 2명 모집합니다.",
    daysRemaining: "D-4",
  },
  {
    id: 4,
    title: "@@@@활동 팀원 모집합니다.",
    author: "김주연",
    dateRange: "2025.01.07 - 2025.01.21",
    description: "팀원 2명 모집합니다.팀원 2명 모집합니다.팀원 2명 모집합니다.",
    daysRemaining: "D-4",
  },
  {
    id: 5,
    title: "@@@@활동 팀원 모집합니다.",
    author: "김주연",
    dateRange: "2025.01.07 - 2025.01.21",
    description: "팀원 2명 모집합니다.팀원 2명 모집합니다.팀원 2명 모집합니다.",
    daysRemaining: "D-4",
  },
  {
    id: 6,
    title: "@@@@활동 팀원 모집합니다.",
    author: "김주연",
    dateRange: "2025.01.07 - 2025.01.21",
    description: "팀원 2명 모집합니다.팀원 2명 모집합니다.팀원 2명 모집합니다.",
    daysRemaining: "D-4",
  },
  {
    id: 7,
    title: "@@@@활동 팀원 모집합니다.",
    author: "김주연",
    dateRange: "2025.01.07 - 2025.01.21",
    description: "팀원 2명 모집합니다.팀원 2명 모집합니다.팀원 2명 모집합니다.",
    daysRemaining: "D-4",
  },
  {
    id: 8,
    title: "@@@@활동 팀원 모집합니다.",
    author: "김주연",
    dateRange: "2025.01.07 - 2025.01.21",
    description: "팀원 2명 모집합니다.팀원 2명 모집합니다.팀원 2명 모집합니다.",
    daysRemaining: "D-4",
  },
];

interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const PostCard = ({ post, onDelete, onEdit }: PostCardProps): JSX.Element => {
  return (
    <article className="flex flex-col w-[502px] h-[276px] items-center justify-center gap-2.5 p-6 relative bg-gray-scalewhite rounded-[10px] border border-solid border-[#a7a7aa]">
      <div className="flex flex-col w-[442px] h-[212px] items-center justify-between relative">
        <div className="flex flex-col items-start gap-[21px] relative self-stretch w-full flex-[0_0_auto]">
          <header className="flex flex-col items-start gap-[3px] relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex h-[31px] items-center justify-between relative self-stretch w-full">
              <h2 className="relative flex-1 mt-[-1.00px] font-heading-h2-100 font-[number:var(--heading-h2-100-font-weight)] text-black text-[length:var(--heading-h2-100-font-size)] tracking-[var(--heading-h2-100-letter-spacing)] leading-[var(--heading-h2-100-line-height)] [font-style:var(--heading-h2-100-font-style)]">
                {post.title}
              </h2>
              <div className="inline-flex items-center justify-center gap-[5px] px-2 py-[5px] relative self-stretch flex-[0_0_auto] bg-gray-scalegray-scale-50 rounded-[5px]">
                <div className="inline-flex items-center gap-[9px] relative flex-[0_0_auto] mt-[-1.50px] mb-[-1.50px]">
                  <time className="relative w-fit mt-[-1.00px] font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-gray-scalegray-scale-800 text-[length:var(--body-b2-200-font-size)] tracking-[var(--body-b2-200-letter-spacing)] leading-[var(--body-b2-200-line-height)] whitespace-nowrap [font-style:var(--body-b2-200-font-style)]">
                    {post.daysRemaining}
                  </time>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
              <p className="relative w-fit mt-[-1.00px] [font-family:'Pretendard-Medium',Helvetica] font-normal text-gray-scalegray-scale-400 text-lg tracking-[0] leading-[18px]">
                <span className="font-[number:var(--body-b1-100-font-weight)] leading-[var(--body-b1-100-line-height)] underline font-body-b1-100 [font-style:var(--body-b1-100-font-style)] tracking-[var(--body-b1-100-letter-spacing)] text-[length:var(--body-b1-100-font-size)]">
                  {post.author}
                </span>
              </p>
              <img
                className="relative w-px h-[19.5px]"
                alt=""
                src="https://c.animaapp.com/mknskxfd3qPIE6/img/vector-203.svg"
                aria-hidden="true"
              />
              <time className="relative w-fit mt-[-1.00px] font-body-b1-100 font-[number:var(--body-b1-100-font-weight)] text-gray-scalegray-scale-400 text-[length:var(--body-b1-100-font-size)] tracking-[var(--body-b1-100-letter-spacing)] leading-[var(--body-b1-100-line-height)] whitespace-nowrap [font-style:var(--body-b1-100-font-style)]">
                {post.dateRange}
              </time>
            </div>
          </header>
          <p className="relative self-stretch font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] tracking-[var(--body-b2-300-letter-spacing)] leading-[var(--body-b2-300-line-height)] [font-style:var(--body-b2-300-font-style)]">
            {post.description}
          </p>
        </div>
        <div className="flex items-center justify-around gap-[253px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex w-[442px] items-center justify-end gap-2.5 relative">
            <button
              className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 relative self-stretch flex-[0_0_auto] bg-gray-scalegray-scale-50 rounded-[10px] cursor-pointer"
              onClick={() => onDelete(post.id)}
              type="button"
              aria-label={`${post.title} 삭제하기`}
            >
              <span className="relative w-fit mt-[-1.00px] font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-400 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
                삭제하기
              </span>
            </button>
            <button
              className="all-[unset] box-border w-[143px] px-[15px] py-2.5 self-stretch bg-primaryprimary-50 rounded-[10px] flex items-center justify-center gap-2.5 relative cursor-pointer"
              onClick={() => onEdit(post.id)}
              type="button"
              aria-label={`${post.title} 수정하기`}
            >
              <span className="relative w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-primaryprimary-800 text-[length:var(--heading-h3-200-font-size)] tracking-[var(--heading-h3-200-letter-spacing)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap [font-style:var(--heading-h3-200-font-style)]">
                수정하기
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export const PostsListSection = (): JSX.Element => {
  const [posts, setPosts] = useState<Post[]>(postsData);

  const handleDelete = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleEdit = (id: number) => {
    console.log("Edit post:", id);
  };

  const rows: Post[][] = [];
  for (let i = 0; i < posts.length; i += 2) {
    rows.push(posts.slice(i, i + 2));
  }

  return (
    <section className="flex flex-col w-[1023px] items-start gap-6 absolute top-[215px] left-[367px]">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-[19px] relative self-stretch w-full flex-[0_0_auto]"
        >
          {row.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ))}
    </section>
  );
};
