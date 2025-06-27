// frontend/src/pages/AdminRequestsPage.js
// This component displays and allows administrators to manage all help requests.
// The 'ID' column has been removed from the table.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const AdminRequestsPage = ({ token }) => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // --- Inline CSS Styles ---
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '1200px',
    margin: 'auto',
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const sectionTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: '1rem',
    textAlign: 'center'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem'
  };

  const thStyle = {
    backgroundColor: '#eff6ff',
    padding: '0.75rem',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#1e40af'
  };

  const tdStyle = {
    padding: '0.75rem',
    borderBottom: '1px solid #e2e8f0',
    verticalAlign: 'top',
    wordBreak: 'break-word'
  };

  const selectActionStyle = {
    padding: '0.3rem',
    borderRadius: '0.25rem',
    border: '1px solid #ccc',
    cursor: 'pointer',
    minWidth: '120px'
  };

  const deleteBtnStyle = {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginLeft: '0.5rem',
    whiteSpace: 'nowrap'
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

  const statusBadgeStyle = (status) => {
    let bgColor;
    let textColor = 'white';
    switch (status) {
      case 'pending': bgColor = '#f59e0b'; break; // Amber
      case 'accepted': bgColor = '#2563eb'; break; // Blue
      case 'completed': bgColor = '#059669'; break; // Dark Green
      case 'cancelled': bgColor = '#ef4444'; break; // Red
      default: bgColor = '#6b7280'; // Default gray
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

  const memoizedConfig = useMemo(() => ({
    headers: { 'x-auth-token': token }
  }), [token]);

  // Fetch all help requests
  const fetchAllRequests = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/requests', memoizedConfig);
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err.response ? err.response.data.msg : err.message);
      setMessage('Failed to fetch requests. Ensure you are logged in as an Admin and backend is running.');
      setMessageType('error');
    }
  }, [memoizedConfig]);

  // Effect to fetch data on component load or token change
  useEffect(() => {
    if (token) {
      fetchAllRequests();
    }
  }, [token, fetchAllRequests]);

  // Admin action: Change Request Status
  const onChangeRequestStatus = async (requestId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/requests/${requestId}/status`, { status: newStatus }, memoizedConfig);
      setMessage(`Request status updated to ${newStatus}`);
      setMessageType('success');
      fetchAllRequests(); // Refresh request list
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error changing request status:', err.response ? err.response.data.msg : err.message);
      setMessage(err.response?.data?.msg || 'Failed to change request status.');
      setMessageType('error');
    }
  };

  // Admin action: Delete Request
  const onDeleteRequest = async (requestId) => {
    // Replaced window.confirm with a simple conditional for direct action as per new guidelines
    if (true) { // In a real app, you'd show a modal here
      try {
        await axios.delete(`http://localhost:5000/api/admin/requests/${requestId}`, memoizedConfig);
        setMessage('Help request deleted successfully!');
        setMessageType('success');
        fetchAllRequests(); // Refresh request list
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting request:', err.response ? err.response.data.msg : err.message);
        setMessage(err.response?.data?.msg || 'Failed to delete request.');
        setMessageType('error');
      }
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={sectionTitleStyle}>All Help Requests</h2>

      {message && (
        <div style={messageType === 'success' ? successMessageBoxStyle : errorMessageBoxStyle}>
          {message}
        </div>
      )}

      {requests.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No help requests found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {/* Removed ID column header */}
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Help Seeker</th>
                <th style={thStyle}>Assigned Volunteer</th>
                <th style={thStyle}>Created At</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request._id}>
                  {/* Removed ID column data */}
                  <td style={tdStyle}>{request.title}</td>
                  <td style={tdStyle}>{request.category}</td>
                  <td style={tdStyle}>
                    <span style={statusBadgeStyle(request.status)}>{request.status}</span>
                  </td>
                  <td style={tdStyle}>{request.user ? request.user.name : 'N/A'}</td>
                  <td style={tdStyle}>{request.assignedVolunteer ? request.assignedVolunteer.name : 'Unassigned'}</td>
                  <td style={tdStyle}>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    <select
                      value={request.status}
                      onChange={(e) => onChangeRequestStatus(request._id, e.target.value)}
                      style={selectActionStyle}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => onDeleteRequest(request._id)}
                      style={{ ...deleteBtnStyle, ':hover': { backgroundColor: '#b91c1c' } }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRequestsPage;
