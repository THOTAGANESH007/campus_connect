import express from "express";
import {
  getOverview,
  getPlacementsByCompany,
  getPlacementsByBranch,
  getStatusDistribution,
} from "../controllers/analyticsController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/overview", protect, getOverview);
router.get("/by-company", protect, getPlacementsByCompany);
router.get("/by-branch", protect, getPlacementsByBranch);
router.get("/status-distribution", protect, getStatusDistribution);

export default router;
