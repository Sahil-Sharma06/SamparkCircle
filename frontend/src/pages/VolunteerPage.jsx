// src/pages/volunteer/VolunteerPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOpportunities } from '../../redux/slices/volunteerSlice';
import OpportunityCard from '../../components/volunteer/OpportunityCard';
import OpportunityFilter from '../../components/volunteer/OpportunityFilter';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

const VolunteerPage = () => {
  const dispatch = useDispatch();
  const { opportunities, loading, error } = useSelector((state) => state.volunteer);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    dispatch(fetchOpportunities());
  }, [dispatch]);

  useEffect(() => {
    if (opportunities) {
      let result = [...opportunities];
      
      // Apply search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        result = result.filter(
          (opp) =>
            opp.title.toLowerCase().includes(searchLower) ||
            opp.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply location filter
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        result = result.filter((opp) =>
          opp.location.toLowerCase().includes(locationLower)
        );
      }
      
      setFilteredOpportunities(result);
    }
  }, [opportunities, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading && opportunities.length === 0) return <Loader />;

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">Volunteer Opportunities</h1>
          <p className="text-gray-400">
            Find opportunities to volunteer and help make a difference.
          </p>
        </div>
        
        {isAuthenticated && user.role === "NGO" && (
          <Link
            to="/volunteer/opportunities/create"
            className="px-6 py-2 mt-4 font-medium text-white bg-green-600 rounded-md md:mt-0 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Post New Opportunity
          </Link>
        )}
      </div>

      {error && <ErrorAlert message={error.message || "Failed to load opportunities"} />}

      <OpportunityFilter onFilterChange={handleFilterChange} />

      {filteredOpportunities.length === 0 ? (
        <div className="p-8 text-center bg-gray-800 rounded-lg shadow-md">
          <p className="mb-4 text-gray-300">
            {opportunities.length === 0
              ? "No volunteer opportunities have been posted yet."
              : "No opportunities match your current filters."}
          </p>
          {opportunities.length > 0 && (
            <button
              onClick={() => setFilters({})}
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Clear filters
            </button>
          )}
          {isAuthenticated && user.role === "NGO" && opportunities.length === 0 && (
            <div className="mt-4">
              <Link
                to="/volunteer/opportunities/create"
                className="px-6 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Be the first to post an opportunity
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity._id} opportunity={opportunity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerPage;