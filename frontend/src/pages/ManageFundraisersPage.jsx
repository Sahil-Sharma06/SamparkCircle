import React, { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const ManageFundraisersPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
      setError("You must be logged in to view this page.");
      setLoading(false);
      setTimeout(() => {
        navigate("/login", {
          state: { from: window.location.pathname, message: "Please log in to manage fundraisers" },
        });
      }, 2000);
      return;
    }

    try {
      const decoded = jwtDecode(storedToken);
      if (!decoded.id) throw new Error("Invalid token structure");
      setUserId(decoded.id);
    } catch (err) {
      setError("Session invalid. Please log in again.");
      setLoading(false);
      localStorage.removeItem("authToken");
      setTimeout(() => {
        navigate("/login", {
          state: { from: window.location.pathname, message: "Your session has expired" },
        });
      }, 2000);
    }
  }, [navigate]);

  const fetchCampaigns = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await api.get("/fundraisers");
      
      const data = response.data;
      console.log("Fetched campaigns data:", data);

      // Simply use all campaigns from the API response without filtering
      // This resolves the issue where campaigns are fetched but not displayed
      if (data && (data.campaigns || Array.isArray(data))) {
        const campaignsArray = data.campaigns || data;
        console.log("Setting campaigns:", campaignsArray);
        setCampaigns(campaignsArray);
      } else {
        setCampaigns([]);
        setError("Unexpected API response format.");
      }
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError("Failed to load your fundraisers: " + (err.response?.data?.message || err.message));
      
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login", {
          state: { from: window.location.pathname, message: "Your session has expired" },
        });
      }
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (userId) {
      fetchCampaigns();
    }
  }, [userId, fetchCampaigns]);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    
    setDeleteLoading(confirmDeleteId);

    try {
      await api.delete(`/fundraisers/${confirmDeleteId}`);
      
      setCampaigns((prev) => prev.filter((c) => c._id !== confirmDeleteId));
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error deleting campaign:", error);
      setError("Failed to delete fundraiser: " + (error.response?.data?.message || error.message));
    } finally {
      setDeleteLoading(null);
      setConfirmDeleteId(null);
    }
  };

  const refreshData = () => fetchCampaigns();

  return (
    <div className="min-h-screen p-10 text-white bg-gray-900">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Fundraisers</h1>
        <div className="flex gap-3">
          {userId && (
            <>
              <button
                onClick={refreshData}
                className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600"
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
              <button
                onClick={() => navigate("/dashboard/fundraisers/create")}
                className="px-4 py-2 font-medium bg-indigo-600 rounded hover:bg-indigo-700"
              >
                + New Fundraiser
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 text-center text-red-400 bg-red-900 rounded-lg bg-opacity-20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="py-12 text-center bg-gray-800 rounded-lg">
          <p className="mb-6 text-lg text-gray-400">No fundraisers created yet.</p>
          <button
            onClick={() => navigate("/dashboard/fundraisers/create")}
            className="px-5 py-3 font-medium bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Create Your First Fundraiser
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <div
              key={c._id}
              className="flex flex-col justify-between p-6 bg-gray-800 shadow-lg rounded-xl"
            >
              <div>
                <h2 className="mb-3 text-xl font-semibold">{c.title}</h2>
                <p className="mb-3 text-gray-300">{c.description}</p>
                <div className="flex justify-between mb-3 text-sm text-gray-400">
                  <p>🎯 Goal: ₹{(c.goal || 0).toLocaleString()}</p>
                  <p>💰 Raised: ₹{(c.amountRaised || 0).toLocaleString()}</p>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2 mb-3 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-indigo-600 rounded-full" 
                    style={{ width: `${Math.min(((c.amountRaised || 0) / (c.goal || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
                
                {c.image && (
                  <div className="h-40 mb-3 overflow-hidden rounded-lg">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        // Use a simple data URL for the placeholder instead of an external service
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='150' viewBox='0 0 300 150'%3E%3Crect width='300' height='150' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23333333'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(`/fundraiser-details/${c._id}`)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-500"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/dashboard/fundraisers/${c._id}/edit`)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDeleteId(c._id)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                  disabled={deleteLoading === c._id}
                >
                  {deleteLoading === c._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-full max-w-sm p-6 text-center bg-gray-800 rounded-lg shadow-xl">
            <h3 className="mb-2 text-xl font-bold text-red-400">Confirm Deletion</h3>
            <p className="mb-4 text-gray-300">Are you sure you want to delete this fundraiser?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-full max-w-sm p-6 text-center bg-gray-800 rounded-lg shadow-xl">
            <h3 className="mb-2 text-xl font-bold text-green-400">Deleted Successfully</h3>
            <p className="mb-4 text-gray-300">Your fundraiser has been removed.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFundraisersPage;