const mongoose = require("mongoose");

const VolunteerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Volunteer", VolunteerSchema);
