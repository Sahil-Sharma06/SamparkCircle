// src/components/volunteer/OpportunityFilter.jsx
import React, { useState } from 'react';

const OpportunityFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ searchTerm, location });
  };

  const handleReset = () => {
    setSearchTerm('');
    setLocation('');
    onFilterChange({});
  };

  return (
    <div className="p-4 mb-6 bg-gray-800 rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="search" className="block mb-1 text-sm font-medium text-gray-300">
              Search
            </label>
            <input
              type="text"
              id="search"
              className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block mb-1 text-sm font-medium text-gray-300">
              Location
            </label>
            <input
              type="text"
              id="location"
              className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filter by location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Filter
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OpportunityFilter;