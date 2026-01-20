import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DUMMY_PROFILE } from "../data/profileData";
import ProfileHeader from "../components/Profile/ProfileHeader";
import InfoSection from "../components/Profile/InfoSection";

const ProfileEditPage = () => {
    const navigate = useNavigate();

    const [editData, setEditData] = useState({
    jobTitle: DUMMY_PROFILE.jobTitle,
    profileImage: DUMMY_PROFILE.profileImage,
    introduction: DUMMY_PROFILE.introduction,
    contact: DUMMY_PROFILE.contact,
    education: DUMMY_PROFILE.education,
    additionalInfo: DUMMY_PROFILE.additionalInfo,
    tags: DUMMY_PROFILE.tags,
    });
    
    const handleDataChange = (field: string, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
    console.log("저장된 데이터:", editData); 
    navigate("/profile", { state: { updatedProfile: editData } });
    };
    return (
        <>
            <div className="flex flex-col gap-[100px]">
                <div className="flex flex-col gap-[46px]">
                <ProfileHeader 
                    isEditing={true} 
                    jobTitle={editData.jobTitle}
                    profileImage={editData.profileImage}
                    tags={[]}
                    onDataChange={handleDataChange}/>

                <InfoSection 
                    isEditing={true} 
                    data={editData}
                    onDataChange={handleDataChange} />
                </div>
                <button 
                    onClick={handleSave}
                    className="flex w-[963px] h-[74px] px-[15px] py-[10px] justify-center items-center gap-[10px]
                    rounded-[10px] bg-[#F2F2F2]
                    font-pretendard text-[20px] font-medium leading-[140%] text-[#343436]"
                    >
                    저장하기
                </button>
            </div>
        </>

    )
}

export default ProfileEditPage