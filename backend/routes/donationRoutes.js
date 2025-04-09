import express from "express";
import { processDonation, getDonationHistory } from "../controllers/donationController.js";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";

const router = express.Router();

// Process a donation (accessible only by donors)
router.post("/charge", authenticateUser, authorizeRole("Donor"), processDonation);

// Get donation history for the donor
router.get("/history", authenticateUser, authorizeRole("Donor"), getDonationHistory);

export default router;
