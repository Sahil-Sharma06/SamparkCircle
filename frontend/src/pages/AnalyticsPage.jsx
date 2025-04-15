import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const AnalyticsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    totalDonations: 0,
    donationCount: 0,
    averageDonation: 0,
    activeFundraisers: 0
  });
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!localStorage.getItem("authToken")) {
        setError("You must be logged in to view analytics");
        setLoading(false);
        setTimeout(() => {
          navigate("/login", {
            state: { from: window.location.pathname, message: "Please log in to view analytics" }
          });
        }, 2000);
        return;
      }

      try {
        setLoading(true);
        
        // Set authorization header for API requests
        const token = localStorage.getItem("authToken");
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Fetch donations and fundraisers data
        let donationsData = [];
        let fundraisersData = [];
        
        try {
          const donationsResponse = await api.get("/donations/ngo/received");
          donationsData = donationsResponse.data.donations || [];
          console.log("Fetched donations:", donationsData);
        } catch (err) {
          console.error("Error fetching donations:", err);
          // We'll continue with empty donations array
        }
        
        try {
          const fundraisersResponse = await api.get("/fundraisers");
          fundraisersData = fundraisersResponse.data.campaigns || [];
          console.log("Fetched fundraisers:", fundraisersData);
        } catch (err) {
          console.error("Error fetching fundraisers:", err);
          // We'll continue with empty fundraisers array
        }
        
        // Calculate analytics from real data
        const totalAmount = donationsData.reduce((sum, donation) => sum + (donation.amount || 0), 0);
        const donationCount = donationsData.length;
        const averageDonation = donationCount > 0 ? totalAmount / donationCount : 0;
        const activeFundraisers = fundraisersData.length;
        
        // Set analytics with real data
        setAnalytics({
          totalDonations: totalAmount,
          donationCount: donationCount,
          averageDonation: averageDonation,
          activeFundraisers: activeFundraisers
        });
        
        // Process time series data based on actual donations
        processTimeSeriesData(donationsData);
        
        // Process category data based on actual donations
        processCategoryData(donationsData);
        
        // Set recent donations (just take the most recent ones)
        const sortedDonations = [...donationsData].sort((a, b) => 
          new Date(b.donatedAt) - new Date(a.donatedAt)
        );
        setRecentDonations(sortedDonations.slice(0, 5));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    
    // Function to process time series data
    const processTimeSeriesData = (donations) => {
      const timeSeriesMap = new Map();
      
      // Get the date range based on timeframe
      const today = new Date();
      let startDate;
      
      switch(timeframe) {
        case 'week':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'year':
          startDate = new Date(today);
          startDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 1);
      }
      
      // Initialize time series data
      if (timeframe === 'week') {
        // For week, show each day
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
          timeSeriesMap.set(dateStr, { name: dateStr, donations: 0, count: 0 });
        }
      } else if (timeframe === 'month') {
        // For month, group by week
        for (let i = 1; i <= 4; i++) {
          const dateStr = `Week ${i}`;
          timeSeriesMap.set(dateStr, { name: dateStr, donations: 0, count: 0 });
        }
      } else if (timeframe === 'year') {
        // For year, group by month
        for (let i = 0; i < 12; i++) {
          const date = new Date(today);
          date.setMonth(today.getMonth() - 11 + i);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short' });
          timeSeriesMap.set(dateStr, { name: dateStr, donations: 0, count: 0 });
        }
      }
      
      // Populate time series data with actual donations
      donations.forEach(donation => {
        const donationDate = new Date(donation.donatedAt);
        
        // Skip donations outside the time range
        if (donationDate < startDate) return;
        
        let key;
        if (timeframe === 'week') {
          key = donationDate.toLocaleDateString('en-US', { weekday: 'short' });
        } else if (timeframe === 'month') {
          // Calculate which week the donation belongs to
          const daysSinceStart = Math.floor((donationDate - startDate) / (1000 * 60 * 60 * 24));
          const weekNum = Math.ceil((daysSinceStart + 1) / 7);
          key = `Week ${weekNum > 4 ? 4 : weekNum}`; // Cap at 4 weeks
        } else if (timeframe === 'year') {
          key = donationDate.toLocaleDateString('en-US', { month: 'short' });
        }
        
        if (timeSeriesMap.has(key)) {
          const data = timeSeriesMap.get(key);
          data.donations += donation.amount || 0;
          data.count += 1;
          timeSeriesMap.set(key, data);
        }
      });
      
      // Convert map to array for chart
      setTimeSeriesData(Array.from(timeSeriesMap.values()));
    };
    
    // Function to process category data
    const processCategoryData = (donations) => {
      const campaignMap = new Map();
      
      // Default category for general donations
      campaignMap.set('general', {
        name: 'General Donation',
        value: 0
      });
      
      donations.forEach(donation => {
        const campaignId = donation.campaign?._id || 'general';
        const campaignName = donation.campaign?.title || 'General Donation';
        
        if (!campaignMap.has(campaignId)) {
          campaignMap.set(campaignId, {
            name: campaignName,
            value: 0
          });
        }
        
        const campaignData = campaignMap.get(campaignId);
        campaignData.value += donation.amount || 0;
        campaignMap.set(campaignId, campaignData);
      });
      
      // Convert map to array and filter out zero values
      const result = Array.from(campaignMap.values())
        .filter(item => item.value > 0);
      
      setCategoryData(result);
    };
    
    fetchAnalyticsData();
  }, [timeframe, navigate]);
  
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  // Function to get appropriate color based on donation status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-10 text-white bg-gray-900">
        <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen p-10 text-white bg-gray-900">
        <div className="max-w-4xl p-6 mx-auto bg-gray-800 rounded-lg shadow-lg">
          <div className="p-4 mb-6 text-center text-red-400 bg-red-900 rounded-lg bg-opacity-20">
            <p className="text-lg">{error}</p>
            <button 
              onClick={() => navigate("/login")}
              className="px-4 py-2 mt-4 bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 text-white bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleTimeframeChange('week')}
              className={`px-4 py-2 rounded ${timeframe === 'week' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Week
            </button>
            <button 
              onClick={() => handleTimeframeChange('month')}
              className={`px-4 py-2 rounded ${timeframe === 'month' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Month
            </button>
            <button 
              onClick={() => handleTimeframeChange('year')}
              className={`px-4 py-2 rounded ${timeframe === 'year' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Year
            </button>
          </div>
        </div>
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-indigo-600 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-400">Total Donations</p>
                <p className="text-2xl font-semibold">₹{analytics.totalDonations.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-green-600 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-400">Donors</p>
                <p className="text-2xl font-semibold">{analytics.donationCount}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-blue-600 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-400">Avg. Donation</p>
                <p className="text-2xl font-semibold">₹{analytics.averageDonation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-purple-600 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                </svg>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-400">Active Fundraisers</p>
                <p className="text-2xl font-semibold">{analytics.activeFundraisers}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          {/* Donations Over Time Chart */}
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Donations Over Time</h2>
            
            <div className="h-64">
              {timeSeriesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeSeriesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' }}
                      formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                      labelStyle={{ color: 'white' }}
                    />
                    <Bar dataKey="donations" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">No data available for selected timeframe</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Donations by Campaign Chart */}
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Donations by Campaign</h2>
            
            <div className="h-64">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => {
                        const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6'];
                        return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                      })}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' }}
                    />
                    <Legend formatter={(value) => <span style={{ color: '#9CA3AF' }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">No campaign data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Recent Donations */}
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Recent Donations</h2>
          </div>
          
          <div className="overflow-x-auto">
            {recentDonations.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 bg-gray-700">
                    <th className="px-6 py-3">Donor</th>
                    <th className="px-6 py-3">Campaign</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentDonations.map(donation => (
                    <tr key={donation._id} className="hover:bg-gray-700">
                      <td className="px-6 py-4">
                        {donation.donor?.name || 'Anonymous'}
                      </td>
                      <td className="px-6 py-4">
                        {donation.campaign?.title || 'General Donation'}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ₹{donation.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(donation.donatedAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(donation.status)}`}>
                          {donation.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-400">
                <p>No recent donations found</p>
              </div>
            )}
          </div>
          
          <div className="p-4 text-center border-t border-gray-700">
            <button 
              onClick={() => navigate("/dashboard/fundraisers/manage")}
              className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Go to Fundraisers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;