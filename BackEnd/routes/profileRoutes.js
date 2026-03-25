import express from "express";
import {
  getMyProfile,
  updateProfile,
  uploadResume,
  toggleBookmark,
  getBookmarks,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/update", protect, updateProfile);
router.put("/upload-resume", protect, upload.single("resume"), uploadResume);
router.post("/bookmark/:type/:id", protect, toggleBookmark);
router.get("/bookmarks", protect, getBookmarks);

export default router;
