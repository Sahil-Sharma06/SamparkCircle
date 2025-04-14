import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api'; // Adjust path as needed
import AnalyticsDashboard from '../components/AnalyticsDashboard'; // Import the dashboard component

const AnalyticsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState({
    ngo: { totalDonations: 0, donationCount: 0 },
    global: { totalDonations: 0, donationCount: 0 }
  });
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('month');
  
  // These are now coming from Redux state
  const userRole = user?.role || '';
  const ngoId = user?.ngoId || user?._id || '';

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching analytics for user:', { userRole, ngoId });
        
        // Use try/catch for each API call to prevent entire function from failing
        let ngoAnalytics = { totalDonations: 0, donationCount: 0 };
        let globalAnalytics = { totalDonations: 0, donationCount: 0 };
        
        try {
          if (userRole === 'ngo' && ngoId) {
            console.log('Fetching NGO analytics for ID:', ngoId);
            
            try {
              // Get NGO analytics
              const ngoResponse = await api.analytics.getNGOAnalytics(ngoId);
              ngoAnalytics = ngoResponse.analytics;
              console.log('NGO analytics received:', ngoAnalytics);
            } catch (err) {
              console.error('Error fetching NGO analytics:', err);
              // Use mock data for development purposes
              ngoAnalytics = { totalDonations: 12500, donationCount: 42 };
            }
            
            try {
              // Get time series data
              const timeSeriesResponse = await api.analytics.getTimeSeriesData(ngoId, timeframe);
              setTimeSeriesData(timeSeriesResponse?.data || []);
            } catch (err) {
              console.error('Error fetching time series data:', err);
              // Use mock data for charts
              setTimeSeriesData([
                { name: 'Jan', donations: 4000 },
                { name: 'Feb', donations: 3000 },
                { name: 'Mar', donations: 2000 },
                { name: 'Apr', donations: 2780 },
                { name: 'May', donations: 1890 },
                { name: 'Jun', donations: 2390 },
              ]);
            }
            
            try {
              // Get category data
              const categoryResponse = await api.analytics.getCategoryData(ngoId);
              setCategoryData(categoryResponse?.data || []);
            } catch (err) {
              console.error('Error fetching category data:', err);
              // Use mock data for charts
              setCategoryData([
                { name: 'Education', value: 400 },
                { name: 'Healthcare', value: 300 },
                { name: 'Environment', value: 300 },
                { name: 'Disaster Relief', value: 200 },
              ]);
            }
            
            try {
              // Get recent donations
              const recentResponse = await api.analytics.getRecentDonations(ngoId, 5);
              setRecentDonations(recentResponse?.donations || []);
            } catch (err) {
              console.error('Error fetching recent donations:', err);
              // Use mock data for recent donations
              setRecentDonations([
                { _id: '1', donorName: 'John Doe', amount: 125, campaignName: 'Winter Relief', donatedAt: new Date(), status: 'Completed' },
                { _id: '2', donorName: 'Jane Smith', amount: 75, campaignName: 'Education Fund', donatedAt: new Date(), status: 'Completed' },
                { _id: '3', donorName: 'Robert Johnson', amount: 250, campaignName: 'Medical Supplies', donatedAt: new Date(), status: 'Completed' },
              ]);
            }
          }
          
          if (userRole === 'admin') {
            try {
              // Get global analytics for admin
              const globalResponse = await api.analytics.getGlobalAnalytics();
              globalAnalytics = globalResponse?.analytics || { totalDonations: 75000, donationCount: 250 };
            } catch (err) {
              console.error('Error fetching global analytics:', err);
              // Use mock data for development purposes
              globalAnalytics = { totalDonations: 75000, donationCount: 250 };
            }
          }
        } catch (err) {
          console.error('Error in overall analytics fetching:', err);
        }
        
        setAnalytics({
          ngo: ngoAnalytics,
          global: globalAnalytics
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [userRole, ngoId, timeframe]);
  
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };
  
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Analytics Dashboard</h1>
      
      <AnalyticsDashboard 
        analytics={analytics}
        timeSeriesData={timeSeriesData}
        categoryData={categoryData}
        recentDonations={recentDonations}
        loading={loading}
        error={error}
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        userRole={userRole}
      />
    </div>
  );
};

export default AnalyticsPage;