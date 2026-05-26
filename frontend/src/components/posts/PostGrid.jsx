import PostCard from './PostCard';
import { EmptyState } from '../common/States';

export default function PostGrid({ posts, onUpdate, emptyMessage }) {
  if (!posts?.length) return <EmptyState message={emptyMessage || 'No posts found'} />;

  return (
    <div className="masonry px-3 sm:px-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} onUpdate={onUpdate} />
      ))}
    </div>
  );
}