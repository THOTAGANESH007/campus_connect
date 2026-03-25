import axios from "axios";

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/resume`;
const api = axios.create({ withCredentials: true });

/**
 * Upload a PDF resume and receive AI analysis.
 * @param {File} file - the PDF file object
 * @returns {Promise<{ score, skills, suggestions, recommendedRoles, summary }>}
 */
export const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  const res = await api.post(`${BASE}/analyze`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
