import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ApplicationStatsCard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch("http://localhost:3000/api/volunteer/applications/stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch application statistics");
        }

        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching application statistics:", error);
        setError("Error loading statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'approved':
        return 'text-green-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 rounded-xl">
        <h3 className="mb-4 text-xl font-semibold">Application Statistics</h3>
        <p className="text-gray-400">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-800 rounded-xl">
        <h3 className="mb-4 text-xl font-semibold">Application Statistics</h3>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-xl">
      <h3 className="mb-4 text-xl font-semibold">Application Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Total Applications</p>
          <p className="text-2xl font-bold text-blue-400">{stats.total}</p>
        </div>
        
        <div className="p-3 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Pending</p>
          <p className={`text-2xl font-bold ${getStatusColor('pending')}`}>{stats.pending}</p>
        </div>
        
        <div className="p-3 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Approved</p>
          <p className={`text-2xl font-bold ${getStatusColor('approved')}`}>{stats.approved}</p>
        </div>
        
        <div className="p-3 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Rejected</p>
          <p className={`text-2xl font-bold ${getStatusColor('rejected')}`}>{stats.rejected}</p>
        </div>
      </div>
      
      <button
        onClick={() => navigate("/volunteer/applications")}
        className="w-full py-2 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        View All Applications
      </button>
    </div>
  );
};

export default ApplicationStatsCard;