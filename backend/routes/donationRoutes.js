import express from "express";
import  { createDonation } from "../controllers/donationController.js";

const router = express.Router();

router.post("/createDonation", createDonation);

export default router;