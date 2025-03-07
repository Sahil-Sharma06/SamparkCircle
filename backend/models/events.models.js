import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Registered users
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", EventSchema);

export default Event;