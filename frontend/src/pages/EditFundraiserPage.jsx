import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const EditFundraiserPage = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    image: ""
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check authentication and fetch campaign data
  useEffect(() => {
    const checkAuthAndFetchCampaign = async () => {
      try {
        // Check for authentication
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          setError("You must be logged in to edit a fundraiser");
          setLoading(false);
          setTimeout(() => {
            navigate("/login", { 
              state: { from: window.location.pathname, message: "Please log in to edit fundraisers" } 
            });
          }, 2000);
          return;
        }

        // Decode token to get user ID
        const decoded = jwtDecode(authToken);
        
        // Fetch campaign data
        const response = await fetch(`http://localhost:3000/api/fundraisers/${campaignId}`, {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch campaign: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched campaign:", data);
        
        // Check if user is authorized to edit this campaign
        if (data.campaign.createdBy.toString() !== decoded.id.toString()) {
          setError("You are not authorized to edit this fundraiser");
          setLoading(false);
          setTimeout(() => {
            navigate("/dashboard/fundraisers");
          }, 2000);
          return;
        }

        // Set form data
        setFormData({
          title: data.campaign.title || "",
          description: data.campaign.description || "",
          goal: data.campaign.goal || "",
          image: data.campaign.image || ""
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load fundraiser: " + err.message);
        setLoading(false);
      }
    };

    checkAuthAndFetchCampaign();
  }, [campaignId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "goal" ? (value === "" ? "" : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const authToken = localStorage.getItem("authToken");
      
      // Validate form data
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }
      
      if (!formData.goal || formData.goal <= 0) {
        throw new Error("Goal must be a positive number");
      }

      const response = await fetch(`http://localhost:3000/api/fundraisers/${campaignId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update fundraiser");
      }

      const data = await response.json();
      console.log("Update successful:", data);
      setSuccess("Fundraiser updated successfully!");
      
      // Redirect after short delay
      setTimeout(() => {
        navigate("/dashboard/fundraisers");
      }, 2000);
    } catch (err) {
      console.error("Error updating campaign:", err);
      setError(err.message || "Failed to update fundraiser");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-10 text-white bg-gray-900">
        <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 text-white bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Edit Fundraiser</h1>
          <button
            onClick={() => navigate("/dashboard/fundraisers")}
            className="px-4 py-2 text-gray-300 transition-colors duration-200 bg-gray-700 rounded hover:bg-gray-600"
          >
            Back to Fundraisers
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 text-red-400 bg-red-900 rounded-md bg-opacity-30">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 mb-6 text-green-400 bg-green-900 rounded-md bg-opacity-30">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 bg-gray-800 shadow-lg rounded-xl">
          <div className="mb-4">
            <label className="block mb-2 text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Fundraiser Title"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe your fundraiser"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-300">Goal Amount (₹)</label>
            <input
              type="number"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full p-3 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="10000"
              min="1"
              step="1"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-300">Image URL (Optional)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-3 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="p-2 mt-2 border border-gray-600 rounded">
                <p className="mb-2 text-sm text-gray-400">Preview:</p>
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="object-cover h-40 mx-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x150?text=Invalid+Image+URL";
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/fundraisers")}
              className="px-6 py-3 text-white transition-colors duration-200 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 px-6 py-3 text-white rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                submitting ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {submitting ? "Updating..." : "Update Fundraiser"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFundraiserPage;