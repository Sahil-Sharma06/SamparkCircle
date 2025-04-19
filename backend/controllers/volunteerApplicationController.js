import VolunteerApplication from "../models/volunteerApplication.models.js";
import VolunteerOpportunity from "../models/volunteerOpportunity.models.js";

import User from "../models/User.js";

/**
 * Submit a new volunteer application
 */
export const submitApplication = async (req, res) => {
  try {
    const { opportunityId, coverLetter } = req.body;
    
    if (!opportunityId || !coverLetter) {
      return res.status(400).json({ message: "Opportunity ID and cover letter are required" });
    }

    // Check if the opportunity exists
    const opportunity = await VolunteerOpportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Volunteer opportunity not found" });
    }

    // Check if this volunteer has already applied for this opportunity
    const existingApplication = await VolunteerApplication.findOne({
      volunteer: req.user.id,
      opportunity: opportunityId
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this opportunity" });
    }

    // Create the application
    const newApplication = new VolunteerApplication({
      volunteer: req.user.id,
      opportunity: opportunityId,
      coverLetter,
      status: "pending",
      ngo: opportunity.postedBy // Store the NGO reference for easier queries
    });

    await newApplication.save();

    return res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    return res.status(500).json({ error: "Server error while submitting application" });
  }
};

/**
 * Get all applications for the logged-in NGO
 */
export const getNgoApplications = async (req, res) => {
  try {
    const applications = await VolunteerApplication.find({ ngo: req.user.id })
      .populate("volunteer", "name email")
      .populate("opportunity", "title description location")
      .sort({ createdAt: -1 });

    return res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching NGO applications:", error);
    return res.status(500).json({ error: "Server error while fetching applications" });
  }
};

/**
 * Get all applications submitted by the logged-in volunteer
 */
export const getMyApplications = async (req, res) => {
  try {
    const applications = await VolunteerApplication.find({ volunteer: req.user.id })
      .populate("ngo", "name email")
      .populate("opportunity", "title description location requirements")
      .sort({ createdAt: -1 });

    return res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching volunteer applications:", error);
    return res.status(500).json({ error: "Server error while fetching applications" });
  }
};

/**
 * Get details for a specific application
 */
export const getApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await VolunteerApplication.findById(applicationId)
      .populate("volunteer", "name email")
      .populate("ngo", "name email")
      .populate("opportunity");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the user has permission to view this application
    const isNgo = req.user.id.toString() === application.ngo._id.toString();
    const isVolunteer = req.user.id.toString() === application.volunteer._id.toString();

    if (!isNgo && !isVolunteer) {
      return res.status(403).json({ message: "Not authorized to view this application" });
    }

    return res.status(200).json({ application });
  } catch (error) {
    console.error("Error fetching application details:", error);
    return res.status(500).json({ error: "Server error while fetching application details" });
  }
};

/**
 * Update the status of an application (approve/reject)
 * Only the NGO that posted the opportunity can update the status
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, feedback } = req.body;
    
    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Valid status is required" });
    }

    const application = await VolunteerApplication.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the current user is the NGO that posted the opportunity
    if (application.ngo.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    // Update the application
    application.status = status;
    if (feedback) {
      application.feedback = feedback;
    }

    await application.save();

    return res.status(200).json({
      message: `Application ${status} successfully`,
      application
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ error: "Server error while updating application status" });
  }
};

/**
 * Withdraw an application (only the applicant can withdraw)
 */
export const withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await VolunteerApplication.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the current user is the volunteer who applied
    if (application.volunteer.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to withdraw this application" });
    }

    // Only allow withdrawing if the application is still pending
    if (application.status !== "pending") {
      return res.status(400).json({ 
        message: `Cannot withdraw application that has already been ${application.status}`
      });
    }

    // Remove the application
    await application.deleteOne();

    return res.status(200).json({
      message: "Application withdrawn successfully"
    });
  } catch (error) {
    console.error("Error withdrawing application:", error);
    return res.status(500).json({ error: "Server error while withdrawing application" });
  }
};

/**
 * Get statistics about applications for the NGO dashboard
 */
export const getApplicationStats = async (req, res) => {
  try {
    const stats = await VolunteerApplication.aggregate([
      {
        $match: { ngo: req.user._id }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format the stats into a more usable object
    const formattedStats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    return res.status(200).json({ stats: formattedStats });
  } catch (error) {
    console.error("Error fetching application stats:", error);
    return res.status(500).json({ error: "Server error while fetching application statistics" });
  }
};