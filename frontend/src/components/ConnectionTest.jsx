import React, { useState } from 'react';
import { testBackendConnection } from '../utils/testConnection';
import axios from 'axios';

const ConnectionTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);

  const runTest = async () => {
    setIsLoading(true);
    setBackendStatus("Checking backend connection...");
    
    try {
      // First check if the backend is reachable at all
      const pingResult = await axios.get('http://localhost:3000/api/test', { timeout: 5000 });
      setBackendStatus(`Backend is reachable! Response: ${JSON.stringify(pingResult.data)}`);
      
      // Then run the full test
      const result = await testBackendConnection();
      setTestResult(result);
    } catch (error) {
      console.error("Connection test error:", error);
      setBackendStatus(`Backend connection failed: ${error.message}`);
      
      setTestResult({
        success: false,
        message: 'Failed to connect to backend server',
        error: {
          message: error.message,
          code: error.code || 'UNKNOWN',
          response: error.response?.data || 'No response data'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="text-lg font-semibold mb-2">API Connection Tester</h3>
      
      <div className="mb-4">
        <button 
          onClick={runTest}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Backend Connection'}
        </button>
        
        {backendStatus && (
          <div className={`mt-2 p-2 rounded text-sm ${backendStatus.includes('failed') ? 'bg-red-100' : 'bg-blue-100'}`}>
            {backendStatus}
          </div>
        )}
      </div>
      
      {testResult && (
        <div className={`p-3 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className="font-semibold">{testResult.success ? '✅ Success' : '❌ Error'}</p>
          <p>{testResult.message}</p>
          
          {!testResult.success && (
            <div className="mt-2 text-sm">
              <p><strong>Error:</strong> {testResult.error.message}</p>
              {testResult.error.code && <p><strong>Code:</strong> {testResult.error.code}</p>}
              
              <div className="mt-2 p-2 bg-white rounded border border-red-200">
                <h4 className="font-semibold">Troubleshooting Steps:</h4>
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>Make sure the backend server is running on port 3000</li>
                  <li>Check if there are any errors in the backend console</li>
                  <li>Verify that your MongoDB connection string is correct</li>
                  <li>Check if your firewall is blocking the connection</li>
                  <li>Try running the test-server.js file to isolate the issue</li>
                </ol>
              </div>
            </div>
          )}
          
          <div className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
            <pre>{JSON.stringify(testResult.success ? testResult.data : testResult.error, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest; 