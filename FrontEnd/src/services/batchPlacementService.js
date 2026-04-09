import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/placements`;

export const uploadBatchData = async (formData) => {
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return response.data;
};

export const getBatches = async () => {
  const response = await axios.get(`${API_URL}/batches`, {
    withCredentials: true,
  });
  return response.data;
};

export const getBatchDetail = async (id) => {
  const response = await axios.get(`${API_URL}/batch/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const getSummaryStats = async (batchId) => {
  const response = await axios.get(`${API_URL}/stats/summary`, {
    params: { batchId },
    withCredentials: true,
  });
  return response.data;
};

export const getBranchStats = async (batchId) => {
  const response = await axios.get(`${API_URL}/stats/branch`, {
    params: { batchId },
    withCredentials: true,
  });
  return response.data;
};

export const getCompanyStats = async (batchId) => {
  const response = await axios.get(`${API_URL}/stats/company`, {
    params: { batchId },
    withCredentials: true,
  });
  return response.data;
};

export const getPackageDistribution = async (batchId) => {
  const response = await axios.get(`${API_URL}/stats/package-distribution`, {
    params: { batchId },
    withCredentials: true,
  });
  return response.data;
};

export const getCGPAStats = async (batchId) => {
  const response = await axios.get(`${API_URL}/stats/cgpa`, {
    params: { batchId },
    withCredentials: true,
  });
  return response.data;
};

export const getInsights = async (batchId) => {
  const response = await axios.get(`${API_URL}/stats/insights`, {
    params: { batchId },
    withCredentials: true,
  });
  return response.data;
};

export const getRoleDistribution = async (batchId) => {
  const response = await axios.get(`${API_URL}/stats/role-distribution`, {
    params: { batchId },
    withCredentials: true,
  });
  return response.data;
};

export const getBranchEfficiency = async (batchId) => {
  const response = await axios.get(`${API_URL}/stats/branch-efficiency`, {
    params: { batchId },
    withCredentials: true,
  });
  return response.data;
};
