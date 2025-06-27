        // frontend/src/pages/AdminUsersPage.js
        import React, { useState, useEffect, useMemo, useCallback } from 'react';
        import axios from 'axios';

        const AdminUsersPage = ({ token }) => {
          const [users, setUsers] = useState([]);
          const [message, setMessage] = useState('');
          const [messageType, setMessageType] = useState(''); // 'success' or 'error'

          const config = useMemo(() => ({
            headers: { 'x-auth-token': token }
          }), [token]);

          const fetchUsers = useCallback(async () => {
            try {
              const res = await axios.get('http://localhost:5000/api/admin/users', config);
              setUsers(res.data);
            } catch (err) {
              console.error('Error fetching users:', err.response?.data || err.message);
              setMessage('Failed to fetch users.');
              setMessageType('error');
            }
          }, [config]);

          useEffect(() => {
            if (token) {
              fetchUsers();
            }
          }, [token, fetchUsers]);

          const handleRoleChange = async (userId, currentRole) => {
            const newRole = currentRole === 'volunteer' ? 'help_seeker' : 'volunteer';
            if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
              try {
                const res = await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`, { role: newRole }, config);
                setMessage(res.data.msg || 'User role updated successfully.');
                setMessageType('success');
                fetchUsers(); // Re-fetch users to update the list
                setTimeout(() => setMessage(''), 3000);
              } catch (err) {
                console.error('Error updating role:', err.response?.data || err.message);
                setMessage(err.response?.data?.msg || 'Failed to update user role.');
                setMessageType('error');
              }
            }
          };

          const handleDeleteUser = async (userId) => {
            if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
              try {
                const res = await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, config);
                setMessage(res.data.msg || 'User deleted successfully.');
                setMessageType('success');
                fetchUsers(); // Re-fetch users to update the list
                setTimeout(() => setMessage(''), 3000);
              } catch (err) {
                console.error('Error deleting user:', err.response?.data || err.message);
                setMessage(err.response?.data?.msg || 'Failed to delete user.');
                setMessageType('error');
              }
            }
          };

          // Inline Styles
          const pageContainerStyle = { padding: '1rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
          const titleStyle = { fontSize: '1.75rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '1.5rem', textAlign: 'center' };
          const messageBoxBaseStyle = { padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.375rem', textAlign: 'center' };
          const successMessageBoxStyle = { ...messageBoxBaseStyle, backgroundColor: '#d1fae5', color: '#065f46' };
          const errorMessageBoxStyle = { ...messageBoxBaseStyle, backgroundColor: '#fee2e2', color: '#991b1b' };
          const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
          const thStyle = { padding: '0.75rem', borderBottom: '2px solid #e2e8f0', textAlign: 'left', backgroundColor: '#f7fafc', fontSize: '0.875rem', fontWeight: 'semibold', textTransform: 'uppercase' };
          const tdStyle = { padding: '0.75rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#4a5568' };
          const roleBadgeStyle = (role) => ({
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            backgroundColor: role === 'admin' ? '#f56565' : role === 'volunteer' ? '#48bb78' : '#4299e1',
            color: 'white',
          });
          const actionBtnStyle = {
            padding: '0.4rem 0.8rem',
            borderRadius: '0.375rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: 'none',
            transition: 'background-color 0.2s ease',
            marginLeft: '0.5rem',
            fontSize: '0.75rem'
          };
          const changeRoleBtnStyle = { ...actionBtnStyle, backgroundColor: '#ecc94b', color: '#fff' }; // Amber
          const deleteBtnStyle = { ...actionBtnStyle, backgroundColor: '#e53e3e', color: '#fff' }; // Red

          return (
            <div style={pageContainerStyle}>
              <h2 style={titleStyle}>Manage Users</h2>
              {message && (
                <div style={messageType === 'success' ? successMessageBoxStyle : errorMessageBoxStyle}>
                  {message}
                </div>
              )}
              {users.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#718096' }}>No users found.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Role</th>
                        <th style={thStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td style={tdStyle}>{user.name}</td>
                          <td style={tdStyle}>{user.email}</td>
                          <td style={tdStyle}>
                            <span style={roleBadgeStyle(user.role)}>
                              {user.role}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            {user.role !== 'admin' && ( // Admins cannot change other admin roles or delete themselves
                              <button
                                onClick={() => handleRoleChange(user._id, user.role)}
                                style={{ ...changeRoleBtnStyle, ':hover': { backgroundColor: '#d69e2e' } }}
                              >
                                Change Role
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              style={{ ...deleteBtnStyle, ':hover': { backgroundColor: '#c53030' } }}
                            >
                              Delete
                            </button>
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

        export default AdminUsersPage;
        