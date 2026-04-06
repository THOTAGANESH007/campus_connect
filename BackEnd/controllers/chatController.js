import axios from "axios";
import ChatSession from "../models/ChatSession.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = process.env.GEMINI_FLASH_URL;

// GET /api/chat/sessions
export async function getSessions(req, res) {
  try {
    const sessions = await ChatSession.find({ userId: req.user._id })
      .select("-messages") // exclude messages for the list view to save bandwidth
      .sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/chat/sessions/:id
export async function getSessionById(req, res) {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/chat/sessions
export async function createSession(req, res) {
  try {
    const newSession = await ChatSession.create({
      userId: req.user._id,
      title: "New Chat",
      messages: [],
    });
    res.status(201).json(newSession);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /api/chat/sessions/:id
export async function deleteSession(req, res) {
  try {
    const session = await ChatSession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/chat/sessions/:id/message
export async function sendMessageToSession(req, res) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const session = await ChatSession.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!session) return res.status(404).json({ message: "Session not found" });

    // Update title if this is the first user message
    if (session.messages.length === 0) {
      session.title = text.substring(0, 30) + (text.length > 30 ? "..." : "");
    }

    // Add user message to DB
    session.messages.push({ role: "user", text });
    await session.save();

    // Prepare history for Gemini
    const historyForApi = session.messages.map((msg) => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    if (!GEMINI_API_KEY)
      return res
        .status(500)
        .json({ message: "Gemini API key not configured on server" });

    let aiText = "";
    try {
      const response = await axios.post(
        `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
        { contents: historyForApi },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      if (data.candidates && data.candidates.length > 0) {
        aiText = data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("No response string from Gemini");
      }
    } catch (apiErr) {
      console.error("Gemini API Error:", apiErr?.response?.data || apiErr.message);
      session.messages.push({
        role: "model",
        text: "I'm sorry, I encountered an error communicating with my brain.",
        isError: true,
      });
      await session.save();
      return res.status(500).json({ 
        error: "Failed to fetch AI response",
        session 
      });
    }

    // Add model message to DB
    session.messages.push({ role: "model", text: aiText });
    await session.save();

    res.json({ text: aiText, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

