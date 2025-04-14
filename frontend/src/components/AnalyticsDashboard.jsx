import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsDashboard = ({
  analytics,
  timeSeriesData,
  categoryData,
  recentDonations,
  loading,
  error,
  timeframe,
  onTimeframeChange,
  userRole
}) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-xl">Loading analytics data...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-xl text-red-500">{error}</div>
    </div>
  );
  
  // Use the provided time series data or fallback to sample data
  const chartData = timeSeriesData.length > 0 ? timeSeriesData : [
    { name: 'Jan', donations: 4000 },
    { name: 'Feb', donations: 3000 },
    { name: 'Mar', donations: 2000 },
    { name: 'Apr', donations: 2780 },
    { name: 'May', donations: 1890 },
    { name: 'Jun', donations: 2390 },
  ];
  
  // Use the provided category data or fallback to sample data
  const pieData = categoryData.length > 0 ? categoryData : [
    { name: 'Education', value: 400 },
    { name: 'Healthcare', value: 300 },
    { name: 'Environment', value: 300 },
    { name: 'Disaster Relief', value: 200 },
  ];
  
  return (
    <div className="space-y-8">
      {/* Timeframe Selector */}
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Timeframe</h2>
        <div className="flex space-x-4">
          <button 
            onClick={() => onTimeframeChange('month')}
            className={`px-4 py-2 rounded-md ${timeframe === 'month' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => onTimeframeChange('quarter')}
            className={`px-4 py-2 rounded-md ${timeframe === 'quarter' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Quarterly
          </button>
          <button 
            onClick={() => onTimeframeChange('year')}
            className={`px-4 py-2 rounded-md ${timeframe === 'year' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Yearly
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* NGO Metrics - Show for NGO users or admins who have selected an NGO */}
        {(userRole === 'ngo' || userRole === 'admin') && (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">
              {userRole === 'ngo' ? 'Your NGO Performance' : 'NGO Performance'}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="mb-1 text-gray-400">Total Donations</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.ngo.totalDonations)}</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="mb-1 text-gray-400">Donation Count</p>
                <p className="text-2xl font-bold">{analytics.ngo.donationCount}</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="mb-1 text-gray-400">Average Donation</p>
                <p className="text-2xl font-bold">
                  {analytics.ngo.donationCount 
                    ? formatCurrency(analytics.ngo.totalDonations / analytics.ngo.donationCount) 
                    : formatCurrency(0)}
                </p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="mb-1 text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold">24.8%</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Global Platform Metrics - Admin only */}
        {userRole === 'admin' && (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Global Platform Performance</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="mb-1 text-gray-400">Total Donations</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.global.totalDonations)}</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="mb-1 text-gray-400">Donation Count</p>
                <p className="text-2xl font-bold">{analytics.global.donationCount}</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="mb-1 text-gray-400">Average Donation</p>
                <p className="text-2xl font-bold">
                  {analytics.global.donationCount 
                    ? formatCurrency(analytics.global.totalDonations / analytics.global.donationCount) 
                    : formatCurrency(0)}
                </p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="mb-1 text-gray-400">Active NGOs</p>
                <p className="text-2xl font-bold">48</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Line Chart - Donations Over Time */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Donations Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} 
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="donations" stroke="#0088FE" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Pie Chart - Donations by Category */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Donations by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} 
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Donations Table */}
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Recent Donations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                  Donor
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                  Campaign
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {recentDonations.length > 0 ? (
                recentDonations.map((donation, index) => (
                  <tr key={donation._id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {donation.donorName || 'Anonymous'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(donation.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {donation.campaignName || 'General Donation'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(donation.donatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${donation.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          donation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    No recent donations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;