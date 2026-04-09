import express from "express";
const router = express.Router();
import { 
    uploadPlacementData, 
    getBatches, 
    getBatchDetail,
    getSummaryStats,
    getBranchStats,
    getCompanyStats,
    getPackageDistribution,
    getCGPAStats,
    getInsights,
    getRoleDistribution,
    getBranchEfficiency
} from "../controllers/placementController.js";
import { protect, authorizeRoles } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

// Upload route (Placement Officer & Admin only)
router.post(
    "/upload", 
    protect, 
    authorizeRoles("PLACEMENT_OFFICER", "ADMIN"), 
    upload.single("file"), 
    uploadPlacementData
);

// Fetch batches (All students, Officers, Admins)
router.get("/batches", protect, getBatches);

// Fetch specific batch (All students, Officers, Admins)
router.get("/batch/:id", protect, getBatchDetail);

// --- ANALYTICS ROUTES ---
router.get("/stats/summary", protect, getSummaryStats);
router.get("/stats/branch", protect, getBranchStats);
router.get("/stats/company", protect, getCompanyStats);
router.get("/stats/package-distribution", protect, getPackageDistribution);
router.get("/stats/cgpa", protect, getCGPAStats);
router.get("/stats/insights", protect, getInsights);
router.get("/stats/role-distribution", protect, getRoleDistribution);
router.get("/stats/branch-efficiency", protect, getBranchEfficiency);

export default router;
