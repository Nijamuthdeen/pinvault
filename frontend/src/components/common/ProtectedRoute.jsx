import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner /></div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function Spinner() {
  return (
    <div className="w-8 h-8 border-2 border-coral-400 border-t-transparent rounded-full animate-spin" />
  );
}