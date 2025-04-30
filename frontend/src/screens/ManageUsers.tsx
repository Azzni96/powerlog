import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  Id: number;
  Username: string;
  Email: string;
  User_level: string;
}

interface EditableUser {
  id: number;
  username: string;
  email: string;
  user_level: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<EditableUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const res = await axios.get('http://localhost:3000/api/user/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Response data:', res.data);

      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setError('Unexpected response format from server');
        console.error('Expected data to be an array, but got:', typeof res.data);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const goBack = () => {
    navigate('/admin-dashboard');
  };

  const handleEditClick = (user: User) => {
    setEditingUser({
      id: user.Id,
      username: user.Username,
      email: user.Email,
      user_level: user.User_level
    });
    setIsEditing(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:3000/api/user/${editingUser.id}`,
        {
          username: editingUser.username,
          email: editingUser.email,
          user_level: editingUser.user_level
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setIsEditing(false);
      setEditingUser(null);
      fetchUsers(); // Refresh the user list

    } catch (error: any) {
      console.error('Error updating user:', error);
      setError(error.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        `http://localhost:3000/api/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Remove the user from the local state
      setUsers(users.filter(user => user.Id !== userId));

    } catch (error: any) {
      console.error('Error deleting user:', error);
      setError(error.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Manage Users</h2>

      {error && <div className="error">{error}</div>}

      {isEditing && editingUser && (
        <div className="edit-user-form">
          <h3>Edit User</h3>
          <input
            type="text"
            value={editingUser.username}
            onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
            placeholder="Username"
          />
          <input
            type="email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
            placeholder="Email"
          />
          <select
            value={editingUser.user_level}
            onChange={(e) => setEditingUser({...editingUser, user_level: e.target.value})}
          >
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>

          <div className="button-group">
            <button className="btn update-btn" onClick={handleUpdateUser}>Update</button>
            <button className="btn cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          {users.length > 0 ? (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>User Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.Id}>
                      <td>{user.Id}</td>
                      <td>{user.Username}</td>
                      <td>{user.Email}</td>
                      <td>{user.User_level}</td>
                      <td className="action-buttons">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.Id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No users found.</p>
          )}
        </>
      )}

      <button onClick={goBack} className="btn">
        Back to Dashboard
      </button>
    </div>
  );
}
