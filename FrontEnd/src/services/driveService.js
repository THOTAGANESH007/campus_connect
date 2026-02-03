import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/drives`;

const axiosInstance = axios.create({
    withCredentials: true,
});

export const getDrives = async (params) => {
    const response = await axiosInstance.get(API_URL, { params });
    return response.data;
};

export const getDriveById = async (id) => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
};

export const createDrive = async (driveData) => {
    const response = await axiosInstance.post(API_URL, driveData);
    return response.data;
};

export const updateDrive = async (id, driveData) => {
    const response = await axiosInstance.put(`${API_URL}/${id}`, driveData);
    return response.data;
};

export const deleteDrive = async (id) => {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
};
