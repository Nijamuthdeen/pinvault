import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';

const CATEGORIES = ['Art', 'Travel', 'Food', 'Fashion', 'Photography', 'Architecture', 'Nature', 'DIY', 'Technology', 'General'];

export default function CreatePost() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [form, setForm] = useState({ title: '', description: '', category: 'General' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return setError('Please select an image');
    if (!form.title.trim()) return setError('Title is required');
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', image);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const { data } = await createPost(fd);
      navigate(`/post/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Create Pin</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="md:flex">
          {/* Image upload */}
          <div className="md:w-2/5 p-6 bg-gray-50 flex flex-col">
            <div
              className={`flex-1 min-h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragOver ? 'border-coral-400 bg-coral-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-400">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Drop image here or click to upload</p>
                  <p className="text-xs text-gray-400">JPG, PNG, GIF, WEBP up to 10MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            {preview && (
              <button onClick={() => { setImage(null); setPreview(null); }} className="mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors text-center">
                Remove image
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="md:w-3/5 p-6 md:p-8 flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
                placeholder="Add a title"
                maxLength={255}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 resize-none"
                placeholder="Tell everyone about your pin..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 bg-white"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="mt-auto pt-2 flex gap-3">
              <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 py-3 bg-coral-400 hover:bg-coral-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm">
                {loading ? 'Publishing...' : 'Publish Pin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}