// DashboardCard.jsx
import React from 'react';

const DashboardCard = ({ title, value, icon, description }) => {
  return (
    <div className="p-6 transition-shadow bg-gray-900 rounded-lg shadow-lg hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-200">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="mb-2 text-3xl font-bold text-white">{value}</div>
      {description && (
        <p className="text-sm text-gray-400">{description}</p>
      )}
    </div>
  );
};

export default DashboardCard;