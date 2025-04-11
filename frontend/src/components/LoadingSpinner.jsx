// LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-16 h-16 border-t-4 border-opacity-75 rounded-full animate-spin border-emerald-500"></div>
    </div>
  );
};

export default LoadingSpinner;