import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const DonorDonationHistoryPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDonation, setSelectedDonation] = useState(null);
  
  useEffect(() => {
    // Verify user has Donor role
    if (user && user.role !== "Donor") {
      setError("Only donors can access donation history");
      setIsLoading(false);
      return;
    }
    
    const fetchDonationHistory = async () => {
      try {
        const res = await api.get("/donations/history");
        if (res.data && res.data.donations) {
          setDonations(res.data.donations);
        } else {
          setError("Failed to load donation history");
        }
      } catch (err) {
        console.error("Error fetching donation history:", err);
        setError(err.response?.data?.error || "An error occurred while fetching your donation history");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchDonationHistory();
    } else {
      setError("Please log in to view your donation history");
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen p-8 text-white bg-gray-900">
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <span className="ml-3">Loading donation history...</span>
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
  
  return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold">Your Donation History</h1>
      
      {donations.length === 0 ? (
        <div className="p-6 bg-gray-800 rounded-lg shadow">
          <p>You haven't made any donations yet.</p>
          <button
            className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => navigate("/explore-ngos")} // Adjust route as needed
          >
            Explore NGOs to Support
          </button>
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
                      Organization
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
                  {donations.map((donation) => (
                    <tr 
                      key={donation._id} 
                      className="transition-colors cursor-pointer hover:bg-gray-700"
                      onClick={() => handleDonationClick(donation)}
                    >
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {formatDate(donation.donatedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center">
                          {donation.ngo.logo && (
                            <img 
                              src={donation.ngo.logo} 
                              alt={`${donation.ngo.name} logo`}
                              className="w-8 h-8 mr-3 rounded-full" 
                            />
                          )}
                          {donation.ngo.name}
                        </div>
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
                
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    {selectedDonation.ngo.logo && (
                      <img 
                        src={selectedDonation.ngo.logo} 
                        alt={`${selectedDonation.ngo.name} logo`}
                        className="w-16 h-16 mr-4 rounded-full" 
                      />
                    )}
                    <h3 className="text-lg font-medium">{selectedDonation.ngo.name}</h3>
                  </div>
                  
                  {selectedDonation.campaign && (
                    <div className="mb-4">
                      <span className="text-gray-400">Campaign:</span>
                      <p className="font-medium">{selectedDonation.campaign.title}</p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <span className="text-gray-400">Amount:</span>
                    <p className="text-2xl font-bold text-green-400">
                      {formatCurrency(selectedDonation.amount)}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-gray-400">Status:</span>
                    <p className="font-medium">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(selectedDonation.status)}`}>
                        {selectedDonation.status}
                      </span>
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-gray-400">Transaction ID:</span>
                    <p className="font-medium">{selectedDonation.transactionId || "N/A"}</p>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-gray-400">Date:</span>
                    <p className="font-medium">{formatDate(selectedDonation.donatedAt)}</p>
                  </div>
                </div>
                
                <button
                  className="w-full px-4 py-2 text-center text-white bg-blue-600 rounded hover:bg-blue-700"
                  onClick={() => setSelectedDonation(null)}
                >
                  Close Details
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-center bg-gray-800 rounded-lg shadow">
                <p className="text-gray-400">
                  Select a donation to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDonationHistoryPage;