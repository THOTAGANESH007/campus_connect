import express from "express";
import {
    createDrive,
    getAllDrives,
    getDriveById,
    updateDrive,
    deleteDrive,
} from "../controllers/driveController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.route("/").post(protect, createDrive).get(protect, getAllDrives);
router
    .route("/:id")
    .get(protect, getDriveById)
    .put(protect, updateDrive)
    .delete(protect, deleteDrive);

export default router;
