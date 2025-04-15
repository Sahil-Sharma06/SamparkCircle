import Campaign from "../models/campaign.models.js";
import NGO from "../models/ngo.models.js";

/**
 * Create a new fundraising campaign.
 * Only authenticated NGO users can create a campaign.
 */
export const createCampaign = async (req, res) => {
  try {
    const { title, description, goal, image } = req.body;
    
    if (!title || !description || !goal) {
      return res.status(400).json({ message: "Title, description, and goal are required." });
    }
    
    // Find the NGO associated with this user
    const ngo = await NGO.findOne({ createdBy: req.user.id });
    if (!ngo) {
      return res.status(404).json({ message: "You must create an NGO profile first" });
    }
    
    const newCampaign = new Campaign({
      title,
      description,
      goal: Number(goal), // Ensure goal is stored as a number
      image: image || "",
      createdBy: req.user.id,
      ngo: ngo._id,
      amountRaised: 0 // Initialize with zero
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
    if (campaign.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this campaign" });
    }
    
    // Update allowed fields
    const { title, description, goal, image } = req.body;
    
    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (goal) campaign.goal = Number(goal); // Ensure goal is stored as a number
    if (image !== undefined) campaign.image = image;
    
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
 * Delete an existing campaign.
 * Only the NGO that created the campaign is allowed to delete it.
 */
export const deleteCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    // First check if the campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    
    // Ensure that the authenticated user is the creator of the campaign
    if (campaign.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this campaign" });
    }
    
    // Delete the campaign
    await Campaign.findByIdAndDelete(campaignId);
    
    return res.status(200).json({
      message: "Campaign deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return res.status(500).json({
      error: "Server error while deleting campaign",
    });
  }
};

/**
 * Get the details of a specific campaign.
 */
export const getCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await Campaign.findById(campaignId)
      .populate("createdBy", "name")
      .populate("ngo", "name");
    
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    
    // Ensure numerical properties are properly formatted
    campaign.goal = Number(campaign.goal);
    campaign.amountRaised = Number(campaign.amountRaised || 0);
    
    // Log what we're sending back for debugging
    console.log("Sending campaign data:", {
      id: campaign._id,
      title: campaign.title,
      goal: campaign.goal,
      goalType: typeof campaign.goal,
      amountRaised: campaign.amountRaised
    });
    
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
 * This endpoint is public and can be enhanced with filtering and pagination.
 */
export const listCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("createdBy", "name")
      .populate("ngo", "name")
      .sort({ createdAt: -1 });
    
    // Ensure all numeric fields are properly formatted
    const formattedCampaigns = campaigns.map(campaign => ({
      ...campaign.toObject(),
      goal: Number(campaign.goal),
      amountRaised: Number(campaign.amountRaised || 0)
    }));
    
    return res.status(200).json({ campaigns: formattedCampaigns });
  } catch (error) {
    console.error("Error listing campaigns:", error);
    return res.status(500).json({
      error: "Server error while listing campaigns",
    });
  }
};