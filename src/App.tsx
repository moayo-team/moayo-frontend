import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeLayout from './layouts/HomeLayout';
import HomePage from './pages/HomePage';
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
        { path: "message", element: <MessagePage />},
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

function App() {
  

  return (
    <>
    <RouterProvider router ={router}/>
    </>
  )
}

export default App;
