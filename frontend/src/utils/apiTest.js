import axios from 'axios';

export const testApiConnection = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/test');
    console.log('API Connection Test:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Connection Error:', error);
    return { 
      success: false, 
      error: error.message,
      details: error.response?.data || 'No response data'
    };
  }
}; 