import mongoose from "mongoose";

const volunteerApplicationSchema = new mongoose.Schema({
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: "VolunteerOpportunity", required: true },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coverLetter: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  appliedAt: { type: Date, default: Date.now },
});

const VolunteerApplication = mongoose.model("VolunteerApplication", volunteerApplicationSchema);

export default VolunteerApplication;
