import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProfileLayout = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <Navbar /> 
        <main className="flex-1 w-full mt-[70px] pb-[100px] overflow-x-auto flex flex-col items-center">
          <div className="w-full min-w-0">
            <Outlet />
          </div>       
        </main>
    </div>
  );
};

export default ProfileLayout;
