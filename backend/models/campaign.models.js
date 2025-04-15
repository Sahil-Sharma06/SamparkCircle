import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goal: { type: Number, required: true },
  amountRaised: { type: Number, default: 0 },
  image: { type: String, default: "" },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    required: true,
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;