import Donation from "../models/donations.models.js";
import NGO from "../models/ngo.models.js";

/**
 * Process a donation.
 * This endpoint simulates donation processing—normally you would integrate a payment gateway like Razorpay or Stripe.
 * Only users with the "Donor" role can donate.
 */
export const processDonation = async (req, res) => {
  try {
    const { ngoId, campaignId, amount } = req.body;
    if (!amount || !ngoId) {
      return res.status(400).json({ message: "Amount and NGO id are required" });
    }
    
    // Simulate a processed payment
    const donation = new Donation({
      donor: req.user.id,
      ngo: ngoId,
      campaign: campaignId, // Optional, if provided
      amount,
      transactionId: "TXN" + Math.floor(Math.random() * 1000000),
      status: "Completed",
    });
    await donation.save();
    
    return res.status(201).json({
      message: "Donation processed successfully",
      donation,
    });
  } catch (error) {
    console.error("Error processing donation:", error);
    return res.status(500).json({ error: "Server error while processing donation" });
  }
};

/**
 * Get the donation history for the logged-in donor.
 */
export const getDonationHistory = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate("ngo", "name email logo")
      .populate("campaign", "title") // If you have a campaign model
      .sort({ donatedAt: -1 }); // Most recent donations first
      
    return res.status(200).json({ donations });
  } catch (error) {
    console.error("Error fetching donation history:", error);
    return res.status(500).json({ error: "Server error while fetching donation history" });
  }
};

/**
 * Get donation details by ID
 */
export const getDonationById = async (req, res) => {
  try {
    const { donationId } = req.params;
    
    // Verify the donation exists and belongs to the requesting user
    const donation = await Donation.findById(donationId)
      .populate("ngo", "name email logo address")
      .populate("campaign", "title"); // If you have a campaign model
      
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    
    // Check if user is authorized (either the donor or the NGO owner)
    if (donation.donor.toString() !== req.user.id) {
      // If not the donor, check if user owns the NGO
      const ngo = await NGO.findById(donation.ngo._id);
      if (!ngo || ngo.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to view this donation" });
      }
    }
    
    return res.status(200).json({ donation });
  } catch (error) {
    console.error("Error fetching donation:", error);
    return res.status(500).json({ error: "Server error while fetching donation details" });
  }
};

/**
 * Get donations received by the NGO associated with the logged-in user
 */
export const getNgoDonations = async (req, res) => {
  try {
    // First find the NGO associated with this user
    const ngo = await NGO.findOne({ createdBy: req.user.id });
    
    if (!ngo) {
      return res.status(404).json({ message: "No NGO profile found for this user" });
    }
    
    // Get all donations for this NGO
    const donations = await Donation.find({ ngo: ngo._id })
      .populate("donor", "name email")
      .populate("campaign", "title") // If you have a campaign model
      .sort({ donatedAt: -1 }); // Most recent first
      
    // Calculate some stats
    const totalAmount = donations
      .filter(d => d.status === "Completed")
      .reduce((sum, d) => sum + d.amount, 0);
      
    const stats = {
      totalDonations: donations.length,
      completedDonations: donations.filter(d => d.status === "Completed").length,
      pendingDonations: donations.filter(d => d.status === "Pending").length,
      failedDonations: donations.filter(d => d.status === "Failed").length,
      totalAmount: totalAmount
    };
    
    return res.status(200).json({ 
      donations,
      stats
    });
  } catch (error) {
    console.error("Error fetching NGO donations:", error);
    return res.status(500).json({ error: "Server error while fetching NGO donations" });
  }
};