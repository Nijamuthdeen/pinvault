import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPosts } from '../services/postService';
import PostGrid from '../components/posts/PostGrid';
import CategoryFilter from '../components/posts/CategoryFilter';
import { LoadingPage, ErrorMessage } from '../components/common/States';

export default function Home() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (reset = false) => {
    try {
      setLoading(true);
      const p = reset ? 1 : page;
      const { data } = await getPosts({ search, category, page: p, limit: 20 });
      setPosts(prev => reset ? data : [...prev, ...data]);
      setHasMore(data.length === 20);
      if (!reset) setPage(p + 1);
    } catch {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchPosts(true);
  }, [search, category]);

  return (
    <div className="max-w-[1600px] mx-auto">
      <CategoryFilter selected={category} onChange={c => { setCategory(c); setPage(1); }} />
      {search && (
        <p className="px-4 py-2 text-sm text-gray-500">
          Results for <span className="font-semibold text-gray-800">"{search}"</span>
        </p>
      )}
      {loading && posts.length === 0 ? (
        <LoadingPage />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <PostGrid posts={posts} onUpdate={() => fetchPosts(true)} />
          {hasMore && !loading && (
            <div className="flex justify-center py-8">
              <button
                onClick={() => fetchPosts()}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Load more
              </button>
            </div>
          )}
          {loading && posts.length > 0 && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-coral-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  );
}