import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = process.env.GEMINI_FLASH_URL;

// POST /api/chat
export async function chat(req, res) {
  try {
    const { history } = req.body; // Array of { role, parts: [{ text }] }
    if (!history || !Array.isArray(history))
      return res.status(400).json({ message: "history array is required" });

    if (!GEMINI_API_KEY)
      return res.status(500).json({ message: "Gemini API key not configured on server" });

    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      { contents: history },
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data;
    if (data.candidates && data.candidates.length > 0) {
      const text = data.candidates[0].content.parts[0].text;
      return res.json({ text });
    }
    res.status(500).json({ message: "No response from Gemini" });
  } catch (err) {
    const errMsg = err.response?.data?.error?.message || err.message;
    res.status(500).json({ error: errMsg });
  }
}
