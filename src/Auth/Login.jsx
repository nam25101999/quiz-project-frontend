import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import { jwtDecode } from 'jwt-decode';
import './styles/Login.css';
import '../styles_main/base.css';

const Login = () => {
  const [step, setStep] = useState(1); // Bước đăng nhập (1: tên đăng nhập, 2: mật khẩu)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra token khi mở trang
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        navigate('/');
      } catch (error) {
        console.error('Token không hợp lệ:', error.message);
      }
    }
  }, [navigate]);

  const handleCheckUsername = async () => {
    setUsernameError('');
    setMessage('');
    if (!username.trim()) {
      setUsernameError('Tên đăng nhập không được để trống.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/check-username', { username });
      if (response.data.exists) {
        setUserInfo({
          username: response.data.username,
          email: response.data.email,
          avatar: response.data.avatar,
        });
        setStep(2);
      } else {
        setMessage('');
      }
    } catch (error) {
      setMessage('Tài khoản không tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToRegister = () => {
    navigate('/register');
  };

  // Hàm xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu có bị trống không
    if (!password.trim()) {
      setPasswordError('Mật khẩu không được để trống.');
      return;
    }

    // Reset lỗi mật khẩu nếu không có lỗi
    setPasswordError('');
    setLoading(true);
    setMessage('');

    try {
      // Gửi yêu cầu đăng nhập
      const response = await api.post('/login', { username, password });

      // Nếu đăng nhập thành công
      localStorage.setItem('token', response.data.token); // Lưu token vào localStorage
      setMessage('Đăng nhập thành công!');
      navigate('/'); // Chuyển hướng về trang chính
    } catch (error) {
      // Xử lý lỗi khi đăng nhập
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;

        // Kiểm tra lỗi nếu là sai mật khẩu
        if (errorMessage === 'Sai mật khẩu') {
          setPasswordError('Sai mật khẩu. Vui lòng thử lại.');
        } else if (errorMessage === 'Tài khoản không tồn tại') {
          setMessage('Tài khoản không tồn tại. Vui lòng kiểm tra lại.');
        } else {
          setMessage('Lỗi máy chủ. Vui lòng thử lại sau.');
        }
      } else {
        setMessage('Lỗi máy chủ. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_form">
      <div className="body_login">
      <form className="form_login" onSubmit={handleLogin}>
        {step === 1 && (
          <div className="form_left">
            <div className="logo_login">
              <img className="logo_img" src="/img/logo.png" alt="Logo" />
            </div>
            <h2 className="login_text">Đăng nhập</h2>
            <p className="login_textf">Sử dụng Tài khoản 2N của bạn</p>
          </div>
        )}

        {step === 2 && (
          <div className="form_left">
            <div className="logo">
              <img className="logo_img" src="/img/logo.png" alt="Logo" />
            </div>
            {userInfo && (
              <div className="user_info">
                <p className="user_name ">{userInfo.username}</p>
                <div className="my_info">
                  <img
                    src={userInfo.avatar ? `http://localhost:5000/${userInfo.avatar}` : '/default-avatar.png'}
                    alt="User Avatar"
                    className="user_avatar"
                  />
                  <p className="user_email">{userInfo.email}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="form_right">
          {step === 1 && (
            <div>
              <div class="form_text">
                <input
                  id="usernameInput"
                  class="login_input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label for="usernameInput" class={`floating_label ${username ? 'active' : ''}`}>
                  Tên đăng nhập hoặc Email
                </label>
              </div>
              {usernameError && (
                <div className="error-container">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <p className="error_message">{usernameError}</p>
                </div>
              )}

              {message && (
                <div className="message-container">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <p className="message">{message}</p>
                </div>
              )}
              <a className="text_account" href="/">Bạn quên tài khoản?</a>
              <div className="text_learnmore">
                Đây không phải máy tính của bạn? Hãy sử dụng chế độ Khách để đăng nhập một cách riêng tư.
                <span>
                  <a className="text_learnmore_a" href="/"> Tìm hiểu thêm về cách sử dụng Chế độ khách</a>
                </span>
              </div>
              <div className="buttons">
                <button className="button_register" onClick={handleRedirectToRegister}>
                  Tạo tài khoản
                </button>
                <button
                  className="button_next"
                  type="button"
                  onClick={handleCheckUsername}
                  disabled={loading}
                >
                  {loading ? 'Đang kiểm tra...' : 'Tiếp theo'}
                  
              </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
            <div className="form_password">
              <label></label>
              <input
                id="passwordInput"
                className="password_input"
                type={showPassword ? "text" : "password"} // Thay đổi kiểu giữa "text" và "password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="passwordInput" className={`floating_label_password ${password ? 'active' : ''}`}>
                Nhập mật khẩu của bạn
              </label>
              {passwordError && <p className="error_text">{passwordError}</p>}
            </div>
          
            <div className="show_password_checkbox">
              <input
                type="checkbox"
                id="showPasswordCheckbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPasswordCheckbox">Hiện mật khẩu</label>
            </div>
            <div className="buttons2">
              <button className="button_password" onClick={handleRedirectToRegister}>
                Bạn quên mật khẩu?
              </button>
              
              <button className="button_next" type="submit" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>
          </div>
          )}
        </div>
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
    </div>
    </div>
  );
};

export default Login;
