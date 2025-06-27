// frontend/src/pages/ContactPage.js
// Placeholder for the Contact Us page.

import React from 'react';

const ContactPage = () => {
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
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2563eb', // Blue
    marginBottom: '1rem'
  };

  const textStyle = {
    fontSize: '1.125rem',
    color: '#4b5563',
    lineHeight: '1.6'
  };

  const linkStyle = {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 'bold'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Contact Us</h1>
        <p style={textStyle}>
          Have questions or need assistance? Feel free to reach out to us!
        </p>
        <p style={textStyle}>
          Email us at: <a href="mailto:support@helpingservice.com" style={linkStyle}>support@helpingservice.com</a>
        </p>
        <p style={textStyle}>
          You can also call us at: <a href="tel:+1234567890" style={linkStyle}>+1 (234) 567-890</a>
        </p>
        <p style={textStyle}>
          Our support team is available Monday - Friday, 9 AM - 5 PM.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
