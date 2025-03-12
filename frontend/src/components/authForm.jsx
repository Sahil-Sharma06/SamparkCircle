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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const BASE_URL = "http://localhost:8000";
      const url = type === "login" ? `${BASE_URL}/api/auth/login` : `${BASE_URL}/api/auth/signup`;
      
      // ✅ Ensure correct request body format
      const payload = type === "signup"
        ? { name: formData.name, email: formData.email, password: formData.password, role: formData.role }
        : { email: formData.email, password: formData.password };
  
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" }
      });
  
      console.log("Response Data:", response.data);
      dispatch(login(response.data));
  
      if (type === "login") {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup/Login Error:", err.response?.data);
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">
          {type === "login" ? "Login" : "Sign Up"}
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          {type === "signup" && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md mb-2"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md mb-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md mb-2"
            required
          />
          {type === "signup" && (
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md mb-2"
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
              className="w-full px-4 py-2 border rounded-md mb-2"
            />
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            {type === "login" ? "Login" : "Sign Up"}
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