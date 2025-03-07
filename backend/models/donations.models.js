import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fundraiser: { type: mongoose.Schema.Types.ObjectId, ref: "Fundraiser", required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String }, // Payment gateway transaction ID
  createdAt: { type: Date, default: Date.now },
});

const Donation = mongoose.model("Donation", DonationSchema);

export default Donation;