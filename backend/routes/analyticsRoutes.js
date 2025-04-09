import express from "express";
import { getNGOAnalytics, getGlobalAnalytics } from "../controllers/analyticsController.js";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";

const router = express.Router();

// NGO-specific analytics (accessible by NGO users)
router.get("/ngo/:ngoId", authenticateUser, authorizeRole("NGO"), getNGOAnalytics);

// Global analytics (accessible by Admin users)
router.get("/global", authenticateUser, authorizeRole("Admin"), getGlobalAnalytics);

export default router;
