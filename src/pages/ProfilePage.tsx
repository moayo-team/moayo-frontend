import { useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import { DUMMY_PROFILE } from "../data/profileData";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ResumeSection from "../components/Resume/ResumeSection";

const ProfilePage = () => {
  const location = useLocation();
  const [profileData, setProfileData] = useState(DUMMY_PROFILE);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [allResumes, setAllResumes] = useState(DUMMY_PROFILE.careers);

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

      <ResumeSection 
        carrers={allResumes} 
        sortOrder={sortOrder}/>

    </div>
  );
}

export default ProfilePage
