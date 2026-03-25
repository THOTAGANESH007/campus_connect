import express from "express";
import {
  getNotifications,
  markRead,
  markAllRead,
  sendNotification,
} from "../controllers/notificationController.js";
import { protect, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/mark-read/:id", protect, markRead);
router.patch("/mark-all-read", protect, markAllRead);
router.post("/send", protect, authorizeRoles("ADMIN", "PLACEMENT_OFFICER"), sendNotification);

export default router;
