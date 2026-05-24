import express from "express";
import {
  getSessions,
  getSessionById,
  createSession,
  sendMessageToSession,
  deleteSession
} from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/sessions", protect, getSessions);
router.post("/sessions", protect, createSession);
router.get("/sessions/:id", protect, getSessionById);
router.post("/sessions/:id/message", protect, sendMessageToSession);
router.delete("/sessions/:id", protect, deleteSession);

export default router;
