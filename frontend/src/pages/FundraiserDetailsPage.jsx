import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const FundraiserDetailsPage = () => {
  const { id } = useParams();
  const [fundraiser, setFundraiser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFundraiser = async () => {
      try {
        const response = await api.get(`/fundraisers/${id}`);
        
        // Extract the fundraiser from the nested structure
        let fundraiserData = null;
        
        if (response.data.campaign) {
          fundraiserData = response.data.campaign;
        } else if (response.data.fundraiser) {
          fundraiserData = response.data.fundraiser;
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          fundraiserData = response.data[0];
        } else {
          fundraiserData = response.data;
        }
        
        // Additional handling for nested campaign object
        if (fundraiserData && fundraiserData.campaign) {
          fundraiserData = fundraiserData.campaign;
        }
        
        // Ensure numeric fields are properly formatted
        if (fundraiserData) {
          fundraiserData.goal = Number(fundraiserData.goal);
          fundraiserData.amountRaised = Number(fundraiserData.amountRaised || 0);
        }
        
        setFundraiser(fundraiserData);
      } catch (err) {
        console.error("Failed to fetch fundraiser:", err);
        setError("Could not load fundraiser details.");
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
    
  // Check if fundraiser goal has been reached
  const isCompleted = fundraiser && (fundraiser.amountRaised || 0) >= fundraiser.goal;

  const handleDonate = () => {
    navigate(`/donate/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 mr-3 -ml-1 text-indigo-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2">Loading fundraiser details...</p>
        </div>
      </div>
    );
  }

  if (error || !fundraiser) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400 bg-gray-900">
        {error || "Fundraiser not found."}
        <button 
          onClick={() => navigate("/dashboard/fundraisers")}
          className="px-4 py-2 ml-4 text-white bg-indigo-600 rounded hover:bg-indigo-700"
        >
          Return to Fundraisers
        </button>
      </div>
    );
  }

  const createdDate = new Date(fundraiser.createdAt).toLocaleDateString();
  
  return (
    <div className="min-h-screen px-4 py-10 text-white bg-gray-900">
      <div className="max-w-4xl p-6 mx-auto bg-gray-800 rounded-lg shadow-xl">
        {/* Goal Completion Banner */}
        {isCompleted && (
          <div className="p-4 mb-6 text-center bg-green-800 rounded-lg bg-opacity-70">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-8 h-8 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h2 className="text-2xl font-bold text-green-400">Fundraising Goal Reached!</h2>
            </div>
            <p className="text-green-200">
              Thank you to all our donors for your incredible generosity and support.
              Together, we've made a difference!
            </p>
          </div>
        )}
      
        {/* Fundraiser Header */}
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="md:w-1/2">
            {fundraiser.image ? (
              <img src={fundraiser.image} alt={fundraiser.title} className="object-cover w-full h-64 rounded-lg" />
            ) : (
              <div className="flex items-center justify-center w-full h-64 bg-gray-700 rounded-lg">
                <span className="text-gray-400">No Image Available</span>
              </div>
            )}
          </div>
          
          <div className="md:w-1/2">
            <h1 className="mb-4 text-3xl font-bold">{fundraiser.title}</h1>
            
            <div className="mb-6">
              {/* Progress bar */}
              <div className="w-full h-4 mb-2 bg-gray-700 rounded-full">
                <div 
                  className={`h-full rounded-full ${isCompleted ? 'bg-green-600' : 'bg-indigo-600'}`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium text-gray-300">
                  <span className="font-bold">{Math.round(progressPercentage)}%</span> Complete
                </span>
                <span className="font-medium text-gray-300">
                  Goal: <span className="font-bold">₹{fundraiser.goal.toLocaleString()}</span>
                </span>
              </div>
              
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-white">₹{(fundraiser.amountRaised || 0).toLocaleString()}</span>
                <span className="ml-2 text-gray-400">raised so far</span>
              </div>
            </div>
            
            {!isCompleted && (
              <button
                onClick={handleDonate}
                className="w-full py-3 mt-2 text-lg font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Donate Now
              </button>
            )}
            
            {isCompleted && (
              <div className="w-full py-3 mt-2 text-lg font-medium text-center text-white bg-green-600 rounded-lg">
                Fundraising Complete
              </div>
            )}
          </div>
        </div>
        
        {/* Fundraiser Details */}
        <div className="mt-8">
          <h2 className="pb-2 mb-4 text-xl font-semibold border-b border-gray-700">About This Fundraiser</h2>
          <p className="leading-relaxed text-gray-300">{fundraiser.description}</p>
          
          <div className="mt-6 text-sm text-gray-400">
            <p>Created on: {createdDate}</p>
            {fundraiser.createdBy && typeof fundraiser.createdBy === 'object' && (
              <p>Created by: {fundraiser.createdBy.name}</p>
            )}
            {fundraiser.ngo && typeof fundraiser.ngo === 'object' && (
              <p>Organization: {fundraiser.ngo.name}</p>
            )}
          </div>
        </div>
        
        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/dashboard/fundraisers")}
            className="px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded hover:bg-gray-600"
          >
            Back to All Fundraisers
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundraiserDetailsPage;