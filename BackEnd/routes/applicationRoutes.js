import express from "express";
import {
  applyForDrive,
  getMyApplications,
  updateApplicationStatus,
  getDriveApplicants,
} from "../controllers/applicationController.js";
import { protect, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

const officerOrAdmin = authorizeRoles("ADMIN", "PLACEMENT_OFFICER");

router.post("/apply/:driveId", protect, applyForDrive);
router.get("/my-applications", protect, getMyApplications);
router.patch("/status/:applicationId", protect, officerOrAdmin, updateApplicationStatus);
router.get("/drive/:driveId", protect, officerOrAdmin, getDriveApplicants);

export default router;
