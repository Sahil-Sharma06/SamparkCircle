import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHandsHelping, FaUsers, FaDonate } from "react-icons/fa";

const HomeContent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen p-6 text-gray-300 bg-gray-950">
      {/* Hero Section */}
      <div className="max-w-4xl mt-16 text-center">
        <h1 className="text-5xl font-extrabold text-white">Welcome to SamparkCircle</h1>
        <p className="mt-4 text-lg text-gray-400">
          Connecting NGOs, Volunteers, and Donors to make a difference.
        </p>
        <button
          className="px-6 py-3 mt-6 text-lg font-semibold text-white transition bg-gray-800 rounded-lg hover:bg-gray-700"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <div className="grid max-w-6xl grid-cols-1 gap-8 mt-16 md:grid-cols-3">
        {/* NGO Card */}
        <div className="flex flex-col items-center p-6 text-center transition bg-gray-900 rounded-lg shadow-md hover:opacity-90">
          <FaHandsHelping className="mb-4 text-5xl text-green-400" />
          <h2 className="text-xl font-semibold text-white">For NGOs</h2>
          <p className="text-gray-400">Create fundraisers, host events, and connect with donors.</p>
          <button
            className="px-4 py-2 mt-4 text-white bg-gray-800 rounded-lg hover:bg-gray-700"
            onClick={() => navigate("/signup?role=ngo")}
          >
            Join as NGO
          </button>
        </div>

        {/* Volunteer Card */}
        <div className="flex flex-col items-center p-6 text-center transition bg-gray-900 rounded-lg shadow-md hover:opacity-90">
          <FaUsers className="mb-4 text-5xl text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">For Volunteers</h2>
          <p className="text-gray-400">Find events and opportunities to contribute.</p>
          <button
            className="px-4 py-2 mt-4 text-white bg-gray-800 rounded-lg hover:bg-gray-700"
            onClick={() => navigate("/signup?role=volunteer")}
          >
            Join as Volunteer
          </button>
        </div>

        {/* Donor Card */}
        <div className="flex flex-col items-center p-6 text-center transition bg-gray-900 rounded-lg shadow-md hover:opacity-90">
          <FaDonate className="mb-4 text-5xl text-blue-400" />
          <h2 className="text-xl font-semibold text-white">For Donors</h2>
          <p className="text-gray-400">Support causes that matter to you.</p>
          <button
            className="px-4 py-2 mt-4 text-white bg-gray-800 rounded-lg hover:bg-gray-700"
            onClick={() => navigate("/signup?role=donor")}
          >
            Join as Donor
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
