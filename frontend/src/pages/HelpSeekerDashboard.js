// frontend/src/pages/HelpSeekerDashboard.js
// This component provides the dashboard for help seekers to create new help requests.
// Their existing requests are now on a separate page (HelpSeekerMyRequestsPage.js).
// The navigation links (View My Requests, View All Volunteers, Lodge Complaint) are now in the Navbar.

import React, { useState, useMemo } from 'react';
import axios from 'axios';

const HelpSeekerDashboard = ({ token, setCurrentPage }) => { // Added setCurrentPage prop
  // State for the new request form
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: 'Other' // Default category
  });

  // State for messages (success/error)
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // --- Inline CSS Styles ---
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem', // Space between sections
    maxWidth: '800px',
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
    color: '#1e40af', // Dark blue
    textAlign: 'center',
    marginBottom: '1.5rem'
  };

  const formGroupStyle = {
    marginBottom: '1rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '0.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    boxSizing: 'border-box' // Include padding in width
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '80px'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const btnPrimaryStyle = {
    backgroundColor: '#2563eb', // Blue
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease'
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

  // Removed navigation button styles as they are no longer needed on this page


  // Memoized config for axios requests
  const memoizedConfig = useMemo(() => ({
    headers: {
      'x-auth-token': token
    }
  }), [token]);

  // Handle form input changes for new request
  const onChange = e => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  // Handle submission of new help request
  const onSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/helpseeker/requests', newRequest, memoizedConfig);

      setMessage(data.msg);
      setMessageType('success');
      setNewRequest({ title: '', description: '', category: 'Other' }); // Reset form
      // No need to fetch requests here as they are on a different page

      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      console.error('Error creating request:', err.response ? err.response.data : err.message);
      setMessage(err.response?.data?.msg || 'Failed to create request.');
      setMessageType('error');
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Help Seeker Dashboard</h1>

      {message && (
        <div style={messageType === 'success' ? successMessageBoxStyle : errorMessageBoxStyle}>
          {message}
        </div>
      )}

      {/* Section to Create New Request */}
      <div style={cardStyle}>
        <h2 style={{ ...titleStyle, fontSize: '1.5rem', marginBottom: '1rem', color: '#1e40af' }}>Create New Help Request</h2>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Reordered: Category field first */}
          <div style={formGroupStyle}>
            <label htmlFor="category" style={labelStyle}>Category</label>
            <select
              id="category"
              name="category"
              value={newRequest.category}
              onChange={onChange}
              required
              style={selectStyle}
            >
              <option value="Groceries">Groceries</option>
              <option value="Transport">Transport</option>
              <option value="Errands">Errands</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="title" style={labelStyle}>Request Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newRequest.title}
              onChange={onChange}
              placeholder="e.g., Need help with grocery shopping"
              required
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="description" style={labelStyle}>Description</label>
            <textarea
              id="description"
              name="description"
              value={newRequest.description}
              onChange={onChange}
              placeholder="Provide more details about the help you need..."
              required
              style={textareaStyle}
            ></textarea>
          </div>
          <button type="submit" style={{ ...btnPrimaryStyle, ':hover': { backgroundColor: '#1d4ed8' } }}>
            Submit Request
          </button>
        </form>
      </div>

      {/* Removed: Navigation Buttons Section - these links are now in the Navbar */}

    </div>
  );
};

export default HelpSeekerDashboard;
