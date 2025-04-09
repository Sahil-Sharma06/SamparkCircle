import React, { useState } from "react";
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    // Debug: Check token from localStorage
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    console.log("Token found:", token);
  
    try {
      const response = await api.post("/fundraisers", {
        title: formData.title,
        description: formData.description,
        goal: Number(formData.goal),
        image: formData.image,
      });
      alert("Fundraiser created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating fundraiser:", err);
      setError("Error creating fundraiser. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
      <div className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">Create Fundraiser</h2>
        {error && <p className="mb-4 text-red-400">{error}</p>}
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
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Fundraiser"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFundraiserPage;
