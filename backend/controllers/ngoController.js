import NGO from "../models/ngo.models.js";

/**
 * Register a new NGO profile.
 * This expects fields like name, email, description, address, website, phone, and logo.
 * The authenticated user's ID is used as the createdBy value.
 */
export const registerNGO = async (req, res) => {
    try {
      const { name, email, description, address, website, phone, logo } = req.body;
      
      // Check if this user already has an NGO profile
      const existingNGO = await NGO.findOne({ createdBy: req.user.id });
      if (existingNGO) {
        return res.status(409).json({
          error: "You already have an NGO profile. Please update your existing profile instead.",
        });
      }
      
      // Check if email is already in use
      const emailExists = await NGO.findOne({ email });
      if (emailExists) {
        return res.status(409).json({
          error: "An NGO with this email already exists. Please use a different email.",
        });
      }
      
      // Create new NGO
      const newNGO = new NGO({
        name,
        email,
        description,
        address,
        website,
        phone,
        logo,
        createdBy: req.user.id,
      });
  
      await newNGO.save();
  
      return res.status(201).json({
        message: "NGO registered successfully!",
        ngo: newNGO,
      });
    } catch (error) {
      console.error("Error registering NGO:", error);
      
      // Check specifically for duplicate key error
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        return res.status(409).json({
          error: "An NGO with this email already exists. Please use a different email.",
        });
      }
      
      return res.status(500).json({
        error: "Server error while registering NGO",
      });
    }
};
  
/**
 * Update an existing NGO profile.
 * Only the creator of the NGO (authenticated user) may update the profile.
 */
export const updateNGO = async (req, res) => {
    try {
      const { ngoId } = req.params;
  
      // Find the NGO by id
      const ngo = await NGO.findById(ngoId);
      if (!ngo) {
        return res.status(404).json({ message: "NGO not found" });
      }
  
      // Check if the current user is the owner of the NGO profile
      if (ngo.createdBy.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this NGO" });
      }
  
      // Define the fields that are allowed to be updated
      const allowedUpdates = ["name", "email", "description", "address", "website", "phone", "logo"];
      
      // If email is being updated, check if it's already in use
      if (req.body.email && req.body.email !== ngo.email) {
        const existingNGO = await NGO.findOne({ email: req.body.email });
        if (existingNGO) {
          return res.status(409).json({ 
            error: "This email is already in use by another NGO. Please use a different email." 
          });
        }
      }
      
      allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) {
          ngo[field] = req.body[field];
        }
      });
  
      await ngo.save();
  
      return res.status(200).json({
        message: "NGO updated successfully",
        ngo,
      });
    } catch (error) {
      console.error("Error updating NGO:", error);
      
      // Check for duplicate key error
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        return res.status(409).json({
          error: "An NGO with this email already exists. Please use a different email.",
        });
      }
      
      return res.status(500).json({
        error: "Server error while updating NGO",
      });
    }
};
  
/**
 * Retrieve the details of a single NGO by ID.
 */
export const getNGO = async (req, res) => {
  try {
    const { ngoId } = req.params;
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }
    return res.status(200).json({ ngo });
  } catch (error) {
    console.error("Error fetching NGO:", error);
    return res.status(500).json({ error: "Server error while fetching NGO" });
  }
};

/**
 * Find NGO by user ID (createdBy field)
 */
export const getNGOByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const ngo = await NGO.findOne({ createdBy: userId });
    
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found for this user" });
    }
    
    return res.status(200).json({ ngo });
  } catch (error) {
    console.error("Error fetching NGO by user ID:", error);
    return res.status(500).json({ error: "Server error while fetching NGO" });
  }
};

/**
 * List all NGOs.
 * This endpoint returns a list of all registered NGO profiles.
 */
export const listNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find();
    return res.status(200).json({ ngos });
  } catch (error) {
    console.error("Error listing NGOs:", error);
    return res.status(500).json({ error: "Server error while listing NGOs" });
  }
};