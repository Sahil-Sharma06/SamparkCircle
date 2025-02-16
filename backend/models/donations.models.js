const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fundraiser: { type: mongoose.Schema.Types.ObjectId, ref: "Fundraiser", required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true }, // Payment gateway transaction ID
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", DonationSchema);
