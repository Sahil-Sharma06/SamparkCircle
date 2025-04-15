import React from "react";
import { useNavigate } from "react-router-dom";

const FundraiserCard = ({ fundraiser, onUpdate }) => {
  const { title, description, goal, amountRaised, image, _id } = fundraiser;
  const navigate = useNavigate();

  const handleDonate = () => {
    navigate(`/donate/${_id}`);
  };

  // Calculate progress percentage with a max of 100%
  const progressPercentage = Math.min(
    ((amountRaised || 0) / goal) * 100, 
    100
  );
  
  // Check if fundraiser goal has been reached
  const isCompleted = (amountRaised || 0) >= goal;

  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-gray-800 rounded-lg shadow-md">
      {/* Completion overlay - shown only when goal is reached */}
      {isCompleted && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-green-900 bg-opacity-80">
          <div className="p-3 mb-4 bg-green-700 rounded-full">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="mb-2 text-2xl font-bold text-white">Goal Reached!</h3>
          <p className="mb-4 text-green-100">Thank you to all our donors for your generous support!</p>
          <button
            onClick={() => navigate(`/fundraiser-details/${_id}`)}
            className="px-4 py-2 text-white transition-colors bg-green-600 rounded hover:bg-green-700"
          >
            View Details
          </button>
        </div>
      )}

      {/* Card content */}
      {image ? (
        <img 
          src={image} 
          alt={title} 
          className={`object-cover w-full h-48 ${isCompleted ? 'opacity-50' : ''}`} 
        />
      ) : (
        <div className={`flex items-center justify-center w-full h-48 bg-gray-700 ${isCompleted ? 'opacity-50' : ''}`}>
          <span className="text-gray-300">No Image</span>
        </div>
      )}
      
      <div className={`flex flex-col justify-between flex-1 p-4 ${isCompleted ? 'opacity-50' : ''}`}>
        <div>
          <h2 className="mb-2 text-xl font-bold text-white">{title}</h2>
          <p className="mb-2 text-sm text-gray-300">{description}</p>
          
          {/* Progress bar */}
          <div className="w-full h-2 mb-2 bg-gray-700 rounded-full">
            <div 
              className={`h-full rounded-full ${isCompleted ? 'bg-green-600' : 'bg-indigo-600'}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="mb-1 text-sm text-gray-400">
            <span className="font-semibold">Goal:</span> ₹{goal.toLocaleString()}
          </div>
          <div className="mb-4 text-sm text-gray-400">
            <span className="font-semibold">Raised:</span> ₹{(amountRaised || 0).toLocaleString()} ({Math.round(progressPercentage)}%)
          </div>
        </div>
        
        {!isCompleted && (
          <button
            onClick={handleDonate}
            className="w-full px-4 py-2 mt-auto text-sm font-medium text-white transition-colors duration-200 bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
          >
            Donate
          </button>
        )}
        
        {isCompleted && (
          <div className="w-full px-4 py-2 mt-auto text-sm font-medium text-center text-white bg-green-600 rounded">
            Completed
          </div>
        )}
      </div>
    </div>
  );
};

export default FundraiserCard;