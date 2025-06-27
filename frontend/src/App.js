import React, { useState, useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import Modal from './components/Modal';
import VolunteerDashboard from './pages/VolunteerDashboard';
import VolunteerMyRequestsPage from './pages/VolunteerMyRequestsPage';
import HelpSeekerDashboard from './pages/HelpSeekerDashboard';
import VolunteerEditProfilePage from './pages/VolunteerEditProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import HelpSeekerMyRequestsPage from './pages/HelpSeekerMyRequestsPage';
import LodgeComplaintPage from './pages/LodgeComplaintPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
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
    localStorage.setItem('userName', name);
    setShowLoginModal(false);

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
        setCurrentPage('home');
        break;
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUserRole(null);
    setUserName('User');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setCurrentPage('home');
  };

  const handleOpenRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };
  const handleCloseRegisterModal = () => setShowRegisterModal(false);

  const handleOpenLoginModal = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const renderPage = () => {
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
      case 'help-seeker-my-requests':
        return <HelpSeekerMyRequestsPage token={token} setCurrentPage={setCurrentPage} />;
      case 'lodge-complaint':
        return <LodgeComplaintPage token={token} setCurrentPage={setCurrentPage} />;
      case 'admin-dashboard':
        return <AdminDashboard token={token} setCurrentPage={setCurrentPage} />;
      default:
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
        userName={userName}
        onLogout={handleLogout}
        onOpenRegisterModal={handleOpenRegisterModal}
        onOpenLoginModal={handleOpenLoginModal}
      />
      
      <main className="main-content container">
        {renderPage()}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Helping Service. All rights reserved.</p>
      </footer>

      <Modal show={showRegisterModal} onClose={handleCloseRegisterModal} title="Register">
        <Register
          onClose={handleCloseRegisterModal}
          onRegisterSuccess={handleRegisterSuccess}
          onLoginTransition={handleOpenLoginModal}
        />
      </Modal>

      <Modal show={showLoginModal} onClose={handleCloseLoginModal} title="Login">
        <Login
          onClose={handleCloseLoginModal}
          onLoginSuccess={handleLoginSuccess}
          onRegisterTransition={handleOpenRegisterModal}
        />
      </Modal>
    </div>
  );
}

export default App;
