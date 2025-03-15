import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHandsHelping, FaUsers, FaDonate } from "react-icons/fa";

const HomeContent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6 flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mt-10">
        <h1 className="text-5xl font-extrabold text-blue-700">Welcome to SamparkCircle</h1>
        <p className="text-gray-700 text-lg mt-4">
          Connecting NGOs, Volunteers, and Donors to make a difference.
        </p>
        <button
          className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>
      </div>
      
      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-6xl">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <FaHandsHelping className="text-green-500 text-5xl mb-4" />
          <h2 className="text-xl font-semibold">For NGOs</h2>
          <p className="text-gray-600">Create fundraisers, host events, and connect with donors.</p>
          <button
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            onClick={() => navigate("/signup?role=ngo")}
          >
            Join as NGO
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <FaUsers className="text-yellow-500 text-5xl mb-4" />
          <h2 className="text-xl font-semibold">For Volunteers</h2>
          <p className="text-gray-600">Find events and opportunities to contribute.</p>
          <button
            className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
            onClick={() => navigate("/signup?role=volunteer")}
          >
            Join as Volunteer
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <FaDonate className="text-blue-500 text-5xl mb-4" />
          <h2 className="text-xl font-semibold">For Donors</h2>
          <p className="text-gray-600">Support causes that matter to you.</p>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
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
