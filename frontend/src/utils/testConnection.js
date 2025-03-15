import axios from 'axios';

// Function to test if the backend server is reachable
export const testBackendConnection = async () => {
  try {
    // Try to connect to the backend test endpoint
    const response = await axios.get('http://localhost:3000/api/test');
    console.log('Backend connection successful:', response.data);
    return {
      success: true,
      message: 'Connected to backend server',
      data: response.data
    };
  } catch (error) {
    console.error('Backend connection error:', error);
    
    // Provide detailed error information
    return {
      success: false,
      message: 'Failed to connect to backend server',
      error: {
        message: error.message,
        code: error.code,
        response: error.response?.data || 'No response data'
      }
    };
  }
}; 