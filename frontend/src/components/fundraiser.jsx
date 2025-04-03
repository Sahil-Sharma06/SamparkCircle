import React, { useState } from "react";
import { Link } from "react-router-dom";

const fundraisers = [
  {
    id: 1,
    title: "Education for Underprivileged Kids",
    description: "Help provide books and online classes for children in need.",
    goal: 50000,
    raised: 32000,
  },
  {
    id: 2,
    title: "Medical Aid for Cancer Patients",
    description: "Support cancer patients with necessary medical treatments.",
    goal: 100000,
    raised: 75000,
  },
  {
    id: 3,
    title: "Rebuild Homes After Floods",
    description: "Assist families affected by floods in rebuilding their homes.",
    goal: 80000,
    raised: 46000,
  },
];

const FundraisersPage = () => {
  const [userRole] = useState("donor"); // Change to "ngo" to test NGO features

  return (
    <div className="min-h-screen px-6 py-10 text-white bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Fundraisers</h1>
          {userRole === "ngo" && (
            <Link
              to="/dashboard/fundraisers/create"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              + Create Fundraiser
            </Link>
          )}
        </div>

        {/* Fundraiser Listings */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {fundraisers.map((fundraiser) => (
            <div key={fundraiser.id} className="p-5 bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{fundraiser.title}</h2>
              <p className="mt-2 text-sm text-gray-400">{fundraiser.description}</p>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>₹{fundraiser.raised} raised</span>
                  <span>Goal: ₹{fundraiser.goal}</span>
                </div>
                <div className="w-full h-2 mt-2 bg-gray-700 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${(fundraiser.raised / fundraiser.goal) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Donate Button */}
              {userRole === "donor" && (
                <button className="w-full py-2 mt-4 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                  Donate Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FundraisersPage;
