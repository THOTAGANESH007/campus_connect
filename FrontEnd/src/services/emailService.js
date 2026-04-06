import axios from "axios";

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/emails`;
const api = axios.create({ withCredentials: true });

export const getStudentsForMail = async () => {
  const { data } = await api.get(`${BASE}/students`);
  return data;
};

export const dispatchMail = async (payload) => {
  // payload: { target, subject, html }
  const { data } = await api.post(`${BASE}/send`, payload);
  return data;
};
