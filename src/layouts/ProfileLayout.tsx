import { Outlet } from "react-router-dom";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import Navbar from "../components/Navbar";

const ProfileLayout = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navbar /> 
      {/* 컨텐츠 영역 */}
      <div className="flex justify-center w-full mt-[20px] pb-[100px]">
        <div className="flex w-full max-w-[1280px] px-[20px] gap-[40px]">
          
          {/* 왼쪽 사이드바 */}
          <aside className="shrink-0">
            <ProfileSidebar />
          </aside>

          {/* 오른쪽 메인 컨텐츠 */}
          <main className="flex-1 max-w-[963px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
