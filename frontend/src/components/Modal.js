// frontend/src/components/Modal.js
// This component provides a reusable modal (pop-up) overlay.
// UPDATED: Increased the maximum width of the modal content for a larger appearance.

import React from 'react';

const Modal = ({ show, onClose, children, title }) => {
  // If show is false, don't render the modal
  if (!show) {
    return null;
  }

  // Inline CSS for the modal backdrop and content
  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark semi-transparent background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000 // Ensure modal is on top of other content
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)', // Stronger shadow for depth
    // Adjusted maxWidth to make the modal bigger.
    // Changed from '90%' which could be too small on larger screens,
    // to a fixed px value or a larger percentage.
    maxWidth: '900px', // Increased maximum width (e.g., from default 90% or smaller px)
    width: '700px', // Allow content to dictate width up to maxWidth
    maxHeight: '80%', // Responsive height
    overflowY: 'auto', // Enable scrolling for long content
    position: 'relative', // For close button positioning
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, sans-serif' // Consistent font
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#374151', // Dark gray color
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  };

  const modalTitleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #e0e7ff', // Subtle underline
    paddingBottom: '1rem',
    flexShrink: 0 // Prevent title from shrinking
  };

  return (
    <div style={backdropStyle} onClick={onClose}> {/* Click backdrop to close */}
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}> {/* Prevent click from closing modal */}
        <button
          onClick={onClose}
          style={closeButtonStyle}
          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} // Red on hover
          onMouseLeave={e => e.currentTarget.style.color = '#374151'} // Revert color
        >
          &times; {/* HTML entity for multiplication sign, often used for close */}
        </button>
        {title && <h2 style={modalTitleStyle}>{title}</h2>}
        {children} {/* Render the content passed to the modal */}
      </div>
    </div>
  );
};

export default Modal;
