import express from "express";
import { analyzeResume } from "../controllers/resumeController.js";
import { protect } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// POST /api/resume/analyze
// Accepts a single "resume" PDF file, returns AI-powered analysis
router.post("/analyze", protect, upload.single("resume"), analyzeResume);

export default router;
