// frontend/src/pages/VolunteerDashboard.js
// This component provides the dashboard for volunteers to browse pending requests,
// accept them, and navigate to a separate page to manage accepted requests.
// UPDATED: Corrected the endpoint for accepting requests.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const VolunteerDashboard = ({ token, setCurrentPage }) => { // Added setCurrentPage prop
  const [pendingRequests, setPendingRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // --- Inline CSS Styles ---
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem', // Space between sections
    maxWidth: '900px',
    margin: 'auto',
    padding: '1rem'
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#059669', // Green for volunteer dashboard
    textAlign: 'center',
    marginBottom: '1.5rem'
  };

  const sectionTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#065f46', // Darker green
    marginBottom: '1rem'
  };

  const requestListStyle = {
    display: 'grid',
    gap: '1rem'
  };

  const requestItemStyle = {
    ...cardStyle,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  };

  const requestTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937' // Dark gray
  };

  const requestMetaStyle = {
    fontSize: '0.875rem',
    color: '#6b7280' // Medium gray
  };

  const requestDescriptionStyle = {
    fontSize: '1rem',
    color: '#374151', // Slightly darker gray
  };

  const btnAcceptStyle = {
    backgroundColor: '#22c55e', // Green
    color: 'white',
    padding: '0.6rem 1.2rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease'
  };

  const statusBadgeStyle = (status) => {
    let bgColor;
    let textColor = 'white';
    switch (status) {
      case 'pending': bgColor = '#f59e0b'; break; // Amber
      case 'accepted': bgColor = '#2563eb'; break; // Blue
      case 'completed': bgColor = '#059669'; break; // Dark Green
      case 'cancelled': bgColor = '#ef4444'; break; // Red
      default: bgColor = '#6b7280'; // Gray
    }
    return {
      backgroundColor: bgColor,
      color: textColor,
      padding: '0.25rem 0.5rem',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      display: 'inline-block'
    };
  };

  const messageBoxBaseStyle = {
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '0.375rem',
    textAlign: 'center'
  };

  const successMessageBoxStyle = {
    ...messageBoxBaseStyle,
    backgroundColor: '#d1fae5',
    color: '#065f46'
  };

  const errorMessageBoxStyle = {
    ...messageBoxBaseStyle,
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  };

  // Define config using useMemo to ensure it's only re-created when 'token' changes
  const memoizedConfig = useMemo(() => ({
    headers: {
      'x-auth-token': token
    }
  }), [token]);

  // Function to fetch all help requests (pending only for this dashboard)
  const fetchPendingRequests = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/volunteer/requests', memoizedConfig);
      // Filter requests to show only 'pending' ones on this dashboard
      const pending = res.data.filter(req => req.status === 'pending');
      setPendingRequests(pending);
    } catch (err) {
      console.error('Error fetching pending requests:', err.response ? err.response.data : err.message);
      setMessage('Failed to fetch pending requests.');
      setMessageType('error');
    }
  }, [memoizedConfig]);

  // Effect to fetch data on component load or token change
  useEffect(() => {
    if (token) {
      fetchPendingRequests();
    }
  }, [token, fetchPendingRequests]);

  // Handle accepting a request
  const handleAcceptRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to accept this request?')) {
      try {
        // CORRECTED: Use the /accept endpoint for accepting a request
        const res = await axios.put(`http://localhost:5000/api/volunteer/requests/${requestId}/accept`, {}, memoizedConfig);
        setMessage(res.data.msg);
        setMessageType('success');
        fetchPendingRequests(); // Re-fetch pending requests to remove the accepted one
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        console.error('Error accepting request:', err.response ? err.response.data : err.message);
        setMessage(err.response?.data?.msg || 'Failed to accept request.'); // Display specific backend message
        setMessageType('error');
      }
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Volunteer Dashboard</h1>

      {message && (
        <div style={messageType === 'success' ? successMessageBoxStyle : errorMessageBoxStyle}>
          {message}
        </div>
      )}

      {/* Available Pending Requests Section */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Available Pending Requests</h2>
        {pendingRequests.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>No pending requests available at the moment. Check back later!</p>
        ) : (
          <div style={requestListStyle}>
            {pendingRequests.map(request => (
              <div key={request._id} style={requestItemStyle}>
                <h3 style={requestTitleStyle}>{request.title}</h3>
                <p style={requestDescriptionStyle}>{request.description}</p>
                <div style={requestMetaStyle}>
                  <strong>Category:</strong> {request.category} | 
                  <strong>Status:</strong> <span style={statusBadgeStyle(request.status)}>{request.status}</span> |
                  <strong>Requested By:</strong> {request.user ? `${request.user.name} (${request.user.email})` : 'N/A'} |
                  <strong>Created:</strong> {new Date(request.createdAt).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => handleAcceptRequest(request._id)}
                    style={{ ...btnAcceptStyle, ':hover': { backgroundColor: '#16a34a' } }}
                  >
                    Accept Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
