import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const NgoDonationHistoryPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    completedDonations: 0,
    pendingDonations: 0,
    failedDonations: 0,
    totalAmount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  
  useEffect(() => {
    // Verify user has NGO role
    if (user && user.role !== "NGO" && user.role !== "ngo") {
      setError("Only NGOs can access this page");
      setIsLoading(false);
      return;
    }
    
    const fetchNgoDonations = async () => {
      try {
        const res = await api.get("/donations/ngo/received");
        if (res.data) {
          setDonations(res.data.donations || []);
          if (res.data.stats) {
            setStats(res.data.stats);
          } else {
            // Calculate stats if not provided by API
            const totalAmount = res.data.donations
              .filter(d => d.status === "Completed")
              .reduce((sum, d) => sum + d.amount, 0);
              
            setStats({
              totalDonations: res.data.donations.length,
              completedDonations: res.data.donations.filter(d => d.status === "Completed").length,
              pendingDonations: res.data.donations.filter(d => d.status === "Pending").length,
              failedDonations: res.data.donations.filter(d => d.status === "Failed").length,
              totalAmount: totalAmount
            });
          }
        } else {
          setError("Failed to load donation data");
        }
      } catch (err) {
        console.error("Error fetching NGO donations:", err);
        setError(err.response?.data?.error || "An error occurred while fetching donation data");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchNgoDonations();
    } else {
      setError("Please log in to view donation data");
      setIsLoading(false);
    }
  }, [user]);
  
  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };
  
  // Handle donation selection
  const handleDonationClick = (donation) => {
    setSelectedDonation(donation);
  };
  
  // Get status style based on donation status
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Filter donations based on selected filters
  const getFilteredDonations = () => {
    return donations.filter(donation => {
      // Filter by status
      if (statusFilter !== "all" && donation.status !== statusFilter) {
        return false;
      }
      
      // Filter by date
      if (dateFilter !== "all") {
        const donationDate = new Date(donation.donatedAt);
        const today = new Date();
        
        switch (dateFilter) {
          case "today":
            return donationDate.toDateString() === today.toDateString();
          case "week":
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            return donationDate >= oneWeekAgo;
          case "month":
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(today.getMonth() - 1);
            return donationDate >= oneMonthAgo;
          case "year":
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(today.getFullYear() - 1);
            return donationDate >= oneYearAgo;
          default:
            return true;
        }
      }
      
      return true;
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen p-8 text-white bg-gray-900">
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <span className="ml-3">Loading donation data...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen p-8 text-white bg-gray-900">
        <div className="p-4 mb-6 text-red-400 bg-red-900 bg-opacity-25 rounded">
          {error}
        </div>
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  const filteredDonations = getFilteredDonations();
  
  return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold">Donation Records</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-blue-900 rounded-lg shadow bg-opacity-40">
          <p className="text-sm font-medium text-blue-300">Total Donations</p>
          <p className="text-2xl font-bold">{stats.totalDonations}</p>
        </div>
        <div className="p-6 bg-green-900 rounded-lg shadow bg-opacity-40">
          <p className="text-sm font-medium text-green-300">Total Amount</p>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
        </div>
        <div className="p-6 bg-yellow-900 rounded-lg shadow bg-opacity-40">
          <p className="text-sm font-medium text-yellow-300">Pending</p>
          <p className="text-2xl font-bold">{stats.pendingDonations}</p>
        </div>
        <div className="p-6 bg-purple-900 rounded-lg shadow bg-opacity-40">
          <p className="text-sm font-medium text-purple-300">Failed</p>
          <p className="text-2xl font-bold">{stats.failedDonations}</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label htmlFor="statusFilter" className="mr-2 text-sm">Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-white bg-gray-800 border border-gray-700 rounded"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="dateFilter" className="mr-2 text-sm">Date Range:</label>
          <select
            id="dateFilter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 text-white bg-gray-800 border border-gray-700 rounded"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
      
      {donations.length === 0 ? (
        <div className="p-6 bg-gray-800 rounded-lg shadow">
          <p>No donations have been received yet.</p>
        </div>
      ) : filteredDonations.length === 0 ? (
        <div className="p-6 bg-gray-800 rounded-lg shadow">
          <p>No donations match the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Donation list - takes up 2/3 on larger screens */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden bg-gray-800 rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                      Donor
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredDonations.map((donation) => (
                    <tr 
                      key={donation._id} 
                      className="transition-colors cursor-pointer hover:bg-gray-700"
                      onClick={() => handleDonationClick(donation)}
                    >
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {formatDate(donation.donatedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {donation.donor ? (donation.donor.name || donation.donor.email) : "Anonymous Donor"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        {formatCurrency(donation.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(donation.status)}`}>
                          {donation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Donation details - takes up 1/3 on larger screens */}
          <div className="lg:col-span-1">
            {selectedDonation ? (
              <div className="p-6 bg-gray-800 rounded-lg shadow">
                <h2 className="mb-4 text-xl font-semibold">Donation Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Donation Date</p>
                    <p className="font-medium">{formatDate(selectedDonation.donatedAt)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Donor</p>
                    <p className="font-medium">
                      {selectedDonation.donor ? (
                        <>
                          {selectedDonation.donor.name || "N/A"}<br />
                          <span className="text-sm text-gray-400">{selectedDonation.donor.email || "N/A"}</span>
                        </>
                      ) : (
                        "Anonymous Donor"
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="text-2xl font-bold text-green-400">
                      {formatCurrency(selectedDonation.amount)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(selectedDonation.status)}`}>
                        {selectedDonation.status}
                      </span>
                      
                      {/* Status update buttons */}
                      {selectedDonation.status === "Pending" && (
                        <div className="ml-4 space-x-2">
                          <button 
                            className="px-2 py-1 text-xs bg-green-600 rounded hover:bg-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Call API to update status
                              // updateDonationStatus(selectedDonation._id, "Completed");
                            }}
                          >
                            Mark Complete
                          </button>
                          <button 
                            className="px-2 py-1 text-xs bg-red-600 rounded hover:bg-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Call API to update status
                              // updateDonationStatus(selectedDonation._id, "Failed");
                            }}
                          >
                            Mark Failed
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Transaction ID</p>
                    <p className="font-medium break-all">
                      {selectedDonation.transactionId || "N/A"}
                    </p>
                  </div>
                  
                  {selectedDonation.campaign && (
                    <div>
                      <p className="text-sm text-gray-400">Campaign</p>
                      <p className="font-medium">{selectedDonation.campaign.title}</p>
                    </div>
                  )}
                  
                  <button
                    className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
                    onClick={() => setSelectedDonation(null)}
                  >
                    Close Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 p-6 text-center bg-gray-800 rounded-lg shadow">
                <p className="text-gray-400">Select a donation to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NgoDonationHistoryPage;