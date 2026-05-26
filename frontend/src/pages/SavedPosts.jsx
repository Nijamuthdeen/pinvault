import { useState, useEffect } from 'react';
import { getSavedPosts } from '../services/postService';
import PostGrid from '../components/posts/PostGrid';
import { LoadingPage, ErrorMessage } from '../components/common/States';

export default function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = () => {
    setLoading(true);
    getSavedPosts()
      .then(r => setPosts(r.data))
      .catch(() => setError('Failed to load saved posts'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-6">Saved Pins</h1>
      <PostGrid posts={posts} onUpdate={fetch} emptyMessage="You haven't saved any pins yet" icon="🔖" />
    </div>
  );
}