// frontend/src/pages/LodgeComplaintPage.js
// Placeholder component for the "Lodge Complaint" page.
// This page will allow help seekers to file a complaint against a volunteer.

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const LodgeComplaintPage = ({ token, setCurrentPage }) => {
  const [complaintData, setComplaintData] = useState({
    title: '',
    description: '',
    againstVolunteerId: '' // ID of the volunteer being complained about
  });
  const [volunteers, setVolunteers] = useState([]); // List of available volunteers
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // --- Inline CSS Styles ---
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
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
    color: '#ef4444', // Red for complaints
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
    minHeight: '100px'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const btnSubmitStyle = {
    backgroundColor: '#ef4444', // Red
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

  const backBtnStyle = {
    backgroundColor: '#6b7280', // Gray for back button
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginTop: '1.5rem',
    width: 'fit-content',
    alignSelf: 'center'
  };

  // Memoized config for axios requests
  const memoizedConfig = useMemo(() => ({
    headers: {
      'x-auth-token': token
    }
  }), [token]);

  // Fetch all volunteers to populate the dropdown
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/volunteers', memoizedConfig);
        setVolunteers(res.data);
      } catch (err) {
        console.error('Error fetching volunteers:', err.response ? err.response.data : err.message);
        setMessage('Failed to load volunteer list. Ensure backend is running and you are logged in.');
        setMessageType('error');
      }
    };

    if (token) {
      fetchVolunteers();
    }
  }, [token, memoizedConfig]);

  // Handle form input changes
  const onChange = e => {
    setComplaintData({ ...complaintData, [e.target.name]: e.target.value });
  };

  // Handle complaint submission
  const onSubmit = async e => {
    e.preventDefault();
    if (!complaintData.againstVolunteerId) {
      setMessage('Please select a volunteer to file a complaint against.');
      setMessageType('error');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/helpseeker/complaints', complaintData, memoizedConfig);
      
      setMessage(res.data.msg);
      setMessageType('success');
      setComplaintData({ title: '', description: '', againstVolunteerId: '' }); // Clear form
      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      console.error('Error lodging complaint:', err.response ? err.response.data : err.message);
      setMessage(err.response?.data?.msg || 'Failed to lodge complaint.');
      setMessageType('error');
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Lodge a Complaint</h1>

      {message && (
        <div style={messageType === 'success' ? successMessageBoxStyle : errorMessageBoxStyle}>
          {message}
        </div>
      )}

      <div style={cardStyle}>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={formGroupStyle}>
            <label htmlFor="againstVolunteerId" style={labelStyle}>Complain Against Volunteer</label>
            <select
              id="againstVolunteerId"
              name="againstVolunteerId"
              value={complaintData.againstVolunteerId}
              onChange={onChange}
              required
              style={selectStyle}
            >
              <option value="">-- Select a Volunteer --</option>
              {volunteers.length === 0 ? (
                <option value="" disabled>No volunteers available</option>
              ) : (
                volunteers.map(volunteer => (
                  <option key={volunteer._id} value={volunteer._id}>
                    {volunteer.name} ({volunteer.email})
                  </option>
                ))
              )}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="title" style={labelStyle}>Complaint Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={complaintData.title}
              onChange={onChange}
              placeholder="e.g., Unresponsive volunteer, unprofessional behavior"
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="description" style={labelStyle}>Complaint Description</label>
            <textarea
              id="description"
              name="description"
              value={complaintData.description}
              onChange={onChange}
              placeholder="Provide detailed information about your complaint..."
              required
              style={textareaStyle}
            ></textarea>
          </div>

          <button
            type="submit"
            style={{ ...btnSubmitStyle, ':hover': { backgroundColor: '#b91c1c' } }}
          >
            Submit Complaint
          </button>
        </form>
      </div>

      {/* Button to navigate back to the main help seeker dashboard */}
      <button
        onClick={() => setCurrentPage('help-seeker-dashboard')}
        style={{ ...backBtnStyle, ':hover': { backgroundColor: '#4b5563' } }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default LodgeComplaintPage;
