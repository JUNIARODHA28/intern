// frontend/src/pages/VolunteerEditProfilePage.js
// This component allows a logged-in volunteer to create or update their profile.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const VolunteerEditProfilePage = ({ token, setCurrentPage }) => {
  const [profileData, setProfileData] = useState({
    bio: '',
    skills: [],
    availability: [],
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const availableSkills = ['Driving', 'Cooking', 'Tutoring', 'Emotional Support', 'Errands', 'Gardening', 'Technical Support', 'Cleaning', 'Childcare', 'Pet Care', 'Other'];
  const availableAvailability = ['Weekdays Mornings', 'Weekdays Afternoons', 'Weekdays Evenings', 'Weekends Mornings', 'Weekends Afternoons', 'Weekends Evenings', 'Anytime'];

  // --- Inline CSS Styles ---
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '700px',
    margin: 'auto',
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#059669', // Green for volunteer actions
    textAlign: 'center',
    marginBottom: '1rem'
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
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    ':focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)'
    }
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '100px'
  };

  const multiSelectContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: '#f9fafb'
  };

  const checkboxLabelStyle = {
    backgroundColor: '#e0f2f7', // Light blue background
    color: '#0e7490', // Darker blue text
    padding: '0.4rem 0.8rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    fontSize: '0.9rem',
    fontWeight: '500'
  };

  const checkboxLabelCheckedStyle = {
    backgroundColor: '#0ea5e9', // Brighter blue when checked
    color: 'white',
    transform: 'scale(1.02)'
  };

  const hiddenCheckboxStyle = {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
    pointerEvents: 'none'
  };

  const submitBtnStyle = {
    backgroundColor: '#22c55e', // Green for submit
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginTop: '1rem',
    ':hover': { backgroundColor: '#16a34a' }
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

  // Memoized config for axios requests
  const memoizedConfig = useMemo(() => ({
    headers: {
      'x-auth-token': token
    }
  }), [token]);

  // Fetch existing profile data on component mount
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/volunteer/profile/me', memoizedConfig);
      const profile = res.data;
      setProfileData({
        bio: profile.bio || '',
        skills: profile.skills || [],
        availability: profile.availability || [],
        location: {
          address: profile.location?.address || '',
          city: profile.location?.city || '',
          state: profile.location?.state || '',
          zipCode: profile.location?.zipCode || ''
        }
      });
      setMessage('Profile loaded successfully.');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setMessage('No existing profile found. Please create one.');
        setMessageType('info'); // Use 'info' if you have a different style for it
      } else {
        console.error('Error fetching profile:', err.response ? err.response.data : err.message);
        setMessage(err.response?.data?.msg || 'Failed to fetch profile.');
        setMessageType('error');
      }
    }
  }, [memoizedConfig]);

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token, fetchProfile]);

  // Handle form input changes
  const onChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  // Handle multi-select changes for skills and availability
  const handleMultiSelectChange = (e, field) => {
    const { value, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  // Handle form submission
  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/volunteer/profile', profileData, memoizedConfig);
      setMessage(res.data.msg);
      setMessageType('success');
      // Optionally re-fetch profile to ensure UI is updated with latest data
      fetchProfile(); 
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error saving profile:', err.response ? err.response.data : err.message);
      setMessage(err.response?.data?.msg || 'Failed to save profile.');
      setMessageType('error');
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Edit Volunteer Profile</h1>

      {message && (
        <div style={messageType === 'success' ? successMessageBoxStyle : errorMessageBoxStyle}>
          {message}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div style={formGroupStyle}>
          <label htmlFor="bio" style={labelStyle}>Bio (Max 500 characters)</label>
          <textarea
            id="bio"
            name="bio"
            value={profileData.bio}
            onChange={onChange}
            maxLength="500"
            required
            style={textareaStyle}
          ></textarea>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Skills:</label>
          <div style={multiSelectContainerStyle}>
            {availableSkills.map(skill => (
              <label 
                key={skill} 
                style={{
                  ...checkboxLabelStyle,
                  ...(profileData.skills.includes(skill) ? checkboxLabelCheckedStyle : {})
                }}
              >
                <input
                  type="checkbox"
                  value={skill}
                  checked={profileData.skills.includes(skill)}
                  onChange={(e) => handleMultiSelectChange(e, 'skills')}
                  style={hiddenCheckboxStyle}
                />
                {skill}
              </label>
            ))}
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Availability:</label>
          <div style={multiSelectContainerStyle}>
            {availableAvailability.map(item => (
              <label 
                key={item} 
                style={{
                  ...checkboxLabelStyle,
                  ...(profileData.availability.includes(item) ? checkboxLabelCheckedStyle : {})
                }}
              >
                <input
                  type="checkbox"
                  value={item}
                  checked={profileData.availability.includes(item)}
                  onChange={(e) => handleMultiSelectChange(e, 'availability')}
                  style={hiddenCheckboxStyle}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Location Section */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Location (Optional):</label>
          <input
            type="text"
            name="location.address"
            value={profileData.location.address}
            onChange={onChange}
            placeholder="Street Address"
            style={inputStyle}
          />
          <input
            type="text"
            name="location.city"
            value={profileData.location.city}
            onChange={onChange}
            placeholder="City"
            style={{ ...inputStyle, marginTop: '1rem' }}
          />
          <input
            type="text"
            name="location.state"
            value={profileData.location.state}
            onChange={onChange}
            placeholder="State"
            style={{ ...inputStyle, marginTop: '1rem' }}
          />
          <input
            type="text"
            name="location.zipCode"
            value={profileData.location.zipCode}
            onChange={onChange}
            placeholder="Zip Code"
            style={{ ...inputStyle, marginTop: '1rem' }}
          />
        </div>

        <button type="submit" style={submitBtnStyle}>
          Save Profile
        </button>
      </form>

      <button
        onClick={() => setCurrentPage('volunteer-dashboard')}
        style={{ ...backBtnStyle, ':hover': { backgroundColor: '#4b5563' } }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default VolunteerEditProfilePage;
