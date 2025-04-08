import Campaign from "../models/campaign.models.js";

/**
 * Create a new fundraising campaign.
 * Only authenticated NGO users can create a campaign.
 */
export const createCampaign = async (req, res) => {
  try {
    const { title, description, goal, image } = req.body;
    const newCampaign = new Campaign({
      title,
      description,
      goal,
      image,
      createdBy: req.user.id,  // Use req.user.id as populated by authentication middleware
    });
    
    await newCampaign.save();
    return res.status(201).json({
      message: "Campaign created successfully",
      campaign: newCampaign,
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return res.status(500).json({
      error: "Server error while creating campaign",
    });
  }
};

/**
 * Update an existing campaign.
 * Only the NGO that created the campaign is allowed to update it.
 */
export const updateCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    
    // Ensure that the authenticated user is the creator of the campaign
    if (campaign.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this campaign" });
    }
    
    // Allowed fields to update
    const allowedUpdates = ["title", "description", "goal", "image"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        campaign[field] = req.body[field];
      }
    });
    
    await campaign.save();
    
    return res.status(200).json({
      message: "Campaign updated successfully",
      campaign,
    });
  } catch (error) {
    console.error("Error updating campaign:", error);
    return res.status(500).json({
      error: "Server error while updating campaign",
    });
  }
};

/**
 * Get the details of a specific campaign.
 */
export const getCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    return res.status(200).json({ campaign });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return res.status(500).json({
      error: "Server error while fetching campaign",
    });
  }
};

/**
 * List all fundraising campaigns.
 * This endpoint is public and can optionally be enhanced with filtering and pagination.
 */
export const listCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    return res.status(200).json({ campaigns });
  } catch (error) {
    console.error("Error listing campaigns:", error);
    return res.status(500).json({
      error: "Server error while listing campaigns",
    });
  }
};
