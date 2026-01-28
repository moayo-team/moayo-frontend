import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeLayout from './layouts/HomeLayout';
import HomePage from './pages/HomePage';
import ResumeAddPage from './pages/CareerAddPage';
import ProfileLayout from './layouts/ProfileLayout';
import ProfilePage from './pages/ProfilePage';
import MessagePage from './pages/MessagePage';
import CareerAddPage from './pages/CareerAddPage';


const router = createBrowserRouter([
     {
      path: "/",
      element: <HomeLayout />, 
      children: [
        { index: true, element: <HomePage /> },
        { path: "profile/add-resume", element: <ResumeAddPage /> },
        { path: "message", element: <MessagePage />}
        ],
      },
      {
        path: "/profile",
        element: <ProfileLayout />,
        children: [
          { index: true, element: <ProfilePage /> },
          { path: "add-career", element: <CareerAddPage />},
        ],
      },
    ],
  );