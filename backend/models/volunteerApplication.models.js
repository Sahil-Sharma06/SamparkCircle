import mongoose from "mongoose";

const volunteerApplicationSchema = new mongoose.Schema(
  {
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VolunteerOpportunity",
      required: true,
      index: true
    },
    coverLetter: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    feedback: {
      type: String,
      default: ""
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Create compound index for volunteer and opportunity
volunteerApplicationSchema.index({ volunteer: 1, opportunity: 1 }, { unique: true });

const VolunteerApplication = mongoose.model(
  "VolunteerApplication",
  volunteerApplicationSchema
);

export default VolunteerApplication;