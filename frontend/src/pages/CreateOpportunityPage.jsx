import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
const CreateOpportunityPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = () => {
      const storedToken = localStorage.getItem("authToken");
  
      console.log("🧪 Raw token from localStorage:", storedToken);
  
      if (!storedToken || storedToken === "undefined" || storedToken === null) {
        setMessage("You must be logged in as an NGO to create an opportunity.");
        return;
      }
  
      try {
        const decoded = jwtDecode(storedToken);
        console.log("✅ Decoded token:", decoded);
  
        if (decoded.role?.toLowerCase() !== "ngo") {
          setMessage("Only NGO accounts can create opportunities.");
        } else {
          setToken(storedToken); // ✅ success
        }
      } catch (err) {
        console.error("❌ Failed to decode token:", err);
        setMessage("Invalid token. Please login again.");
      }
    };
  
    // Try immediately
    loadToken();
  
    // Fallback if loaded too early
    window.addEventListener("load", loadToken);
  
    return () => {
      window.removeEventListener("load", loadToken);
    };
  }, []);
  
  

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Missing authentication token.");
      return;
    }

    setLoading(true);
    setMessage("");

    console.log("📦 Submitting Opportunity:", formData);
    console.log("🔐 Token:", token);

    try {
      const res = await fetch("http://localhost:3000/api/volunteer/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Matching backend expectation
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Opportunity created successfully!");
        setTimeout(() => navigate("/dashboard/volunteer-opportunities"), 1500);
      } else {
        setMessage(data.msg || data.message || "❌ Failed to create opportunity.");
      }
    } catch (err) {
      console.error("🚨 Submission Error:", err);
      setMessage("Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 text-white bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-center">Create Volunteer Opportunity</h1>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-gray-800 rounded-lg shadow-lg">
          <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />
          <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} required />
          <Input label="Requirements" name="requirements" value={formData.requirements} onChange={handleChange} />
          <Input label="Location" name="location" value={formData.location} onChange={handleChange} required />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Opportunity"}
          </button>

          {message && <p className="mt-3 text-sm text-center text-red-400">{message}</p>}
        </form>
      </div>
    </div>
  );
};

// 🔧 Reusable Input
const Input = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2 bg-gray-700 rounded outline-none focus:ring"
    />
  </div>
);

// 🔧 Reusable Textarea
const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <textarea
      rows={4}
      {...props}
      className="w-full px-4 py-2 bg-gray-700 rounded outline-none focus:ring"
    />
  </div>
);

export default CreateOpportunityPage;
