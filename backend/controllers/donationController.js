import Donation from "../models/donations.models.js";
import Fundraiser from "../models/fundraiser.models.js";
import User from "../models/User.js";

export const createDonation = async (req, res) => {
    try {
        const { userId, fundraiserId, amount, transactionId } = req.body;

        // Validate input
        if (!userId || !fundraiserId || !amount || !transactionId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if user and fundraiser exist
        const user = await User.findById(userId);
        const fundraiser = await Fundraiser.findById(fundraiserId);

        if (!user || !fundraiser) {
            return res.status(404).json({ error: "User or Fundraiser not found." });
        }

        // Create a new donation
        const donation = new Donation({
            user: user._id,
            fundraiser: fundraiser._id,
            amount,
            transactionId,
            createdAt: new Date()
        });

        // Save donation to database
        await donation.save();

        res.status(201).json({
            message: "Donation successful!",
            donation
        });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};