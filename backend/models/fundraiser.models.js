import mongoose from "mongoose";

const FundraiserSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", required: true },
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Fundraiser = mongoose.model("Fundraiser", FundraiserSchema);

export default Fundraiser;