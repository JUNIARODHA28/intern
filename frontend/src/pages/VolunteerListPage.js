// frontend/src/pages/VolunteerListPage.js
// This component displays a list of all available volunteers and allows viewing their public profiles in a modal.

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const VolunteerListPage = ({ token, setCurrentPage }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteerProfile, setSelectedVolunteerProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // --- Inline CSS Styles (copied/adapted from HelpSeekerDashboard for consistency) ---
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
    color: '#1e40af', // Dark blue
    textAlign: 'center',
    marginBottom: '1.5rem'
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

  const listStyle = {
    display: 'grid',
    gap: '1rem'
  };

  const listItemStyle = {
    ...cardStyle,
    padding: '1rem 1.5rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const itemTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1f2937'
  };

  const itemMetaStyle = {
    fontSize: '0.875rem',
    color: '#6b7280'
  };

  // Styles for the modal
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    maxWidth: '500px',
    width: '90%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const modalCloseBtnStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#374151'
  };


  // Memoized function to fetch all volunteers
  const fetchVolunteers = useCallback(async () => {
    try {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      const res = await axios.get('http://localhost:5000/api/users/volunteers', config);
      setVolunteers(res.data);
    } catch (err) {
      console.error('Error fetching volunteers:', err.response ? err.response.data : err.message);
      setMessage('Failed to load volunteer list. Please try again later.');
      setMessageType('error');
    }
  }, [token]);

  // Memoized function to fetch a single volunteer's public profile
  const fetchVolunteerProfile = useCallback(async (volunteerId) => {
    try {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      const res = await axios.get(`http://localhost:5000/api/users/${volunteerId}/profile`, config);
      setSelectedVolunteerProfile(res.data);
    } catch (err) {
      console.error('Error fetching volunteer profile:', err.response ? err.response.data : err.message);
      setMessage('Failed to load volunteer profile. It might not exist or an error occurred.');
      setMessageType('error');
      setSelectedVolunteerProfile(null);
    }
  }, [token]);

  // Effect to fetch volunteers when the component loads or token changes
  useEffect(() => {
    if (token) {
      fetchVolunteers();
    }
  }, [token, fetchVolunteers]);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Our Volunteers</h1>

      {message && (
        <div style={messageType === 'success' ? successMessageBoxStyle : errorMessageBoxStyle}>
          {message}
        </div>
      )}

      <div style={cardStyle}>
        {volunteers.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>No volunteers currently available.</p>
        ) : (
          <div style={listStyle}>
            {volunteers.map(volunteer => (
              <div key={volunteer._id} style={listItemStyle}>
                <div>
                  <h3 style={itemTitleStyle}>{volunteer.name}</h3>
                  <p style={itemMetaStyle}>{volunteer.email}</p>
                </div>
                <button
                  onClick={() => fetchVolunteerProfile(volunteer._id)}
                  style={{ ...btnPrimaryStyle, padding: '0.5rem 1rem', fontSize: '0.875rem', ':hover': { backgroundColor: '#1d4ed8' } }}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Volunteer Profile Modal */}
      {selectedVolunteerProfile && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={() => setSelectedVolunteerProfile(null)} style={modalCloseBtnStyle}>&times;</button>
            <h2 style={{ ...titleStyle, fontSize: '1.75rem', color: '#1e40af', marginBottom: '0.5rem' }}>Volunteer Profile</h2>
            <p><strong>Name:</strong> {selectedVolunteerProfile.user.name}</p>
            <p><strong>Email:</strong> {selectedVolunteerProfile.user.email}</p>
            {selectedVolunteerProfile.profile ? (
              <>
                <p><strong>Skills:</strong> {selectedVolunteerProfile.profile.skills || 'N/A'}</p>
                <p><strong>Availability:</strong> {selectedVolunteerProfile.profile.availability || 'N/A'}</p>
                <p><strong>Bio:</strong> {selectedVolunteerProfile.profile.bio || 'N/A'}</p>
                {/* Add more profile fields here as they are added to the backend VolunteerProfile model */}
              </>
            ) : (
              <p style={{ color: '#6b7280' }}>No detailed profile available for this volunteer yet.</p>
            )}
            <button
              onClick={() => setSelectedVolunteerProfile(null)}
              style={{ ...btnPrimaryStyle, marginTop: '1rem', width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerListPage;
