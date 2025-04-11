import express from "express";
import { 
  processDonation, 
  getDonationHistory, 
  getDonationById,
  getNgoDonations 
} from "../controllers/donationController.js";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";

const router = express.Router();

// Process a donation (accessible only by donors)
router.post("/charge", authenticateUser, authorizeRole("Donor"), processDonation);

// Get donation history for the donor
router.get("/history", authenticateUser, authorizeRole("Donor"), getDonationHistory);

// Get donations received by the NGO associated with the logged-in user
// Note: This route needs to be BEFORE the /:donationId route to avoid conflicts
router.get("/ngo/received", authenticateUser, authorizeRole("NGO"), getNgoDonations);

// Get donation details by ID (accessible by both donor and associated NGO)
router.get("/:donationId", authenticateUser, getDonationById);

export default router;