import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeLayout from './layouts/HomeLayout';
import HomePage from './pages/HomePage';
import ResumeAddPage from './pages/ResumeAddPage';
import ProfileLayout from './layouts/ProfileLayout';
import ProfilePage from './pages/ProfilePage';
import ProfileHistoryPage from './pages/ProfileHistoryPage';
import ProfileEditPage from './pages/ProfileEditPage';
import ProfilePostsPage from './pages/ProfilePostsPage';
import MessagePage from './pages/MessagePage';


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
          { path: "history", element: <ProfileHistoryPage /> },
          { path: "posts", element: <ProfilePostsPage /> },
          { path: "edit", element: <ProfileEditPage /> },
          { path: "add-resume", element: <ResumeAddPage />},
        ],
      },
    ],
  );

function App() {
  

  return (
    <>
    <RouterProvider router ={router}/>
    </>
  )
}

export default App;
