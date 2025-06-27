// frontend/src/App.js
// This is the main component of our React application. It acts as the container
// for different pages, handles basic navigation, AND manages the state for auth modals.
// UPDATED: Login now redirects directly to the user's respective dashboard.
// FIXED: Ensured correct routing for Help Seeker's "My Requests" and "Lodge Complaint" pages.
// DEBUGGING: Includes console logs to renderPage to track current page.
// FIXED: Corrected import syntax for React and hooks.

import React, { useState, useEffect } from 'react';
import './index.css'; // Import global CSS
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Register from './pages/Register'; // Import Register component for modal
import Login from './pages/Login';     // Import Login component for modal
import Modal from './components/Modal';   // Import Modal component

// Import Dashboard and specific pages
import VolunteerDashboard from './pages/VolunteerDashboard';
import VolunteerMyRequestsPage from './pages/VolunteerMyRequestsPage';
import HelpSeekerDashboard from './pages/HelpSeekerDashboard';
import VolunteerEditProfilePage from './pages/VolunteerEditProfilePage'; // Placeholder for Edit Profile
import AdminDashboard from './pages/AdminDashboard'; // Placeholder for Admin Dashboard

// Import Help Seeker specific pages
import HelpSeekerMyRequestsPage from './pages/HelpSeekerMyRequestsPage'; // Placeholder for Help Seeker's My Requests
import LodgeComplaintPage from './pages/LodgeComplaintPage'; // Placeholder for Lodge Complaint page


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User'); // New state for userName

  // States for modal visibility
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // On initial load, try to get token, role, and name from localStorage
    setToken(localStorage.getItem('token'));
    setUserRole(localStorage.getItem('userRole'));
    setUserName(localStorage.getItem('userName') || 'User');
  }, []);

  const handleLoginSuccess = (newToken, role, name) => {
    setToken(newToken);
    setUserRole(role);
    setUserName(name);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name); // Store userName in localStorage
    setShowLoginModal(false); // Close login modal on successful login

    // Redirect based on user role after login
    switch (role) {
      case 'volunteer':
        setCurrentPage('volunteer-dashboard');
        break;
      case 'help_seeker':
        setCurrentPage('help-seeker-dashboard');
        break;
      case 'admin':
        setCurrentPage('admin-dashboard');
        break;
      default:
        setCurrentPage('home'); // Fallback to home if role is unknown
        break;
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUserRole(null);
    setUserName('User'); // Reset userName on logout
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName'); // Remove userName from localStorage
    setCurrentPage('home'); // Always go to home on logout
  };

  // Handlers for modal visibility (passed down to children)
  const handleOpenRegisterModal = () => {
    setShowLoginModal(false); // Close login modal if open
    setShowRegisterModal(true);
  };
  const handleCloseRegisterModal = () => setShowRegisterModal(false);

  const handleOpenLoginModal = () => {
    setShowRegisterModal(false); // Close register modal if open
    setShowLoginModal(true);
  };
  const handleCloseLoginModal = () => setShowLoginModal(false);

  // This function is called by Register after successful registration
  // It closes the register modal and opens the login modal
  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };


  const renderPage = () => {
    // DEBUGGING: Log the current page being rendered
    console.log('Current Page to Render:', currentPage);

    switch (currentPage) {
      case 'home':
        return <HomePage token={token} userRole={userRole} onOpenRegisterModal={handleOpenRegisterModal} onOpenLoginModal={handleOpenLoginModal} />;
      case 'volunteer-dashboard':
        return <VolunteerDashboard token={token} setCurrentPage={setCurrentPage} />;
      case 'volunteer-my-requests':
        return <VolunteerMyRequestsPage token={token} setCurrentPage={setCurrentPage} />;
      case 'volunteer-edit-profile':
        return <VolunteerEditProfilePage token={token} setCurrentPage={setCurrentPage} userName={userName} userRole={userRole} />;
      case 'help-seeker-dashboard':
        return <HelpSeekerDashboard token={token} setCurrentPage={setCurrentPage} />;
      // Help Seeker specific pages
      case 'help-seeker-my-requests':
        return <HelpSeekerMyRequestsPage token={token} setCurrentPage={setCurrentPage} />;
      case 'lodge-complaint':
        return <LodgeComplaintPage token={token} setCurrentPage={setCurrentPage} />;
      case 'admin-dashboard':
        return <AdminDashboard token={token} setCurrentPage={setCurrentPage} />;
      default:
        // This default case will render HomePage if currentPage is not recognized
        console.warn('Unknown currentPage value:', currentPage, '. Redirecting to Home.');
        return <HomePage token={token} userRole={userRole} onOpenRegisterModal={handleOpenRegisterModal} onOpenLoginModal={handleOpenLoginModal} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar
        setCurrentPage={setCurrentPage}
        token={token}
        userRole={userRole}
        userName={userName} // Pass userName to Navbar
        onLogout={handleLogout}
        onOpenRegisterModal={handleOpenRegisterModal} // Pass modal handlers to Navbar
        onOpenLoginModal={handleOpenLoginModal}     // Pass modal handlers to Navbar
      />
      
      <main className="main-content container">
        {renderPage()}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Helping Service. All rights reserved.</p>
      </footer>

      {/* Register Modal (rendered by App.js) */}
      <Modal show={showRegisterModal} onClose={handleCloseRegisterModal} title="Register">
        <Register
          onClose={handleCloseRegisterModal} // Allows Register form to close itself if needed
          onRegisterSuccess={handleRegisterSuccess} // After success, close Register and open Login
          onLoginTransition={handleOpenLoginModal} // Allows direct switch to login from Register footer
        />
      </Modal>

      {/* Login Modal (rendered by App.js) */}
      <Modal show={showLoginModal} onClose={handleCloseLoginModal} title="Login">
        <Login
          onClose={handleCloseLoginModal} // Allows Login form to close itself if needed
          onLoginSuccess={handleLoginSuccess} // Handles global login state and modal close
          onRegisterTransition={handleOpenRegisterModal} // Allows direct switch to register from Login footer
        />
      </Modal>
    </div>
  );
}

export default App;