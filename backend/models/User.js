import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Updated enum values to match the sample JSON ("NGO" instead of "ngo")
  role: { type: String, enum: ["Admin", "NGO", "Volunteer", "Donor"], required: true },
  profileImage: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

export default User;
