        // frontend/src/pages/VolunteerMyRequestsPage.js
        // Component to display a volunteer's accepted and completed requests.
        import React, { useState, useEffect, useMemo, useCallback } from 'react';
        import axios from 'axios';

        const VolunteerMyRequestsPage = ({ token, setCurrentPage }) => {
          const [acceptedRequests, setAcceptedRequests] = useState([]);
          const [message, setMessage] = useState('');
          const [messageType, setMessageType] = useState(''); // 'success' or 'error'

          const config = useMemo(() => ({
            headers: { 'x-auth-token': token }
          }), [token]);

          const fetchAcceptedRequests = useCallback(async () => {
            if (!token) return;
            try {
              // Assuming a backend endpoint to get requests assigned to the current volunteer
              const res = await axios.get('http://localhost:5000/api/requests/assigned-to-me', config);
              // Sort requests by createdAt date in descending order (most recent first)
              const sortedRequests = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              setAcceptedRequests(sortedRequests);
              setMessage('');
              setMessageType('');
            } catch (err) {
              console.error('Error fetching accepted requests:', err.response?.data || err.message);
              setMessage('Failed to load your handled requests. Please try again.');
              setMessageType('error');
            }
          }, [token, config]);

          useEffect(() => {
            fetchAcceptedRequests();
          }, [fetchAcceptedRequests]);

          const handleMarkComplete = async (requestId) => {
            if (window.confirm('Are you sure you want to mark this request as completed?')) {
              try {
                const res = await axios.put(`http://localhost:5000/api/requests/${requestId}/complete`, {}, config);
                setMessage(res.data.msg || 'Request marked as completed!');
                setMessageType('success');
                fetchAcceptedRequests(); // Re-fetch to update status
                setTimeout(() => setMessage(''), 3000);
              } catch (err) {
                console.error('Error marking complete:', err.response?.data || err.message);
                setMessage(err.response?.data?.msg || 'Failed to mark request as complete.');
                setMessageType('error');
              }
            }
          };

          const handleCancelAssignment = async (requestId) => {
            if (window.confirm('Are you sure you want to cancel your assignment for this request? This will make it available to other volunteers.')) {
              try {
                const res = await axios.put(`http://localhost:5000/api/requests/${requestId}/unassign`, {}, config);
                setMessage(res.data.msg || 'Assignment cancelled successfully.');
                setMessageType('success');
                fetchAcceptedRequests(); // Re-fetch to update status
                setTimeout(() => setMessage(''), 3000);
              } catch (err) {
                console.error('Error cancelling assignment:', err.response?.data || err.message);
                setMessage(err.response?.data?.msg || 'Failed to cancel assignment.');
                setMessageType('error');
              }
            }
          };


          // Inline Styles
          const pageContainerStyle = { padding: '2rem', backgroundColor: '#f3f4f6', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' };
          const titleStyle = { fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '1.5rem', textAlign: 'center' };
          const messageBoxBaseStyle = { padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.375rem', textAlign: 'center' };
          const successMessageBoxStyle = { ...messageBoxBaseStyle, backgroundColor: '#d1fae5', color: '#065f46' };
          const errorMessageBoxStyle = { ...messageBoxBaseStyle, backgroundColor: '#fee2e2', color: '#991b1b' };
          const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
          const thStyle = { padding: '0.75rem', borderBottom: '2px solid #e2e8f0', textAlign: 'left', backgroundColor: '#f7fafc', fontSize: '0.875rem', fontWeight: 'semibold', textTransform: 'uppercase' };
          const tdStyle = { padding: '0.75rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#4a5568' };
          const statusBadgeStyle = (status) => {
            let bgColor;
            let textColor = 'white';
            switch (status) {
              case 'pending': bgColor = '#f59e0b'; break; // Amber (should ideally not be here, as these are 'accepted')
              case 'accepted': bgColor = '#2563eb'; break; // Blue
              case 'completed': bgColor = '#059669'; break; // Dark Green
              case 'cancelled': bgColor = '#ef4444'; break; // Red
              default: bgColor = '#6b7280'; // Gray
            }
            return {
              backgroundColor: bgColor,
              color: textColor,
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontWeight: 'bold',
              fontSize: '0.75rem',
            };
          };
          const actionBtnStyle = {
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: 'none',
            transition: 'background-color 0.3s ease',
            marginLeft: '0.5rem',
            fontSize: '0.875rem'
          };
          const completeBtnStyle = { ...actionBtnStyle, backgroundColor: '#059669', color: '#fff' }; // Green
          const cancelAssignmentBtnStyle = { ...actionBtnStyle, backgroundColor: '#ef4444', color: '#fff' }; // Red

          return (
            <div style={pageContainerStyle}>
              <h2 style={titleStyle}>My Handled Requests</h2>
              {message && (
                <div style={messageType === 'success' ? successMessageBoxStyle : errorMessageBoxStyle}>
                  {message}
                </div>
              )}
              {acceptedRequests.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#718096' }}>You have not accepted or completed any requests yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Title</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Requested By</th>
                        <th style={thStyle}>Accepted On</th>
                        <th style={thStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {acceptedRequests.map((request) => (
                        <tr key={request._id}>
                          <td style={tdStyle}>{request.title}</td>
                          <td style={tdStyle}>{request.category}</td>
                          <td style={tdStyle}>
                            <span style={statusBadgeStyle(request.status)}>
                              {request.status}
                            </span>
                          </td>
                          <td style={tdStyle}>{request.user ? request.user.name : 'N/A'}</td>
                          <td style={tdStyle}>{new Date(request.acceptedAt || request.createdAt).toLocaleDateString()}</td>
                          <td style={tdStyle}>
                            {request.status === 'accepted' && (
                              <>
                                <button
                                  onClick={() => handleMarkComplete(request._id)}
                                  style={{ ...completeBtnStyle, ':hover': { backgroundColor: '#047857' } }}
                                >
                                  Mark Complete
                                </button>
                                <button
                                  onClick={() => handleCancelAssignment(request._id)}
                                  style={{ ...cancelAssignmentBtnStyle, ':hover': { backgroundColor: '#b91c1c' } }}
                                >
                                  Cancel Assignment
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        };

        export default VolunteerMyRequestsPage;
        