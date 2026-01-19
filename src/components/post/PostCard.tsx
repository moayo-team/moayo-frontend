import { useState } from "react";
import dotIcon from "../../assets/Ellipse 12.svg"
import { DUMMY_POST } from "../../data/postData";

const PostCard = ({ data, onLikeToggle }: { data: any, onLikeToggle: () => void }) => {
   

    return (
        <div className="flex flex-col w-[306px] gap-[16px] items-center">
            {/* 이미지 영역 */}
            <div className="relative w-full aspect-square rounded-[20px] bg-[#F2F2F2] overflow-hidden flex items-center justify-center">
                {data.image ? (
                    <img
                        src={data.image}
                        alt={data.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    /* 이미지가 없는 경우*/
                    <span className="w-full h-full bg-[#F2F2F2]"></span>
                )}

                {/* 찜하기 버튼*/}
                <button
                    className="absolute top-[20px] right-[20px] z-10"
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onLikeToggle();
                    }}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24"
                        fill={data.isLiked ? "#FF5A5F" : "none"}
                        stroke={data.isLiked ? "#FF5A5F" : "#969599"}
                        strokeWidth="2"
                        className="drop-shadow-sm transition-colors duration-200"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>

            {/*텍스트 정보 */}
            <div className="flex flex-col gap-[24px]">
                <div className="flex flex-col self-stretch">
                    {/* 제목*/}
                    <span className="self-stretch font-pretendard text-[24px] font-semibold leading-[130%] text-[#444446]
                        ">
                        {data.title}
                    </span>

                    {/* 소개글*/}
                    <p className="self-stretch font-pretendard text-[18px] font-semibold leading-[150%] text-[#444446] min-h-[54px]
                        ">
                        {data.intro}
                    </p>
                </div>
                {/* 하단 정보 */}
                <div className="flex flex-col w-fit items-start gap-[4px]">
                    <span className="font-pretendard text-[14px] font-normal leading-[150%] text-[#7C7B80]
                        truncate">
                        {data.author}
                    </span>
                    <div className="flex items-center gap-[4px]">
                        <span className="font-pretendard text-[14px] text-[#7C7B80] font-normal leading-[150%]
                            truncate">
                            {data.category}
                        </span>
                       <img
                            src={dotIcon}
                            className="w-[3px] h-[3px]"
                       />
                        <span className="font-pretendard text-[14px] text-[#7C7B80] font-normal leading-[150%]
                            truncate">
                            {data.preferred}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostCard