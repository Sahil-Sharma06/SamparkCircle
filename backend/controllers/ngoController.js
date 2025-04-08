import NGO from "../models/ngo.models.js";

/**
 * Register a new NGO profile.
 * This expects fields like name, email, description, address, website, phone, and logo.
 * The authenticated user's ID is used as the createdBy value.
 */
export const registerNGO = async (req, res) => {
    try {
      const { name, email, description, address, website, phone, logo } = req.body;
      // Use req.user.id if your JWT payload is signed with { id: user._id, role: user.role }
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
      // NOTE: Use req.user.id instead of req.user._id
      if (ngo.createdBy.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this NGO" });
      }
  
      // Define the fields that are allowed to be updated
      const allowedUpdates = ["name", "email", "description", "address", "website", "phone", "logo"];
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
      return res.status(500).json({
        error: "Server error while updating NGO",
      });
    }
};
  

/**
 * Retrieve the details of a single NGO.
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
