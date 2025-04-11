import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NgoProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    address: "",
    website: "",
    phone: "",
    logo: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Extract user ID, ensuring we handle both _id and id formats
        const userId = user?._id || user?.id;
        
        if (!userId) {
          setError("User ID not found. Please log in again.");
          setIsLoading(false);
          return;
        }
        
        console.log("Fetching NGO profiles for user ID:", userId);
        
        // First, fetch all NGOs to find the one created by this user
        try {
          const allNgosRes = await api.get("/ngos");
          
          if (allNgosRes.data && allNgosRes.data.ngos) {
            // Find the NGO where createdBy matches the current user's ID
            const userNgo = allNgosRes.data.ngos.find(
              ngo => ngo.createdBy === userId || ngo.createdBy?._id === userId
            );
            
            if (userNgo) {
              console.log("Found NGO profile:", userNgo);
              setProfile(userNgo);
              setFormData({
                name: userNgo.name || "",
                email: userNgo.email || "",
                description: userNgo.description || "",
                address: userNgo.address || "",
                website: userNgo.website || "",
                phone: userNgo.phone || "",
                logo: userNgo.logo || "",
              });
            } else {
              // No NGO found for this user
              console.log("No NGO profile found for this user");
              setError("NGO profile not found. Please create your profile.");
            }
          } else {
            setError("Failed to retrieve NGO profiles.");
          }
        } catch (err) {
          console.error("Error fetching NGOs:", err);
          setError(`Failed to load profiles: ${err.response?.data?.message || err.message}`);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      console.log("User not available in state:", user);
      setError("User not found. Please log in again.");
      setIsLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ngoId = profile?._id;
      
      if (!ngoId) {
        setError("NGO ID not found. Cannot update profile.");
        return;
      }
      
      const res = await api.put(`/ngos/${ngoId}`, formData);
      setProfile(res.data.ngo);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      
      let errorMessage = "Failed to update profile.";
      
      if (err.response) {
        console.log("Error status:", err.response.status);
        console.log("Error data:", err.response.data);
        
        if (err.response.status === 409) {
          errorMessage = "An NGO with this email already exists. Please use a different email.";
        } else if (err.response.data && (err.response.data.error || err.response.data.message)) {
          errorMessage = err.response.data.error || err.response.data.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  if (isLoading) return <div className="p-8 text-white">Loading profile...</div>;

  if (error)
    return (
      <div className="min-h-screen p-8 text-white bg-gray-900">
        <div className="p-4 mb-6 text-red-400 bg-red-900 bg-opacity-25 rounded">
          {error}
        </div>
        {error.includes("not found") && (
          <button
            className="px-4 py-2 mt-4 text-white bg-blue-600 rounded"
            onClick={() => navigate("/dashboard/profile/create")}
          >
            Create Profile
          </button>
        )}
        <button
          className="px-4 py-2 mt-4 ml-4 text-white bg-gray-600 rounded"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );

  if (!profile) return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <div className="p-4 mb-6 bg-yellow-900 bg-opacity-25 rounded">
        No NGO profile found. Please create a profile to continue.
      </div>
      <button
        className="px-4 py-2 mt-4 text-white bg-blue-600 rounded"
        onClick={() => navigate("/dashboard/profile/create")}
      >
        Create Profile
      </button>
    </div>
  );

  return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold">NGO Profile</h1>
      
      {error && (
        <div className="p-4 mb-6 text-red-400 bg-red-900 bg-opacity-25 rounded">
          {error}
        </div>
      )}
      
      {!editMode ? (
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-4"><span className="font-semibold text-gray-400">Organization Name:</span><br/> {profile.name}</p>
              <p className="mb-4"><span className="font-semibold text-gray-400">Email:</span><br/> {profile.email}</p>
              <p className="mb-4"><span className="font-semibold text-gray-400">Phone:</span><br/> {profile.phone}</p>
              <p className="mb-4"><span className="font-semibold text-gray-400">Address:</span><br/> {profile.address}</p>
            </div>
            <div>
              <p className="mb-4"><span className="font-semibold text-gray-400">Website:</span><br/> 
                {profile.website ? (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {profile.website}
                  </a>
                ) : (
                  "Not specified"
                )}
              </p>
              <p className="mb-4"><span className="font-semibold text-gray-400">Verification Status:</span><br/> 
                {profile.verified ? 
                  <span className="px-2 py-1 text-sm text-green-900 bg-green-200 rounded">Verified</span> : 
                  <span className="px-2 py-1 text-sm text-yellow-900 bg-yellow-200 rounded">Pending Verification</span>
                }
              </p>
              {profile.logo && (
                <div className="mb-4">
                  <p className="mb-2 font-semibold text-gray-400">Logo:</p>
                  <img src={profile.logo} alt="Organization Logo" className="object-contain w-32 h-32 border border-gray-700 rounded" />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <p className="font-semibold text-gray-400">Organization Description:</p>
            <p className="p-4 mt-2 bg-gray-700 rounded">{profile.description}</p>
          </div>
          
          <button 
            onClick={() => setEditMode(true)}
            className="px-4 py-2 mt-6 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-gray-800 rounded-lg shadow-lg">
          <div>
            <label className="block mb-2 font-medium">Organization Name:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full p-3 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500" 
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Email:</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full p-3 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500" 
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Description:</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="4"
              className="w-full p-3 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500" 
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Address:</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              className="w-full p-3 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500" 
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Website:</label>
            <input 
              type="url" 
              name="website" 
              value={formData.website} 
              onChange={handleChange} 
              className="w-full p-3 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500" 
              placeholder="https://www.example.org"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Phone:</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="w-full p-3 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500" 
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Logo URL:</label>
            <input 
              type="url" 
              name="logo" 
              value={formData.logo} 
              onChange={handleChange} 
              className="w-full p-3 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500" 
              placeholder="https://example.com/your-logo.png"
            />
          </div>
          <div className="flex pt-4 space-x-4">
            <button 
              type="submit" 
              className="px-6 py-3 font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Save Changes
            </button>
            <button 
              type="button" 
              onClick={() => {
                setEditMode(false);
                setError("");
                // Reset form data to original profile data
                setFormData({
                  name: profile.name || "",
                  email: profile.email || "",
                  description: profile.description || "",
                  address: profile.address || "",
                  website: profile.website || "",
                  phone: profile.phone || "",
                  logo: profile.logo || "",
                });
              }} 
              className="px-6 py-3 font-medium text-white bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NgoProfilePage;