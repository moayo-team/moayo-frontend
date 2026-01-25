import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProfileLayout = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <Navbar /> 
        <main className="flex-1 w-full mt-[70px] pb-[100px] flex justify-center">
          <div className="w-full max-w-[1024px] px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>       
        </main>
    </div>
  );
};

export default ProfileLayout;
