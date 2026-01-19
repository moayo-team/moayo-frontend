import { useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileHeader from "../components/Profile/ProfileHeader";
import InfoSection from "../components/Profile/InfoSection";
import { DUMMY_PROFILE } from "../data/profileData";

const ProfilePage = () => {
  const location = useLocation();
  const [profileData, setProfileData] = useState(DUMMY_PROFILE);

  useEffect(() => {
    if (location.state?.updatedProfile) {
      setProfileData(location.state.updatedProfile);
    }
  }, [location.state]);

  return (
    <div className="flex flex-col gap-[33px]">
    
      <ProfileHeader
        isEditing={false} 
        jobTitle={profileData.jobTitle}
        profileImage={profileData.profileImage}
        tags={profileData.tags || []}
        onDataChange={() => {}}/>
      <InfoSection 
          isEditing={false} 
          data={profileData}
           onDataChange={() => {}} />

    </div>
  );
}

export default ProfilePage
