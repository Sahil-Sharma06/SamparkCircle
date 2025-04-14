import express from "express";
import { 
  createCampaign, 
  updateCampaign, 
  getCampaign, 
  listCampaigns,
  deleteCampaign 
} from "../controllers/fundraiserController.js";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";

const router = express.Router();

// POST /api/fundraisers - Create a new campaign (restricted to authenticated NGO users)
router.post("/", authenticateUser, authorizeRole("NGO"), createCampaign);

// PUT /api/fundraisers/:campaignId - Update an existing campaign (restricted to the creator)
router.put("/:campaignId", authenticateUser, authorizeRole("NGO"), updateCampaign);

// DELETE /api/fundraisers/:campaignId - Delete an existing campaign (restricted to the creator)
router.delete("/:campaignId", authenticateUser, authorizeRole("NGO"), deleteCampaign);

// GET /api/fundraisers/:campaignId - Get details of a specific campaign (public)
router.get("/:campaignId", getCampaign);

// GET /api/fundraisers - List all campaigns (public)
router.get("/", listCampaigns);

export default router;