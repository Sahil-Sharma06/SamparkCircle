import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const CreateFundraiserPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to create a fundraiser");
      setTimeout(() => {
        navigate("/login", { 
          state: { from: window.location.pathname, message: "Please log in to create a fundraiser" }
        });
      }, 2000);
    } else {
      // Set the Authorization header for all subsequent requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      // Validate the form data before submission
      if (!formData.title.trim() || !formData.description.trim() || !formData.goal) {
        throw new Error("Please fill in all required fields");
      }
      
      if (isNaN(Number(formData.goal)) || Number(formData.goal) <= 0) {
        throw new Error("Goal amount must be a positive number");
      }
      
      const fundraiserData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        goal: Number(formData.goal),
        image: formData.image.trim() || ""
      };
      
      console.log("Submitting fundraiser with data:", fundraiserData);
      
      const response = await api.post("/fundraisers", fundraiserData);
      
      console.log("Fundraiser created successfully:", response.data);
      alert("Fundraiser created successfully!");
      navigate("/dashboard/fundraisers/manage");
    } catch (err) {
      console.error("Error creating fundraiser:", err);
      
      if (err.response?.status === 404 && err.response?.data?.message?.includes("NGO profile")) {
        setError("You must create an NGO profile first before creating a fundraiser.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to create fundraisers. Your account must have NGO role.");
      } else if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => {
          localStorage.removeItem("authToken");
          navigate("/login");
        }, 2000);
      } else {
        setError(
          err.response?.data?.message || 
          err.message || 
          "Error creating fundraiser. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goToCreateNgoProfile = () => {
    navigate("/ngo/create");
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
      <div className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">Create Fundraiser</h2>
        
        {error && (
          <div className="p-4 mb-6 text-center text-red-400 bg-red-900 rounded-lg bg-opacity-20">
            <p className="mb-2">{error}</p>
            {error.includes("NGO profile") && (
              <button
                onClick={goToCreateNgoProfile}
                className="px-4 py-2 mt-2 font-medium bg-blue-600 rounded hover:bg-blue-700"
              >
                Create NGO Profile
              </button>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Goal (in INR)</label>
            <input
              type="number"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Image URL (optional)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </div>
              ) : (
                "Create Fundraiser"
              )}
            </button>
            <button
              type="button"
              className="px-4 py-2 font-semibold text-white bg-gray-600 rounded hover:bg-gray-500"
              onClick={() => navigate("/dashboard/fundraisers/manage")}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFundraiserPage;