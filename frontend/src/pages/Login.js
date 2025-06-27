// frontend/src/pages/Login.js
// This component provides the user login form, now designed for modal use.
// UPDATED: Adapted for modal display, uses onClose and onLoginSuccess/onRegisterTransition props.
// FIXED: Removed invalid inline style pseudo-classes (e.g., ':focus', ':hover')
//        and implemented dynamic styles using event handlers.

import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onClose, onLoginSuccess, onRegisterTransition }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, msg, user } = res.data;
      
      const userRole = user?.role || 'help_seeker';
      const userName = user?.name || 'User';

      setMessage(msg);
      setMessageType('success');
      
      setTimeout(() => {
        onLoginSuccess(token, userRole, userName);
        setMessage('');
      }, 1000);

    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.msg
                                 ? err.response.data.msg
                                 : 'Login failed. Please check your credentials.';
      setMessage(errorMessage);
      setMessageType('error');
    }
  };

  // Shared styles for form elements
 
  const formGroupStyle = {
    marginBottom: '0.5rem'
  };

  const formLabelStyle = {
    display: 'block',
    color: '#374151',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  };

  // Base style for form inputs
  const formInputBaseStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    marginBottom: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
  };

  // Focus style for form inputs
  const formInputFocusStyle = {
    outline: 'none',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)'
  };

  // Base style for submit button
  const submitBtnBaseStyle = {
    width: '100%',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    border: 'none',
    backgroundColor: '#2563eb',
    color: 'white',
    marginTop: '1rem'
  };

  // Hover style for submit button
  const submitBtnHoverStyle = {
    backgroundColor: '#1d4ed8'
  };

  const footerTextStyle = {
    textAlign: 'center',
    color: '#4b5563',
    fontSize: '0.875rem',
    marginTop: '1rem'
  };

  // Base style for link button
  const linkBtnBaseStyle = {
    color: '#2563eb',
    fontWeight: 'bold',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.3s ease'
  };

  // Hover style for link button
  const linkBtnHoverStyle = {
    color: '#1e40af'
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

  // State to manage input focus styles
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [submitBtnIsHovered, setSubmitBtnIsHovered] = useState(false);
  const [linkBtnIsHovered, setLinkBtnIsHovered] = useState(false);


  return (
    <div style={{ width: '100%', maxWidth: '28rem', margin: '0 auto' }}>
      
      
      {message && (
        <div style={messageType === 'success' ? successMessageBoxStyle : errorMessageBoxStyle}>
          {message}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={formGroupStyle}>
          <label htmlFor="email" style={formLabelStyle}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            style={{ ...formInputBaseStyle, ...(emailFocus ? formInputFocusStyle : {}) }}
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="password" style={formLabelStyle}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            style={{ ...formInputBaseStyle, ...(passwordFocus ? formInputFocusStyle : {}) }}
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
          />
        </div>
        <button
          type="submit"
          style={{ ...submitBtnBaseStyle, ...(submitBtnIsHovered ? submitBtnHoverStyle : {}) }}
          onMouseEnter={() => setSubmitBtnIsHovered(true)}
          onMouseLeave={() => setSubmitBtnIsHovered(false)}
        >
          Sign In
        </button>
      </form>
      <p style={footerTextStyle}>
        Don't have an account?{' '}
        <button
          onClick={() => { onClose(); onRegisterTransition(); }}
          style={{ ...linkBtnBaseStyle, ...(linkBtnIsHovered ? linkBtnHoverStyle : {}) }}
          onMouseEnter={() => setLinkBtnIsHovered(true)}
          onMouseLeave={() => setLinkBtnIsHovered(false)}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
