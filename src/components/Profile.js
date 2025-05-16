import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import '../styles_main/base.css';
import './styles/profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (token) {
        api.get('/user', { headers: { Authorization: `Bearer ${token}` } })
          .then(response => {
            setUser(response.data);
          })
          .catch(err => {
            if (err.response && err.response.status === 401) {
              // If token is expired or invalid
              setMessage('Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
              localStorage.removeItem('token');
              navigate('/login');
            } else {
              setMessage('Lỗi khi lấy thông tin người dùng');
            }
          });
      } else {
        setMessage('Token không hợp lệ');
        navigate('/login');
      }
    }, [navigate]);

  const handleEdit = () => {
    navigate('/update-profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="profile-container">
      <h2 className="profile-header">Thông tin người dùng</h2>
      {message && <p className="message">{message}</p>}
      {user ? (
        <div className="profile-info">
          <p><strong>ID người dùng:</strong> {user._id}</p>
          <p><strong>Tên người dùng:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Họ và tên:</strong> {user.fullName}</p>
          <p><strong>Ngày sinh:</strong> {user.dob}</p>
          <p><strong>Giới tính:</strong> {user.gender}</p>
          <div className="profile-actions">
            <button className="profile-button" onClick={handleEdit}>Sửa thông tin</button>
            <button className="profile-button" onClick={handleLogout}>Đăng xuất</button>
          </div>
        </div>
      ) : (
        <p>Đang tải thông tin người dùng...</p>
      )}
    </div>
  );
};

export default Profile;
