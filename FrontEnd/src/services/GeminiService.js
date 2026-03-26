import axios from "axios";

const API = `${import.meta.env.VITE_API_BASE_URL}/api/chat`;

/**
 * Sends a message to Gemini via the secure backend proxy.
 * @param {Array} history - Chat history: [{ role: 'user'|'model', parts: [{ text }] }]
 * @returns {Promise<string>} - Response text from Gemini
 */
export const sendMessageToGemini = async (history) => {
  try {
    const response = await axios.post(
      API,
      { history },
      { withCredentials: true },
    );
    return response.data.text;
  } catch (error) {
    console.error("Error communicating with Gemini backend:", error);
    throw error;
  }
};
