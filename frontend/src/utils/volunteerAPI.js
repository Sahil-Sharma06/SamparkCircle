// src/services/volunteerAPI.js
import API from './api';

/**
 * Service for volunteer opportunity related API calls
 */
const VolunteerAPI = {
  // Opportunity endpoints
  getOpportunities: () => {
    return API.get('/opportunities');
  },

  getOpportunity: (opportunityId) => {
    return API.get(`/opportunities/${opportunityId}`);
  },

  createOpportunity: (opportunityData) => {
    return API.post('/opportunities', opportunityData);
  },

  updateOpportunity: (opportunityId, opportunityData) => {
    return API.put(`/opportunities/${opportunityId}`, opportunityData);
  },

  deleteOpportunity: (opportunityId) => {
    return API.delete(`/opportunities/${opportunityId}`);
  },

  // Application endpoints
  applyForOpportunity: (applicationData) => {
    return API.post('/applications', applicationData);
  },

  getApplicationsForOpportunity: (opportunityId) => {
    return API.get(`/applications/opportunity/${opportunityId}`);
  },

  updateApplicationStatus: (applicationId, statusData) => {
    return API.put(`/applications/${applicationId}`, statusData);
  },

  getApplication: (applicationId) => {
    return API.get(`/applications/${applicationId}`);
  }
};

export default VolunteerAPI;