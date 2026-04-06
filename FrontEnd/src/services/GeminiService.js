import axios from "axios";

const API = `${import.meta.env.VITE_API_BASE_URL}/api/chat/sessions`;

export const getChatSessions = async () => {
  const response = await axios.get(API, { withCredentials: true });
  return response.data;
};

export const getChatSession = async (id) => {
  const response = await axios.get(`${API}/${id}`, { withCredentials: true });
  return response.data;
};

export const createChatSession = async () => {
  const response = await axios.post(API, {}, { withCredentials: true });
  return response.data;
};

export const sendMessageToChatSession = async (id, text) => {
  const response = await axios.post(
    `${API}/${id}/message`,
    { text },
    { withCredentials: true }
  );
  return response.data;
};

export const deleteChatSession = async (id) => {
  const response = await axios.delete(`${API}/${id}`, { withCredentials: true });
  return response.data;
};
