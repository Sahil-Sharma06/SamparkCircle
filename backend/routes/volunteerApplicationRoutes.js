import express from "express";
import {
  applyForOpportunity,
  listApplicationsForOpportunity,
  updateApplicationStatus,
  getApplication,
} from "../controllers/volunteerApplicationController.js";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";

const router = express.Router();

// Volunteers can apply for opportunities
router.post("/", authenticateUser, authorizeRole("Volunteer"), applyForOpportunity);

// NGOs can list applications for a specific opportunity
router.get("/opportunity/:opportunityId", authenticateUser, authorizeRole("NGO"), listApplicationsForOpportunity);

// NGOs can update application status
router.put("/:applicationId", authenticateUser, authorizeRole("NGO"), updateApplicationStatus);

// Both NGOs and volunteers can get application details
router.get("/:applicationId", authenticateUser, getApplication);

export default router;
