import React, { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ManageFundraisersPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();

  // Fetch and validate authToken on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    
    if (!storedToken) {
      console.warn("AuthToken missing from localStorage");
      setError("You must be logged in to view this page.");
      setLoading(false);
      setTimeout(() => {
        navigate("/login", { 
          state: { from: window.location.pathname, message: "Please log in to manage fundraisers" } 
        });
      }, 2000);
      return;
    }
    
    console.log("AuthToken found:", storedToken);
    setAuthToken(storedToken);
    
    try {
      const decoded = jwtDecode(storedToken);
      console.log("Decoded token:", decoded);
      
      if (!decoded.id) {
        throw new Error("Invalid token structure");
      }
      
      setUserId(decoded.id);
    } catch (err) {
      console.error("Token decode failed:", err);
      setError("Session invalid. Please log in again.");
      setLoading(false);
      localStorage.removeItem("authToken");
      setTimeout(() => {
        navigate("/login", { 
          state: { from: window.location.pathname, message: "Your session has expired" } 
        });
      }, 2000);
    }
  }, [navigate]);
  
  // Fetch campaigns when userId and authToken are available
  const fetchCampaigns = useCallback(async () => {
    if (!userId || !authToken) return;
    
    try {
      setLoading(true);
      const apiUrl = "http://localhost:3000/api/fundraisers";
      console.log("Fetching from:", apiUrl);
      console.log("Using authToken:", authToken ? "Yes (token exists)" : "No (token missing)");
      
      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        }
      });
      
      console.log("Response status:", res.status);
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response received:", text.substring(0, 500) + "...");
        throw new Error(`Expected JSON response but got: ${contentType || "unknown"}`);
      }
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`HTTP error! Status: ${res.status}. ${errorData.message || ''}`);
      }
      
      const data = await res.json();
      console.log("API response data:", data);

      if (Array.isArray(data.campaigns)) {
        console.log("Fetched campaigns:", data.campaigns);
        
        const userIdStr = userId.toString();
        const myCampaigns = data.campaigns.filter(
          (c) => c.createdBy && c.createdBy.toString() === userIdStr
        );
        
        console.log("My campaigns:", myCampaigns);
        setCampaigns(myCampaigns);
      } else {
        console.warn("Expected data.campaigns to be an array but got:", data.campaigns);
        setError("Unexpected API response format. Please try again later.");
      }
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError("Server error: " + err.message);
      
      // Handle authentication errors
      if (err.message.includes("401") || err.message.includes("unauthorized")) {
        localStorage.removeItem("authToken");
        setAuthToken(null);
        setUserId(null);
        setTimeout(() => {
          navigate("/login", { 
            state: { from: window.location.pathname, message: "Your session has expired" } 
          });
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, authToken, navigate]);
  
  // Call fetchCampaigns when dependencies change
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleDelete = async (campaignId) => {
    if (!authToken) {
      alert("You must be logged in to delete a fundraiser.");
      navigate("/login");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this fundraiser? This action cannot be undone.")) {
      return;
    }
    
    setDeleteLoading(campaignId);
    
    try {
      const response = await fetch(`http://localhost:3000/api/fundraisers/${campaignId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete fundraiser");
      }
      
      setCampaigns(campaigns.filter(c => c._id !== campaignId));
      alert("Fundraiser deleted successfully!");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      alert("Failed to delete fundraiser: " + error.message);
      
      // Handle authentication errors
      if (error.message.includes("401") || error.message.includes("unauthorized")) {
        localStorage.removeItem("authToken");
        setAuthToken(null);
        setUserId(null);
        navigate("/login", { 
          state: { from: window.location.pathname, message: "Your session has expired" } 
        });
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const refreshData = () => {
    fetchCampaigns();
  };

  return (
    <div className="min-h-screen p-10 text-white bg-gray-900">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Fundraisers</h1>
        <div className="flex gap-3">
          {userId && (
            <>
              <button
                onClick={refreshData}
                className="px-3 py-2 text-white transition-colors duration-200 bg-gray-700 rounded hover:bg-gray-600"
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
              <button
                onClick={() => navigate("/dashboard/fundraisers/create")}
                className="px-4 py-2 font-medium text-white transition-colors duration-200 bg-indigo-600 rounded hover:bg-indigo-700"
              >
                + New Fundraiser
              </button>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="mb-4 text-red-400">{error}</p>
          {!userId && (
            <button 
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-white transition-colors duration-200 bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Log In
            </button>
          )}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="py-12 text-center bg-gray-800 rounded-lg">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <p className="mb-6 text-lg text-gray-400">No fundraisers created yet.</p>
          <button
            onClick={() => navigate("/dashboard/fundraisers/create")}
            className="px-5 py-3 font-medium text-white transition-colors duration-200 bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Create Your First Fundraiser
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <div
              key={c._id}
              className="flex flex-col justify-between p-6 transition-transform duration-200 bg-gray-800 shadow-lg rounded-xl hover:shadow-xl"
            >
              <div>
                <h2 className="mb-3 text-xl font-semibold text-white">{c.title}</h2>
                <p className="mb-3 text-gray-300">{c.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-400">🎯 Goal: ₹{c.goal?.toLocaleString() || 0}</p>
                  <span className="px-2 py-1 text-xs text-green-400 bg-gray-700 rounded-full">Active</span>
                </div>
                {c.image && (
                  <div className="h-40 mt-2 mb-3 overflow-hidden bg-gray-700 rounded-lg">
                    <img 
                      src={c.image} 
                      alt={c.title} 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x150?text=No+Image";
                      }} 
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(`/dashboard/fundraisers/${c._id}/edit`)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  disabled={deleteLoading === c._id}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    deleteLoading === c._id 
                      ? "bg-gray-600 cursor-not-allowed" 
                      : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  }`}
                >
                  {deleteLoading === c._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageFundraisersPage;