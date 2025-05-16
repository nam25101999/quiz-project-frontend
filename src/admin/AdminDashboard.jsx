import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });

  // Fetch all users when the component is mounted
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  // Handle creating a new user
  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/admin/user', newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers([...users, response.data]); // Add the new user to the list
      setNewUser({ username: '', email: '', password: '', role: 'user' }); // Reset the form
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user._id !== userId)); // Remove the user from the list
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Manage Users</h2>

      <h3>Create New User</h3>
      <input 
        type="text" 
        placeholder="Username" 
        value={newUser.username} 
        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} 
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={newUser.email} 
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={newUser.password} 
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
      />
      <select 
        value={newUser.role} 
        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} 
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleCreateUser}>Create User</button>

      <h3>Existing Users</h3>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.username} ({user.role})
            <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
