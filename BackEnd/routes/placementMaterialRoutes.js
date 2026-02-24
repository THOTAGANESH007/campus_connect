import express from "express";
import {
    createMaterial,
    getAllMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial,
    toggleUpvote,
    incrementDownload,
} from "../controllers/placementMaterialController.js";
import { protect } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// CRUD — file upload supported on create
router.route("/").post(protect, upload.single("file"), createMaterial).get(protect, getAllMaterials);
router.route("/:id").get(protect, getMaterialById).put(protect, updateMaterial).delete(protect, deleteMaterial);

// Upvote toggle
router.put("/:id/upvote", protect, toggleUpvote);

// Increment download count
router.put("/:id/download", protect, incrementDownload);

export default router;
