import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "volunteer",
    profileImage: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Use port 3000 for backend
      const BASE_URL = "http://localhost:3000";
      const endpoint = type === "login" ? "login" : "signup";
      const url = `${BASE_URL}/api/auth/${endpoint}`;
      
      console.log("Sending request to:", url);
      
      // Prepare the request payload based on the form type
      const payload = type === "signup"
        ? { 
            name: formData.name, 
            email: formData.email, 
            password: formData.password, 
            role: formData.role 
          }
        : { 
            email: formData.email, 
            password: formData.password 
          };
  
      console.log("Request payload:", payload);
      
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" }
      });
  
      console.log("Response Data:", response.data);
      
      // Store user data in Redux
      dispatch(login(response.data));
  
      // Navigate based on success
      if (type === "login") {
        navigate("/dashboard");
      } else {
        // Show success message and redirect to login
        alert("Signup successful! Please login with your credentials.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Auth Error:", err);
      
      // Handle different types of errors
      if (err.response) {
        // The server responded with an error status
        console.error("Server Error Response:", err.response.data);
        setError(err.response.data.msg || err.response.data.error || "Server error. Please try again.");
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setError("No response from server. Please check your connection and make sure the backend is running on port 3000.");
      } else {
        // Something else caused the error
        console.error("Error:", err.message);
        setError(`Connection error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">
          {type === "login" ? "Login" : "Sign Up"}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">{error}</p>}
        <form onSubmit={handleSubmit}>
          {type === "signup" && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md mb-3"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md mb-3"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md mb-3"
            required
          />
          {type === "signup" && (
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md mb-3"
              required
            >
              <option value="ngo">NGO</option>
              <option value="volunteer">Volunteer</option>
              <option value="donor">Donor</option>
            </select>
          )}
          {type === "signup" && (
            <input
              type="text"
              name="profileImage"
              placeholder="Profile Image URL (optional)"
              value={formData.profileImage}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md mb-3"
            />
          )}
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (type === "login" ? "Login" : "Sign Up")}
          </button>
        </form>
        <div className="mt-4 text-sm">
          {type === "login" ? (
            <p>
              Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
            </p>
          ) : (
            <p>
              Already have an account? <a href="/login" className="text-blue-500">Login</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;