import mongoose from "mongoose";
import Donation from "../models/donations.models.js";

/**
 * Get analytics data for a specific NGO.
 * Returns the total donation amount and donation count for the given NGO.
 */

export const getNGOAnalytics = async (req, res) => {
  try {
    const { ngoId } = req.params;
    console.log("Fetching analytics for NGO ID:", ngoId);
    
    if (!mongoose.Types.ObjectId.isValid(ngoId)) {
      console.log("Invalid NGO ID format:", ngoId);
      return res.status(400).json({ error: "Invalid NGO ID format." });
    }
    
    const donationAgg = await Donation.aggregate([
      { $match: { ngo: new mongoose.Types.ObjectId(ngoId), status: "Completed" } },
      {
        $group: {
          _id: null,
          totalDonations: { $sum: "$amount" },
          donationCount: { $sum: 1 },
        },
      },
    ]);
    
    console.log("Aggregation result:", donationAgg);
    
    const totalDonations = donationAgg.length > 0 ? donationAgg[0].totalDonations : 0;
    const donationCount = donationAgg.length > 0 ? donationAgg[0].donationCount : 0;
    
    return res.status(200).json({ analytics: { totalDonations, donationCount } });
  } catch (error) {
    console.error("Error fetching NGO analytics:", error);
    return res.status(500).json({ error: "Server error while fetching NGO analytics" });
  }
};

/**
 * Get global analytics data across the platform.
 * Returns aggregated donation amount and count for all completed donations.
 */
export const getGlobalAnalytics = async (req, res) => {
  try {
    const donationAgg = await Donation.aggregate([
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: null,
          totalDonations: { $sum: "$amount" },
          donationCount: { $sum: 1 },
        },
      },
    ]);
    const totalDonations = donationAgg.length > 0 ? donationAgg[0].totalDonations : 0;
    const donationCount = donationAgg.length > 0 ? donationAgg[0].donationCount : 0;
    return res.status(200).json({
      analytics: {
        totalDonations,
        donationCount,
      },
    });
  } catch (error) {
    console.error("Error fetching global analytics:", error);
    return res.status(500).json({ error: "Server error while fetching global analytics" });
  }
};
