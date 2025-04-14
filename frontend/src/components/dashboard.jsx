import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaHandHoldingHeart, FaCalendarAlt, FaChartLine } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  if (!user) {
    navigate("/login");
    return null;
  }

  const role = user?.role || "Unknown";

  return (
    <div className="flex flex-col items-center min-h-screen p-8 text-gray-200 bg-gray-900">
      {/* Greeting Header */}
      <div className="text-center">
        <h1 className="text-4xl font-semibold">{greeting}, {user?.name || "User"}!</h1>
        <p className="mt-2 text-lg text-gray-400">
          Role: <span className="font-medium text-gray-300">{role}</span>
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 mt-12 md:grid-cols-3">
        {role === "ngo" && (
          <>
            <DashboardCard
              icon={<FaHandHoldingHeart className="text-5xl text-gray-300" />}
              title="Manage Fundraisers"
              description="Create and track your fundraising campaigns."
              buttonText="Create Fundraiser"
              buttonAction={() => navigate("/dashboard/fundraisers/create")}
            />
            
            <DashboardCard
              icon={<FaChartLine className="text-5xl text-gray-300" />}
              title="Donation Analytics"
              description="View detailed metrics about your donations and campaigns."
              buttonText="View Analytics"
              buttonAction={() => navigate("/dashboard/analytics")}
            />
          </>
        )}

        {role === "donor" && (
          <DashboardCard
            icon={<FaUsers className="text-5xl text-gray-300" />}
            title="Browse Fundraisers"
            description="Support causes that matter to you."
            buttonText="Browse Fundraisers"
            buttonAction={() => navigate("/dashboard/fundraisers")}
          />
        )}

        {role === "volunteer" && (
          <DashboardCard
            icon={<FaCalendarAlt className="text-5xl text-gray-300" />}
            title="Join Events"
            description="Find and participate in volunteer events."
            buttonText="View Events"
            buttonAction={() => navigate("/dashboard/events")}
          />
        )}
        
        {role === "admin" && (
          <DashboardCard
            icon={<FaChartLine className="text-5xl text-gray-300" />}
            title="Platform Analytics"
            description="View global donation analytics and performance metrics."
            buttonText="View Analytics"
            buttonAction={() => navigate("/dashboard/admin/analytics")}
          />
        )}
      </div>
    </div>
  );
};

// 🔹 Reusable Dashboard Card Component
const DashboardCard = ({ icon, title, description, buttonText, buttonAction }) => {
  return (
    <div className="relative p-6 transition duration-300 transform bg-gray-800 bg-opacity-50 shadow-lg backdrop-blur-lg rounded-xl hover:scale-105 hover:bg-opacity-70">
      <div className="flex flex-col items-center text-center">
        {icon}
        <h2 className="mt-4 text-xl font-medium text-gray-100">{title}</h2>
        <p className="mt-2 text-sm text-gray-400">{description}</p>
        <button
          className="px-5 py-2 mt-4 text-gray-200 transition-all duration-300 bg-gray-700 rounded-lg hover:bg-gray-600"
          onClick={buttonAction}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;