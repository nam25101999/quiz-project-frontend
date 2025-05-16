import React, { useState, useRef, useEffect } from 'react';
import '../styles/HeaderForm.css';
import UserMenu from '../../Home/components/UserMenu';
import { Link } from 'react-router-dom'; // Make sure to import Link for navigation

const HeaderForm = ({ setCurrentPage, title, setTitle }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const underlineRef = useRef(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    if (inputRef.current) {
      const textWidth = inputRef.current.scrollWidth;
      inputRef.current.style.width = `${textWidth + 10}px`;
    }

    if (underlineRef.current && title && title.trim()) {
      const textWidth = inputRef.current.scrollWidth;
      underlineRef.current.style.width = isFocused && title.trim() ? `${textWidth}px` : `0px`; // Cập nhật gạch chân
      underlineRef.current.style.left = `calc(50% - ${textWidth / 2}px)`; // Căn giữa gạch chân
    }
  }, [title, isFocused]);

  // Hàm thay đổi trang khi người dùng nhấn vào các link
  const handleNavClick = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  return (
    <header className="header-form">
      <div className="header_content">
        <div className="header-left">
          <div className="logo_form-header"
            onClick={() => (window.location.href = '/')}>
            <img className="logo_form-header" src="/img/logo-while.png" alt="Logo" />
          </div>
          <div className={`title-header ${isFocused ? 'focused' : ''}`}>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={handleTitleChange}
              required
              placeholder="Tiêu đề biểu mẫu"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div className="star">
            <i className="fa-regular fa-star"></i>
          </div>
        </div>

        <div className="header-right">
          <div className="icon-container">
            <i className="fas fa-user"></i>
            <i className="fas fa-bell"></i>
            <i className="fas fa-cog"></i>
            <i className="fas fa-question-circle"></i>
          </div>
          <button className="send">Gửi</button>
          <div className="icon_cham">
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </div>
          <UserMenu />
        </div>
      </div>

      <nav className="navbar">
        <ul>
          <li><button onClick={() => handleNavClick("createExam")}>Câu Hỏi</button></li>
          <li><button onClick={() => handleNavClick("examResults")}>Câu Trả Lời</button></li>
          <li><button onClick={() => handleNavClick("settings")}>Cài Đặt</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderForm;
