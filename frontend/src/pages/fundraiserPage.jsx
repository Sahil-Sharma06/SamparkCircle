import React, { useEffect, useState } from "react";
import api from "../utils/api";
import FundraiserCard from "../components/FundraiserCard";

const FundraisersPage = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const response = await api.get("/fundraisers");
        // Adjust according to your backend response structure
        // For example, if the response has a field named 'campaigns' or 'fundraisers'
        setFundraisers(response.data.campaigns || response.data.fundraisers || []);
      } catch (err) {
        setError("Failed to load fundraisers.");
      } finally {
        setLoading(false);
      }
    };
    fetchFundraisers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-white">Loading Fundraisers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-semibold">Fundraisers</h1>
      {fundraisers.length === 0 ? (
        <p>No fundraisers found.</p>
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
