import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/interview-questions`;

const axiosInstance = axios.create({ withCredentials: true });

export const getQuestions = async (params) => {
    const res = await axiosInstance.get(API_URL, { params });
    return res.data;
};

export const getQuestionById = async (id) => {
    const res = await axiosInstance.get(`${API_URL}/${id}`);
    return res.data;
};

export const createQuestion = async (data) => {
    const res = await axiosInstance.post(API_URL, data);
    return res.data;
};

export const updateQuestion = async (id, data) => {
    const res = await axiosInstance.put(`${API_URL}/${id}`, data);
    return res.data;
};

export const deleteQuestion = async (id) => {
    const res = await axiosInstance.delete(`${API_URL}/${id}`);
    return res.data;
};

export const toggleUpvoteQuestion = async (id) => {
    const res = await axiosInstance.put(`${API_URL}/${id}/upvote`);
    return res.data;
};

export const addComment = async (id, text) => {
    const res = await axiosInstance.post(`${API_URL}/${id}/comments`, { text });
    return res.data;
};

export const deleteComment = async (questionId, commentId) => {
    const res = await axiosInstance.delete(`${API_URL}/${questionId}/comments/${commentId}`);
    return res.data;
};
