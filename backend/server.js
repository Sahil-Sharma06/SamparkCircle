import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/donation", donationRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to SamparkCircle API!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));