import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import SavedPosts from './pages/SavedPosts';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="post/:id" element={<PostDetail />} />
        <Route path="profile/:username" element={<Profile />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="create" element={<CreatePost />} />
          <Route path="saved" element={<SavedPosts />} />
        </Route>
      </Route>
    </Routes>
  );
}