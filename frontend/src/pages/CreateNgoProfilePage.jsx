import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const CreateNgoProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  let emailCheckTimeout;
  
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    description: "",
    address: "",
    website: "",
    phone: "",
    logo: "",
  });

  // Check if user already has a profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      try {
        const userId = user?._id || user?.id;
        if (!userId) return;
        
        // Try to find NGO by user ID
        const res = await api.get(`/ngos/${userId}`);
        if (res.data && res.data.ngo) {
          // Profile already exists, redirect to view/edit
          navigate("/dashboard/profile");
        }
      } catch (err) {
        // 404 is expected if profile doesn't exist
        if (err.response && err.response.status !== 404) {
          console.error("Error checking for existing profile:", err);
        }
      }
    };
    
    checkExistingProfile();
  }, [user, navigate]);

  // Check if email is already in use by another NGO
  const checkEmailAvailability = async (email) => {
    try {
      // Fetch all NGOs
      const res = await api.get("/ngos");
      
      if (res.data && res.data.ngos) {
        // Check if any NGO uses this email
        const exists = res.data.ngos.some(ngo => ngo.email === email);
        return !exists; // Return true if email is available
      }
      return true; // Default to true if we can't verify
    } catch (err) {
      console.error("Error checking email availability:", err);
      return true; // Default to true if we can't verify
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // If the email field is changing, check availability
    if (name === 'email') {
      setIsEmailTaken(false); // Reset the state initially
      
      // Only check if email has a valid format
      if (value && value.includes('@')) {
        // Debounce this check to avoid too many API calls
        clearTimeout(emailCheckTimeout);
        emailCheckTimeout = setTimeout(async () => {
          const isAvailable = await checkEmailAvailability(value);
          setIsEmailTaken(!isAvailable);
        }, 500);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // First check if email is available
    if (isEmailTaken) {
      setError("An NGO with this email already exists. Please use a different email.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // Create NGO profile - sending the form data directly to /ngos endpoint
      console.log("Submitting NGO profile data:", formData);
      
      const res = await api.post("/ngos", formData);
      
      console.log("Profile creation response:", res.data);
      
      if (res.data && res.data.ngo) {
        alert("NGO profile created successfully!");
        navigate("/dashboard/profile");
      } else if (res.data && res.data.message) {
        alert(res.data.message);
        navigate("/dashboard/profile");
      } else {
        setError("Failed to create profile. Please try again.");
      }
    } catch (err) {
      console.error("Error creating NGO profile:", err);
      
      // Extract error message from response
      let errorMessage = "Failed to create profile. Please try again.";
      
      if (err.response) {
        console.log("Error status:", err.response.status);
        console.log("Error data:", err.response.data);
        
        if (err.response.status === 401) {
          errorMessage = "You are not authorized to create an NGO profile. Please ensure you have the NGO role.";
        } else if (err.response.status === 403) {
          errorMessage = "Permission denied. Only users with NGO role can create profiles.";
        } else if (err.response.status === 409) {
          errorMessage = "An NGO with this email already exists. Please use a different email.";
        } else if (err.response.status === 400 || err.response.status === 500) {
          // Check for duplicate key error messages
          if (err.response.data && err.response.data.error) {
            if (typeof err.response.data.error === 'string' && 
                (err.response.data.error.includes("duplicate") || 
                 err.response.data.error.toLowerCase().includes('duplicate'))) {
              errorMessage = "An NGO with this email already exists. Please use a different email.";
            } else {
              errorMessage = err.response.data.error;
            }
          } else if (err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the user doesn't have the NGO role, show an error
  if (user && user.role !== "ngo" && user.role !== "NGO") {
    return (
      <div className="min-h-screen p-8 text-white bg-gray-900">
        <div className="p-4 text-red-400 bg-red-900 bg-opacity-25 rounded">
          You don't have permission to create an NGO profile. This page is only for users with the NGO role.
        </div>
        <button 
          className="px-4 py-2 mt-4 text-white bg-blue-600 rounded"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold">Create NGO Profile</h1>
      
      {error && (
        <div className="p-4 mb-6 text-red-400 bg-red-900 bg-opacity-25 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block mb-2 font-medium">Organization Name *</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full p-3 text-white bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" 
            required
            placeholder="Enter your organization name"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Email Address *</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className={`w-full p-3 text-white bg-gray-800 border ${isEmailTaken ? 'border-red-500' : 'border-gray-700'} rounded focus:outline-none focus:border-blue-500`} 
            required
            placeholder="Enter contact email"
          />
          {isEmailTaken && (
            <p className="mt-1 text-sm text-red-400">This email is already in use by another NGO</p>
          )}
          <p className="mt-1 text-sm text-gray-400">Must be unique - no other NGO can use this email</p>
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Organization Description *</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            rows="4"
            className="w-full p-3 text-white bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" 
            required
            placeholder="Describe your organization's mission and activities"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Address *</label>
          <input 
            type="text" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            className="w-full p-3 text-white bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" 
            required
            placeholder="Enter your organization's address"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Website</label>
          <input 
            type="url" 
            name="website" 
            value={formData.website} 
            onChange={handleChange} 
            className="w-full p-3 text-white bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" 
            placeholder="https://www.example.org"
          />
          <p className="mt-1 text-sm text-gray-400">Optional: Include https:// in your URL</p>
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Phone Number *</label>
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            className="w-full p-3 text-white bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" 
            required
            placeholder="Enter contact phone number"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Logo URL</label>
          <input 
            type="url" 
            name="logo" 
            value={formData.logo} 
            onChange={handleChange} 
            className="w-full p-3 text-white bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500" 
            placeholder="https://example.com/your-logo.png"
          />
          <p className="mt-1 text-sm text-gray-400">Optional: URL to your organization's logo</p>
        </div>
        
        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting || isEmailTaken}
            className={`px-6 py-3 font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${(isSubmitting || isEmailTaken) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 font-medium text-white bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNgoProfilePage;