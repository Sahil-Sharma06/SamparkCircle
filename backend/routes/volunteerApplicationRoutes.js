import express from "express";
import {
  applyForOpportunity,
  listApplicationsForOpportunity,
  updateApplicationStatus,
  getApplication,
} from "../controllers/volunteerApplicationController.js";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeRole("volunteer"), applyForOpportunity);
router.get("/opportunity/:opportunityId", authenticateUser, authorizeRole("ngo"), listApplicationsForOpportunity);
router.put("/:applicationId/status", authenticateUser, authorizeRole("ngo"), updateApplicationStatus);
router.get("/:applicationId", authenticateUser, getApplication);

export default router;
