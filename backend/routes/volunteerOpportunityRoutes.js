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

router.post("/", authenticateUser, authorizeRole("ngo"), createOpportunity);
router.put("/:opportunityId", authenticateUser, authorizeRole("ngo"), updateOpportunity);
router.delete("/:opportunityId", authenticateUser, authorizeRole("ngo"), deleteOpportunity);
router.get("/:opportunityId", getOpportunity); // public
router.get("/", listOpportunities); // public

export default router;
