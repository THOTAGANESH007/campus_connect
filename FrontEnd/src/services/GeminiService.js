import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Sends a message to the Gemini API.
 * @param {Array} history - The chat history including the new user message.
 * Format: [{ role: 'user' | 'model', parts: [{ text: 'message' }] }]
 * @returns {Promise<string>} - The response text from Gemini.
 */
export const sendMessageToGemini = async (history) => {
    if (!API_KEY) {
        throw new Error("Gemini API Key is missing");
    }

    try {
        const response = await axios.post(
            `${BASE_URL}?key=${API_KEY}`,
            {
                contents: history,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = response.data;
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("No response from Gemini");
        }
    } catch (error) {
        console.error("Error communicating with Gemini:", error);
        throw error;
    }
};
