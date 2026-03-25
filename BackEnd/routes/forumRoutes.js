import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  addComment,
  toggleUpvote,
  deletePost,
} from "../controllers/forumController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getPosts);
router.post("/", protect, createPost);
router.get("/:id", protect, getPostById);
router.post("/:id/comment", protect, addComment);
router.patch("/:id/upvote", protect, toggleUpvote);
router.delete("/:id", protect, deletePost);

export default router;
