import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost, likePost, savePost, getComments, addComment, deleteComment, deletePost } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { LoadingPage, ErrorMessage } from '../components/common/States';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    Promise.all([getPost(id), getComments(id)])
      .then(([postRes, commRes]) => {
        setPost(postRes.data);
        setLiked(postRes.data.is_liked || false);
        setSaved(postRes.data.is_saved || false);
        setLikesCount(postRes.data.likes_count || 0);
        setComments(commRes.data);
      })
      .catch(() => setError('Post not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await likePost(id);
      setLiked(data.liked);
      setLikesCount(c => data.liked ? c + 1 : c - 1);
    } catch {}
  };

  const handleSave = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await savePost(id);
      setSaved(data.saved);
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;
    setSubmitting(true);
    try {
      const { data } = await addComment(id, comment);
      setComments(prev => [...prev, data]);
      setComment('');
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (cid) => {
    try {
      await deleteComment(cid);
      setComments(prev => prev.filter(c => c.id !== cid));
    } catch {}
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      navigate('/');
    } catch {}
  };

  if (loading) return <LoadingPage />;
  if (error || !post) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2 bg-gray-50">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover max-h-[600px] md:max-h-none" />
          </div>

          {/* Details */}
          <div className="md:w-1/2 flex flex-col p-6 md:p-8 max-h-[600px] overflow-y-auto">
            {/* Actions */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={handleSave}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${saved ? 'bg-coral-400 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                </svg>
                {saved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${liked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {likesCount}
              </button>
              {user?.id === post.user_id && (
                <button onClick={handleDeletePost} className="ml-auto p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete post">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Category */}
            {post.category && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full mb-3 w-fit">
                {post.category}
              </span>
            )}

            {/* Title & Description */}
            <h1 className="font-display text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
            {post.description && <p className="text-gray-600 text-sm leading-relaxed mb-6">{post.description}</p>}

            {/* Author */}
            <Link to={`/profile/${post.username}`} className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-coral-400 flex items-center justify-center text-white font-semibold">
                {post.avatar ? <img src={post.avatar} alt="" className="w-full h-full object-cover" /> : post.username[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{post.username}</p>
                <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </Link>

            {/* Comments */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{comments.length} Comments</h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {comments.map(c => (
                  <div key={c.id} className="flex gap-3 group">
                    <div className="w-7 h-7 rounded-full bg-coral-400 flex items-center justify-center text-white text-xs font-semibold shrink-0 overflow-hidden">
                      {c.avatar ? <img src={c.avatar} alt="" className="w-full h-full object-cover" /> : c.username[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-gray-800 mr-2">{c.username}</span>
                      <span className="text-xs text-gray-600">{c.content}</span>
                    </div>
                    {user?.id === c.user_id && (
                      <button onClick={() => handleDeleteComment(c.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-xs">✕</button>
                    )}
                  </div>
                ))}
              </div>

              {user ? (
                <form onSubmit={handleComment} className="flex gap-2">
                  <input
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-400"
                  />
                  <button disabled={submitting || !comment.trim()} className="bg-coral-400 hover:bg-coral-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                    Post
                  </button>
                </form>
              ) : (
                <p className="text-xs text-gray-400">
                  <Link to="/login" className="text-coral-400 font-medium">Log in</Link> to comment
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}