import axios from "axios";

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;
const api  = axios.create({ withCredentials: true });

export const getMyProfile    = () => api.get(`${BASE}/profile/me`).then(r => r.data);
export const updateProfile   = (data) => api.put(`${BASE}/profile/update`, data).then(r => r.data);
export const uploadResume    = (formData) =>
  api.put(`${BASE}/profile/upload-resume`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(r => r.data);
export const toggleBookmark  = (type, id) => api.post(`${BASE}/profile/bookmark/${type}/${id}`).then(r => r.data);
export const getBookmarks    = () => api.get(`${BASE}/profile/bookmarks`).then(r => r.data);
export const getOverview     = () => api.get(`${BASE}/analytics/overview`).then(r => r.data);
export const getByCompany    = () => api.get(`${BASE}/analytics/by-company`).then(r => r.data);
export const getByBranch     = () => api.get(`${BASE}/analytics/by-branch`).then(r => r.data);
export const getStatusDistribution = () => api.get(`${BASE}/analytics/status-distribution`).then(r => r.data);
