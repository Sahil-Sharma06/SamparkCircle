import React, { useEffect, useState, useCallback } from "react";
import api from "../utils/api";
import FundraiserCard from "../components/FundraiserCard";

const FundraisersPage = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFundraisers = useCallback(async () => {
    try {
      setLoading(true);
      // This endpoint matches your backend route
      const response = await api.get("/fundraisers");
      
      // Handle different response formats (campaigns or fundraisers)
      let fundraiserData = [];
      if (response.data.campaigns) {
        fundraiserData = response.data.campaigns;
      } else if (response.data.fundraisers) {
        fundraiserData = response.data.fundraisers;
      } else if (Array.isArray(response.data)) {
        fundraiserData = response.data;
      }
      
      setFundraisers(fundraiserData);
      setError("");
    } catch (err) {
      console.error("Error fetching fundraisers:", err);
      setError("Failed to load fundraisers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFundraisers();
  }, [fetchFundraisers]);

  return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Fundraisers</h1>
        <button
          onClick={fetchFundraisers}
          className="px-4 py-2 font-medium text-white transition-colors duration-200 bg-gray-700 rounded hover:bg-gray-600"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-xl text-white">Loading Fundraisers...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-xl text-red-400">{error}</p>
        </div>
      ) : fundraisers.length === 0 ? (
        <p className="text-gray-400">No fundraisers found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {fundraisers.map((fundraiser) => (
            <FundraiserCard key={fundraiser._id} fundraiser={fundraiser} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FundraisersPage;