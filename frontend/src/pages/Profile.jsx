import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import PostGrid from '../components/posts/PostGrid';
import { LoadingPage, ErrorMessage } from '../components/common/States';

export default function Profile() {
  const { username } = useParams();
  const { user, login } = useAuth();
  const fileRef = useRef();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  const isOwner = user?.username === username;

  const fetch = () => {
    setLoading(true);
    getProfile(username)
      .then(r => { setProfile(r.data); setBio(r.data.bio || ''); })
      .catch(() => setError('User not found'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [username]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('bio', bio);
      const { data } = await updateProfile(fd);
      setProfile(prev => ({ ...prev, ...data }));
      setEditing(false);
    } catch {} finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    fd.append('bio', bio);
    try {
      const { data } = await updateProfile(fd);
      setProfile(prev => ({ ...prev, avatar: data.avatar }));
    } catch {}
  };

  if (loading) return <LoadingPage />;
  if (error || !profile) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-coral-400 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
            {profile.avatar ? (
              <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              profile.username[0].toUpperCase()
            )}
          </div>
          {isOwner && (
            <>
              <button
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-gray-600">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </>
          )}
        </div>

        <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">{profile.username}</h1>
        <p className="text-sm text-gray-400 mb-3">{profile.email}</p>

        {editing ? (
          <div className="flex flex-col items-center gap-2 w-full max-w-xs">
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 resize-none"
              rows={3}
              placeholder="Write a short bio..."
            />
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="px-4 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-1.5 text-sm bg-coral-400 text-white rounded-full hover:bg-coral-500 disabled:opacity-60">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {profile.bio && <p className="text-sm text-gray-600 max-w-xs mb-3">{profile.bio}</p>}
            {isOwner && (
              <button onClick={() => setEditing(true)} className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full transition-colors">
                Edit profile
              </button>
            )}
          </>
        )}

        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <p className="font-bold text-gray-900 text-lg">{profile.posts?.length || 0}</p>
            <p className="text-xs text-gray-400">Pins</p>
          </div>
        </div>
      </div>

      {/* Posts */}
      <PostGrid posts={profile.posts} onUpdate={fetch} emptyMessage={`${profile.username} hasn't posted yet`} />
    </div>
  );
}