import express from "express";
import {
  submitApplication,
  getNgoApplications,
  getMyApplications,
  getApplicationDetails,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationStats
} from "../controllers/volunteerApplicationController.js";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";

const router = express.Router();

// Routes for volunteers
router.post("/", authenticateUser, authorizeRole("volunteer"), submitApplication);
router.get("/my-applications", authenticateUser, authorizeRole("volunteer"), getMyApplications);
router.delete("/:applicationId/withdraw", authenticateUser, authorizeRole("volunteer"), withdrawApplication);

// Routes for NGOs
router.get("/", authenticateUser, authorizeRole("ngo"), getNgoApplications);
router.get("/stats", authenticateUser, authorizeRole("ngo"), getApplicationStats);
router.put("/:applicationId/status", authenticateUser, authorizeRole("ngo"), updateApplicationStatus);

// Shared routes (accessible by both volunteers and NGOs with appropriate authorization)
router.get("/:applicationId", authenticateUser, getApplicationDetails);

export default router;