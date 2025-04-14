import React from 'react';
import { formatDistance } from 'date-fns';
import { jwtDecode } from 'jwt-decode';

const OpportunityCard = ({ opportunity, onDelete }) => {
  // Get user role and ID from token
  const token = localStorage.getItem('token');
  let user = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      user = { id: decoded.id, role: decoded.role };
    } catch (err) {
      console.error('Token decode failed', err);
    }
  }

  const postedDate = new Date(opportunity.createdAt);
  const timeAgo = formatDistance(postedDate, new Date(), { addSuffix: true });

  // Fix ObjectId vs string issue (handles both string and populated object)
  const postedById =
    typeof opportunity.postedBy === 'object'
      ? opportunity.postedBy._id
      : opportunity.postedBy;

  const showControls = user?.role === 'ngo' && user?.id === postedById?.toString();

  return (
    <div className="overflow-hidden transition-transform bg-gray-800 rounded-lg shadow-md hover:transform hover:scale-102 hover:shadow-lg">
      <div className="flex flex-col justify-between h-full p-6">
        <div>
          <h3 className="mb-2 text-xl font-semibold text-white">{opportunity.title}</h3>
          <p className="mb-4 text-gray-300 line-clamp-2">{opportunity.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center text-gray-400">
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {opportunity.location}
            </div>
            <div className="flex items-center text-gray-400">
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {timeAgo}
            </div>
          </div>
        </div>

        {showControls && (
          <div className="flex gap-4 pt-4 mt-auto border-t border-gray-700">
            <button
              onClick={() => alert("Edit button clicked")} // You can replace this with a modal or inline form later
              className="px-4 py-2 text-sm font-medium text-yellow-400 border border-yellow-400 rounded hover:bg-yellow-500 hover:text-black"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(opportunity._id)}
              className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded hover:bg-red-600 hover:text-white"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;
