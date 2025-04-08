import NGO from "../models/ngo.models.js";
import User from "../models/User.js";

/**
 * List all NGOs pending verification.
 * Only NGOs with verified set to false will be returned.
 */
export const listNGOsPendingVerification = async (req, res) => {
  try {
    const ngos = await NGO.find({ verified: false });
    return res.status(200).json({ ngos });
  } catch (error) {
    console.error("Error listing NGOs for admin:", error);
    return res.status(500).json({ error: "Server error while listing NGOs" });
  }
};

/**
 * Verify or reject an NGO registration.
 * Expects a POST request with a body property `action` that must be either "approve" or "reject".
 * - Approve: Sets verified to true.
 * - Reject: Deletes the NGO registration.
 */
export const verifyNGO = async (req, res) => {
  try {
    const { ngoId } = req.params;
    const { action } = req.body;
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    if (action === "approve") {
      ngo.verified = true;
      await ngo.save();
      return res.status(200).json({ message: "NGO verified successfully", ngo });
    } else if (action === "reject") {
      // Optionally, delete the NGO if registration is rejected
      await ngo.deleteOne();
      return res.status(200).json({ message: "NGO registration rejected and removed" });
    } else {
      return res.status(400).json({ message: "Invalid action specified. Use 'approve' or 'reject'" });
    }
  } catch (error) {
    console.error("Error verifying NGO:", error);
    return res.status(500).json({ error: "Server error while verifying NGO" });
  }
};

/**
 * List all users in the system.
 * This can be useful for admin monitoring and management.
 */
export const listUsers = async (req, res) => {
  try {
    // Exclude sensitive fields such as the password
    const users = await User.find().select("-password");
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error listing users:", error);
    return res.status(500).json({ error: "Server error while listing users" });
  }
};
