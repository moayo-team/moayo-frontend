import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";


const HomeLayout = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="relative z-[9999]"> 
        <Navbar />
      </div> 
        <div className="flex flex-col  w-full mt-[100px] pb-[100px] overflow-x-auto">
        <main className="w-fit items-center px-[20px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
