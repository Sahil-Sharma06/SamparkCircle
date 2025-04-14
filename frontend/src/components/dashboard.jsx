import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaUserEdit,
  FaHandHoldingHeart,
  FaDollarSign,
  FaChartLine,
  FaUsers
} from "react-icons/fa";

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
          Role: <span className="font-medium text-gray-300">{role.toUpperCase()}</span>
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {role === "ngo" && (
          <>
            <DashboardCard
              icon={<FaUserEdit className="text-5xl text-gray-300" />}
              title="Manage Profile"
              description="View and update your NGO profile."
              buttonText="Edit Profile"
              buttonAction={() => navigate("/dashboard/profile")}
            />

            <DashboardCard
              icon={<FaHandHoldingHeart className="text-5xl text-gray-300" />}
              title="Manage Fundraisers"
              description="Create and track your fundraising campaigns."
              buttonText="Create Fundraiser"
              buttonAction={() => navigate("/dashboard/fundraisers/create")}
            />

            <DashboardCard
              icon={<FaDollarSign className="text-5xl text-gray-300" />}
              title="Donation History"
              description="View donations made to your campaigns."
              buttonText="View Donations"
              buttonAction={() => navigate("/dashboard/donations")}
            />

            <DashboardCard
              icon={<FaChartLine className="text-5xl text-gray-300" />}
              title="Analytics"
              description="See insights and performance metrics."
              buttonText="View Analytics"
              buttonAction={() => navigate("/dashboard/analytics")}
            />

            <DashboardCard
              icon={<FaUsers className="text-5xl text-gray-300" />}
              title="Volunteer Opportunities"
              description="Manage volunteer postings and applications."
              buttonText="Manage Opportunities"
              buttonAction={() => navigate("/dashboard/volunteer-opportunities")}
            />
          </>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, description, buttonText, buttonAction }) => {
  return (
    <div className="relative p-6 transition duration-300 transform bg-gray-800 shadow-lg rounded-xl hover:scale-105">
      <div className="flex flex-col items-center text-center">
        {icon}
        <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm text-gray-400">{description}</p>
        <button
          className="px-5 py-2 mt-4 text-sm font-medium text-white transition bg-gray-700 rounded-lg hover:bg-gray-600"
          onClick={buttonAction}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
