import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000, // Add a timeout for requests
});

// Request interceptor - adds auth token to requests
api.interceptors.request.use(
  (config) => {
    // Check for token in both localStorage keys for backward compatibility
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Adding auth token to request:", config.url);
    } else {
      console.warn("No auth token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - for global error handling
api.interceptors.response.use(
  (response) => {
    // Any status code between 200 and 299 will trigger this function
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error(`API Error (${error.config?.url}):`, error.response?.data || error.message);
    
    // Handle 401 Unauthorized globally - could redirect to login
    if (error.response && error.response.status === 401) {
      console.warn("Authentication error - you may need to log in again");
      // You could add auto-logout here
      // store.dispatch(logout()) or similar
    }
    
    // Handle 403 Forbidden with more specific message
    if (error.response && error.response.status === 403) {
      console.warn("Authorization error - you don't have permission for this action");
    }
    
    return Promise.reject(error);
  }
);

// Fundraiser API Services
const fundraiserAPI = {
  // Create a new fundraiser
  createFundraiser: async (fundraiserData) => {
    try {
      const response = await api.post("/fundraisers", fundraiserData);
      return response.data;
    } catch (error) {
      console.error("Error creating fundraiser:", error);
      throw error;
    }
  },
  
  // Get all fundraisers
  getAllFundraisers: async () => {
    try {
      const response = await api.get("/fundraisers");
      return response.data;
    } catch (error) {
      console.error("Error fetching fundraisers:", error);
      throw error;
    }
  },
  
  // Get a single fundraiser by ID
  getFundraiserById: async (id) => {
    try {
      const response = await api.get(`/fundraisers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching fundraiser #${id}:`, error);
      throw error;
    }
  },
  
  // Update a fundraiser
  updateFundraiser: async (id, updatedData) => {
    try {
      const response = await api.put(`/fundraisers/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating fundraiser #${id}:`, error);
      throw error;
    }
  },
  
  // Delete a fundraiser
  deleteFundraiser: async (id) => {
    try {
      const response = await api.delete(`/fundraisers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting fundraiser #${id}:`, error);
      throw error;
    }
  }
};

// Analytics API Services
const analyticsAPI = {
  // Get NGO-specific analytics
  getNGOAnalytics: async (ngoId) => {
    try {
      const response = await api.get(`/analytics/ngo/${ngoId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching NGO analytics:", error);
      throw error;
    }
  },

  // Get global analytics (admin only)
  getGlobalAnalytics: async () => {
    try {
      const response = await api.get("/analytics/global");
      return response.data;
    } catch (error) {
      console.error("Error fetching global analytics:", error);
      throw error;
    }
  },

  // Get time-based donation data for charts
  getTimeSeriesData: async (ngoId, timeframe = "month") => {
    try {
      const response = await api.get(`/analytics/timeseries`, {
        params: { ngoId, timeframe },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching time series data:", error);
      throw error;
    }
  },

  // Get donation breakdown by category
  getCategoryData: async (ngoId) => {
    try {
      const response = await api.get(`/analytics/categories`, {
        params: { ngoId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching category data:", error);
      throw error;
    }
  },

  // Get recent donations list
  getRecentDonations: async (ngoId, limit = 10) => {
    try {
      const response = await api.get(`/donations/recent`, {
        params: { ngoId, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching recent donations:", error);
      throw error;
    }
  },
};

// Donations API Services
const donationsAPI = {
  // Process a donation
  processDonation: async (campaignId, amount) => {
    try {
      const response = await api.post(`/donations/direct-campaign/${campaignId}`, { amount });
      return response.data;
    } catch (error) {
      console.error("Error processing donation:", error);
      throw error;
    }
  },
  
  // Get donation history
  getDonationHistory: async () => {
    try {
      const response = await api.get("/donations/history");
      return response.data;
    } catch (error) {
      console.error("Error fetching donation history:", error);
      throw error;
    }
  }
};

// Add service modules to the main api export
api.analytics = analyticsAPI;
api.fundraisers = fundraiserAPI;
api.donations = donationsAPI;

export default api;