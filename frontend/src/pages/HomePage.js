// frontend/src/pages/HomePage.js
// This component represents the main landing page of the application, now with inline CSS and integrated with App.js for auth modals.
// It showcases the key features of the platform for different user roles,
// with a focus on conciseness and enhanced UI.
// UPDATED: Removed internal modal state, now receives modal open handlers from App.js.

import React from 'react';
// No need to import Modal, Register, Login directly here as they are handled by App.js

const HomePage = ({ token, userRole, onOpenRegisterModal, onOpenLoginModal }) => { // Added modal open handlers as props
  // Shared card style
  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', // Enhanced shadow
    marginBottom: '2rem',
    border: '1px solid #e2e8f0', // Subtle border
    transition: 'all 0.3s ease-in-out' // Smooth transitions for cards
  };

  const sectionTitleStyle = {
    fontSize: '2.5rem', // Larger, more prominent title
    fontWeight: '800',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: '2rem', // More space below title
    lineHeight: '1.2'
  };

  const featureCategoryTitleStyle = {
    fontSize: '2rem', // Slightly larger category titles
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: '1.25rem',
    borderBottom: '3px solid #93c5fd', // Thicker, more vibrant underline
    paddingBottom: '0.75rem',
    textAlign: 'left'
  };

  const featureItemStyle = {
    fontSize: '1.125rem',
    color: '#374151',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    borderRadius: '0.6rem',
    transition: 'all 0.3s ease-out',
    backgroundColor: '#f8fafc',
    border: '1px solid #f0f4f8'
  };

  const featureItemHoverStyle = {
    backgroundColor: '#e0f7fa',
    transform: 'translateY(-5px) scale(1.02)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
  };

  const iconStyle = {
    fontSize: '1.8rem',
    color: '#4f46e5',
    flexShrink: 0,
    lineHeight: '1',
    transition: 'transform 0.3s ease-out',
    filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))'
  };

  const iconHoverStyle = {
    transform: 'scale(1.2) rotate(5deg)'
  };

  const introTextStyle = {
    fontSize: '1.3rem',
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: '3rem',
    maxWidth: '900px',
    lineHeight: '1.8'
  };

  const welcomeTitleStyle = {
    fontSize: '4.5rem',
    fontWeight: '900',
    color: '#059669',
    textAlign: 'center',
    marginBottom: '1.5rem',
    textShadow: '3px 3px 6px rgba(0,0,0,0.15)'
  };

  const callToActionStyle = {
    fontSize: '1.25rem',
    color: '#4b5563',
    textAlign: 'center',
    marginTop: '2.5rem',
    fontWeight: '500'
  };

  const highlightStyle = {
    fontWeight: 'bold',
    color: '#2563eb'
  };

  const linkButtonStyle = {
    color: '#2563eb',
    fontWeight: 'bold',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'color 0.2s ease',
    fontSize: '1.25rem' // Match callToActionStyle font size
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#eef2f6',
      minHeight: 'calc(100vh - 160px)',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Main Welcome Section */}
      <div style={{ ...cardStyle, textAlign: 'center', maxWidth: '1000px', padding: '3.5rem' }}>
        <h1 style={welcomeTitleStyle}>
          Welcome to Kind Neighbour!
        </h1>
        <p style={introTextStyle}>
          Connecting compassionate volunteers with individuals in need. Join our community to give or receive help, fostering a stronger, more supportive environment.
        </p>
      </div>

      {/* Features Section */}
      <div style={{ ...cardStyle, maxWidth: '1000px', padding: '3rem' }}>
        <h2 style={sectionTitleStyle}>Explore Our Features</h2>

        {/* Features for Help Seekers */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={featureCategoryTitleStyle}>For Help Seekers</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {['📋 Request Assistance: Easily post needs (groceries, transport, emotional support, errands).',
              '✅ Track Status: Monitor your requests from pending to completed.',
              '👤 View Volunteers: Browse profiles of dedicated volunteers.',
              '⭐ Rate & Review: Provide feedback for completed services.',
              '🚨 Lodge Complaints: Ensure a safe and respectful environment.'
            ].map((text, index) => (
              <li
                key={index}
                style={featureItemStyle}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, featureItemHoverStyle);
                  e.currentTarget.querySelector('span').style.transform = iconHoverStyle.transform;
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, featureItemStyle); // Revert to base
                  e.currentTarget.querySelector('span').style.transform = 'scale(1)';
                }}
              >
                <span style={iconStyle}>{text.split(':')[0].trim()}</span> {text.split(':')[1].trim()}
              </li>
            ))}
          </ul>
        </div>

        {/* Features for Volunteers */}
        <div>
          <h3 style={featureCategoryTitleStyle}>For Volunteers</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {['🤝 Browse & Accept: Discover and accept pending help requests.',
              '📝 Manage Requests: Update status to "completed" or "cancelled".',
              '📊 Public Profile: Showcase your skills and availability.',
              '👍 Receive Ratings: Get recognition for your efforts.'
            ].map((text, index) => (
              <li
                key={index}
                style={featureItemStyle}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, featureItemHoverStyle);
                  e.currentTarget.querySelector('span').style.transform = iconHoverStyle.transform;
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, featureItemStyle); // Revert to base
                  e.currentTarget.querySelector('span').style.transform = 'scale(1)';
                }}
              >
                <span style={iconStyle}>{text.split(':')[0].trim()}</span> {text.split(':')[1].trim()}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Call to Action Section */}
      {!token && (
        <div style={{ ...cardStyle, textAlign: 'center', maxWidth: '800px', padding: '2.5rem' }}>
          <p style={callToActionStyle}>
            Ready to make a difference? Please {' '}
            <button
              onClick={onOpenRegisterModal} // Use prop to open register modal
              style={{ ...linkButtonStyle, ':hover': { color: '#1e40af' } }}
            >
             Sign Up
            </button>
            {' '} or {' '}
            <button
              onClick={onOpenLoginModal} // Use prop to open login modal
              style={{ ...linkButtonStyle, ':hover': { color: '#1e40af' } }}
            >
             Sign In
            </button>
            {' '} to get started!
          </p>
        </div>
      )}

      {token && (
        <div style={{ ...cardStyle, textAlign: 'center', maxWidth: '800px', padding: '2.5rem' }}>
          <p style={{ ...callToActionStyle, marginBottom: '0' }}>
            You are logged in as <span style={highlightStyle}>{userRole}</span>. Navigate using the menu above!
          </p>
        </div>
      )}

      {/* Modals are now rendered in App.js */}
    </div>
  );
};

export default HomePage;
