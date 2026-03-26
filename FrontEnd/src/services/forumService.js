import axios from "axios";

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/forum`;
const api = axios.create({ withCredentials: true });

export const getPosts = (params) =>
  api.get(BASE, { params }).then((r) => r.data);
export const getPostById = (id) => api.get(`${BASE}/${id}`).then((r) => r.data);
export const createPost = (data) => api.post(BASE, data).then((r) => r.data);
export const addComment = (id, content) =>
  api.post(`${BASE}/${id}/comment`, { content }).then((r) => r.data);
export const toggleUpvote = (id) =>
  api.patch(`${BASE}/${id}/upvote`).then((r) => r.data);
export const deletePost = (id) =>
  api.delete(`${BASE}/${id}`).then((r) => r.data);
