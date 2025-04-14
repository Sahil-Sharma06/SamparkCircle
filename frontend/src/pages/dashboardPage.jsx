import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaHandHoldingHeart,
  FaCalendarAlt,
  FaUserEdit,
  FaChartBar,
  FaDonate,
  FaPlusCircle,
  FaInbox
} from "react-icons/fa";

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
  const lowerRole = role.toLowerCase();

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

      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {lowerRole === "ngo" && (
          <>
            <DashboardCard
              icon={<FaUserEdit className="text-5xl" />}
              title="Manage Profile"
              description="View and update your NGO profile."
              buttonText="Edit Profile"
              buttonAction={() => navigate("/dashboard/profile")}
            />
            <DashboardCard
              icon={<FaHandHoldingHeart className="text-5xl" />}
              title="Create Fundraiser"
              description="Start a new fundraising campaign."
              buttonText="Create Fundraiser"
              buttonAction={() => navigate("/dashboard/fundraisers/create")}
            />
            <DashboardCard
              icon={<FaChartBar className="text-5xl" />}
              title="Manage Fundraisers"
              description="Edit or delete your existing campaigns."
              buttonText="View Fundraisers"
              buttonAction={() => navigate("/dashboard/fundraisers/manage")}
            />
            <DashboardCard
              icon={<FaDonate className="text-5xl" />}
              title="Donation History"
              description="View donations made to your campaigns."
              buttonText="View Donations"
              buttonAction={() => navigate("/dashboard/donations")}
            />
            <DashboardCard
              icon={<FaChartBar className="text-5xl" />}
              title="Analytics"
              description="See insights and performance metrics."
              buttonText="View Analytics"
              buttonAction={() => navigate("/dashboard/analytics")}
            />
            <DashboardCard
              icon={<FaUsers className="text-5xl" />}
              title="Volunteer Opportunities"
              description="Manage volunteer postings and applications."
              buttonText="Manage Opportunities"
              buttonAction={() => navigate("/dashboard/volunteer-opportunities")}
            />
            <DashboardCard
              icon={<FaPlusCircle className="text-5xl" />}
              title="Create Opportunity"
              description="Publish a new volunteer opportunity."
              buttonText="Create Opportunity"
              buttonAction={() => navigate("/dashboard/volunteer-opportunities/create")}
            />
            <DashboardCard
              icon={<FaInbox className="text-5xl" />}
              title="View Applications"
              description="Review applications received for opportunities."
              buttonText="View Applications"
              buttonAction={() => navigate("/dashboard/volunteer-applications")}
            />
          </>
        )}

        {lowerRole === "donor" && (
          <DashboardCard
            icon={<FaHandHoldingHeart className="text-5xl" />}
            title="Browse Fundraisers"
            description="Support causes that matter to you."
            buttonText="Browse Fundraisers"
            buttonAction={() => navigate("/dashboard/fundraisers")}
          />
        )}

        {lowerRole === "volunteer" && (
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
        <p className="mt-2 text-sm text-gray-400">{description}</p>
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
