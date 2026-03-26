import axios from "axios";

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/notifications`;
const api = axios.create({ withCredentials: true });

export const getNotifications = () => api.get(BASE).then((r) => r.data);
export const markRead = (id) =>
  api.patch(`${BASE}/mark-read/${id}`).then((r) => r.data);
export const markAllRead = () =>
  api.patch(`${BASE}/mark-all-read`).then((r) => r.data);
export const sendNotification = (payload) =>
  api.post(`${BASE}/send`, payload).then((r) => r.data);
