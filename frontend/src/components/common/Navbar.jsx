import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-coral-400 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 2C8 2 5 5 5 9c0 2.4 1.2 4.5 3 5.7L7 20l3-2 2 4 2-4 3 2-.9-5.3C17.8 13.5 19 11.4 19 9c0-4-3-7-7-7z"/>
            </svg>
          </div>
          <span className="font-display text-xl font-bold text-gray-900 hidden sm:block">Pinvault</span>
        </Link>

        {/* Search */}
        <SearchBar />

        {/* Nav actions */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link to="/create" className="hidden sm:flex items-center gap-1.5 bg-coral-400 hover:bg-coral-500 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
                <span className="text-lg leading-none">+</span> Create
              </Link>
              <Link to="/saved" className="hidden sm:block p-2 text-gray-500 hover:text-gray-800 transition-colors" title="Saved">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                </svg>
              </Link>
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 hover:border-coral-400 transition-colors">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-coral-400 flex items-center justify-center text-white font-semibold text-sm">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-11 bg-white rounded-2xl shadow-xl border border-gray-100 w-48 py-2 z-50">
                    <Link to={`/profile/${user.username}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      Profile
                    </Link>
                    <Link to="/saved" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      Saved Posts
                    </Link>
                    <Link to="/create" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      Create Post
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">Log in</Link>
              <Link to="/register" className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function SearchBar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/?search=${encodeURIComponent(q.trim())}`);
    else navigate('/');
  };
  return (
    <form onSubmit={submit} className="flex-1 max-w-md">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search pins..."
          className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 focus:bg-white transition-all"
        />
      </div>
    </form>
  );
}