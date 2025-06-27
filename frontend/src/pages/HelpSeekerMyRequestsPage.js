// frontend/src/pages/HelpSeekerMyRequestsPage.js
// This component displays a help seeker's own requests and allows them to manage them
// (delete, and leave reviews for completed requests).

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const HelpSeekerMyRequestsPage = ({ token, setCurrentPage }) => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // NEW: State for the review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  // NEW: State to hold details of the request currently being reviewed
  const [currentRequestToReview, setCurrentRequestToReview] = useState(null);
  // NEW: State for the review form data
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5, // Default rating
    comment: ''
  });

  // --- Inline CSS Styles (adapted from HelpSeekerDashboard for consistency) ---
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    maxWidth: '800px',
    margin: 'auto',
    padding: '1rem'
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e40af', // Dark blue
    textAlign: 'center',
    marginBottom: '1.5rem'
  };

  const requestListStyle = {
    display: 'grid',
    gap: '1rem'
  };

  const requestItemStyle = {
    ...cardStyle,
    padding: '1rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const requestTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937' // Dark gray
  };

  const requestMetaStyle = {
    fontSize: '0.875rem',
    color: '#6b7280' // Medium gray
  };

  const requestDescriptionStyle = {
    fontSize: '1rem',
    color: '#374151', // Slightly darker gray
    marginTop: '0.5rem',
    marginBottom: '0.5rem'
  };

  const btnDangerStyle = {
    backgroundColor: '#dc2626', // Red
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease'
  };

  const btnReviewStyle = {
    backgroundColor: '#8b5cf6', // Purple
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginLeft: '0.5rem' // Space from delete button
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

  const backBtnStyle = {
    backgroundColor: '#6b7280', // Gray for back button
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginTop: '1.5rem',
    width: 'fit-content',
    alignSelf: 'center'
  };

  // Styles for the modal
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000 // Ensure modal is on top
  };

  const modalContentStyle = {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    maxWidth: '500px',
    width: '90%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const modalCloseBtnStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#374151'
  };

  const formGroupStyle = { // For modal form
    marginBottom: '1rem'
  };

  const labelStyle = { // For modal form
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '0.5rem'
  };

  const inputStyle = { // For modal form
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    boxSizing: 'border-box'
  };

  const textareaStyle = { // For modal form
    ...inputStyle,
    resize: 'vertical',
    minHeight: '80px'
  };

  const selectStyle = { // For modal form
    ...inputStyle,
    cursor: 'pointer'
  };

  const btnPrimaryStyle = { // For modal form buttons
    backgroundColor: '#2563eb', // Blue
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease'
  };

  // Memoized config for axios requests
  const memoizedConfig = useMemo(() => ({
    headers: { 'x-auth-token': token }
  }), [token]);

  // Function to fetch help requests from the backend
  const fetchRequests = useCallback(async () => {
    try {
      // Backend route now populates assignedVolunteer and adds hasReview flag
      const res = await axios.get('http://localhost:5000/api/helpseeker/requests/me', memoizedConfig);
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setMessage('Failed to fetch requests.');
      setMessageType('error');
    }
  }, [memoizedConfig]);

  // Effect to fetch initial data when the component loads or token changes
  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token, fetchRequests]);

  // Handle deleting a request
  const onDeleteRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await axios.delete(`http://localhost:5000/api/helpseeker/requests/${id}`, memoizedConfig);
        setMessage('Request deleted successfully!');
        setMessageType('success');
        fetchRequests();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting request:', err.response ? err.response.data : err.message);
        setMessage(err.response?.data?.msg || 'Failed to delete request.');
        setMessageType('error');
      }
    }
  };

  // Function to open the review modal
  const handleLeaveReviewClick = (request) => {
    setCurrentRequestToReview(request); // Store the request data
    setReviewFormData({ rating: 5, comment: '' }); // Reset form
    setShowReviewModal(true); // Show the modal
  };

  // Handle changes in the review form
  const onReviewFormChange = e => {
    setReviewFormData({ ...reviewFormData, [e.target.name]: e.target.value });
  };

  // Handle submission of the review form
  const onReviewFormSubmit = async (e) => {
    e.preventDefault();
    if (!currentRequestToReview || !currentRequestToReview.assignedVolunteer) {
      setMessage('Error: No request or assigned volunteer found for review.');
      setMessageType('error');
      return;
    }

    try {
      const reviewData = {
        helpRequestId: currentRequestToReview._id,
        rating: parseInt(reviewFormData.rating), // Ensure rating is an integer
        comment: reviewFormData.comment
      };

      const { data } = await axios.post('http://localhost:5000/api/helpseeker/reviews', reviewData, memoizedConfig);
      
      setMessage(data.msg);
      setMessageType('success');
      setShowReviewModal(false); // Close modal
      setCurrentRequestToReview(null); // Clear selected request
      fetchRequests(); // Re-fetch requests to update review status

      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      console.error('Error submitting review:', err.response ? err.response.data : err.message);
      setMessage(err.response?.data?.msg || 'Failed to submit review.');
      setMessageType('error');
    }
  };


  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>My Help Requests</h1>

      {message && (
        <div style={messageType === 'success' ? successMessageBoxStyle : errorMessageBoxStyle}>
          {message}
        </div>
      )}

      {/* Section to Display Existing Requests */}
      <div style={cardStyle}>
        {requests.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>You have no active help requests. Create one from the main Help Seeker Dashboard!</p>
        ) : (
          <div style={requestListStyle}>
            {requests.map(request => (
              <div key={request._id} style={requestItemStyle}>
                <h3 style={requestTitleStyle}>{request.title}</h3>
                <p style={requestDescriptionStyle}>{request.description}</p>
                <div style={requestMetaStyle}>
                  <strong>Category:</strong> {request.category} | 
                  <strong>Status:</strong> {request.status} | 
                  <strong>Created:</strong> {new Date(request.createdAt).toLocaleDateString()}
                  {request.assignedVolunteer && (
                    <span> | <strong>Assigned Volunteer:</strong> {request.assignedVolunteer.name}</span>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => onDeleteRequest(request._id)}
                    style={{ ...btnDangerStyle, ':hover': { backgroundColor: '#b91c1c' } }}
                  >
                    Delete Request
                  </button>
                  
                  {request.status === 'completed' && request.assignedVolunteer && !request.hasReview && (
                    <button
                      onClick={() => handleLeaveReviewClick(request)}
                      style={{ ...btnReviewStyle, ':hover': { backgroundColor: '#7c3aed' } }}
                    >
                      Leave Review
                    </button>
                  )}
                   {request.hasReview && (
                    <span style={{ ...btnReviewStyle, backgroundColor: '#6b7280', cursor: 'not-allowed' }}>
                        Reviewed
                    </span>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <button
        onClick={() => setCurrentPage('help-seeker-dashboard')}
        style={{ ...backBtnStyle, ':hover': { backgroundColor: '#4b5563' } }}
      >
        Back to Dashboard
      </button>


      {showReviewModal && currentRequestToReview && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={() => setShowReviewModal(false)} style={modalCloseBtnStyle}>&times;</button>
            <h2 style={{ ...titleStyle, fontSize: '1.75rem', color: '#8b5cf6' }}>Leave a Review for {currentRequestToReview.assignedVolunteer?.name}</h2>
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>For your request: "{currentRequestToReview.title}"</p>

            <form onSubmit={onReviewFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={formGroupStyle}>
                <label htmlFor="rating" style={labelStyle}>Rating (1-5 Stars)</label>
                <select
                  id="rating"
                  name="rating"
                  value={reviewFormData.rating}
                  onChange={onReviewFormChange}
                  required
                  style={selectStyle}
                >
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Good</option>
                  <option value="2">2 Stars - Fair</option>
                  <option value="1">1 Star - Poor</option>
                </select>
              </div>
              <div style={formGroupStyle}>
                <label htmlFor="comment" style={labelStyle}>Your Review</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={reviewFormData.comment}
                  onChange={onReviewFormChange}
                  placeholder="Share your experience with the volunteer..."
                  required
                  style={textareaStyle}
                ></textarea>
              </div>
              <button type="submit" style={{ ...btnReviewStyle, backgroundColor: '#8b5cf6', ':hover': { backgroundColor: '#7c3aed' } }}>
                Submit Review
              </button>
              <button 
                type="button" 
                onClick={() => setShowReviewModal(false)} 
                style={{ ...btnPrimaryStyle, backgroundColor: '#6b7280', ':hover': { backgroundColor: '#4b5563' }, marginTop: '0.5rem' }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSeekerMyRequestsPage;
