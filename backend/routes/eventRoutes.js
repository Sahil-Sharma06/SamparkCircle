import express from "express";
import { createEvent, updateEvent, deleteEvent, getEvent, listEvents } from "../controllers/eventsController.js";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";

const router = express.Router();

// POST /api/events - Create a new event (restricted to authenticated NGO users)
router.post("/", authenticateUser, authorizeRole("ngo"), createEvent);

// PUT /api/events/:eventId - Update an event (restricted to the event creator)
router.put("/:eventId", authenticateUser, authorizeRole("ngo"), updateEvent);

// DELETE /api/events/:eventId - Delete an event (restricted to the event creator)
router.delete("/:eventId", authenticateUser, authorizeRole("ngo"), deleteEvent);

// GET /api/events/:eventId - Get details of a specific event (public)
router.get("/:eventId", getEvent);

// GET /api/events - List all events (public)
router.get("/", listEvents);

export default router;
