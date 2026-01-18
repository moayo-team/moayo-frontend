import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import editIcon from "../../assets/Edit2.svg";
import shareIcon from "../../assets/Share.svg";
import { DUMMY_PROFILE } from "../../data/profileData";
import InterestTags from "./InterestTags";

interface HeaderProps {
  isEditing: boolean;
  jobTitle: string;
  profileImage: string;
  tags: any[]; 
  onDataChange: (field: string, value: any) => void;
}

const ProfileHeader = ({ isEditing, jobTitle="", profileImage="",tags = [], onDataChange }: HeaderProps) => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const safeJobTitle = jobTitle || "";
    const displayTitle = safeJobTitle.split(",").join(" . ");
    const location = useLocation();
    // 현재 경로가 이력서 관리 페이지인지 확인
    const isResumeManagePage = location.pathname === "/profile/history";

    const handleEditClick = () => {
        navigate("/profile/edit");
    };
    const handleImageClick = () => {
        if (isEditing) {
            fileInputRef.current?.click(); // 편집 모드일 때만 파일 탐색기 열기
        }
    };
    
    // 파일 선택 시 업로드 처리
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            //업로드 성공 시 즉시 미리보기 반영
            const previewUrl = URL.createObjectURL(file);
            onDataChange("profileImage", previewUrl); 
        }
    };

    return (
        <header className="inline-flex flex-start gap-[40px]">
            {/**이미지 */}
            <div
                onClick={isEditing ? handleImageClick : undefined}
                className={`h-[258px] bg-[#FAFAFA] flex items-center justify-center gap-[10px] self-stretch 
                    rounded-[10px] px-[20px] py-[27px]  
                    ${isEditing ? "cursor-pointer" : "cursor-default"}`}    
            >
                <div className="h-[188.936px] aspect-square overflow-hidden rounded-full">
                    <img
                        src={profileImage || DUMMY_PROFILE.profileImage}
                        alt="프로필 이미지"
                        className="w-full h-full object-cover"
                    />
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <div className="flex w-[539px] flex-col gap-[60px]">
                <div className="flex flex-col w-[305px] items-start gap-[14px]">
                    <span className="slef-stretch font-pretendard text-[48px] font-bold leading-[120%] tracking-[-0.01em]">
                        {DUMMY_PROFILE.name}
                    </span>

                    <div className="flex w-fit items-center gap-[11px] self-stretch">
                        {isEditing ? (
                            // 수정 모드일 때
                            <>
                                <input
                                    className="font-pretendard text-[24px] font-medium leading-[130%] text-gray-500 bg-transparent outline-none w-full"
                                    value={displayTitle}
                                    onChange={(e) => onDataChange("jobTitle", e.target.value)}
                                    style={{ width: `${(jobTitle.length + 2.1) + 4}ch`}}
                                />
                                <img 
                                    src={editIcon}
                                    alt="수정" 
                                    className="w-[20px] h-[20px]" 
                                />
                            </>
                        ) : (
                            // 일반 모드일 때
                            <>
                                <span className="font-pretendard text-[24px] font-medium leading-[130%] text-gray-500">
                                    {displayTitle}
                                </span>
                                <button className="w-[24px] h-[24px] cursor-pointer">
                                    <img
                                        src={shareIcon}
                                        alt="공유"
                                        className="w-[16px] h-[20px] "
                                    />
                                </button>
                            </>
                        )}
                    </div>
                </div>


                {/* 수정 버튼 */}
                {!isEditing && !isResumeManagePage &&(
                    <button
                        onClick={handleEditClick}
                        className="h-[74px] py-[10px] px-[15px] items-center justify-center gap-[10px] self-stretch 
                        bg-[#f2f2f2] rounded-[10px] cursor-pointer
                        font-pretendard text-[20px] font-medium leading-[140%]">
                        프로필 수정하기
                    </button>
                )}
                {isResumeManagePage && (
                <div className="">
                    <InterestTags 
                        interests={tags.map((tag: any) => ({
                            id: tag.id,
                            name: tag.title, 
                            selected: true
                        }))} 
                        isEditing={false} 
                    />
                </div>
            )}
            </div>


        </header>
    )
}

export default ProfileHeader;