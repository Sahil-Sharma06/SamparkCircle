import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const DonationPage = () => {
  const { id } = useParams();
  const [fundraiser, setFundraiser] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingDonation, setProcessingDonation] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(null);
  const navigate = useNavigate();

  // Fetch the fundraiser data
  useEffect(() => {
    const fetchFundraiser = async () => {
      try {
        console.log("Fetching fundraiser with ID:", id);
        const response = await api.get(`/fundraisers/${id}`);
        
        console.log("API Response:", response.data);
        
        // Extract the fundraiser from the nested structure
        let fundraiserData = null;
        
        // Handle different possible response structures
        if (response.data.campaign) {
          // If response has campaign property
          fundraiserData = response.data.campaign;
        } else if (response.data.fundraiser) {
          // If response has fundraiser property
          fundraiserData = response.data.fundraiser;
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          // If response is an array
          fundraiserData = response.data[0];
        } else {
          // If data is directly in the response
          fundraiserData = response.data;
        }

        console.log("Extracted fundraiser data:", fundraiserData);
        
        // Additional handling for nested campaign object
        if (fundraiserData && fundraiserData.campaign) {
          fundraiserData = fundraiserData.campaign;
        }
        
        // Validate the data
        if (!fundraiserData) {
          setError("No fundraiser data received from server");
          setLoading(false);
          return;
        }
        
        // Convert goal to number if it's a string
        if (fundraiserData.goal && typeof fundraiserData.goal === 'string') {
          fundraiserData.goal = parseFloat(fundraiserData.goal);
        }
        
        // Check for required fields
        if (typeof fundraiserData.goal !== 'number' || isNaN(fundraiserData.goal)) {
          console.error("Invalid goal value:", fundraiserData.goal);
          setError("Invalid fundraiser goal data. Please try again.");
          setLoading(false);
          return;
        }
        
        // Initialize amountRaised if it doesn't exist
        if (fundraiserData.amountRaised === undefined || fundraiserData.amountRaised === null) {
          fundraiserData.amountRaised = 0;
        } else if (typeof fundraiserData.amountRaised === 'string') {
          fundraiserData.amountRaised = parseFloat(fundraiserData.amountRaised);
        }
        
        // If createdBy is present but ngo is not, get the creator's NGO info
        if (!fundraiserData.ngo && fundraiserData.createdBy) {
          try {
            const ngoResponse = await api.get(`/ngos/user/${fundraiserData.createdBy._id || fundraiserData.createdBy}`);
            if (ngoResponse.data && ngoResponse.data.ngo) {
              fundraiserData.ngo = ngoResponse.data.ngo._id || ngoResponse.data.ngo;
            }
          } catch (ngoErr) {
            console.error("Failed to fetch NGO info:", ngoErr);
          }
        }
        
        console.log("Final fundraiser data being set:", fundraiserData);
        setFundraiser(fundraiserData);
      } catch (err) {
        console.error("Failed to fetch fundraiser:", err);
        setError(`Could not load fundraiser details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFundraiser();
  }, [id]);

  // Calculate progress percentage - with null/undefined checks
  const progressPercentage = fundraiser && typeof fundraiser.goal === 'number' 
    ? Math.min(((fundraiser.amountRaised || 0) / fundraiser.goal) * 100, 100)
    : 0;

  const handleDonate = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }

    setProcessingDonation(true);
    setError("");

    try {
      // Use a direct donation to the campaign and let the backend handle NGO association
      // We're using the modified endpoint that doesn't require NGO ID explicitly
      const res = await api.post(`/donations/direct-campaign/${id}`, { 
        amount: Number(amount)
      });
      
      console.log("Donation response:", res.data);
      
      if (res.status === 200 || res.status === 201) {
        // Update the fundraiser state with the latest amount raised
        if (res.data.updatedFundraiser) {
          setFundraiser(prev => ({
            ...prev,
            amountRaised: res.data.updatedFundraiser.amountRaised
          }));
        } else {
          // If the backend doesn't return the updated amount, calculate it client-side
          setFundraiser(prev => ({
            ...prev,
            amountRaised: (prev.amountRaised || 0) + Number(amount)
          }));
        }
        
        setDonationSuccess({
          amount: Number(amount),
          transactionId: res.data.donation?.transactionId || "Unknown"
        });
        setShowModal(true);
      }
    } catch (err) {
      console.error("Donation failed:", err);
      setError(err.response?.data?.message || `Failed to process donation: ${err.message}`);
    } finally {
      setProcessingDonation(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Refresh the fundraiser data one more time to ensure we have the latest
    api.get(`/fundraisers/${id}`)
      .then(response => {
        // Handle nested data again
        let updatedData = null;
        if (response.data.campaign) {
          updatedData = response.data.campaign;
        } else if (response.data.fundraiser) {
          updatedData = response.data.fundraiser;
        } else {
          updatedData = response.data;
        }
        
        if (updatedData && updatedData.campaign) {
          updatedData = updatedData.campaign;
        }
        
        if (updatedData && typeof updatedData.goal === 'number') {
          setFundraiser(updatedData);
        }
      })
      .catch(err => console.error("Failed to refresh fundraiser:", err));
  };

  const handleViewDonations = () => {
    setShowModal(false);
    navigate("/dashboard/donations");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 mr-3 -ml-1 text-indigo-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2">Loading donation page...</p>
        </div>
      </div>
    );
  }

  if (error && !fundraiser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-400 bg-gray-900">
        <p className="mb-4">{error || "Fundraiser not found."}</p>
        <div className="p-4 mt-4 overflow-auto text-xs text-left text-white bg-gray-800 rounded w-96 max-h-96">
          <h3 className="mb-2 font-bold">Debug Information:</h3>
          <p>Fundraiser ID: {id}</p>
        </div>
        <button 
          onClick={() => navigate("/dashboard/fundraisers")}
          className="px-4 py-2 mt-4 text-white bg-indigo-600 rounded hover:bg-indigo-700"
        >
          Return to Fundraisers
        </button>
      </div>
    );
  }

  // Extra safety check
  if (!fundraiser || typeof fundraiser.goal !== 'number') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-400 bg-gray-900">
        <p className="mb-4">Invalid fundraiser data. Please try again later.</p>
        <div className="p-4 mt-4 overflow-auto text-xs text-left text-white bg-gray-800 rounded w-96 max-h-96">
          <h3 className="mb-2 font-bold">Debug Information:</h3>
          <p>Fundraiser ID: {id}</p>
          <pre>Data: {JSON.stringify(fundraiser, null, 2)}</pre>
        </div>
        <button 
          onClick={() => navigate("/dashboard/fundraisers")}
          className="px-4 py-2 mt-4 text-white bg-indigo-600 rounded hover:bg-indigo-700"
        >
          Return to Fundraisers
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 text-white bg-gray-900">
      <div className="max-w-2xl p-6 mx-auto bg-gray-800 rounded-lg shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">{fundraiser.title}</h1>
        <p className="mb-4 text-gray-300">{fundraiser.description}</p>

        {fundraiser.image && (
          <img
            src={fundraiser.image}
            alt={fundraiser.title}
            className="object-cover w-full h-56 mb-4 rounded"
          />
        )}

        <div className="mb-6">
          {/* Progress bar */}
          <div className="w-full h-3 mb-2 bg-gray-700 rounded-full">
            <div 
              className="h-full transition-all duration-500 bg-indigo-600 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">
            🎯 Goal: ₹{fundraiser.goal.toLocaleString()} | 💰 Raised: ₹{(fundraiser.amountRaised || 0).toLocaleString()} ({Math.round(progressPercentage)}%)
          </p>
        </div>

        {error && <p className="p-3 mb-4 text-sm text-red-400 bg-red-900 rounded bg-opacity-30">{error}</p>}

        <div className="mb-4">
          <label htmlFor="amount" className="block mb-2 text-sm font-medium">
            Enter Donation Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 500"
            disabled={processingDonation}
          />
        </div>

        <button
          onClick={handleDonate}
          disabled={processingDonation}
          className={`w-full py-3 mt-4 text-white transition duration-200 rounded ${
            processingDonation 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {processingDonation ? (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Proceed to Donate"
          )}
        </button>
      </div>

      {showModal && donationSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-full max-w-md p-6 text-center bg-gray-800 rounded-lg shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-green-400">Thank You!</h2>
            <p className="mb-2 text-gray-300">
              You donated <span className="font-bold text-white">₹{donationSuccess.amount.toLocaleString()}</span> to{" "}
              <span className="font-semibold text-indigo-400">{fundraiser.title}</span>.
            </p>
            <p className="mb-4 text-sm text-gray-400">
              Transaction ID: {donationSuccess.transactionId}
            </p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <button
                onClick={handleViewDonations}
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
              >
                View My Donations
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
              >
                Back to Fundraisers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationPage;