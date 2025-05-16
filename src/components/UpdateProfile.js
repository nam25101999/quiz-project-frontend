import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../axios';
import './styles/updateprofile.css';

const UpdateProfile = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    dob: '',
    gender: '',
    password: '', // Thêm trường mật khẩu
  });
  const [message, setMessage] = useState('');

  // Lấy thông tin người dùng khi component được mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api
        .get('/user', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUser({
            fullName: response.data.fullName,
            email: response.data.email,
            dob: response.data.dob,
            gender: response.data.gender,
            password: '', // Không hiển thị mật khẩu cũ
          });
        })
        .catch(() => {
          setMessage('Lỗi khi tải dữ liệu người dùng');
        });
    }
  }, []);

  // Hàm xử lý cập nhật thông tin người dùng
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await api.put('/update', user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message || 'Cập nhật thành công!');
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Lỗi máy chủ');
    }
  };

  return (
    <div className="update-profile">
      {/* Thanh TabBar */}
      <nav className="tabbar">
        <Link to="/" className="tabbar__button">
          Trang chủ
        </Link>
        <Link to="/profile" className="tabbar__button">
          Thông tin cá nhân
        </Link>
      </nav>

      {/* Nội dung cập nhật thông tin */}
      <h2 className="update-profile__title">Cập nhật thông tin</h2>
      <form className="update-profile__form" onSubmit={handleUpdate}>
        <div className="update-profile__field">
          <label className="update-profile__label">Họ và tên</label>
          <input
            type="text"
            className="update-profile__input"
            value={user.fullName || ''}
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
          />
        </div>
        <div className="update-profile__field">
          <label className="update-profile__label">Email</label>
          <input
            type="email"
            className="update-profile__input"
            value={user.email || ''}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div className="update-profile__field">
          <label className="update-profile__label">Ngày sinh</label>
          <input
            type="date"
            className="update-profile__input"
            value={user.dob || ''}
            onChange={(e) => setUser({ ...user, dob: e.target.value })}
          />
        </div>
        <div className="update-profile__field">
          <label className="update-profile__label">Giới tính</label>
          <select
            className="update-profile__select"
            value={user.gender || ''}
            onChange={(e) => setUser({ ...user, gender: e.target.value })}
          >
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
            <option value="Other">Khác</option>
          </select>
        </div>
        <div className="update-profile__field">
          <label className="update-profile__label">Mật khẩu mới (nếu thay đổi)</label>
          <input
            type="password"
            className="update-profile__input"
            value={user.password || ''}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Nhập mật khẩu mới nếu thay đổi"
          />
        </div>
        <button type="submit" className="update-profile__button">
          Cập nhật
        </button>
      </form>
      {message && <p className="update-profile__message">{message}</p>}
    </div>
  );
};

export default UpdateProfile;
