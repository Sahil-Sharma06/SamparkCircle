import mongoose from "mongoose";

const volunteerOpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String },
  location: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const VolunteerOpportunity = mongoose.model("VolunteerOpportunity", volunteerOpportunitySchema);
export default VolunteerOpportunity;
