import VolunteerOpportunity from "../models/volunteerOpportunity.model.js";

/**
 * Create a new volunteer opportunity.
 * Only authenticated NGO users can create opportunities.
 */
export const createOpportunity = async (req, res) => {
  try {
    const { title, description, requirements, location } = req.body;
    const newOpportunity = new VolunteerOpportunity({
      title,
      description,
      requirements,
      location,
      postedBy: req.user.id, // using req.user.id from token payload
    });
    await newOpportunity.save();
    return res.status(201).json({
      message: "Volunteer opportunity created successfully",
      opportunity: newOpportunity,
    });
  } catch (error) {
    console.error("Error creating opportunity:", error);
    return res.status(500).json({ error: "Server error while creating opportunity" });
  }
};

/**
 * Update an existing volunteer opportunity.
 * Only the NGO that posted the opportunity is authorized.
 */
export const updateOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const opportunity = await VolunteerOpportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    if (opportunity.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this opportunity" });
    }
    const allowedUpdates = ["title", "description", "requirements", "location"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        opportunity[field] = req.body[field];
      }
    });
    await opportunity.save();
    return res.status(200).json({
      message: "Volunteer opportunity updated successfully",
      opportunity,
    });
  } catch (error) {
    console.error("Error updating opportunity:", error);
    return res.status(500).json({ error: "Server error while updating opportunity" });
  }
};

/**
 * Delete a volunteer opportunity.
 * Only the posting NGO can delete their opportunity.
 */
export const deleteOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const opportunity = await VolunteerOpportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    if (opportunity.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this opportunity" });
    }
    await opportunity.deleteOne();
    return res.status(200).json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    return res.status(500).json({ error: "Server error while deleting opportunity" });
  }
};

/**
 * Retrieve details for a specific volunteer opportunity.
 */
export const getOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const opportunity = await VolunteerOpportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    return res.status(200).json({ opportunity });
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    return res.status(500).json({ error: "Server error while fetching opportunity" });
  }
};

/**
 * List all volunteer opportunities.
 */
export const listOpportunities = async (req, res) => {
  try {
    const opportunities = await VolunteerOpportunity.find();
    return res.status(200).json({ opportunities });
  } catch (error) {
    console.error("Error listing opportunities:", error);
    return res.status(500).json({ error: "Server error while listing opportunities" });
  }
};
