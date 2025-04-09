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
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const ngoId = user._id ? user._id : user.id;
        console.log("Fetching profile for NGO ID:", ngoId);
        const res = await api.get(`/ngos/${ngoId}`);
        console.log("Profile response:", res.data);
        if (!res.data.ngo) {
          setError("NGO profile not found. Please create your profile.");
        } else {
          setProfile(res.data.ngo);
          setFormData({
            name: res.data.ngo.name || "",
            email: res.data.ngo.email || "",
            description: res.data.ngo.description || "",
            address: res.data.ngo.address || "",
            website: res.data.ngo.website || "",
            phone: res.data.ngo.phone || "",
            logo: res.data.ngo.logo || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response && err.response.status === 404) {
          setError("NGO profile not found. Please create your profile.");
        } else {
          setError("Failed to load profile. Please try again.");
        }
      }
    };

    if (user && (user._id || user.id)) {
      fetchProfile();
    } else {
      console.log("User not available in state:", user);
      setError("User not found. Please log in again.");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ngoId = profile && (profile._id || profile.id) ? (profile._id || profile.id) : (user._id || user.id);
      const res = await api.put(`/ngos/${ngoId}`, formData);
      setProfile(res.data.ngo);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  };

  if (error)
    return (
      <div className="p-8 text-red-400">
        {error}
        {error.includes("not found") && (
          <button
            className="px-4 py-2 mt-4 bg-blue-600 rounded"
            onClick={() => navigate("/dashboard/profile/create")}
          >
            Create Profile
          </button>
        )}
      </div>
    );

  if (!profile) return <div className="p-8 text-white">Loading profile...</div>;

  return (
    <div className="min-h-screen p-8 text-white bg-gray-900">
      <h1 className="mb-4 text-3xl font-bold">NGO Profile</h1>
      {!editMode ? (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Description:</strong> {profile.description}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>Website:</strong> {profile.website}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          {profile.logo && <img src={profile.logo} alt="Logo" className="w-32 h-32 mt-4" />}
          <button 
            onClick={() => setEditMode(true)}
            className="px-4 py-2 mt-4 bg-blue-600 rounded"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-gray-800 border rounded" required/>
          </div>
          <div>
            <label className="block">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 bg-gray-800 border rounded" required/>
          </div>
          <div>
            <label className="block">Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 bg-gray-800 border rounded" required/>
          </div>
          <div>
            <label className="block">Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 bg-gray-800 border rounded" required/>
          </div>
          <div>
            <label className="block">Website:</label>
            <input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full p-2 bg-gray-800 border rounded"/>
          </div>
          <div>
            <label className="block">Phone:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 bg-gray-800 border rounded" required/>
          </div>
          <div>
            <label className="block">Logo URL:</label>
            <input type="text" name="logo" value={formData.logo} onChange={handleChange} className="w-full p-2 bg-gray-800 border rounded"/>
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="px-4 py-2 bg-green-600 rounded">Save</button>
            <button type="button" onClick={() => setEditMode(false)} className="px-4 py-2 bg-red-600 rounded">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NgoProfilePage;
