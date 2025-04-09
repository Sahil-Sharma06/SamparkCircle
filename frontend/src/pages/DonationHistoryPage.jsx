import React, { useEffect, useState } from "react";
import api from "../utils/api";

const DonationHistoryPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // Assuming backend endpoint /donation/history for donors; for NGO, adjust endpoint (e.g., /ngos/donations)
        const res = await api.get("/donation/history");
        setDonations(res.data.donations);
      } catch (err) {
        setError("Failed to load donation history.");
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading donations...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold">Donation History</h1>
      {donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Campaign/NGO</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td className="p-2 border">{new Date(donation.donatedAt).toLocaleDateString()}</td>
                <td className="p-2 border">₹{donation.amount}</td>
                <td className="p-2 border">{donation.ngo.name}</td>
                <td className="p-2 border">{donation.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DonationHistoryPage;
