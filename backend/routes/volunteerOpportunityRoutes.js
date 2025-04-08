import express from "express";
import {
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunity,
  listOpportunities,
} from "../controllers/volunteerOpportunityController.js";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";

const router = express.Router();

// Create, update, and delete require NGO authentication
router.post("/", authenticateUser, authorizeRole("NGO"), createOpportunity);
router.put("/:opportunityId", authenticateUser, authorizeRole("NGO"), updateOpportunity);
router.delete("/:opportunityId", authenticateUser, authorizeRole("NGO"), deleteOpportunity);

// Public endpoints to fetch a specific opportunity and list all opportunities
router.get("/:opportunityId", getOpportunity);
router.get("/", listOpportunities);

export default router;
