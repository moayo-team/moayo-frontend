import { Outlet } from "react-router-dom";
import { NavigationBar } from "../components/Navbar";

export default function MinLayoutContainer() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <div className="relative z-[9999]">
        <NavigationBar />
      </div>

      <main className="flex-1 w-full mt-[70px] pb-[100px] flex justify-center">
        <div className="w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
