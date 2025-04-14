import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000, // Add a timeout for requests
});

// Request interceptor - adds auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // Handle 401 Unauthorized globally - could redirect to login
    if (error.response && error.response.status === 401) {
      console.warn("Authentication error - you may need to log in again");
      // You could add auto-logout here
      // store.dispatch(logout()) or similar
    }
    return Promise.reject(error);
  }
);

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

// Add the analytics API to the main api export
api.analytics = analyticsAPI;

export default api;