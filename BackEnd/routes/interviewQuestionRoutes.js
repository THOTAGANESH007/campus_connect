import express from "express";
import {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    toggleUpvote,
    addComment,
    deleteComment,
} from "../controllers/interviewQuestionController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// CRUD
router.route("/").post(protect, createQuestion).get(protect, getAllQuestions);
router.route("/:id").get(protect, getQuestionById).put(protect, updateQuestion).delete(protect, deleteQuestion);

// Upvote toggle
router.put("/:id/upvote", protect, toggleUpvote);

// Comments
router.post("/:id/comments", protect, addComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);

export default router;
