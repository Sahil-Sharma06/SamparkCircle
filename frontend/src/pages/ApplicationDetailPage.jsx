// src/pages/volunteer/ApplicationDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { fetchApplicationsForOpportunity, updateApplicationStatus } from '../../redux/slices/volunteerSlice';
import VolunteerAPI from '../../services/volunteerAPI';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import ConfirmModal from '../../components/common/ConfirmModal';

const ApplicationDetailPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  
  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setLoading(true);
        const response = await VolunteerAPI.getApplication(applicationId);
        const applicationData = response.data.application;
        
        // Check authorization - only the NGO who posted the opportunity or the volunteer who applied can view
        const isNGOOwner = isAuthenticated && 
          user.role === 'NGO' && 
          applicationData.opportunity.postedBy === user._id;
          
        const isApplicant = isAuthenticated && 
          user.role === 'Volunteer' && 
          applicationData.volunteer._id === user._id;
          
        if (!isNGOOwner && !isApplicant) {
          setUnauthorized(true);
          return;
        }
        
        setApplication(applicationData);
      } catch (err) {
        console.error('Error fetching application:', err);
        setError(err.response?.data || { message: 'Failed to load application details' });
      } finally {
        setLoading(false);
      }
    };
    
    if (applicationId) {
      fetchApplicationData();
    }
  }, [applicationId, isAuthenticated, user]);
  
  const handleUpdateStatus = async () => {
    if (!application || !statusToUpdate) return;
    
    try {
      await dispatch(updateApplicationStatus({
        applicationId: application._id,
        status: statusToUpdate
      })).unwrap();
      
      // Update the local state with the new status
      setApplication(prev => ({
        ...prev,
        status: statusToUpdate
      }));
      
      setShowStatusModal(false);
      setStatusToUpdate('');
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data || { message: 'Failed to update application status' });
    }
  };
  
  const openStatusModal = (status) => {
    setStatusToUpdate(status);
    setShowStatusModal(true);
  };
  
  if (loading) return <Loader />;
  
  if (unauthorized) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <ErrorAlert message="You are not authorized to view this application" />
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
        <ErrorAlert message={error.message || "Failed to load application details"} />
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
  
  if (!application) return null;
  
  const isNGOOwner = isAuthenticated && 
    user.role === 'NGO' && 
    application.opportunity.postedBy === user._id;
    
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-6">
        {isNGOOwner ? (
          <Link 
            to={`/volunteer/opportunities/${application.opportunity._id}/applications`}
            className="flex items-center text-blue-400 hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to all applications
          </Link>
        ) : (
          <Link 
            to="/volunteer/opportunities"
            className="flex items-center text-blue-400 hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to opportunities
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - Application details */}
        <div className="col-span-2">
          <div className="overflow-hidden bg-gray-800 rounded-lg shadow-lg">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="mb-2 text-2xl font-bold text-white">
                    Application for {application.opportunity.title}
                  </h1>
                  <p className="text-gray-400">
                    Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full 
                  ${application.status === 'Accepted' ? 'bg-green-900 text-green-200' : 
                    application.status === 'Rejected' ? 'bg-red-900 text-red-200' : 
                    'bg-yellow-900 text-yellow-200'}`}>
                  {application.status}
                </span>
              </div>
              
              {application.coverLetter ? (
                <div className="mb-8">
                  <h2 className="mb-3 text-xl font-semibold text-white">Cover Letter</h2>
                  <div className="p-4 text-gray-300 whitespace-pre-line bg-gray-700 rounded-md">
                    {application.coverLetter}
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <h2 className="mb-3 text-xl font-semibold text-white">Cover Letter</h2>
                  <div className="p-4 italic text-gray-400 bg-gray-700 rounded-md">
                    No cover letter provided.
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="mb-3 text-xl font-semibold text-white">Opportunity Details</h2>
                <div className="p-4 bg-gray-700 rounded-md">
                  <h3 className="mb-2 text-lg font-medium text-white">{application.opportunity.title}</h3>
                  <p className="mb-2 text-gray-300">Location: {application.opportunity.location}</p>
                  <Link 
                    to={`/volunteer/opportunities/${application.opportunity._id}`}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300"
                  >
                    View Opportunity Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {isNGOOwner && application.status === 'Pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => openStatusModal('Accepted')}
                    className="px-6 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Accept Application
                  </button>
                  <button
                    onClick={() => openStatusModal('Rejected')}
                    className="px-6 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column - Volunteer info */}
        <div className="col-span-1">
          <div className="overflow-hidden bg-gray-800 rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">Volunteer Information</h2>
              
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white bg-blue-600 rounded-full">
                    {application.volunteer?.name?.charAt(0).toUpperCase() || 'V'}
                  </div>
                </div>
                
                <h3 className="mb-1 text-lg font-medium text-center text-white">
                  {application.volunteer?.name || 'Volunteer Name'}
                </h3>
                <p className="mb-4 text-center text-gray-400">
                  {application.volunteer?.email || 'volunteer@example.com'}
                </p>
                
                {isNGOOwner && application.status === 'Accepted' && (
                  <a 
                    href={`mailto:${application.volunteer?.email}`} 
                    className="block w-full px-4 py-2 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Contact Volunteer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Update Confirmation Modal */}
      {showStatusModal && (
        <ConfirmModal
          title={`${statusToUpdate} Application`}
          message={`Are you sure you want to mark this application as ${statusToUpdate.toLowerCase()}?`}
          confirmText={statusToUpdate}
          cancelText="Cancel"
          onConfirm={handleUpdateStatus}
          onCancel={() => {
            setShowStatusModal(false);
            setStatusToUpdate('');
          }}
          confirmButtonClass={statusToUpdate === 'Accepted' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
        />
      )}
    </div>
  );
};

export default ApplicationDetailPage;