// frontend/src/pages/AdminOverviewPage.js
// This component provides an overview dashboard for admins with charts displaying
// user role distribution and help request status distribution.
// UPDATED: Excludes 'admin' role from the user distribution chart.
// FIXED: Removed a syntax error related to an inline comment in JSX that caused compilation to fail.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
// Import necessary components from Recharts library
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const AdminOverviewPage = ({ token }) => {
  const [userRoleStats, setUserRoleStats] = useState([]);
  const [requestStatusStats, setRequestStatusStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Inline CSS Styles ---
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem', // Space between sections
    maxWidth: '1200px',
    margin: 'auto',
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e40af', // Dark blue
    textAlign: 'center',
    marginBottom: '1rem'
  };

  const chartContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    width: '100%'
  };

  const chartCardStyle = {
    backgroundColor: '#f8fafc', // Light gray background for chart cards
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    width: '100%', // Take full width
    minHeight: '350px', // Ensure charts have enough space
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const chartTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '1rem',
    textAlign: 'center'
  };

  const messageStyle = {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#6b7280',
    marginTop: '1rem'
  };

  const errorStyle = {
    ...messageStyle,
    color: '#ef4444', // Red for error messages
    fontWeight: 'bold'
  };

  // Define colors for the pie chart slices and bar chart bars
  const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']; // Example colors
  const BAR_COLORS = ['#2563eb', '#f59e0b', '#059669', '#ef4444', '#6b7280']; // Blue, Amber, Green, Red, Gray

  // Memoized config for axios requests
  const memoizedConfig = useMemo(() => ({
    headers: { 'x-auth-token': token }
  }), [token]);

  // Fetch user role statistics
  const fetchUserRoleStats = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats/user-roles', memoizedConfig);
      // Filter out 'admin' role from the fetched data
      const filteredStats = res.data.filter(stat => stat.role !== 'admin');
      setUserRoleStats(filteredStats);
    } catch (err) {
      console.error('Error fetching user role stats:', err.response ? err.response.data.msg : err.message);
      setError('Failed to load user role statistics.');
    }
  }, [memoizedConfig]);

  // Fetch request status statistics
  const fetchRequestStatusStats = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats/request-statuses', memoizedConfig);
      setRequestStatusStats(res.data);
    } catch (err) {
      console.error('Error fetching request status stats:', err.response ? err.response.data.msg : err.message);
      setError(prev => prev ? prev + ' Failed to load request status statistics.' : 'Failed to load request status statistics.');
    }
  }, [memoizedConfig]);

  // Effect to fetch all data on component mount
  useEffect(() => {
    if (token) {
      setLoading(true);
      setError(null);
      Promise.all([
        fetchUserRoleStats(),
        fetchRequestStatusStats()
      ]).finally(() => setLoading(false));
    }
  }, [token, fetchUserRoleStats, fetchRequestStatusStats]);


  if (loading) {
    return <div style={messageStyle}>Loading dashboard data...</div>;
  }

  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Admin Dashboard Overview</h1>

      <div style={chartContainerStyle}>
        {/* User Role Distribution Pie Chart */}
        <div style={chartCardStyle}>
          <h2 style={chartTitleStyle}>User Distribution (Excluding Admins)</h2> {/* Updated title */}
          {userRoleStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ role, percent }) => `${role}: ${(percent * 100).toFixed(0)}%`}
                >
                  {userRoleStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} users`, props.payload.role]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={messageStyle}>No user role data available (excluding admins).</p>
          )}
        </div>

        {/* Help Request Status Bar Chart */}
        <div style={chartCardStyle}>
          <h2 style={chartTitleStyle}>Help Requests by Status</h2>
          {requestStatusStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={requestStatusStats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip formatter={(value, name, props) => [`${value} requests`, props.payload.status]} />
                <Legend />
                <Bar dataKey="count" fill="#2563eb">
                  {requestStatusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={messageStyle}>No request status data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
