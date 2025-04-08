import express from "express";
import { authenticateUser, authorizeRole } from "../controllers/authController.js";
import { registerNGO, updateNGO, getNGO, listNGOs } from "../controllers/ngoController.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeRole("NGO"), registerNGO);
router.put("/:ngoId", authenticateUser, authorizeRole("NGO"), updateNGO);
router.get("/:ngoId", getNGO);
router.get("/", listNGOs);

export default router;
