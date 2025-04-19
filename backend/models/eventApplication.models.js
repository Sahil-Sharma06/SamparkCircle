import mongoose from "mongoose";

const eventApplicationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coverLetter: { type: String },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const EventApplication = mongoose.model("EventApplication", eventApplicationSchema);
export default EventApplication;
