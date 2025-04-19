import express from "express";
import {
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunity,
  listOpportunities,
  listMyOpportunities,
} from "../controllers/volunteerOpportunityController.js";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";

const router = express.Router();

// Important: Order matters! More specific routes must come before less specific ones

// Route to list opportunities created by the logged-in NGO
router.get("/mine", authenticateUser, authorizeRole("ngo"), listMyOpportunities);

// CRUD operations on specific opportunity IDs
router.post("/", authenticateUser, authorizeRole("ngo"), createOpportunity);
router.put("/:opportunityId", authenticateUser, authorizeRole("ngo"), updateOpportunity);
router.delete("/:opportunityId", authenticateUser, authorizeRole("ngo"), deleteOpportunity);
router.get("/:opportunityId", getOpportunity); // public route for fetching a specific opportunity

// General listing route (must come after /mine and /:opportunityId routes)
router.get("/", listOpportunities); // public route for fetching all opportunities

export default router;