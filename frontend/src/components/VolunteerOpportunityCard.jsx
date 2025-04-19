import React from "react";
import { jwtDecode } from "jwt-decode";

export default function OpportunityCard({ opportunity, onDelete }) {
  const isNgo = () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return false;
      
      const decoded = jwtDecode(token);
      return decoded.role?.toLowerCase() === "ngo";
    } catch (err) {
      console.error("Error checking user role:", err);
      return false;
    }
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="overflow-hidden transition-shadow duration-300 bg-gray-800 hover:shadow-xl rounded-2xl">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-white">{opportunity.title}</h2>
          {isNgo() && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(opportunity._id);
              }}
              className="p-1 text-red-400 hover:text-red-500"
              aria-label="Delete opportunity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
        
        <div className="mb-4">
          <span className="inline-block px-3 py-1 mb-2 mr-2 text-xs font-semibold text-green-600 uppercase bg-green-100 rounded-full">
            {opportunity.location}
          </span>
          <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold text-blue-600 uppercase bg-blue-100 rounded-full">
            Posted: {formatDate(opportunity.createdAt)}
          </span>
        </div>
        
        <p className="mb-4 text-gray-300">{opportunity.description}</p>
        
        {opportunity.requirements && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-200">Requirements:</h3>
            <p className="text-sm text-gray-400">{opportunity.requirements}</p>
          </div>
        )}
        
        {!isNgo() && (
          <div className="pt-2 mt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Click to apply for this opportunity
            </p>
          </div>
        )}
      </div>
    </div>
  );
}