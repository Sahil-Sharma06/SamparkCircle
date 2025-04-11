import express from "express";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";
import { 
  registerNGO, 
  updateNGO, 
  getNGO, 
  getNGOByUserId,
  listNGOs 
} from "../controllers/ngoController.js";

const router = express.Router();

// Create NGO profile (requires NGO role)
router.post("/", authenticateUser, authorizeRole("NGO"), registerNGO);

// Update NGO profile (requires NGO role)
router.put("/:ngoId", authenticateUser, authorizeRole("NGO"), updateNGO);

// Get NGO by ID (no authentication required)
router.get("/:ngoId", getNGO);

// Get NGO by user ID (no authentication required)
router.get("/user/:userId", getNGOByUserId);

// List all NGOs (no authentication required)
router.get("/", listNGOs);

export default router;