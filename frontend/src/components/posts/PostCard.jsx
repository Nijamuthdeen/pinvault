import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { likePost, savePost } from '../../services/postService';
import { useAuth } from '../../context/AuthContext';

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.is_liked || false);
  const [saved, setSaved] = useState(post.is_saved || false);
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [hover, setHover] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) return navigate('/login');
    try {
      const { data } = await likePost(post.id);
      setLiked(data.liked);
      setLikes(l => data.liked ? l + 1 : l - 1);
    } catch {}
  };

  const handleSave = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) return navigate('/login');
    try {
      const { data } = await savePost(post.id);
      setSaved(data.saved);
      onUpdate?.();
    } catch {}
  };

  return (
    <div className="masonry-item group relative">
      <Link to={`/post/${post.id}`}>
        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {/* Overlay */}
          <div className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${hover ? 'opacity-100' : 'opacity-0'} rounded-2xl`}>
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button
                onClick={handleSave}
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${saved ? 'bg-coral-400 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                title={saved ? 'Unsave' : 'Save'}
              >
                <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                </svg>
              </button>
              <button
                onClick={handleLike}
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${liked ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                title={liked ? 'Unlike' : 'Like'}
              >
                <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Category badge */}
          {post.category && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
          )}
        </div>

        {/* Post info */}
        <div className="px-1 pt-2 pb-1">
          <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{post.title}</p>
          <div className="flex items-center justify-between mt-1.5">
            <Link
              to={`/profile/${post.username}`}
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            >
              <div className="w-5 h-5 rounded-full bg-coral-400 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                {post.avatar ? <img src={post.avatar} alt="" className="w-full h-full object-cover" /> : post.username[0].toUpperCase()}
              </div>
              <span className="text-xs text-gray-500">{post.username}</span>
            </Link>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-red-400">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {likes}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}