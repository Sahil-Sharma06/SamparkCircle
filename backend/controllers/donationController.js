import Donation from "../models/donations.models.js";

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
    const donations = await Donation.find({ donor: req.user.id }).populate("ngo", "name email");
    return res.status(200).json({ donations });
  } catch (error) {
    console.error("Error fetching donation history:", error);
    return res.status(500).json({ error: "Server error while fetching donation history" });
  }
};
