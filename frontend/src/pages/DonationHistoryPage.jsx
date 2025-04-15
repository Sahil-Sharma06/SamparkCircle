import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DonationHistoryPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc"); // Default sorting: newest first

  useEffect(() => {
    // Debug: Log user information
    console.log("Current user:", user);
    console.log("User role:", user?.role);
    
    const fetchDonations = async () => {
      try {
        // Always use lowercase roles to match what's in the database
        const endpoint = user?.role?.toLowerCase() === "ngo" 
          ? "/donations/ngo/received" 
          : "/donations/history";
        
        console.log("Fetching donations from endpoint:", endpoint);
        const res = await api.get(endpoint);
        setDonations(res.data.donations || []);
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to load donation history. " + (err.response?.data?.message || ""));
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchDonations();
    } else {
      setError("Please log in to view your donation history");
      setLoading(false);
    }
  }, [user]);

  // Filter donations based on active tab
  const filteredDonations = donations.filter(donation => {
    if (activeTab === "all") return true;
    return donation.status.toLowerCase() === activeTab.toLowerCase();
  });

  // Sort donations based on selected sort option
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    switch (sortBy) {
      case "amount-asc":
        return a.amount - b.amount;
      case "amount-desc":
        return b.amount - a.amount;
      case "date-asc":
        return new Date(a.donatedAt) - new Date(b.donatedAt);
      case "date-desc":
      default:
        return new Date(b.donatedAt) - new Date(a.donatedAt);
    }
  });

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
  };

  const closeModal = () => {
    setSelectedDonation(null);
  };

  const goToCampaign = (campaignId) => {
    if (campaignId) {
      navigate(`/fundraiser-details/${campaignId}`);
    }
  };

  // Function to get appropriate badge color based on status
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-10 text-white bg-gray-900">
        <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-10 text-white bg-gray-900">
        <div className="max-w-4xl p-6 mx-auto bg-gray-800 rounded-lg shadow-lg">
          <div className="p-4 mb-6 text-center text-red-400 bg-red-900 rounded-lg bg-opacity-20">
            <p>{error}</p>
            <p className="mt-2">User role: {user?.role || "Not logged in"}</p>
            <button 
              onClick={() => navigate("/login")}
              className="px-4 py-2 mt-4 bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 text-white bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {user?.role?.toLowerCase() === "ngo" ? "Received Donations" : "Your Donation History"}
          </h1>
          {user?.role?.toLowerCase() !== "ngo" && (
            <button
              onClick={() => navigate("/donate")}
              className="px-4 py-2 font-medium bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Make a New Donation
            </button>
          )}
        </div>
        
        {/* Filter and Sort Controls */}
        <div className="flex flex-col justify-between p-4 mb-6 bg-gray-800 rounded-lg md:flex-row">
          <div className="mb-4 md:mb-0">
            <span className="mr-3 text-gray-400">Status:</span>
            <div className="inline-flex rounded-md" role="group">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  activeTab === "all" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "completed" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "pending" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab("failed")}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  activeTab === "failed" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Failed
              </button>
            </div>
          </div>
          
          <div>
            <span className="mr-3 text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
            </select>
          </div>
        </div>
        
        {/* Donations List */}
        <div className="overflow-hidden bg-gray-800 rounded-lg shadow-lg">
          {sortedDonations.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {sortedDonations.map(donation => (
                <div 
                  key={donation._id} 
                  className="p-5 transition-colors cursor-pointer hover:bg-gray-700"
                  onClick={() => handleViewDetails(donation)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">
                        {user?.role?.toLowerCase() === "ngo" 
                          ? `From: ${donation.donor?.name || 'Anonymous Donor'}` 
                          : `To: ${donation.ngo?.name || 'Unknown NGO'}`}
                      </h3>
                      <p className="mb-1 text-gray-300">
                        Campaign: {donation.campaign?.title || 'General Donation'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Date: {new Date(donation.donatedAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="mb-2 text-2xl font-bold">₹{donation.amount.toLocaleString('en-IN')}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(donation.status)}`}>
                        {donation.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-3">
                    <button
                      className="px-3 py-1 text-sm bg-indigo-600 rounded hover:bg-indigo-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(donation);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5m14-2a2 2 0 00-2-2H7a2 2 0 00-2 2m14 2v-5a2 2 0 00-2-2H7a2 2 0 00-2 2v5" />
              </svg>
              <p className="mt-4 text-lg">No donations found for the selected filter.</p>
              {activeTab !== "all" && (
                <button
                  onClick={() => setActiveTab("all")}
                  className="px-4 py-2 mt-4 bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  Show All Donations
                </button>
              )}
              {user?.role?.toLowerCase() !== "ngo" && (
                <button
                  onClick={() => navigate("/donate")}
                  className="px-4 py-2 mt-4 ml-4 bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  Make a Donation
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-full max-w-lg mx-4 bg-gray-800 rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Donation Details</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-xl font-bold">₹{selectedDonation.amount.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedDonation.status)}`}>
                    {selectedDonation.status}
                  </span>
                </div>
                
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Date:</span>
                  <span>
                    {new Date(selectedDonation.donatedAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">
                    {user?.role?.toLowerCase() === "ngo" ? "Donor:" : "NGO:"}
                  </span>
                  <span>
                    {user?.role?.toLowerCase() === "ngo" 
                      ? (selectedDonation.donor?.name || 'Anonymous') 
                      : (selectedDonation.ngo?.name || 'Unknown NGO')}
                  </span>
                </div>
                
                {selectedDonation.transactionId && (
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-400">Transaction ID:</span>
                    <span className="font-mono">{selectedDonation.transactionId}</span>
                  </div>
                )}
                
                {selectedDonation.campaign && (
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-400">Campaign:</span>
                    <span className="text-indigo-400 cursor-pointer hover:underline" onClick={() => goToCampaign(selectedDonation.campaign._id)}>
                      {selectedDonation.campaign.title}
                    </span>
                  </div>
                )}
                
                {/* Additional details can be added here */}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationHistoryPage;