import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}