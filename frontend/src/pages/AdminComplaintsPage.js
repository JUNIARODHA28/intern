// frontend/src/pages/AdminComplaintsPage.js
// This component displays and allows administrators to view and manage complaints.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const AdminComplaintsPage = ({ token }) => {
  const [complaints, setComplaints] = useState([]);
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
      case 'reviewed': bgColor = '#2563eb'; break; // Blue
      case 'resolved': bgColor = '#059669'; break; // Dark Green
      case 'dismissed': bgColor = '#ef4444'; break; // Red
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

  // Fetch all complaints
  const fetchAllComplaints = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/complaints', memoizedConfig);
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching complaints:', err.response ? err.response.data.msg : err.message);
      setMessage('Failed to fetch complaints. Ensure you are logged in as an Admin and backend is running.');
      setMessageType('error');
    }
  }, [memoizedConfig]);

  // Effect to fetch data on component load or token change
  useEffect(() => {
    if (token) {
      fetchAllComplaints();
    }
  }, [token, fetchAllComplaints]);

  // Admin action: Change Complaint Status
  const onChangeComplaintStatus = async (complaintId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/complaints/${complaintId}/status`, { status: newStatus }, memoizedConfig);
      setMessage(`Complaint status updated to ${newStatus}`);
      setMessageType('success');
      fetchAllComplaints(); // Refresh complaint list
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error changing complaint status:', err.response ? err.response.data.msg : err.message);
      setMessage(err.response?.data?.msg || 'Failed to change complaint status.');
      setMessageType('error');
    }
  };

  return (
    <React.Fragment> {/* Added React.Fragment as a wrapper */}
      <div style={containerStyle}>
        <h2 style={sectionTitleStyle}>All Complaints</h2>

        {message && (
          <div style={messageType === 'success' ? successMessageBoxStyle : errorMessageBoxStyle}>
            {message}
          </div>
        )}

        {complaints.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>No complaints filed yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Filed By</th>
                  <th style={thStyle}>Against Volunteer</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Filed On</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(complaint => (
                  <tr key={complaint._id}>
                    <td style={tdStyle}>{complaint.title}</td>
                    <td style={tdStyle}>{complaint.description}</td>
                    <td style={tdStyle}>{complaint.filedBy ? `${complaint.filedBy.name} (${complaint.filedBy.email})` : 'N/A'}</td>
                    <td style={tdStyle}>{complaint.againstVolunteer ? `${complaint.againstVolunteer.name} (${complaint.againstVolunteer.email})` : 'N/A'}</td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle(complaint.status)}>{complaint.status}</span>
                    </td>
                    <td style={tdStyle}>{new Date(complaint.filedAt).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                          <select
                              value={complaint.status}
                              onChange={(e) => onChangeComplaintStatus(complaint._id, e.target.value)}
                              style={selectActionStyle}
                          >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="resolved">Resolved</option>
                              <option value="dismissed">Dismissed</option>
                          </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </React.Fragment>
  );
};

export default AdminComplaintsPage;
