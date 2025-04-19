import EventApplication from "../models/eventApplication.models.js";
import Event from "../models/events.models.js";

/**
 * Apply for an event.
 * Only users with the "Volunteer" role can apply.
 */
export const applyForEvent = async (req, res) => {
  try {
    const { eventId, coverLetter } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const existingApplication = await EventApplication.findOne({
      event: eventId,
      volunteer: req.user.id,
    });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this event" });
    }
    const application = new EventApplication({
      event: eventId,
      volunteer: req.user.id,
      coverLetter,
    });
    await application.save();
    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error applying for event:", error);
    return res.status(500).json({ error: "Server error while applying for event" });
  }
};

/**
 * List all applications for a specific event.
 * Only the NGO who created the event is authorized.
 */
export const listApplicationsForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to view applications for this event" });
    }
    const applications = await EventApplication.find({ event: eventId })
      .populate("volunteer", "name email");
    return res.status(200).json({ applications });
  } catch (error) {
    console.error("Error listing applications:", error);
    return res.status(500).json({ error: "Server error while listing applications" });
  }
};

/**
 * Update the status of an event application.
 * Only the NGO that created the event can update the application status.
 */
export const updateEventApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const application = await EventApplication.findById(applicationId)
      .populate("event");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.event.createdBy.toString() !== req.user.id.toString()) {
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
 * Retrieve details of a specific event application.
 */
export const getEventApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await EventApplication.findById(applicationId)
      .populate("volunteer", "name email")
      .populate("event");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res.status(200).json({ application });
  } catch (error) {
    console.error("Error fetching application:", error);
    return res.status(500).json({ error: "Server error while fetching application" });
  }
};

export const listUserEventApplications = async (req, res) => {
    try {
      const applications = await EventApplication.find({ volunteer: req.user.id }).select("event");
      const joinedEventIds = applications.map(app => app.event.toString());
      return res.status(200).json({ joinedEventIds });
    } catch (error) {
      console.error("Error fetching user's event applications:", error);
      return res.status(500).json({ error: "Server error" });
    }
};
  
