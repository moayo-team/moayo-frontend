import './App.css'
import '../index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeLayout from './layouts/HomeLayout';
import HomePage from './pages/HomePage';
import ProfileLayout from './layouts/ProfileLayout';
import ProfilePage from './pages/ProfilePage';
import MessagePage from './pages/MessagePage';
import CareerAddPage from './pages/CareerAddPage';
import LoginPage from './pages/LoginPage';
import { BoardPage } from './pages/BoardPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { EditPostPage } from './pages/EditPostPage';
import { MyPostsPage } from './pages/MyPostsPage';
import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthProvider';
import 'react-quill-new/dist/quill.snow.css';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, 
    },
  },
});


const router = createBrowserRouter([
     {
      path: "/",
      element: <HomeLayout />, 
      children: [
        { index: true, element: <HomePage /> },
        { path: "login", element: <LoginPage /> },
        { path: "profile/add-craeer", element: <CareerAddPage /> },
        { path: "board", element: <BoardPage /> }, 
        { path: "post/:id", element: <PostDetailPage /> },
        { path: "create", element: <CreatePostPage /> },
        { path: "edit/:id", element: <EditPostPage /> },
        { path: "my-posts", element: <MyPostsPage /> },
        { path: "message", element: <MessagePage /> }
      ],
    },
      {
      path: "/message",
      element: <MessagePage />,
    },
    {
      path: "/profile",
      element: <ProfileLayout />,
        children: [
          { index: true, element: <ProfilePage /> },
          { path: "add-career", element: <CareerAddPage />},
        ],
      }
    ],
  );

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App;
