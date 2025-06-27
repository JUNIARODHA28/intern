// frontend/src/components/Navbar.js
// This component provides the navigation bar for the application.
// UPDATED: Added a profile icon with a dropdown menu showing user name and logout button.
// NEW: Added a dedicated "Volunteer" dropdown menu with links to Dashboard, My Handled Requests, and Edit Profile.
// NEW: Added a dedicated "Help Seeker" dropdown menu with links to Dashboard, My Requests, and Lodge Complaint.

import React, { useState, useEffect, useRef } from 'react'; // Import useState, useEffect, and useRef

const Navbar = ({ setCurrentPage, token, userRole, userName, onLogout, onOpenRegisterModal, onOpenLoginModal }) => {
  // State to control the visibility of the profile dropdown
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  // State to control the visibility of the volunteer-specific dropdown
  const [showVolunteerDropdown, setShowVolunteerDropdown] = useState(false);
  // NEW: State to control the visibility of the help-seeker-specific dropdown
  const [showHelpSeekerDropdown, setShowHelpSeekerDropdown] = useState(false);

  // Refs for the dropdown containers to detect clicks outside
  const profileDropdownRef = useRef(null);
  const volunteerDropdownRef = useRef(null);
  // NEW: Ref for help seeker dropdown
  const helpSeekerDropdownRef = useRef(null);

  // Toggle dropdown visibility for profile
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(prev => !prev);
    // Close other dropdowns if open
    setShowVolunteerDropdown(false);
    setShowHelpSeekerDropdown(false);
  };

  // Toggle dropdown visibility for volunteer specific menu
  const toggleVolunteerDropdown = () => {
    setShowVolunteerDropdown(prev => !prev);
    // Close other dropdowns if open
    setShowProfileDropdown(false);
    setShowHelpSeekerDropdown(false);
  };

  // NEW: Toggle dropdown visibility for help seeker specific menu
  const toggleHelpSeekerDropdown = () => {
    setShowHelpSeekerDropdown(prev => !prev);
    // Close other dropdowns if open
    setShowProfileDropdown(false);
    setShowVolunteerDropdown(false);
  };


  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      // Close volunteer dropdown
      if (volunteerDropdownRef.current && !volunteerDropdownRef.current.contains(event.target)) {
        setShowVolunteerDropdown(false);
      }
      // NEW: Close help seeker dropdown
      if (helpSeekerDropdownRef.current && !helpSeekerDropdownRef.current.contains(event.target)) {
        setShowHelpSeekerDropdown(false);
      }
    };
    // Add event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);
    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Inline CSS Styles for Navbar
  const navbarStyle = {
    backgroundColor: '#1a2b40', // Darker blue/indigo background
    padding: '1rem 0',
    color: '#ffffff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    fontFamily: 'Inter, sans-serif'
  };

  const navbarContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    flexWrap: 'wrap', // Allow wrapping on smaller screens
  };

  const brandButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '1.75rem', // text-2xl
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
    ':hover': {
      backgroundColor: '#2e4157', // Slightly lighter on hover
      transform: 'scale(1.02)'
    }
  };

  const navbarLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem', // Space between links/buttons
    flexWrap: 'wrap', // Allow links to wrap
    justifyContent: 'flex-end', // Align to right
    marginTop: '0', // Reset margin
    '@media (max-width: 768px)': { // Responsive adjustments
      width: '100%',
      justifyContent: 'center',
      marginTop: '1rem',
    }
  };

  const navLinkButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '0.6rem 1.2rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    textDecoration: 'none', // For button acting as link
    whiteSpace: 'nowrap', // Prevent text wrap
    ':hover': {
      backgroundColor: '#2e4157',
      transform: 'translateY(-2px)'
    }
  };

  const logoutButtonStyle = {
    backgroundColor: '#dc2626', // Red background for logout
    color: 'white',
    padding: '0.6rem 1.2rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    width: '100%', // Full width in dropdown
    textAlign: 'left', // Align text to left
    ':hover': {
      backgroundColor: '#b91c1c', // Darker red on hover
      transform: 'none' // No transform for dropdown item
    }
  };

  // Profile icon button style
  const profileIconButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '1.5rem', // Adjust size of icon
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%', // Circular button
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px', // Fixed size for icon circle
    height: '40px',
    ':hover': {
      backgroundColor: '#2e4157'
    }
  };

  // Dropdown container style for all dropdowns
  const dropdownContainerStyle = {
    position: 'relative', // For positioning the dropdown menu
    marginLeft: '1rem' // Space from other navbar items
  };

  // Dropdown menu style
  const dropdownMenuStyle = {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)', // Position below the button with some space
    right: '0', // Align to the right of the button
    backgroundColor: '#1a2b40', // Same as navbar background
    borderRadius: '0.375rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem', // Space between dropdown items
    minWidth: '160px', // Minimum width for readability
    zIndex: 1001 // Ensure dropdown is above other content
  };

  const dropdownUsernameStyle = {
    color: '#a3a3a3', // Lighter grey
    padding: '0.5rem 1rem',
    fontSize: '0.95rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis', // Add ellipsis for long names
    borderBottom: '1px solid #2e4157', // Separator
    marginBottom: '0.5rem',
    paddingBottom: '0.5rem',
    fontWeight: 'bold'
  };

  // Dropdown menu item button style
  const dropdownItemButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    width: '100%',
    textAlign: 'left',
    ':hover': {
      backgroundColor: '#2e4157'
    }
  };

  return (
    <nav style={navbarStyle}>
      <div style={navbarContainerStyle}>
        {/* Brand/Logo - clicking takes to home page */}
        <button
          onClick={() => setCurrentPage('home')}
          style={brandButtonStyle}
          onMouseEnter={e => Object.assign(e.currentTarget.style, brandButtonStyle[':hover'])}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: brandButtonStyle.backgroundColor, transform: 'none' })}
        >
         Kind Neighbour
        </button>

        {/* Navigation links */}
        <div style={navbarLinksStyle}>
          {!token ? ( // If no token, show Register and Login
            <>
              <button
                onClick={onOpenRegisterModal} // Call modal open handler
                style={navLinkButtonStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkButtonStyle[':hover'])}
                onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: navLinkButtonStyle.backgroundColor, transform: 'none' })}
              >
                Register
              </button>
              <button
                onClick={onOpenLoginModal} // Call modal open handler
                style={navLinkButtonStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkButtonStyle[':hover'])}
                onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: navLinkButtonStyle.backgroundColor, transform: 'none' })}
              >
                Login
              </button>
            </>
          ) : ( // If logged in (token exists), show specific links and Logout
            <>
              {/* Conditional Volunteer links */}
              {userRole === 'volunteer' && (
                <div style={dropdownContainerStyle} ref={volunteerDropdownRef}>
                  <button
                    onClick={toggleVolunteerDropdown}
                    style={navLinkButtonStyle} // Use navLinkButtonStyle for the main dropdown button
                    onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkButtonStyle[':hover'])}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: navLinkButtonStyle.backgroundColor, transform: 'none' })}
                  >
                    Volunteer &#9662; {/* Down arrow */}
                  </button>
                  {showVolunteerDropdown && (
                    <div style={dropdownMenuStyle}>
                      <button
                        onClick={() => { setCurrentPage('volunteer-dashboard'); setShowVolunteerDropdown(false); }}
                        style={dropdownItemButtonStyle}
                        onMouseEnter={e => Object.assign(e.currentTarget.style, dropdownItemButtonStyle[':hover'])}
                        onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: dropdownItemButtonStyle.backgroundColor })}
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => { setCurrentPage('volunteer-my-requests'); setShowVolunteerDropdown(false); }}
                        style={dropdownItemButtonStyle}
                        onMouseEnter={e => Object.assign(e.currentTarget.style, dropdownItemButtonStyle[':hover'])}
                        onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: dropdownItemButtonStyle.backgroundColor })}
                      >
                        My Handled Requests
                      </button>
                      <button
                        onClick={() => { setCurrentPage('volunteer-edit-profile'); setShowVolunteerDropdown(false); }}
                        style={dropdownItemButtonStyle}
                        onMouseEnter={e => Object.assign(e.currentTarget.style, dropdownItemButtonStyle[':hover'])}
                        onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: dropdownItemButtonStyle.backgroundColor })}
                      >
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* NEW: Conditional Help Seeker links */}
              {userRole === 'help_seeker' && (
                <div style={dropdownContainerStyle} ref={helpSeekerDropdownRef}>
                  <button
                    onClick={toggleHelpSeekerDropdown}
                    style={navLinkButtonStyle} // Use navLinkButtonStyle for the main dropdown button
                    onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkButtonStyle[':hover'])}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: navLinkButtonStyle.backgroundColor, transform: 'none' })}
                  >
                    Help Seeker &#9662; {/* Down arrow */}
                  </button>
                  {showHelpSeekerDropdown && (
                    <div style={dropdownMenuStyle}>
                      <button
                        onClick={() => { setCurrentPage('help-seeker-dashboard'); setShowHelpSeekerDropdown(false); }}
                        style={dropdownItemButtonStyle}
                        onMouseEnter={e => Object.assign(e.currentTarget.style, dropdownItemButtonStyle[':hover'])}
                        onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: dropdownItemButtonStyle.backgroundColor })}
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => { setCurrentPage('help-seeker-my-requests'); setShowHelpSeekerDropdown(false); }}
                        style={dropdownItemButtonStyle}
                        onMouseEnter={e => Object.assign(e.currentTarget.style, dropdownItemButtonStyle[':hover'])}
                        onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: dropdownItemButtonStyle.backgroundColor })}
                      >
                        My Requests
                      </button>
                      <button
                        onClick={() => { setCurrentPage('lodge-complaint'); setShowHelpSeekerDropdown(false); }}
                        style={dropdownItemButtonStyle}
                        onMouseEnter={e => Object.assign(e.currentTarget.style, dropdownItemButtonStyle[':hover'])}
                        onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: dropdownItemButtonStyle.backgroundColor })}
                      >
                        Lodge Complaint
                      </button>
                    </div>
                  )}
                </div>
              )}

              {userRole === 'admin' && (
                <button
                  onClick={() => setCurrentPage('admin-dashboard')} // Placeholder for Admin Dashboard
                  style={navLinkButtonStyle}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkButtonStyle[':hover'])}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: navLinkButtonStyle.backgroundColor, transform: 'none' })}
                >
                  Admin Dashboard
                </button>
              )}
              
              {/* Profile Icon and Dropdown */}
              <div style={dropdownContainerStyle} ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  style={profileIconButtonStyle}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, profileIconButtonStyle[':hover'])}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: profileIconButtonStyle.backgroundColor })}
                >
                  👤 {/* Profile icon (using an emoji as a simple placeholder) */}
                </button>

                {showProfileDropdown && (
                  <div style={dropdownMenuStyle}>
                    <span style={dropdownUsernameStyle}>
                      {userName} ({userRole})
                    </span>
                    <button
                      onClick={() => { onLogout(); setShowProfileDropdown(false); }} // Call logout and close dropdown
                      style={logoutButtonStyle}
                      onMouseEnter={e => Object.assign(e.currentTarget.style, logoutButtonStyle[':hover'])}
                      onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: logoutButtonStyle.backgroundColor, transform: 'none' })}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
