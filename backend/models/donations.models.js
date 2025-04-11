import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }, 
  amount: { type: Number, required: true },
  transactionId: { type: String }, // In a real-world scenario, this comes from the payment gateway
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  donatedAt: { type: Date, default: Date.now },
});

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;