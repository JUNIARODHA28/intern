// frontend/src/components/AdminNavbar.js
// This component provides the navigation bar specifically for the Admin Dashboard.
// It allows admins to switch between managing users, requests, and complaints.

import React from 'react';

const AdminNavbar = ({ setCurrentAdminPage, currentAdminPage }) => {
  // --- Inline CSS Styles ---
  const navbarStyle = {
    backgroundColor: '#b91c1c', // Darker red for admin nav
    padding: '0.75rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem', // Space between buttons
    flexWrap: 'wrap', // Allow wrapping on smaller screens
  };

  const navBtnBaseStyle = {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '0.6rem 1.2rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.1s ease',
    fontSize: '1rem',
    whiteSpace: 'nowrap', // Prevent text wrapping within button
  };

  const navBtnHoverStyle = {
    backgroundColor: '#ef4444', // Lighter red on hover
    transform: 'translateY(-1px)' // Slight lift effect
  };

  const navBtnActiveStyle = {
    backgroundColor: '#7f1d1d', // Even darker red for active
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)', // Inset shadow for active state
  };

  return (
    <nav style={navbarStyle}>
      <button
        onClick={() => setCurrentAdminPage('users')}
        style={{
          ...navBtnBaseStyle,
          ...(currentAdminPage === 'users' ? navBtnActiveStyle : {}),
          ':hover': navBtnHoverStyle // Pseudo-class for hover (JS simulation)
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = navBtnHoverStyle.backgroundColor}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentAdminPage === 'users' ? navBtnActiveStyle.backgroundColor : navBtnBaseStyle.backgroundColor}
      >
        Manage Users
      </button>

      <button
        onClick={() => setCurrentAdminPage('requests')}
        style={{
          ...navBtnBaseStyle,
          ...(currentAdminPage === 'requests' ? navBtnActiveStyle : {}),
          ':hover': navBtnHoverStyle
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = navBtnHoverStyle.backgroundColor}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentAdminPage === 'requests' ? navBtnActiveStyle.backgroundColor : navBtnBaseStyle.backgroundColor}
      >
        Manage Requests
      </button>

      <button
        onClick={() => setCurrentAdminPage('complaints')}
        style={{
          ...navBtnBaseStyle,
          ...(currentAdminPage === 'complaints' ? navBtnActiveStyle : {}),
          ':hover': navBtnHoverStyle
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = navBtnHoverStyle.backgroundColor}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentAdminPage === 'complaints' ? navBtnActiveStyle.backgroundColor : navBtnBaseStyle.backgroundColor}
      >
        View Complaints
      </button>
    </nav>
  );
};

export default AdminNavbar;
