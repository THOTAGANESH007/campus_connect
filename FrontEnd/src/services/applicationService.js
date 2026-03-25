import axios from "axios";

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;
const api = axios.create({ withCredentials: true });

export const applyForDrive  = (driveId) => api.post(`${BASE}/applications/apply/${driveId}`).then(r => r.data);
export const getMyApplications = () => api.get(`${BASE}/applications/my-applications`).then(r => r.data);
export const updateStatus = (applicationId, status) =>
  api.patch(`${BASE}/applications/status/${applicationId}`, { status }).then(r => r.data);
export const getDriveApplicants = (driveId) =>
  api.get(`${BASE}/applications/drive/${driveId}`).then(r => r.data);
