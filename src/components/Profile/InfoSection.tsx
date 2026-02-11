import type { ProfileFormData } from "../../types/profileForm";
import ProfileDetails from "./ProfileDetails";


interface InfoSectionProps {
    isEditing: boolean;
    isReadOnly?: boolean;
    isDetailsEmpty: boolean;
    data: ProfileFormData;
    experienceIds: number[];
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

const InfoSection = ({ isEditing, isReadOnly = false, isDetailsEmpty, data, experienceIds, onDataChange, onModeChange }: InfoSectionProps) => {

    //  버튼 텍스트 결정 로직
    const getButtonText = () => {
        if (isEditing) return "저장하기";
        return "수정하기";
    };

    const handleButtonClick = () => {
        if (isEditing) {
            // 필수 항목 체크
            const school = data.details.find(d => d.id === "school")?.value?.trim();
            const major = data.details.find(d => d.id === "major")?.value?.trim();
            const intro = data.introduction?.trim();

            if (!school || !major || !intro) {
                alert("학력, 학과, 자기소개는 모두 필수 입력 항목입니다.");
                return; 
            }
        }

        // 문제 없으면 모드 전환
        onModeChange();
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
                    {!isReadOnly && (
                        <div className="flex justify-end items-center">
                            <button
                                onClick={handleButtonClick}
                                className={`flex w-[100px] sm:w-[120px] h-[44px] sm:h-[48px] justify-center items-center rounded-[10px] transition-colors
                                    ${isEditing ? "bg-[#6EEBC7] text-[#25221D]" : "bg-[#EFEEEB] text-[#5F5749]"} 
                                `}
                            >
                                <span className="font-pretendard font-medium text-[14px] sm:text-[16px] leading-[140%]">
                                    {getButtonText()}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <ProfileDetails
                        isEditing={isEditing} // 초기 상태일 때도 입력창이 보여야 하므로 합쳐서 전달
                        isReadOnly={isReadOnly}
                        isDetailsEmpty={isDetailsEmpty}
                        data={data}
                        experienceIds={experienceIds}
                        onDataChange={onDataChange}
                    />
                </div>
            </div>
        </>
    )
}

export default InfoSection