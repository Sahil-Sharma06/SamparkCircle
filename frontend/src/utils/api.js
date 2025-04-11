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

export default api;