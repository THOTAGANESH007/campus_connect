import express from "express";
import {
  createDrive,
  getAllDrives,
  getDriveById,
  updateDrive,
  deleteDrive,
} from "../controllers/driveController.js";
import { protect, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

const officerOrAdmin = authorizeRoles("ADMIN", "PLACEMENT_OFFICER");

router
  .route("/")
  .post(protect, officerOrAdmin, createDrive)
  .get(protect, getAllDrives);

router
  .route("/:id")
  .get(protect, getDriveById)
  .put(protect, officerOrAdmin, updateDrive)
  .delete(protect, officerOrAdmin, deleteDrive);

export default router;
