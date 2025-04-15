import React from "react";

const FundraiserCard = ({ fundraiser }) => {
  const { title, description, goal, amountRaised, image } = fundraiser;

  return (
    <div className="overflow-hidden bg-gray-800 rounded-lg shadow-md">
      {image ? (
        <img src={image} alt={title} className="object-cover w-full h-48" />
      ) : (
        <div className="flex items-center justify-center w-full h-48 bg-gray-700">
          <span className="text-gray-300">No Image</span>
        </div>
      )}
      <div className="p-4">
        <h2 className="mb-2 text-xl font-bold">{title}</h2>
        <p className="mb-2 text-sm text-gray-300">{description}</p>
        <div className="mb-2 text-sm text-gray-400">
          <span className="font-semibold">Goal:</span> ₹{goal}
        </div>
        <div className="text-sm text-gray-400">
          <span className="font-semibold">Raised:</span> ₹{amountRaised || 0}
        </div>
      </div>
    </div>
  );
};

export default FundraiserCard;
