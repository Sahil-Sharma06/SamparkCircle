import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaHandHoldingHeart, FaCalendarAlt, FaChartBar } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const role = user?.role || "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Welcome, {user?.name || "User"}!</h1>
        <p className="text-gray-700 mb-6 text-lg">Role: <span className="font-semibold text-blue-600">{role}</span></p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {role === "ngo" && (
            <div className="bg-white p-8 shadow-xl rounded-lg flex flex-col items-center text-center transform transition duration-300 hover:scale-105">
              <FaHandHoldingHeart className="text-green-500 text-5xl mb-4" />
              <h2 className="text-2xl font-semibold">Manage Fundraisers</h2>
              <p className="text-gray-500 mb-4">Create and track your fundraising campaigns.</p>
              <button
                className="bg-green-500 text-white py-3 px-5 rounded-lg hover:bg-green-600"
                onClick={() => navigate("/dashboard/fundraisers/create")}
              >
                Create Fundraiser
              </button>
            </div>
          )}
          {role === "donor" && (
            <div className="bg-white p-8 shadow-xl rounded-lg flex flex-col items-center text-center transform transition duration-300 hover:scale-105">
              <FaUsers className="text-yellow-500 text-5xl mb-4" />
              <h2 className="text-2xl font-semibold">Browse Fundraisers</h2>
              <p className="text-gray-500 mb-4">Support causes that matter to you.</p>
              <button
                className="bg-yellow-500 text-white py-3 px-5 rounded-lg hover:bg-yellow-600"
                onClick={() => navigate("/dashboard/fundraisers")}
              >
                Browse Fundraisers
              </button>
            </div>
          )}
          {role === "volunteer" && (
            <div className="bg-white p-8 shadow-xl rounded-lg flex flex-col items-center text-center transform transition duration-300 hover:scale-105">
              <FaCalendarAlt className="text-blue-500 text-5xl mb-4" />
              <h2 className="text-2xl font-semibold">Join Events</h2>
              <p className="text-gray-500 mb-4">Find and participate in volunteer events.</p>
              <button
                className="bg-blue-500 text-white py-3 px-5 rounded-lg hover:bg-blue-600"
                onClick={() => navigate("/dashboard/events")}
              >
                View Events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
