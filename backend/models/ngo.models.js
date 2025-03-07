import mongoose from "mongoose";

const NGOSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  website: { type: String, default: "" },
  phone: { type: String, required: true },
  verified: { type: Boolean, default: false },  // Admin verification status
  logo: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});
const NGO = mongoose.model("NGO", NGOSchema);

export default NGO;