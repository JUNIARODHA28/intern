// frontend/src/pages/HelpPage.js
// Placeholder for the Help/FAQ page.

import React from 'react';

const HelpPage = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)', // Adjust based on navbar/footer height
    padding: '1rem'
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    maxWidth: '800px',
    width: '100%'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: '1.5rem'
  };

  const faqItemStyle = {
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #e5e7eb' // Light gray border
  };

  const questionStyle = {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem'
  };

  const answerStyle = {
    fontSize: '1rem',
    color: '#4b5563',
    lineHeight: '1.5'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Help & FAQ</h1>
        
        <div style={faqItemStyle}>
          <h3 style={questionStyle}>How do I register?</h3>
          <p style={answerStyle}>
            Click on the "Register" button in the navigation bar. Fill in your name, email, password, and select your role (Help Seeker or Volunteer).
          </p>
        </div>

        <div style={faqItemStyle}>
          <h3 style={questionStyle}>How do I create a help request?</h3>
          <p style={answerStyle}>
            If you are a Help Seeker, log in and navigate to the "My Requests" dashboard. You will find a form there to create a new request.
          </p>
        </div>

        <div style={faqItemStyle}>
          <h3 style={questionStyle}>How can I volunteer?</h3>
          <p style={answerStyle}>
            Register as a Volunteer, then log in and navigate to your "Volunteer Dashboard". You can create your profile there and then review pending help requests.
          </p>
        </div>

        <div style={faqItemStyle}>
          <h3 style={questionStyle}>What if I forget my password?</h3>
          <p style={answerStyle}>
            (Feature not yet implemented: For now, please contact support. In future, we will add a password reset option.)
          </p>
        </div>

        <p style={{ ...answerStyle, marginTop: '1.5rem', textAlign: 'center' }}>
          If your question isn't answered here, please visit our <button onClick={() => window.location.href = '#contact'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', textDecoration: 'underline', fontSize: '1rem' }}>Contact Us</button> page.
        </p>
      </div>
    </div>
  );
};

export default HelpPage;
