import { useState } from "react";
import type { JSX } from "react";
import logo from "../../../assets/pavicon.png";
import head from "../../../assets/profile.svg";
import menu from "../../../assets/menu.svg";
import separator from "../../../assets/separator.svg";
import deco_1 from "../../../assets/deco_1.svg";
import like from "../../../assets/like.svg";
import send from "../../../assets/send.svg";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
  isReply?: boolean;
}

interface JobFilter {
  id: string;
  label: string;
  selected: boolean;
}

export const DivWrapper = (): JSX.Element => {
  const [jobFilters, setJobFilters] = useState<JobFilter[]>([
    { id: "planning", label: "기획", selected: true },
    { id: "marketing", label: "마케팅", selected: false },
    { id: "design", label: "디자인", selected: false },
    { id: "development", label: "개발", selected: true },
    { id: "startup", label: "창업", selected: false },
    { id: "arts", label: "예체능", selected: false },
    { id: "literature", label: "문학", selected: false },
    { id: "etc", label: "기타", selected: false },
  ]);

  const [commentText, setCommentText] = useState("");
  const [likes, setLikes] = useState(3);
  const [isLiked, setIsLiked] = useState(false);

  const comments: Comment[] = [
    {
      id: 1,
      author: "익명",
      avatar: head,
      content: "궁금한 점이 있어서 쪽지 드려도 될까요?",
      date: "2024.02.22",
      isReply: false,
    },
    {
      id: 2,
      author: "익명",
      avatar: head,
      content: "궁금한 점이 있어서 쪽지 드려도 될까요?",
      date: "2024.02.22",
      isReply: true,
    },
  ];

  const navItems = [
    { label: "홈", active: false },
    { label: "프로필", active: false },
    { label: "게시판", active: true },
    { label: "쪽지함", active: false },
  ];

  const postDetails = [
    { label: "모집인원", value: "3명" },
    { label: "모집포지션", value: "디자이너 (BX, 그래픽)" },
    { label: "마감일", value: "25.02.17" },
  ];

  const handleJobFilterToggle = (id: string) => {
    setJobFilters(
      jobFilters.map((filter) =>
        filter.id === id ? { ...filter, selected: !filter.selected } : filter,
      ),
    );
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setCommentText("");
    }
  };

  return (
    <div className="relative w-[1440px] h-[2129px] bg-white">
      <header className="absolute top-0 left-[calc(50.00%_-_720px)] w-[1440px] h-20 bg-white shadow-[0px_0px_6px_#0000001f]">
        <div className="absolute top-5 left-[50px] w-10 h-10 bg-[#0000001a] rounded-[100px]" />
        <img
          className="absolute top-5 left-[50px] w-10 h-10"
          alt="Logo"
          src={logo}
        />
        <h1 className="absolute top-[22px] left-[101px] [font-family:'Pretendard-Bold',Helvetica] font-bold text-black text-[28px] tracking-[0] leading-9 whitespace-nowrap">
          MOAYO!
        </h1>
        <nav
          className="inline-flex items-center gap-10 absolute top-7 left-[calc(50.00%_-_130px)]"
          role="navigation"
          aria-label="Main navigation"
        >
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`relative w-fit mt-[-1.00px] ${
                item.active
                  ? "font-body-b2-300 font-[number:var(--body-b2-300-font-weight)]"
                  : "font-body-b2-200 font-[number:var(--body-b2-200-font-weight)]"
              } text-black text-[length:var(--body-b2-300-font-size)] tracking-[var(--body-b2-300-letter-spacing)] leading-[var(--body-b2-300-line-height)] whitespace-nowrap [font-style:var(--body-b2-300-font-style)]`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="flex w-[999px] items-end justify-around gap-[858px] absolute top-[126px] left-[391px]">
        <h2 className="relative w-fit mt-[-1.00px] font-heading-h1-200 font-[number:var(--heading-h1-200-font-weight)] text-black text-[length:var(--heading-h1-200-font-size)] tracking-[var(--heading-h1-200-letter-spacing)] leading-[var(--heading-h1-200-line-height)] whitespace-nowrap [font-style:var(--heading-h1-200-font-style)]">
          게시판
        </h2>
      </div>

      <aside className="flex flex-col w-[280px] h-[348px] items-start gap-[15px] absolute top-[215px] left-[53px]">
          <div className="h-[258px] items-center justify-center gap-2.5 px-5 py-[27px] relative self-stretch w-full bg-gray-scale30 rounded-[10px] flex flex-col">
          <div className="inline-flex flex-col items-center gap-2.5 relative flex-[0_0_auto] mt-[-7.50px] mb-[-7.50px]">
            <img
              className="w-[150px] h-[152px] relative object-cover rounded-full"
              alt="Profile"
              src="https://ui-avatars.com/api/?name=김주연&background=E9FCEF&color=26E1AC&size=152"
            />
            <div className="flex flex-col w-[148px] items-center gap-0.5 relative flex-[0_0_auto]">
              <div className="self-stretch mt-[-1.00px] font-heading-h2-300 font-[number:var(--heading-h2-300-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--heading-h2-300-font-size)] text-center leading-[var(--heading-h2-300-line-height)] relative tracking-[var(--heading-h2-300-letter-spacing)] [font-style:var(--heading-h2-300-font-style)]">
                김주연
              </div>
              <div className="flex items-center justify-center gap-[11px] relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-fit mt-[-1.00px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--body-b2-300-font-size)] text-center leading-[var(--body-b2-300-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)]">
                  디자이너
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="all-[unset] box-border flex items-center justify-center gap-2.5 px-[15px] py-2.5 relative flex-1 self-stretch w-full grow bg-gray-scale30 rounded-[5px]">
          <img
            className="relative w-5 h-5"
            alt="List icon"
            src={menu}
          />
          <span className="w-fit font-heading-h3-200 font-[number:var(--heading-h3-200-font-weight)] text-gray-scalegray-scale-500 text-[length:var(--heading-h3-200-font-size)] leading-[var(--heading-h3-200-line-height)] whitespace-nowrap relative tracking-[var(--heading-h3-200-letter-spacing)] [font-style:var(--heading-h3-200-font-style)]">
            내가 쓴 게시글
          </span>
        </button>
      </aside>

      <aside className="flex flex-col w-[280px] items-start gap-5 absolute top-[614px] left-[53px]">
        <h3 className="self-stretch mt-[-1.00px] font-heading-h2-300 font-[number:var(--heading-h2-300-font-weight)] text-black text-[length:var(--heading-h2-300-font-size)] leading-[var(--heading-h2-300-line-height)] relative tracking-[var(--heading-h2-300-letter-spacing)] [font-style:var(--heading-h2-300-font-style)]">
          직무필터
        </h3>
        <div className="flex items-center gap-2.5 px-6 py-[31px] relative self-stretch w-full flex-[0_0_auto] rounded-[10px] border border-solid border-[#a7a7aa]">
          <div className="flex flex-col w-[232px] items-start gap-5 relative">
            <div className="flex flex-col items-start gap-[30px] relative self-stretch w-full flex-[0_0_auto]">
              {[0, 1, 2, 3].map((rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]"
                >
                  {jobFilters
                    .slice(rowIndex * 2, rowIndex * 2 + 2)
                    .map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => handleJobFilterToggle(filter.id)}
                        className={`${
                          filter.selected
                            ? "bg-primaryprimary-50 border-[#26e1ac]"
                            : "bg-gray-scalegray-scale-50 border-[#d6d6d8]"
                        } flex h-[51px] items-center justify-center gap-[5px] px-2.5 py-[3px] rounded-[10px] border border-solid ${
                          rowIndex === 0 && filter.id === "planning"
                            ? "w-28 relative"
                            : rowIndex === 0 && filter.id === "marketing"
                              ? "w-28 relative mr-[-2.00px]"
                              : rowIndex === 1 && filter.id === "design"
                                ? "w-28 relative"
                                : rowIndex === 1 && filter.id === "development"
                                  ? "w-[110px] relative"
                                  : "w-28 relative mr-[-2.00px]"
                        }`}
                      >
                        <span
                          className={`${
                            filter.selected
                              ? "text-gray-scalegray-scale-900"
                              : "text-gray-scalegray-scale-300"
                          } ${
                            rowIndex === 0 && filter.id === "planning"
                              ? "relative flex-1"
                              : rowIndex === 1 && filter.id === "development"
                                ? "relative flex-1"
                                : "flex-1"
                          } font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-[length:var(--body-b1-200-font-size)] text-center leading-[var(--body-b1-200-line-height)] tracking-[var(--body-b1-200-letter-spacing)] [font-style:var(--body-b1-200-font-style)]`}
                        >
                          {filter.label}
                        </span>
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <article className="absolute top-[215px] left-[391px] w-[999px]">
        <div className="flex w-[999px] items-start justify-center gap-[100px] px-5 py-2.5 bg-gray-scale30 rounded-[5px] shadow-[0px_0px_4px_#0000004c]">
          <div className="flex items-center gap-[15px] relative flex-1 self-stretch grow">
            <img
              className="w-[62px] h-[63px] relative object-cover rounded-full"
              alt="Author avatar"
              src="https://ui-avatars.com/api/?name=김우연&background=F2F2F2&color=343436&size=128"
            />
            <div className="flex flex-col w-[94px] items-start gap-[3px] relative self-stretch">
              <div className="self-stretch mt-[-1.00px] font-heading-h2-100 font-[number:var(--heading-h2-100-font-weight)] text-black text-[length:var(--heading-h2-100-font-size)] leading-[var(--heading-h2-100-line-height)] relative tracking-[var(--heading-h2-100-letter-spacing)] [font-style:var(--heading-h2-100-font-style)]">
                김우연
              </div>
              <div className="relative self-stretch font-body-b1-200 font-[number:var(--body-b1-200-font-weight)] text-black text-[length:var(--body-b1-200-font-size)] tracking-[var(--body-b1-200-letter-spacing)] leading-[var(--body-b1-200-line-height)] [font-style:var(--body-b1-200-font-style)]">
                rwd4533
              </div>
            </div>
          </div>
          <a
            href="#"
            className="w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-black text-base leading-4 relative tracking-[0]"
          >
            <span className="leading-[var(--body-b2-300-line-height)] underline font-body-b2-300 [font-style:var(--body-b2-300-font-style)] font-[number:var(--body-b2-300-font-weight)] tracking-[var(--body-b2-300-letter-spacing)] text-[length:var(--body-b2-300-font-size)]">
              프로필 바로가기
            </span>
          </a>
        </div>

        <h1 className="absolute top-[138px] left-0 font-heading-h1-100 font-[number:var(--heading-h1-100-font-weight)] text-black text-[length:var(--heading-h1-100-font-size)] tracking-[var(--heading-h1-100-letter-spacing)] leading-[var(--heading-h1-100-line-height)] whitespace-nowrap [font-style:var(--heading-h1-100-font-style)]">
          2026 로레알 브랜드스톰 팀원 모집합니다.
        </h1>

        <div className="w-[100px] absolute top-[134px] left-[899px] bg-gray-scalegray-scale-50 border-[#969599] flex h-[51px] items-center justify-center gap-[5px] px-2.5 py-[3px] rounded-[10px] border border-solid">
          <div className="flex-1 font-heading-h3-100 font-[number:var(--heading-h3-100-font-weight)] text-gray-scalegray-scale-900 text-[length:var(--heading-h3-100-font-size)] text-center leading-[var(--heading-h3-100-line-height)] relative tracking-[var(--heading-h3-100-letter-spacing)] [font-style:var(--heading-h3-100-font-style)]">
            D-4
          </div>
        </div>

        <div className="w-[999px] items-start gap-5 absolute top-[226px] left-0 flex flex-col">
          {postDetails.map((detail, index) => (
            <div
              key={index}
              className="flex items-center gap-3 relative self-stretch w-full flex-[0_0_auto]"
            >
              <div className="flex w-[129px] h-[74px] items-center justify-center gap-2.5 px-10 py-2.5 relative bg-gray-scalegray-scale-50 rounded-[10px_0px_0px_10px]">
                <div
                  className={`flex items-center justify-center w-fit ${
                    index === 0
                      ? "ml-[-10.50px] mr-[-10.50px]"
                      : index === 1
                        ? "ml-[-19.00px] mr-[-19.00px]"
                        : "ml-[-1.50px] mr-[-1.50px]"
                  } font-heading-h3-300 font-[number:var(--heading-h3-300-font-weight)] text-gray-scalegray-scale-700 text-[length:var(--heading-h3-300-font-size)] text-center leading-[var(--heading-h3-300-line-height)] whitespace-nowrap relative tracking-[var(--heading-h3-300-letter-spacing)] [font-style:var(--heading-h3-300-font-style)]`}
                >
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

        <div className="flex flex-col w-[999px] h-[735px] items-center justify-center gap-2.5 p-2.5 absolute top-[527px] left-0 rounded-[3px] border border-solid border-[#a7a7aa]">
          <p className="w-[933px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] leading-[var(--body-b2-300-line-height)] relative tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)]">
            가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사가나다라바사
          </p>
          <div className="relative w-[933px] h-[352px] bg-gray-scalegray-scale-50" />
        </div>

        <div className="inline-flex items-center gap-[13px] absolute top-[1308px] left-0">
          <button
            onClick={handleLikeToggle}
            className="inline-flex items-center justify-center gap-[5px] px-2 py-[5px] relative flex-[0_0_auto] bg-gray-scalegray-scale-50 rounded-[5px]"
            aria-label={`공감 ${likes}개`}
          >
            <img
              className="relative w-5 h-5"
              alt="Thumbs up"
              src={like}
            />
            <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
              <span className="w-fit mt-[-1.00px] font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-gray-scalegray-scale-300 text-[length:var(--body-b2-200-font-size)] leading-[var(--body-b2-200-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-200-letter-spacing)] [font-style:var(--body-b2-200-font-style)]">
                공감
              </span>
              <span className="relative w-fit mt-[-1.00px] font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-gray-scalegray-scale-300 text-[length:var(--body-b2-200-font-size)] tracking-[var(--body-b2-200-letter-spacing)] leading-[var(--body-b2-200-line-height)] whitespace-nowrap [font-style:var(--body-b2-200-font-style)]">
                {likes}
              </span>
            </div>
          </button>
          <button className="flex w-[83px] items-center justify-center gap-[5px] px-2 py-[5px] relative bg-gray-scalegray-scale-50 rounded-[5px]">
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
        </div>

        <img
          className="absolute top-[1201px] left-[-339px] w-[9px] h-5"
          alt="Decoration"
          src={deco_1}
        />
        <img
          className="absolute top-[1321px] left-[-339px] w-[9px] h-5"
          alt="Decoration"
          src={deco_1}
        />

        <section className="flex flex-col w-[999px] items-start gap-[17px] absolute top-[1376px] left-0">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`${
                comment.isReply
                  ? "gap-2.5 p-2.5 bg-gray-scalegray-scale-50"
                  : "gap-[11px]"
              } flex flex-col w-[999px] items-start relative flex-[0_0_auto]`}
            >
              <div
                className={`flex ${
                  comment.isReply ? "flex-col" : ""
                } items-start gap-[11px] relative ${
                  comment.isReply
                    ? "self-stretch w-full flex-[0_0_auto]"
                    : "w-[999px]"
                }`}
              >
                <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                  <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                    <img
                      className="relative w-[35px] h-[35.36px] object-cover"
                      alt={`${comment.author} avatar`}
                      src={comment.avatar}
                    />
                    <div className="relative w-fit font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-black text-[length:var(--body-b2-200-font-size)] tracking-[var(--body-b2-200-letter-spacing)] leading-[var(--body-b2-200-line-height)] whitespace-nowrap [font-style:var(--body-b2-200-font-style)]">
                      {comment.author}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2.5 relative flex-[0_0_auto]">
                    <button className="w-fit mt-[-1.00px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] leading-[var(--body-b2-300-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)]">
                      대댓글
                    </button>
                    <img
                      className="relative w-px h-[13.5px]"
                      alt="Separator"
                      src={separator}
                    />
                    <button className="w-fit mt-[-1.00px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] leading-[var(--body-b2-300-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)]">
                      쪽지
                    </button>
                    <img
                      className="relative w-px h-[13.5px]"
                      alt="Separator"
                      src={separator}
                    />
                    <button className="w-fit mt-[-1.00px] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-black text-[length:var(--body-b2-300-font-size)] leading-[var(--body-b2-300-line-height)] whitespace-nowrap relative tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)]">
                      신고
                    </button>
                  </div>
                </div>
                <div className="flex flex-col w-[249px] items-start relative flex-[0_0_auto]">
                  <p className="self-stretch mt-[-1.00px] font-body-b2-200 font-[number:var(--body-b2-200-font-weight)] text-black text-[length:var(--body-b2-200-font-size)] leading-[var(--body-b2-200-line-height)] relative tracking-[var(--body-b2-200-letter-spacing)] [font-style:var(--body-b2-200-font-style)]">
                    {comment.content}
                  </p>
                  <time className="relative self-stretch font-body-b3-200 font-[number:var(--body-b3-200-font-weight)] text-black text-[length:var(--body-b3-200-font-size)] tracking-[var(--body-b3-200-letter-spacing)] leading-[var(--body-b3-200-line-height)] [font-style:var(--body-b3-200-font-style)]">
                    {comment.date}
                  </time>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="flex w-[999px] items-center gap-5 absolute top-[1638px] left-0">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글 쓰기"
            className="flex w-[886px] h-14 items-center gap-2.5 px-5 py-2.5 relative bg-gray-scalewhite rounded-[5px] border border-solid border-[#a7a7aa] font-body-b2-300 font-[number:var(--body-b2-300-font-weight)] text-gray-scalegray-scale-300 text-[length:var(--body-b2-300-font-size)] leading-[var(--body-b2-300-line-height)] tracking-[var(--body-b2-300-letter-spacing)] [font-style:var(--body-b2-300-font-style)]"
            aria-label="댓글 입력"
          />
          <button
            onClick={handleCommentSubmit}
            className="flex h-14 items-center justify-center gap-2.5 p-2.5 relative flex-1 grow bg-primaryprimary-50 rounded-[5px] border border-solid border-[#23cd9d]"
          >
            <span className="w-fit font-body-b1-100 font-[number:var(--body-b1-100-font-weight)] text-primaryprimary-600 text-[length:var(--body-b1-100-font-size)] leading-[var(--body-b1-100-line-height)] whitespace-nowrap relative tracking-[var(--body-b1-100-letter-spacing)] [font-style:var(--body-b1-100-font-style)]">
              등록
            </span>
          </button>
        </div>
      </article>
    </div>
  );
};
