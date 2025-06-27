// frontend/src/pages/Register.js
// This component provides the user registration form, now designed for modal use.
// UPDATED: Adapted for modal display, uses onClose and onRegisterSuccess/onLoginTransition props.
// FIXED: Removed invalid inline style pseudo-classes (e.g., ':focus', ':hover')
//        and implemented dynamic styles using event handlers.

import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onClose, onRegisterSuccess, onLoginTransition }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    password2: '',
    role: 'help_seeker'
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const { name, email, contactNumber, password, password2, role } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    if (password !== password2) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }

    const phoneRegex = /^[+]?[\s\d\-().]{7,20}$/;
    if (!contactNumber || !phoneRegex.test(contactNumber)) {
      setMessage('Please enter a valid contact number (7-20 digits, may include +, -, ()).');
      setMessageType('error');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        contactNumber,
        password,
        role
      });

      setMessage(res.data.msg);
      setMessageType('success');
      
      setTimeout(() => {
        onRegisterSuccess(); // This will handle closing register and opening login modal via App.js
        setMessage('');
      }, 2000);

    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.msg
                           ? err.response.data.msg
                           : 'Registration failed. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
    }
  };

  // Inline CSS styles
 
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

  // States to manage input focus styles
  const [nameFocus, setNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [contactFocus, setContactFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [password2Focus, setPassword2Focus] = useState(false);
  const [roleFocus, setRoleFocus] = useState(false); // For select element

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
          <label htmlFor="name" style={formLabelStyle}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            required
            style={{ ...formInputBaseStyle, ...(nameFocus ? formInputFocusStyle : {}) }}
            onFocus={() => setNameFocus(true)}
            onBlur={() => setNameFocus(false)}
          />
        </div>
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
          <label htmlFor="contactNumber" style={formLabelStyle}>Contact Number</label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={contactNumber}
            onChange={onChange}
            required
            style={{ ...formInputBaseStyle, ...(contactFocus ? formInputFocusStyle : {}) }}
            onFocus={() => setContactFocus(true)}
            onBlur={() => setContactFocus(false)}
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
            minLength="6"
            required
            style={{ ...formInputBaseStyle, ...(passwordFocus ? formInputFocusStyle : {}) }}
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="password2" style={formLabelStyle}>Confirm Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={onChange}
            minLength="6"
            required
            style={{ ...formInputBaseStyle, ...(password2Focus ? formInputFocusStyle : {}) }}
            onFocus={() => setPassword2Focus(true)}
            onBlur={() => setPassword2Focus(false)}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="role" style={formLabelStyle}>Register as</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={onChange}
            style={{ ...formInputBaseStyle, ...(roleFocus ? formInputFocusStyle : {}) }}
            onFocus={() => setRoleFocus(true)}
            onBlur={() => setRoleFocus(false)}
          >
            <option value="help_seeker">Help Seeker</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>
        <button
          type="submit"
          style={{ ...submitBtnBaseStyle, ...(submitBtnIsHovered ? submitBtnHoverStyle : {}) }}
          onMouseEnter={() => setSubmitBtnIsHovered(true)}
          onMouseLeave={() => setSubmitBtnIsHovered(false)}
        >
          Register
        </button>
      </form>
      <p style={footerTextStyle}>
        Already have an account?{' '}
        <button
          onClick={() => { onClose(); onLoginTransition(); }}
          style={{ ...linkBtnBaseStyle, ...(linkBtnIsHovered ? linkBtnHoverStyle : {}) }}
          onMouseEnter={() => setLinkBtnIsHovered(true)}
          onMouseLeave={() => setLinkBtnIsHovered(false)}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;
