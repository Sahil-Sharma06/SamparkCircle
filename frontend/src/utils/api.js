// API configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      SIGNUP: '/api/auth/signup',
    },
    DONATIONS: '/api/donation',
    EVENTS: '/api/events',
    FUNDRAISERS: '/api/fundraisers',
    NGOS: '/api/ngos',
  }
};

export default API_CONFIG; 