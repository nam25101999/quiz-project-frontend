import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import './styles/Register.css';
import '../styles_main/base.css';


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState({ firstName: '', lastName: '' });
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [message, setMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Mật khẩu không khớp!');
      return;
    }

    try {
      const response = await api.post('/register', {
        username,
        email,
        password,
        fullName: `${fullName.firstName} ${fullName.lastName}`,
        dob,
        gender,
      });
      setMessage(response.data.message);
      if (response.data.success) {
        navigate('/login');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Đã xảy ra lỗi từ server');
    }
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="register_form">
      <div className="register-container">
     <form onSubmit={handleRegister} className="register-form">
  {currentStep === 1 && (
    <div className="register-step-container">
      <div className="register-step-left">
        <div className="logo_login">
          <img className="logo_img" src="/img/logo.png" alt="Logo" />
          </div>
          <h2 className="login_text">Đăng Ký</h2>
        </div>
      <div className="register-step-right">
        <label>Họ</label>
        <input
          type="text"
          className="register-step-input"
          value={fullName.firstName}
          onChange={(e) =>
            setFullName({ ...fullName, firstName: e.target.value })
          }
          required
        />
        <label>Tên</label>
        <input
          type="text"
          className="register-step-input"
          value={fullName.lastName}
          onChange={(e) =>
            setFullName({ ...fullName, lastName: e.target.value })
          }
          required
        />
        <div className="register-button-container">
          <button type="button" className="register-button register-button-next" onClick={handleNext}>
            Tiếp theo
          </button>
        </div>
      </div>
    </div>
  )}

  {currentStep === 2 && (
    <div className="register-step-container">
      <div className="register-step-left">
      <div className="logo_login">
              <img className="logo_img" src="/img/logo.png" alt="Logo" />
            </div>
            <h2 className="login_text">Đăng Ký</h2>
      </div>
      <div className="register-step-right">
        <label>Ngày sinh</label>
        <input
          type="date"
          className="register-step-input"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
        <label>Giới tính</label>
        <select
          className="register-step-select"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Chọn giới tính</option>
          <option value="Male">Nam</option>
          <option value="Female">Nữ</option>
          <option value="Other">Khác</option>
        </select>
        <div className="register-button-container">
          <button type="button" className="register-button register-button-back" onClick={handleBack}>
            Quay lại
          </button>
          <button type="button" className="register-button register-button-next" onClick={handleNext}>
            Tiếp theo
          </button>
        </div>
      </div>
    </div>
  )}

    {currentStep === 3 && (
    <div className="register-step-container">
      <div className="register-step-left">
      <div className="logo_login">
              <img className="logo_img" src="/img/logo.png" alt="Logo" />
            </div>
            <h2 className="login_text">Đăng Ký</h2>
      </div>
      <div className="register-step-right">
        <label>Tên đăng nhập</label>
        <input
          type="text"
          className="register-step-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Email</label>
        <input
          type="email"
          className="register-step-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="register-button-container">
          <button type="button" className="register-button register-button-back" onClick={handleBack}>
            Quay lại
          </button>
          <button type="button" className="register-button register-button-next" onClick={handleNext}>
            Tiếp theo
          </button>
        </div>
      </div>
    </div>
  )}

  {currentStep === 4 && (
    <div className="register-step-container">
      <div className="register-step-left">
      <div className="logo_login">
              <img className="logo_img" src="/img/logo.png" alt="Logo" />
            </div>
            <h2 className="login_text">Đăng Ký</h2>
      </div>
      <div className="register-step-right">
        <label>Mật khẩu</label>
        <input
          type="password"
          className="register-step-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Nhập lại mật khẩu</label>
        <input
          type="password"
          className="register-step-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className="register-button-container">
          <button type="button" className="register-button register-button-back" onClick={handleBack}>
            Quay lại
          </button>
          <button type="submit" className="register-button register-button-submit">
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  )}
</form>
<div className="login_help">
        <div class="language">
          <select id="languageSelector" class="custom-select">
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </select>
        </div>
        <div className="content_help">
          <ul className="help_list">
            <li className="help_item">Trợ giúp</li>
            <li className="help_item">Quyền riêng tư</li>
            <li className="help_item">Tài Khoản</li>
          </ul>
        </div>
      </div>
      {message && <p className="register-message">{message}</p>}
    </div>

    </div>



  );
};

export default Register;
