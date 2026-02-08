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
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthProvider';
import { GoogleCallback } from './pages/GoogleCallback';
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
      { path: "board", element: <ProtectedRoute><BoardPage /></ProtectedRoute> }, 
      { path: "post/:id", element: <PostDetailPage /> },
      { path: "create", element: <ProtectedRoute><CreatePostPage /></ProtectedRoute> },
      { path: "edit/:id", element: <ProtectedRoute><EditPostPage /></ProtectedRoute> },
      { path: "my-posts", element: <ProtectedRoute><MyPostsPage /></ProtectedRoute> },
      { path: "message", element: <ProtectedRoute><MessagePage /></ProtectedRoute> },
      { path: "profile/add-career", element: <CareerAddPage /> },
      { path: "auth/callback", element: <GoogleCallback /> },
    ],
  },
  {
    path: "/profile",
    element: <ProtectedRoute><ProfileLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <ProfilePage /> }, //내 프로필
      { path: ":userId", element: <ProfilePage /> }, // 타인 프로필
      { path: "add-career", element: <CareerAddPage />},
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider> {/* 모든 라우트를 감싸고 있어야 합니다. */}
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App;