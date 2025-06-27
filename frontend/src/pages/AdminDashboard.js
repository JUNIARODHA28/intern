// frontend/src/pages/AdminDashboard.js
// This component acts as the main container for the Admin section,
// managing different views like User Management, Request Management, Complaint Management,
// and now, the new Overview page.

import React, { useState } from 'react'; // Removed useEffect as it's not used
// Removed AdminNavbar import as it's not rendered in this component
import AdminUsersPage from './AdminUsersPage.js'; // Component for managing users
import AdminRequestsPage from './AdminRequestsPage.js'; // Component for managing requests
import AdminComplaintsPage from './AdminComplaintsPage.js'; // Corrected: Component for managing complaints
import AdminOverviewPage from './AdminOverviewPage.js'; // NEW: Component for the Overview page

const AdminDashboard = ({ token, setCurrentPage }) => {
  // `currentView` state manages which sub-component (page) is displayed within the Admin Dashboard.
  const [currentView, setCurrentView] = useState('overview'); // Default to overview

  // --- Inline CSS Styles ---
  const dashboardContainerStyle = {
    display: 'flex',
    minHeight: 'calc(100vh - 160px)', // Adjust based on App.js navbar/footer height
    backgroundColor: '#f3f4f6', // Light gray background
    borderRadius: '0.75rem',
    overflow: 'hidden', // Ensures inner content respects rounded corners
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const sidebarStyle = {
    width: '250px', // Fixed width sidebar
    backgroundColor: '#1f2937', // Dark gray sidebar
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
  };

  const mainContentStyle = {
    flexGrow: 1, // Takes remaining space
    padding: '1.5rem',
    backgroundColor: '#ffffff', // White background for content area
    borderRadius: '0.75rem',
    marginLeft: '1rem', // Space between sidebar and main content
  };

  const navButtonStyle = {
    backgroundColor: 'transparent',
    color: '#d1d5db', // Light gray text
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '1rem',
    fontWeight: 'medium',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    width: '100%', // Full width of sidebar
  };

  const navButtonHoverStyle = {
    backgroundColor: '#374151', // Slightly darker gray on hover
    color: '#f9fafb' // Lighter text on hover
  };

  const navButtonActiveStyle = {
    backgroundColor: '#2563eb', // Blue when active
    color: 'white',
    fontWeight: 'bold',
  };

  const logoutBtnStyle = {
    backgroundColor: '#dc2626', // Red
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginTop: 'auto', // Pushes button to the bottom of the sidebar
  };

  // Removed logoutBtnHoverStyle as it was not used.

  // Render the appropriate sub-component based on `currentView` state
  const renderAdminView = () => {
    switch (currentView) {
      case 'overview': // NEW case for overview
        return <AdminOverviewPage token={token} />;
      case 'users':
        return <AdminUsersPage token={token} />;
      case 'requests':
        return <AdminRequestsPage token={token} />;
      case 'complaints':
        return <AdminComplaintsPage token={token} />;
      default:
        return <AdminOverviewPage token={token} />; // Default to overview
    }
  };

  return (
    <div style={dashboardContainerStyle}>
      {/* Admin Sidebar Navigation */}
      <div style={sidebarStyle}>
        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
          Admin Panel
        </h2>
        {/* NEW: Overview Button */}
        <button
          onClick={() => setCurrentView('overview')}
          style={{
            ...navButtonStyle,
            ...(currentView === 'overview' ? navButtonActiveStyle : {}),
            ':hover': currentView === 'overview' ? navButtonActiveStyle : navButtonHoverStyle
          }}
        >
          Overview
        </button>
        {/* User Management Button */}
        <button
          onClick={() => setCurrentView('users')}
          style={{
            ...navButtonStyle,
            ...(currentView === 'users' ? navButtonActiveStyle : {}),
            ':hover': currentView === 'users' ? navButtonActiveStyle : navButtonHoverStyle
          }}
        >
          Manage Users
        </button>
        {/* Request Management Button */}
        <button
          onClick={() => setCurrentView('requests')}
          style={{
            ...navButtonStyle,
            ...(currentView === 'requests' ? navButtonActiveStyle : {}),
            ':hover': currentView === 'requests' ? navButtonActiveStyle : navButtonHoverStyle
          }}
        >
          Manage Requests
        </button>
        {/* Complaints Management Button */}
        <button
          onClick={() => setCurrentView('complaints')}
          style={{
            ...navButtonStyle,
            ...(currentView === 'complaints' ? navButtonActiveStyle : {}),
            ':hover': currentView === 'complaints' ? navButtonActiveStyle : navButtonHoverStyle
          }}
        >
          Manage Complaints
        </button>
        
        {/* Back to Home Button (or Logout) */}
        <button
          onClick={() => setCurrentPage('home')} // Navigate back to the main app home
          style={{
            ...logoutBtnStyle, // Using logout style as a general bold button
            backgroundColor: '#6b7280', // Gray for 'Back to Home'
            ':hover': { backgroundColor: '#4b5563' }
          }}
        >
          Back to Main Site
        </button>
      </div>

      {/* Main Content Area for the Admin View */}
      <div style={mainContentStyle}>
        {renderAdminView()} {/* Render the active admin sub-page */}
      </div>
    </div>
  );
};

export default AdminDashboard;
