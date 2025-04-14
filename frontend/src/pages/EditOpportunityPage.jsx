// src/pages/volunteer/EditOpportunityPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOpportunityById, 
  updateOpportunity, 
  clearCurrentOpportunity 
} from '../../redux/slices/volunteerSlice';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

const EditOpportunityPage = () => {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentOpportunity, loading, error } = useSelector((state) => state.volunteer);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [unauthorized, setUnauthorized] = useState(false);
  
  useEffect(() => {
    if (opportunityId) {
      dispatch(fetchOpportunityById(opportunityId));
    }
    
    return () => {
      dispatch(clearCurrentOpportunity());
    };
  }, [dispatch, opportunityId]);
  
  useEffect(() => {
    if (currentOpportunity) {
      // Check if the current user is the owner
      if (isAuthenticated && user._id !== currentOpportunity.postedBy) {
        setUnauthorized(true);
        return;
      }
      
      setFormData({
        title: currentOpportunity.title || '',
        description: currentOpportunity.description || '',
        requirements: currentOpportunity.requirements || '',
        location: currentOpportunity.location || ''
      });
    }
  }, [currentOpportunity, isAuthenticated, user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(updateOpportunity({ 
        opportunityId, 
        data: formData 
      })).unwrap();
      navigate(`/volunteer/opportunities/${opportunityId}`);
    } catch (err) {
      console.error('Failed to update opportunity:', err);
    }
  };
  
  if (loading && !currentOpportunity) return <Loader />;
  
  if (unauthorized) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <ErrorAlert message="You are not authorized to edit this opportunity" />
        <div className="mt-4">
          <Link 
            to="/volunteer/opportunities" 
            className="text-blue-400 hover:text-blue-300"
          >
            &larr; Back to opportunities
          </Link>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <ErrorAlert message={error.message || "Failed to load opportunity"} />
        <div className="mt-4">
          <Link 
            to="/volunteer/opportunities" 
            className="text-blue-400 hover:text-blue-300"
          >
            &larr; Back to opportunities
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-6">
        <Link 
          to={`/volunteer/opportunities/${opportunityId}`}
          className="flex items-center text-blue-400 hover:text-blue-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to opportunity details
        </Link>
      </div>
      
      <div className="overflow-hidden bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6">
          <h1 className="mb-6 text-2xl font-bold text-white">Edit Volunteer Opportunity</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full bg-gray-700 border ${formErrors.title ? 'border-red-500' : 'border-gray-600'} rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter opportunity title"
              />
              {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-300">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                className={`w-full bg-gray-700 border ${formErrors.description ? 'border-red-500' : 'border-gray-600'} rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Describe the volunteer opportunity in detail"
              ></textarea>
              {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="requirements" className="block mb-2 text-sm font-medium text-gray-300">
                Requirements (Optional)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows="4"
                value={formData.requirements}
                onChange={handleChange}
                className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List any specific requirements or skills needed"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-300">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full bg-gray-700 border ${formErrors.location ? 'border-red-500' : 'border-gray-600'} rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter location (e.g., Remote, New York, NY)"
              />
              {formErrors.location && <p className="mt-1 text-sm text-red-500">{formErrors.location}</p>}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader size="sm" /> : 'Update Opportunity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOpportunityPage;