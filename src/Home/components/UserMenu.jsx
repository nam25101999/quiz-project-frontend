import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axios';
import '../styles/UserMenu.css';

const UserMenu = () => {
  const [user, setUser] = useState(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const navigate = useNavigate();
  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const userInfoRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/user', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUser(response.data);
          setLoading(false);
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          }
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMouseEnter = () => {
    setIsTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra xem click có xảy ra ngoài các phần tử menu và modal không
      if (
        menuRef.current && !menuRef.current.contains(event.target) && // Nếu click ngoài menu
        !userInfoRef.current.contains(event.target) && // Nếu click ngoài user info
        (modalRef.current && !modalRef.current.contains(event.target)) // Nếu click ngoài modal
      ) {
        setIsMenuOpen(false); // Đóng menu
      }
    };
  
    // Thêm sự kiện click
    document.addEventListener('mousedown', handleClickOutside);
  
    // Cleanup để xóa sự kiện khi component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
  
      // Xem trước ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result); // Đặt preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!avatar) {
      alert('Vui lòng chọn một ảnh.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('http://localhost:5000/api/users/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Đã xảy ra lỗi khi tải ảnh.');
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <div
        className="user-info"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={toggleMenu}
        ref={userInfoRef}
      >
        <img
          src={user.avatar ? `http://localhost:5000/${user.avatar}` : '/default-avatar.png'}
          alt="User Avatar"
          className="user-icon"
        />

        {isTooltipVisible && user && (
          <div className="tooltip">
            <h3>Tài khoản 2N</h3>
            <p>{user.fullName}</p>
            <p>{user.email}</p>
          </div>
        )}
      </div>
      {isMenuOpen && user && (
        <div className="user-dropdown">        
          <div className="user-details">
            <p className="text_user">{user.email}
              <button className="close-btn" onClick={closeMenu}>
              &times;
              </button>
            </p>
            <div className="avatar-container">
              <img
                className="user_avt"
                src={user.avatar ? `http://localhost:5000/${user.avatar}` : '/default-avatar.png'}
                alt="Avatar"
                onClick={() => setIsModalOpen(true)}
              />
              <button className="update-avatar-btn" onClick={() => setIsModalOpen(true)}>
                <i className="fa fa-pencil"></i>
              </button>
            </div>
            <p className="text_user"><strong>Chào</strong> {user.username},</p>
            <button onClick={() => navigate('/update-profile')} className="edit-profile-btn">Sửa thông tin</button>
            <button onClick={handleLogout} className="logout-btn" style={{ marginTop: '10px' }}>Đăng xuất</button>
            <div className="footer_user">
              <p>Chính sách quyền riêng tư</p>
              <p>Điều khoản và dịch vụ</p>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="overlay">
          <div className="modal" ref={modalRef}>
            <div className="modal-content">
              <h3 className="update-avatar-title">Cập nhật ảnh đại diện</h3>
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="file-input" 
              />
              {previewAvatar ? (
                <img src={previewAvatar} alt="Preview Avatar" className="preview-avatar" />
              ) : (
                <img 
                  src={user.avatar ? `http://localhost:5000/${user.avatar}` : '/default-avatar.png'} 
                  alt="Current Avatar" 
                  className="preview-avatar" 
                />
              )}
              <div className="button-container">
                <button onClick={handleUpload} className="upload-btn">Lưu</button>
                <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
