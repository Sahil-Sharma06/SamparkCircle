import express from "express";
import {
  applyForEvent,
  listApplicationsForEvent,
  updateEventApplicationStatus,
  getEventApplication,
  listUserEventApplications,
} from "../controllers/eventApplicationController.js";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";

const router = express.Router();

router.get("/my-events", authenticateUser, authorizeRole("volunteer"), listUserEventApplications);
router.post("/", authenticateUser, authorizeRole("volunteer"), applyForEvent);
router.get("/event/:eventId", authenticateUser, authorizeRole("ngo"), listApplicationsForEvent);
router.put("/:applicationId/status", authenticateUser, authorizeRole("ngo"), updateEventApplicationStatus);
router.get("/:applicationId", authenticateUser, getEventApplication);

export default router;
