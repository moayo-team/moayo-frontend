import type { ProfileFormData } from "../../types/profileForm";
import ProfileDetails from "./ProfileDetails";


interface InfoSectionProps {
    isEditing: boolean;
    isDetailsEmpty:boolean;
    data: ProfileFormData;
     onDataChange: (
    id:
      | keyof ProfileFormData
      | "school"
      | "major"
      | "email"
      | "phone"
      | "school_verified",
    value: any
  ) => void;
    onModeChange: () => void;
}

const InfoSection = ({ isEditing, isDetailsEmpty, data, onDataChange, onModeChange }: InfoSectionProps) => {   

    //  버튼 텍스트 결정 로직
    const getButtonText = () => {
        if (isEditing) return "저장하기";
        return "수정하기"; 
    };
    return (
        <>
        <div className="flex flex-col w-full gap-[30px] pt-8">
            {/**타이틀, 버튼 */}
            <div className="flex flex-col w-full relative gap-4 md:gap-0">
                <span className="text-center text-[#342F28] font-pretendard text-[24px] md:text-[28px] font-semibold leading-[36px] tracking-normal">
                   프로필
                </span>
                    {/* 편집 버튼 */}
                    <div className="flex justify-end items-center">
                        <button
                            onClick={() => {
                                onModeChange();
                            }}
                            className={`flex w-[100px] sm:w-[120px] h-[44px] sm:h-[48px] justify-center items-center rounded-[10px] transition-colors
                                    ${isEditing ? "bg-[#6EEBC7] text-[#25221D]" : "bg-[#EFEEEB] text-[#5F5749]"} 
                                `}
                            >
                            <span className="font-pretendard font-medium text-[14px] sm:text-[16px] leading-[140%]">
                                {getButtonText()}
                            </span>
                        </button>
                    </div>
            </div>
            <div>
                <ProfileDetails
                    isEditing={isEditing} // 초기 상태일 때도 입력창이 보여야 하므로 합쳐서 전달
                    isDetailsEmpty={isDetailsEmpty}
                    data={data}
                    onDataChange={onDataChange}
                />
            </div>
        </div>
        </>
    )
}

export default InfoSection