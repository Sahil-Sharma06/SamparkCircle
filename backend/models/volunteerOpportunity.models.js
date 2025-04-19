import mongoose from "mongoose";

const volunteerOpportunitySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  requirements: { 
    type: String,
    trim: true,
    default: ""
  },
  location: { 
    type: String, 
    required: true,
    trim: true
  },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true // Add index for performance
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt' 
  }
});

// Ensure index for postedBy to improve query performance
volunteerOpportunitySchema.index({ postedBy: 1 });

const VolunteerOpportunity = mongoose.model("VolunteerOpportunity", volunteerOpportunitySchema);

export default VolunteerOpportunity;