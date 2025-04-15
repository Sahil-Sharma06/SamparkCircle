import express from "express";
import {
  processDonation,
  getDonationHistory,
  getDonationById,
  getNgoDonations
} from "../controllers/donationController.js";

import { authenticateUser, authorizeRole } from "../controllers/authController.js";

const router = express.Router();

// Process a donation (for donors)
router.post("/charge", authenticateUser, authorizeRole("donor"), processDonation);

// New direct campaign donation route that doesn't require NGO ID
router.post("/direct-campaign/:campaignId", authenticateUser, async (req, res, next) => {
  try {
    // Get the campaign details to extract NGO ID
    const Fundraiser = (await import("../models/campaign.models.js")).default;
    const campaign = await Fundraiser.findById(req.params.campaignId);
    
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    
    // Get the NGO ID via the campaign's createdBy field if ngo isn't set
    let ngoId = campaign.ngo;
    if (!ngoId) {
      const NGO = (await import("../models/ngo.models.js")).default;
      const ngo = await NGO.findOne({ createdBy: campaign.createdBy });
      if (!ngo) {
        return res.status(404).json({ message: "NGO not found for this campaign" });
      }
      ngoId = ngo._id;
      
      // Update the campaign with the NGO ID for future use
      campaign.ngo = ngoId;
      await campaign.save();
    }
    
    // Set up the body with the required parameters
    req.body.ngoId = ngoId;
    req.body.campaignId = req.params.campaignId;
    
    // Forward to the regular donation processor
    next();
  } catch (error) {
    console.error("Error setting up campaign donation:", error);
    return res.status(500).json({ error: "Server error while processing donation" });
  }
}, processDonation);

// Custom endpoint for donations directly to campaigns (to simplify frontend)
router.post("/campaign/:campaignId", authenticateUser, async (req, res, next) => {
  try {
    // Make sure ngoId is provided directly or we'll try to find it
    if (!req.body.ngoId) {
      // Get the campaign details to extract NGO ID
      const Fundraiser = (await import("../models/campaign.models.js")).default;
      const campaign = await Fundraiser.findById(req.params.campaignId);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      if (!campaign.ngo) {
        return res.status(400).json({ message: "This campaign doesn't have an associated NGO. Please provide ngoId manually." });
      }
      
      req.body.ngoId = campaign.ngo;
    }
    
    // Set the campaign ID
    req.body.campaignId = req.params.campaignId;
    
    // Forward to the regular donation processor
    next();
  } catch (error) {
    console.error("Error setting up campaign donation:", error);
    return res.status(500).json({ error: "Server error while processing donation" });
  }
}, processDonation);

// Get donation history (for donors)
router.get("/history", authenticateUser, authorizeRole("donor"), getDonationHistory);

// Get NGO's received donations (for NGOs)
router.get("/ngo/received", authenticateUser, authorizeRole("ngo"), getNgoDonations);

// Get donation details by ID (shared)
router.get("/:donationId", authenticateUser, getDonationById);

export default router;