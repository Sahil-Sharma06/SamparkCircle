// src/pages/volunteer/ApplicationsListPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOpportunityById, 
  fetchApplicationsForOpportunity,
  updateApplicationStatus 
} from '../../redux/slices/volunteerSlice';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import ConfirmModal from '../../components/common/ConfirmModal';

const ApplicationsListPage = () => {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentOpportunity, applications, loading, error } = useSelector((state) => state.volunteer);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [unauthorized, setUnauthorized] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  
  useEffect(() => {
    if (!opportunityId) return;
    
    const fetchData = async () => {
      try {
        // First fetch the opportunity details
        const opportunity = await dispatch(fetchOpportunityById(opportunityId)).unwrap();
        
        // Check if the current user is the owner
        if (!isAuthenticated || user._id !== opportunity.postedBy) {
          setUnauthorized(true);
          return;
        }
        
        // Then fetch the applications
        await dispatch(fetchApplicationsForOpportunity(opportunityId)).unwrap();
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, [dispatch, opportunityId, isAuthenticated, user]);
  
  const handleUpdateStatus = async () => {
    if (!selectedApplication || !statusToUpdate) return;
    
    try {
      await dispatch(updateApplicationStatus({
        applicationId: selectedApplication._id,
        status: statusToUpdate
      })).unwrap();
      
      setShowStatusModal(false);
      setSelectedApplication(null);
      setStatusToUpdate('');
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };
  
  const openStatusModal = (application, status) => {
    setSelectedApplication(application);
    setStatusToUpdate(status);
    setShowStatusModal(true);
  };
  
  if (loading && (!currentOpportunity || applications.length === 0)) return <Loader />;
  
  if (unauthorized) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <ErrorAlert message="You are not authorized to view applications for this opportunity" />
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
        <ErrorAlert message={error.message || "Failed to load applications"} />
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
  
  if (!currentOpportunity) return null;
  
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
      
      <div className="mb-6 overflow-hidden bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6">
          <h1 className="mb-2 text-2xl font-bold text-white">Applications for {currentOpportunity.title}</h1>
          <p className="mb-2 text-gray-400">Location: {currentOpportunity.location}</p>
        </div>
      </div>
      
      {applications.length === 0 ? (
        <div className="p-8 text-center bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-300">No applications have been submitted for this opportunity yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-gray-800 rounded-lg shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                    Volunteer
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                    Applied On
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {applications.map((application) => (
                  <tr key={application._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {application.volunteer?.name || 'Volunteer Name'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {application.volunteer?.email || 'volunteer@example.com'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(application.appliedAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${application.status === 'Accepted' ? 'bg-green-900 text-green-200' : 
                          application.status === 'Rejected' ? 'bg-red-900 text-red-200' : 
                          'bg-yellow-900 text-yellow-200'}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => navigate(`/volunteer/applications/${application._id}`)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View
                        </button>
                        
                        {application.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => openStatusModal(application, 'Accepted')}
                              className="text-green-400 hover:text-green-300"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => openStatusModal(application, 'Rejected')}
                              className="text-red-400 hover:text-red-300"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Status Update Confirmation Modal */}
      {showStatusModal && selectedApplication && (
        <ConfirmModal
          title={`${statusToUpdate} Application`}
          message={`Are you sure you want to mark this application as ${statusToUpdate.toLowerCase()}?`}
          confirmText={statusToUpdate}
          cancelText="Cancel"
          onConfirm={handleUpdateStatus}
          onCancel={() => {
            setShowStatusModal(false);
            setSelectedApplication(null);
            setStatusToUpdate('');
          }}
          confirmButtonClass={statusToUpdate === 'Accepted' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
        />
      )}
    </div>
  );
};

export default ApplicationsListPage;