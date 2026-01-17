import { useRef, useState, type ChangeEvent } from "react";
import InterestTags from "./InterestTags";
import { Pencil } from "lucide-react";

interface UserInfoProps {
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
}

const UserInfo = ({ isEditing, setIsEditing }: UserInfoProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [avatarUrl, setAvatarUrl] = useState("src/assets/profile_photo.svg");  
    const [interestList, setInterestList] = useState([
            { id: 1, name: "디자인", selected: false },
            { id: 2, name: "기획", selected: false },
            { id: 3, name: "개발", selected: false },
            { id: 4, name: "스타트업", selected: true },
            { id: 5, name: "창업", selected: false },
        ]);

    const [userData, setUserData] = useState({
        school: "이화여자대학교",
        birth: "2003.03.22",
        major: "커뮤니케이션 미디어학부",
        email: "rwd4533@naver.com",
        bio: "자기소개자기소개자기소개자기소개자기소개..."
    });

    //프로필 사진 영역 클릭 시 호출
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    // 파일 선택 시 업로드 처리
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        //업로드 성공 시 즉시 미리보기 반영
        const previewUrl = URL.createObjectURL(file);
        setAvatarUrl(previewUrl);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    //태그 클릭 핸들러
    const handleTagToggle = (tagId: number) => {
        setInterestList(prev => 
        prev.map(tag => 
            tag.id === tagId ? { ...tag, selected: !tag.selected } : tag
        )
        );
    };

    return (
        <div className="w-full">
            <div className="flex w-full gap-[60px]">
                {/*아미지 & 수정버튼*/}
                <div className="flex flex-col w-[227px] items-start gap-[25px]">
                    {/**이미지 */}
                    <div 
                        onClick={isEditing ? handleImageClick : undefined}
                        className={`relative h-[258px] bg-[#FAFAFA] flex items-center justify-center
                        gap-[10px] self-stretch rounded-[10px] px-[20px] py-[27px]
                        ${isEditing ? "cursor-pointer" : "cursor-default"}`}    
                    >

                    <div className="relative h-[188.936px] aspect-square">
                        <div className=" overflow-hidden rounded-full">
                            <img 
                                src={avatarUrl}
                                alt="프로필 이미지" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                            
                        {isEditing && (
                            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
                                <div className="w-[40px] h-[40px] rounded-[20px] bg-[#F2F2F2] border border-[#C3C2C5]
                                    flex items-center justify-center shadow-sm">
                                <Pencil size={20} className="text-[#C3C2C5]" />
                                </div>
                            </div>
                        )}
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"  
                    />
                    </div>

                    {/* 수정 버튼 */}
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="w-full h-[74px] py-[10px] px-[15px] items-center justify-center gap-[10px] self-stretch 
                            bg-[#f2f2f2] rounded-[10px] cursor-pointer
                            font-pretendard text-[20px] font-medium leading-[140%]">
                            프로필 수정하기
                        </button>
                    )}
                </div>

                {/**정보 */}
                <div className="flex flex-col items-start w-[461px] gap-[20px]">
                    {[
                        { label: "학력", key: "school" },
                        { label: "생년월일", key: "birth" },
                        { label: "학과", key: "major" },
                        { label: "이메일", key: "email" }
                    ].map((item) => (
                        <div key={item.key} className="flex gap-[12px] items-center shrink-0">
                            <div className="flex items-center justify-center w-[95px] h-[74px] px-[40px] py-[10px]
                                bg-[#E9FCF7] rounded-l-[10px] 
                                font-pretendard text-[#58575B] text-[24px] font-medium leading-[130%]
                                whitespace-nowrap">
                                {item.label}
                            </div>
                            {isEditing ? (
                                //수정 모드일 때
                                <div className="relative flex-1 group"> 
                                    <input 
                                        type="text"
                                        value={userData[item.key as keyof typeof userData]}
                                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                                        className="flex items-center w-[325px] h-[74px] px-[30px] py-[10px]
                                        rounded-r-[10px] border border-[#D6D6D8] 
                                        font-pretendard text-[#444446] text-[24px] font-medium leading-[130%]
                                        outline-none
                                        " 
                                    />
                                    <div className="absolute right-[20px] top-1/2 -translate-y-1/2 text-[#C3C2C5]">
                                        <Pencil size="20" />
                                    </div>
                                </div>
                            ) : (
                                //일반 모드
                                <div className="flex items-center w-[325px] h-[74px] px-[30px] py-[10px]
                                    rounded-r-[10px] border border-[#D6D6D8] 
                                    font-pretendard text-[#444446] text-[24px] font-medium leading-[130%]">
                                    {userData[item.key as keyof typeof userData]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>


                {/**소개와 태그 */}
                <div className="flex flex-col w-[572px] gap-3">
                    {/**소개 */}
                    <div className="inline-flex flex-col gap-[10px] h-[160px] border border-[#D6D6D8] rounded-[10px] p-[20px]">
                        <div className="flex items-center justify-between">
                            <span className="font-pretendard text-[24px] font-semibold text-[#58575b] leading-[130%]">
                                한 줄 소개
                            </span>
                            {isEditing && (
                                <Pencil size={20} className="text-[#969599]" />
                                )}
                        </div>
                        {isEditing ? (
                            <>
                            <textarea 
                                className="outline-none font-pretendard text-[18px] resize-none leading-[150%]"
                                value={userData.bio}
                                onChange={(e) => handleInputChange("bio", e.target.value)}
                            />
                            </>
                        ) : (
                            <div className="text-[18px] text-[#444446] font-normal leading-[150%]">{userData.bio}</div>
                        )}
                    </div>
                    {/**관심사 태그 */}
                    <div className="flex flex-col w-[496px] items-start gap-[20px]">
                        <span className="self-stretch font-pretendard font-semibold text-[24px] leading-[130%] text-[#58575b]">
                            관심사 태그
                        </span>
                            <InterestTags 
                                interests={interestList} 
                                isEditing={isEditing} 
                                onTagClick={handleTagToggle} 
                            />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfo;