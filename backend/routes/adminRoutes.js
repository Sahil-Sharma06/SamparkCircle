import express from "express";
import {
  listNGOsPendingVerification,
  verifyNGO,
  listUsers,
} from "../controllers/adminController.js";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";

const router = express.Router();

// GET /api/admin/ngos
// Lists all NGOs pending verification (only accessible by Admins)
router.get("/ngos", authenticateUser, authorizeRole("Admin"), listNGOsPendingVerification);

// POST /api/admin/ngos/:ngoId/verify
// Verifies or rejects an NGO registration (only accessible by Admins)
// Expected request body: { "action": "approve" } or { "action": "reject" }
router.post("/ngos/:ngoId/verify", authenticateUser, authorizeRole("Admin"), verifyNGO);

// GET /api/admin/users
// Lists all users (only accessible by Admins)
router.get("/users", authenticateUser, authorizeRole("Admin"), listUsers);

export default router;
