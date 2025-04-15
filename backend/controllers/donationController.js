import Donation from "../models/donations.models.js";
import NGO from "../models/ngo.models.js";
import Fundraiser from "../models/campaign.models.js";

/**
 * Process a donation.
 * This simulates a payment and updates fundraiser's amountRaised.
 */
export const processDonation = async (req, res) => {
  try {
    const { ngoId, campaignId, amount } = req.body;
    if (!amount || !ngoId) {
      return res.status(400).json({ message: "Amount and NGO ID are required." });
    }

    const donation = new Donation({
      donor: req.user.id,
      ngo: ngoId,
      campaign: campaignId || null,
      amount: Number(amount), // Ensure amount is a number
      transactionId: "TXN" + Math.floor(Math.random() * 1000000),
      status: "Completed",
    });

    await donation.save();

    // Update amountRaised in fundraiser
    if (campaignId) {
      const fundraiser = await Fundraiser.findById(campaignId);
      if (fundraiser) {
        fundraiser.amountRaised = (fundraiser.amountRaised || 0) + Number(amount);
        await fundraiser.save();
        
        // Return the updated fundraiser data
        return res.status(201).json({
          message: "Donation processed successfully",
          donation,
          updatedFundraiser: {
            id: fundraiser._id,
            amountRaised: fundraiser.amountRaised
          }
        });
      }
    }

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
      .populate("campaign", "title")
      .sort({ donatedAt: -1 });

    return res.status(200).json({ donations });
  } catch (error) {
    console.error("Error fetching donation history:", error);
    return res.status(500).json({ error: "Server error while fetching donation history" });
  }
};

/**
 * Get donation details by ID.
 */
export const getDonationById = async (req, res) => {
  try {
    const { donationId } = req.params;
    const donation = await Donation.findById(donationId)
      .populate("ngo", "name email logo address")
      .populate("campaign", "title");

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.donor.toString() !== req.user.id) {
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
 * Get donations received by the NGO of the logged-in user.
 */
export const getNgoDonations = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ createdBy: req.user.id });
    if (!ngo) {
      return res.status(404).json({ message: "No NGO profile found for this user" });
    }

    const donations = await Donation.find({ ngo: ngo._id })
      .populate("donor", "name email")
      .populate("campaign", "title")
      .sort({ donatedAt: -1 });

    const totalAmount = donations
      .filter(d => d.status === "Completed")
      .reduce((sum, d) => sum + d.amount, 0);

    const stats = {
      totalDonations: donations.length,
      completedDonations: donations.filter(d => d.status === "Completed").length,
      pendingDonations: donations.filter(d => d.status === "Pending").length,
      failedDonations: donations.filter(d => d.status === "Failed").length,
      totalAmount,
    };

    return res.status(200).json({ donations, stats });
  } catch (error) {
    console.error("Error fetching NGO donations:", error);
    return res.status(500).json({ error: "Server error while fetching NGO donations" });
  }
};

/**
 * Get recent donations (for analytics)
 */
export const getRecentDonations = async (req, res) => {
  try {
    const { ngoId, limit = 10 } = req.query;
    
    const query = ngoId ? { ngo: ngoId } : {};
    
    const donations = await Donation.find(query)
      .populate("donor", "name email")
      .populate("ngo", "name")
      .populate("campaign", "title")
      .sort({ donatedAt: -1 })
      .limit(parseInt(limit));
    
    return res.status(200).json({ 
      donations,
      count: donations.length
    });
  } catch (error) {
    console.error("Error fetching recent donations:", error);
    return res.status(500).json({ error: "Server error while fetching recent donations" });
  }
};