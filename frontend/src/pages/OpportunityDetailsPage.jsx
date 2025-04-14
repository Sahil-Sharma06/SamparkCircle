// src/pages/volunteer/OpportunityDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { 
  fetchOpportunityById, 
  deleteOpportunity,
  applyForOpportunity 
} from '../../redux/slices/volunteerSlice';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import ConfirmModal from '../../components/common/ConfirmModal';

const OpportunityDetailPage = () => {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentOpportunity, loading, error } = useSelector((state) => state.volunteer);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  
  useEffect(() => {
    if (opportunityId) {
      dispatch(fetchOpportunityById(opportunityId));
    }
  }, [dispatch, opportunityId]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteOpportunity(opportunityId)).unwrap();
      navigate('/volunteer/opportunities');
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleApply = async () => {
    try {
      await dispatch(applyForOpportunity({
        opportunityId,
        coverLetter
      })).unwrap();
      setApplicationSuccess(true);
    } catch (err) {
      console.error('Failed to apply:', err);
    }
  };

  const isOwner = isAuthenticated && 
    currentOpportunity && 
    user._id === currentOpportunity.postedBy;

  const canApply = isAuthenticated && 
    user.role === "Volunteer" && 
    !applicationSuccess;

  if (loading && !currentOpportunity) return <Loader />;
  
  if (error) return (
    <div className="container px-4 py-8 mx-auto">
      <ErrorAlert message={error.message || "Failed to load opportunity details"} />
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

  if (!currentOpportunity) return null;

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-6">
        <Link 
          to="/volunteer/opportunities" 
          className="flex items-center text-blue-400 hover:text-blue-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to opportunities
        </Link>
      </div>

      <div className="overflow-hidden bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">{currentOpportunity.title}</h1>
            
            {isOwner && (
              <div className="flex gap-2">
                <Link
                  to={`/volunteer/opportunities/${opportunityId}/edit`}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {currentOpportunity.location}
            </div>
            
            <div className="flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Posted {formatDistanceToNow(new Date(currentOpportunity.createdAt), { addSuffix: true })}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-white">Description</h2>
            <div className="text-gray-300 whitespace-pre-line">
              {currentOpportunity.description}
            </div>
          </div>

          {currentOpportunity.requirements && (
            <div className="mb-8">
              <h2 className="mb-3 text-xl font-semibold text-white">Requirements</h2>
              <div className="text-gray-300 whitespace-pre-line">
                {currentOpportunity.requirements}
              </div>
            </div>
          )}

          {isOwner && (
            <div className="mt-8">
              <Link
                to={`/volunteer/opportunities/${opportunityId}/applications`}
                className="px-6 py-2 font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                View Applications
              </Link>
            </div>
          )}

          {canApply && (
            <div className="mt-8">
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-6 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Apply Now
              </button>
            </div>
          )}

          {applicationSuccess && (
            <div className="p-4 mt-8 text-green-200 bg-green-900 rounded-md">
              <p className="font-medium">Application submitted successfully!</p>
              <p className="mt-2">The organization will review your application and contact you.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete Opportunity"
          message="Are you sure you want to delete this volunteer opportunity? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg">
            <h2 className="mb-4 text-2xl font-bold text-white">Apply for Volunteer Opportunity</h2>
            
            <div className="mb-4">
              <label htmlFor="coverLetter" className="block mb-2 text-sm font-medium text-gray-300">
                Message / Cover Letter (Optional)
              </label>
              <textarea
                id="coverLetter"
                rows="6"
                className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell the organization why you're interested in this opportunity..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityDetailPage;