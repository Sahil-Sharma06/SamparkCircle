import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/api";

const DonationPage = () => {
  const { id } = useParams(); // This is the campaign/fundraiser ID
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [fundraiser, setFundraiser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [donationData, setDonationData] = useState(null);

  // Predefined donation amounts
  const donationOptions = [100, 500, 1000, 5000];

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate(`/login?redirect=/donate/${id}`);
      return;
    }
    
    const fetchFundraiser = async () => {
      try {
        const response = await api.get(`/fundraisers/${id}`);
        
        // Handle different response formats
        let fundraiserData = null;
        if (response.data.campaign) {
          fundraiserData = response.data.campaign;
        } else if (response.data.fundraiser) {
          fundraiserData = response.data.fundraiser;
        } else {
          fundraiserData = response.data;
        }
        
        if (fundraiserData) {
          setFundraiser(fundraiserData);
        } else {
          setError("Could not load fundraiser details.");
        }
      } catch (err) {
        console.error("Failed to fetch fundraiser:", err);
        setError("Could not load fundraiser details.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFundraiser();
  }, [id, isAuthenticated, navigate]);

  const handleDonation = async (e) => {
    e.preventDefault();
    
    if (!fundraiser || !fundraiser._id || !fundraiser.ngo || !fundraiser.ngo._id) {
      setError("Invalid fundraiser data. Please try again.");
      return;
    }
    
    setProcessingPayment(true);
    setError("");
    
    try {
      // Use the direct campaign donation endpoint that matches your backend routes
      const response = await api.post(`/donations/campaign/${fundraiser._id}`, {
        amount,
        ngoId: fundraiser.ngo._id
      });
      
      // Save the donation data for displaying in the success popup
      setDonationData({
        amount,
        campaign: fundraiser.title,
        ngo: fundraiser.ngo.name,
        transactionId: response.data?.donation?.transactionId || "Transaction Pending",
        date: new Date().toLocaleString()
      });
      
      // Show success popup instead of redirecting
      setShowSuccessPopup(true);
      
      // Reset the form
      setAmount(100);
      setPaymentMethod("card");
    } catch (err) {
      console.error("Error processing donation:", err);
      setError(err.response?.data?.message || "Failed to process your donation. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };
  
  // Function to close popup and navigate
  const handleClosePopup = (destination) => {
    setShowSuccessPopup(false);
    if (destination) {
      navigate(destination);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !fundraiser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white bg-gray-900">
        <div className="p-6 bg-red-900 rounded-lg bg-opacity-20">
          <p className="text-xl text-red-400">{error}</p>
          <button
            onClick={() => navigate("/dashboard/fundraisers")}
            className="px-4 py-2 mt-4 text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Back to Fundraisers
          </button>
        </div>
      </div>
    );
  }

  if (!fundraiser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white bg-gray-900">
        <div className="p-6 bg-gray-800 rounded-lg">
          <p className="text-xl">Fundraiser not found.</p>
          <button
            onClick={() => navigate("/dashboard/fundraisers")}
            className="px-4 py-2 mt-4 text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Back to Fundraisers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-10 text-white bg-gray-900 md:p-8">
      {/* Success Popup */}
      {showSuccessPopup && donationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="max-w-lg p-6 mx-4 text-center bg-gray-800 rounded-lg shadow-2xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-green-600 rounded-full">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="mb-4 text-2xl font-bold text-white">Donation Successful!</h2>
            <p className="mb-6 text-green-300">Thank you for your generous contribution. Your support makes a real difference!</p>
            
            <div className="p-4 mb-6 text-left bg-gray-700 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Amount:</span>
                <span className="font-bold">₹{donationData.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Campaign:</span>
                <span>{donationData.campaign}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Organization:</span>
                <span>{donationData.ngo}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Transaction ID:</span>
                <span className="font-mono text-sm">{donationData.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Date:</span>
                <span>{donationData.date}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => handleClosePopup("/dashboard/donations/history")}
                className="px-6 py-3 font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                View Donation History
              </button>
              
              <button
                onClick={() => handleClosePopup("/dashboard")}
                className="px-6 py-3 font-medium text-white transition bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl p-6 mx-auto bg-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col mb-6 md:flex-row md:items-center">
          <div className="md:w-1/2 md:pr-6">
            <h1 className="mb-4 text-2xl font-bold md:text-3xl">
              Donate to {fundraiser.title}
            </h1>
            <p className="mb-4 text-gray-300">
              {fundraiser.description}
            </p>
            
            <div className="p-4 mb-4 bg-gray-700 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Goal:</span>
                <span className="font-semibold">₹{fundraiser.goal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Raised so far:</span>
                <span className="font-semibold">₹{(fundraiser.amountRaised || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-6">
            {fundraiser.image ? (
              <img 
                src={fundraiser.image} 
                alt={fundraiser.title} 
                className="object-cover w-full h-48 mb-4 rounded-lg md:h-64" 
              />
            ) : (
              <div className="flex items-center justify-center w-full h-48 mb-4 bg-gray-700 rounded-lg md:h-64">
                <span className="text-gray-400">No Image Available</span>
              </div>
            )}
          </div>
        </div>
        
        <form onSubmit={handleDonation}>
          <div className="p-6 mb-6 bg-gray-700 rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">Your Donation</h2>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-300">Select Amount (₹)</label>
              <div className="flex flex-wrap gap-2">
                {donationOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`px-4 py-2 rounded-lg ${
                      amount === option
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                    onClick={() => setAmount(option)}
                  >
                    ₹{option.toLocaleString()}
                  </button>
                ))}
                
                <div className="flex w-full mt-3">
                  <span className="flex items-center justify-center px-4 bg-gray-600 border-r-0 border-gray-700 rounded-l-lg">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 text-white bg-gray-600 border-gray-700 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-gray-300">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 text-white bg-gray-600 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </div>
          </div>
          
          {error && (
            <div className="p-4 mb-6 text-center text-red-400 bg-red-900 rounded-lg bg-opacity-20">
              <p>{error}</p>
            </div>
          )}
          
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <button
              type="button"
              onClick={() => navigate(`/fundraiser-details/${id}`)}
              className="px-6 py-3 text-white bg-gray-600 rounded-lg hover:bg-gray-500"
            >
              Back to Fundraiser
            </button>
            
            <button
              type="submit"
              disabled={processingPayment || amount <= 0}
              className={`px-6 py-3 font-semibold text-white rounded-lg ${
                processingPayment || amount <= 0
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {processingPayment ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Donate ₹${amount.toLocaleString()}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationPage;