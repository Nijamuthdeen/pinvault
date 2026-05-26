import api from './api';

export const getPosts = (params) => api.get('/posts', { params });
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (formData) => api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const likePost = (id) => api.post(`/posts/${id}/like`);
export const savePost = (id) => api.post(`/posts/${id}/save`);
export const getSavedPosts = () => api.get('/posts/saved');

export const getComments = (postId) => api.get(`/comments/post/${postId}`);
export const addComment = (postId, content) => api.post(`/comments/post/${postId}`, { content });
export const deleteComment = (id) => api.delete(`/comments/${id}`);

export const getProfile = (username) => api.get(`/users/${username}`);
export const updateProfile = (formData) => api.put('/users/me/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });