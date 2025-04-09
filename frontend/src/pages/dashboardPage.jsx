import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaHandHoldingHeart, FaCalendarAlt } from "react-icons/fa";

const DashboardPage = () => {
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
      <div className="text-center">
        <h1 className="text-4xl font-semibold">
          {greeting}, {user?.name || "User"}!
        </h1>
        <p className="mt-2 text-lg">
          Role: <span className="font-medium">{role}</span>
        </p>
      </div>
      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 mt-12 md:grid-cols-3">
        {role.toLowerCase() === "ngo" && (
          <DashboardCard
            icon={<FaHandHoldingHeart className="text-5xl" />}
            title="Manage Fundraisers"
            description="Create and track your fundraising campaigns."
            buttonText="Create Fundraiser"
            buttonAction={() => navigate("/dashboard/fundraisers/create")}
          />
        )}
        {role.toLowerCase() === "donor" && (
          <DashboardCard
            icon={<FaUsers className="text-5xl" />}
            title="Browse Fundraisers"
            description="Support causes that matter to you."
            buttonText="Browse Fundraisers"
            buttonAction={() => navigate("/dashboard/fundraisers")}
          />
        )}
        {role.toLowerCase() === "volunteer" && (
          <DashboardCard
            icon={<FaCalendarAlt className="text-5xl" />}
            title="Join Events"
            description="Find and participate in volunteer events."
            buttonText="View Events"
            buttonAction={() => navigate("/dashboard/events")}
          />
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, description, buttonText, buttonAction }) => {
  return (
    <div className="p-6 transition duration-300 transform bg-gray-800 bg-opacity-50 rounded-xl hover:scale-105 hover:bg-opacity-70">
      <div className="flex flex-col items-center text-center">
        {icon}
        <h2 className="mt-4 text-xl font-medium">{title}</h2>
        <p className="mt-2 text-sm">{description}</p>
        <button
          className="px-5 py-2 mt-4 text-gray-200 bg-gray-700 rounded-lg hover:bg-gray-600"
          onClick={buttonAction}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
