import VolunteerApplication from "../models/volunteerApplication.models.js";
import VolunteerOpportunity from "../models/volunteerOpportunity.model.js";

/**
 * Apply for a volunteer opportunity.
 * Only users with the "Volunteer" role can apply.
 */
export const applyForOpportunity = async (req, res) => {
  try {
    const { opportunityId, coverLetter } = req.body;
    const opportunity = await VolunteerOpportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    const application = new VolunteerApplication({
      opportunity: opportunityId,
      volunteer: req.user.id,
      coverLetter,
    });
    await application.save();
    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error applying for opportunity:", error);
    return res.status(500).json({ error: "Server error while applying for opportunity" });
  }
};

/**
 * List all applications for a specific opportunity.
 * Only the NGO who posted the opportunity is authorized.
 */
export const listApplicationsForOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const opportunity = await VolunteerOpportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    if (opportunity.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to view applications for this opportunity" });
    }
    const applications = await VolunteerApplication.find({ opportunity: opportunityId })
      .populate("volunteer", "name email");
    return res.status(200).json({ applications });
  } catch (error) {
    console.error("Error listing applications:", error);
    return res.status(500).json({ error: "Server error while listing applications" });
  }
};

/**
 * Update the status of an application.
 * Only the NGO that posted the opportunity can update the application status.
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const application = await VolunteerApplication.findById(applicationId)
      .populate("opportunity");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    // Check if the NGO updating the status is the one who posted the opportunity
    if (application.opportunity.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }
    application.status = status;
    await application.save();
    return res.status(200).json({
      message: "Application status updated",
      application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ error: "Server error while updating application status" });
  }
};

/**
 * Retrieve details of a specific application.
 */
export const getApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await VolunteerApplication.findById(applicationId)
      .populate("volunteer", "name email")
      .populate("opportunity");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res.status(200).json({ application });
  } catch (error) {
    console.error("Error fetching application:", error);
    return res.status(500).json({ error: "Server error while fetching application" });
  }
};
