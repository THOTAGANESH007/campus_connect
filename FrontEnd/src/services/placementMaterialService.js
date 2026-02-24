import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/placement-materials`;

const axiosInstance = axios.create({ withCredentials: true });

export const getMaterials = async (params) => {
    const res = await axiosInstance.get(API_URL, { params });
    return res.data;
};

export const getMaterialById = async (id) => {
    const res = await axiosInstance.get(`${API_URL}/${id}`);
    return res.data;
};

export const createMaterial = async (formData) => {
    // formData can be FormData (with file) or plain object (link only)
    const isFormData = formData instanceof FormData;
    const res = await axiosInstance.post(API_URL, formData, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
};

export const updateMaterial = async (id, data) => {
    const res = await axiosInstance.put(`${API_URL}/${id}`, data);
    return res.data;
};

export const deleteMaterial = async (id) => {
    const res = await axiosInstance.delete(`${API_URL}/${id}`);
    return res.data;
};

export const toggleUpvoteMaterial = async (id) => {
    const res = await axiosInstance.put(`${API_URL}/${id}/upvote`);
    return res.data;
};

export const incrementDownload = async (id) => {
    const res = await axiosInstance.put(`${API_URL}/${id}/download`);
    return res.data;
};
