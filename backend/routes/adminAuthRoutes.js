import express from "express";
import { adminSignup, adminLogin } from "../controllers/authController.js";

const router = express.Router();

// Route for admin signup
router.post("/signup", adminSignup);

// Route for admin login
router.post("/login", adminLogin);

export default router;
