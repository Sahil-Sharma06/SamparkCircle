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
    profileImage: "",
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
      const BASE_URL = "http://localhost:3000";
      const endpoint = type === "login" ? "login" : "signup";
      const url = `${BASE_URL}/api/auth/${endpoint}`;

      const payload =
        type === "signup"
          ? {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              role: formData.role,
            }
          : {
              email: formData.email,
              password: formData.password,
            };

      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      dispatch(login(response.data));

      if (type === "login") {
        navigate("/dashboard");
      } else {
        alert("Signup successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || "Server error. Please try again.");
      } else if (err.request) {
        setError("No response from server. Check your connection.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen text-gray-300 bg-gray-950">
      <div className="p-8 bg-gray-900 rounded-lg shadow-lg w-96">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          {type === "login" ? "Login" : "Sign Up"}
        </h2>

        {error && (
          <p className="p-2 mb-4 text-sm text-red-300 bg-red-800 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {type === "signup" && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-3 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-3 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-3 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          {type === "signup" && (
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-3 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select role</option>
              <option value="NGO">NGO</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Donor">Donor</option>
            </select>
          )}
          {type === "signup" && (
            <input
              type="text"
              name="profileImage"
              placeholder="Profile Image URL (optional)"
              value={formData.profileImage}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-3 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          )}
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-md font-semibold transition-all hover:bg-blue-500 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : type === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-400">
          {type === "login" ? (
            <p>
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </a>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
