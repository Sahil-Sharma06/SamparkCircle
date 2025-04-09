import React, { useEffect, useState } from "react";
import api from "../utils/api";

const DashboardAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Assuming endpoint /analytics/ngo/:ngoId; retrieve ngoId from local state or redux user data
        const ngoId = JSON.parse(localStorage.getItem("user"))._id;
        const res = await api.get(`/analytics/ngo/${ngoId}`);
        setAnalytics(res.data.analytics);
      } catch (err) {
        setError("Failed to load analytics.");
      }
    };
    fetchAnalytics();
  }, []);

  if (error) return <div className="p-8 text-red-400">{error}</div>;
  if (!analytics)
    return <div className="p-8 text-white">Loading analytics...</div>;

  return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold">Dashboard Analytics</h1>
      <div className="space-y-4">
        <div>
          <span className="font-bold">Total Donations: </span> ₹{analytics.totalDonations}
        </div>
        <div>
          <span className="font-bold">Number of Donations: </span> {analytics.donationCount}
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
