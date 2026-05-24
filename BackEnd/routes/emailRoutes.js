import express from "express";
import {
  getStudentsList,
  sendMailAction,
} from "../controllers/emailController.js";
import { protect, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// Fetch student list for dropdown selection
router.get(
  "/students",
  protect,
  authorizeRoles("ADMIN", "PLACEMENT_OFFICER"),
  getStudentsList
);

// Dispatch email
router.post(
  "/send",
  protect,
  authorizeRoles("ADMIN", "PLACEMENT_OFFICER"),
  sendMailAction
);

export default router;
