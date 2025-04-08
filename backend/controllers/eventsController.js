import Event from "../models/events.models.js";

/**
 * Create a new event.
 * Only authenticated NGO users should be able to create events.
 */
export const createEvent = async (req, res) => {
  try {
    const { title, description, location, eventDate, image } = req.body;
    const newEvent = new Event({
      title,
      description,
      location,
      eventDate,
      image,
      createdBy: req.user.id, // ensure req.user is populated by authentication middleware
    });
    
    await newEvent.save();
    
    return res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({
      error: "Server error while creating event",
    });
  }
};

/**
 * Update an existing event.
 * Only the NGO that created the event is allowed to update it.
 */
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Ensure that the authenticated user is the creator of the event
    if (event.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this event" });
    }
    
    // List of fields that can be updated
    const allowedUpdates = ["title", "description", "location", "eventDate", "image"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });
    
    await event.save();
    
    return res.status(200).json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({
      error: "Server error while updating event",
    });
  }
};

/**
 * Delete an event.
 * Only the creator (NGO) can delete their event.
 */
export const deleteEvent = async (req, res) => {
    try {
      const { eventId } = req.params;
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Check if the authenticated user is the creator
      if (event.createdBy.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "Not authorized to delete this event" });
      }
      
      // Use deleteOne() instead of remove()
      await event.deleteOne();
      
      return res.status(200).json({
        message: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      return res.status(500).json({
        error: "Server error while deleting event",
      });
    }
};
  

/**
 * Retrieve details of a specific event.
 * This endpoint is public.
 */
export const getEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json({ event });
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({
      error: "Server error while fetching event",
    });
  }
};

/**
 * List all events.
 * This endpoint is public and can be extended with filtering and pagination.
 */
export const listEvents = async (req, res) => {
  try {
    const events = await Event.find();
    return res.status(200).json({ events });
  } catch (error) {
    console.error("Error listing events:", error);
    return res.status(500).json({
      error: "Server error while listing events",
    });
  }
};
