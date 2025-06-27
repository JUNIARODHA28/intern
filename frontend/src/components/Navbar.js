import React, { useState, useEffect, useRef } from 'react'; 

const Navbar = ({ setCurrentPage, token, userRole, userName, onLogout, onOpenRegisterModal, onOpenLoginModal }) => {
 
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
 
  const [showVolunteerDropdown, setShowVolunteerDropdown] = useState(false);
 
  const [showHelpSeekerDropdown, setShowHelpSeekerDropdown] = useState(false);

 
  const profileDropdownRef = useRef(null);
  const volunteerDropdownRef = useRef(null);

  const helpSeekerDropdownRef = useRef(null);


  const toggleProfileDropdown = () => {
    setShowProfileDropdown(prev => !prev);

    setShowVolunteerDropdown(false);
    setShowHelpSeekerDropdown(false);
  };

  
  const toggleVolunteerDropdown = () => {
    setShowVolunteerDropdown(prev => !prev);
    
    setShowProfileDropdown(false);
    setShowHelpSeekerDropdown(false);
  };

  
  const toggleHelpSeekerDropdown = () => {
    setShowHelpSeekerDropdown(prev => !prev);

    setShowProfileDropdown(false);
    setShowVolunteerDropdown(false);
  };


 
  useEffect(() => {
    const handleClickOutside = (event) => {
 
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
 
      if (volunteerDropdownRef.current && !volunteerDropdownRef.current.contains(event.target)) {
        setShowVolunteerDropdown(false);
      }
    
      if (helpSeekerDropdownRef.current && !helpSeekerDropdownRef.current.contains(event.target)) {
        setShowHelpSeekerDropdown(false);
      }
    };
   
    document.addEventListener('mousedown', handleClickOutside);
   
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const navbarStyle = {
    backgroundColor: '#1a2b40',
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
    flexWrap: 'wrap',
  };

  const brandButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '1.75rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
    ':hover': {
      backgroundColor: '#2e4157',
      transform: 'scale(1.02)'
    }
  };

  const navbarLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem', 
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginTop: '0', 
    '@media (max-width: 768px)': { 
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
    textDecoration: 'none', 
    whiteSpace: 'nowrap', 
    ':hover': {
      backgroundColor: '#2e4157',
      transform: 'translateY(-2px)'
    }
  };

  const logoutButtonStyle = {
    backgroundColor: '#dc2626', 
    color: 'white',
    padding: '0.6rem 1.2rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    width: '100%',
    textAlign: 'left',
    ':hover': {
      backgroundColor: '#b91c1c',
      transform: 'none'
    }
  };

 
  const profileIconButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '1.5rem', 
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    ':hover': {
      backgroundColor: '#2e4157'
    }
  };

 
  const dropdownContainerStyle = {
    position: 'relative',
    marginLeft: '1rem'
  };

 
  const dropdownMenuStyle = {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)',
    right: '0', 
    backgroundColor: '#1a2b40',
    borderRadius: '0.375rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    minWidth: '160px',
    zIndex: 1001 
  };

  const dropdownUsernameStyle = {
    color: '#a3a3a3',
    padding: '0.5rem 1rem',
    fontSize: '0.95rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis', 
    borderBottom: '1px solid #2e4157',
    marginBottom: '0.5rem',
    paddingBottom: '0.5rem',
    fontWeight: 'bold'
  };

  
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
       
        <button
          onClick={() => setCurrentPage('home')}
          style={brandButtonStyle}
          onMouseEnter={e => Object.assign(e.currentTarget.style, brandButtonStyle[':hover'])}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: brandButtonStyle.backgroundColor, transform: 'none' })}
        >
         Kind Neighbour
        </button>

       
        <div style={navbarLinksStyle}>
          {!token ? (
            <>
              <button
                onClick={onOpenRegisterModal} 
                style={navLinkButtonStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkButtonStyle[':hover'])}
                onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: navLinkButtonStyle.backgroundColor, transform: 'none' })}
              >
                Register
              </button>
              <button
                onClick={onOpenLoginModal}
                style={navLinkButtonStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkButtonStyle[':hover'])}
                onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: navLinkButtonStyle.backgroundColor, transform: 'none' })}
              >
                Login
              </button>
            </>
          ) : (
            <>
             
              {userRole === 'volunteer' && (
                <div style={dropdownContainerStyle} ref={volunteerDropdownRef}>
                  <button
                    onClick={toggleVolunteerDropdown}
                    style={navLinkButtonStyle} 
                    onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkButtonStyle[':hover'])}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: navLinkButtonStyle.backgroundColor, transform: 'none' })}
                  >
                    Volunteer &#9662;
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

             
              {userRole === 'help_seeker' && (
                <div style={dropdownContainerStyle} ref={helpSeekerDropdownRef}>
                  <button
                    onClick={toggleHelpSeekerDropdown}
                    style={navLinkButtonStyle}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkButtonStyle[':hover'])}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: navLinkButtonStyle.backgroundColor, transform: 'none' })}
                  >
                    Help Seeker &#9662; 
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
                  onClick={() => setCurrentPage('admin-dashboard')}
                  style={navLinkButtonStyle}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, navLinkButtonStyle[':hover'])}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: navLinkButtonStyle.backgroundColor, transform: 'none' })}
                >
                  Admin Dashboard
                </button>
              )}
              
              
              <div style={dropdownContainerStyle} ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  style={profileIconButtonStyle}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, profileIconButtonStyle[':hover'])}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: profileIconButtonStyle.backgroundColor })}
                >
                  👤
                </button>

                {showProfileDropdown && (
                  <div style={dropdownMenuStyle}>
                    <span style={dropdownUsernameStyle}>
                      {userName} ({userRole})
                    </span>
                    <button
                      onClick={() => { onLogout(); setShowProfileDropdown(false); }} 
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
