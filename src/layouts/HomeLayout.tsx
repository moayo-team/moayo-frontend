import { Outlet } from "react-router-dom";
import { NavigationBar } from "../components/Navbar";


const HomeLayout = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <div className="relative z-[9999]"> 
        <NavigationBar />
      </div> 
        <div className="flex-1 w-full mt-[100px] pb-[100px] overflow-x-auto flex flex-col items-center">
        <main className="w-full flex flex-col items-center min-w-0 px-[20px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
