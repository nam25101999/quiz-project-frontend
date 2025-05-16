import React, { useState, useEffect, useRef } from 'react';
import '../styles/HamburgerMenu.css';
import Setting from '../pages/Setting';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true); // State mới để điều khiển menu
  const menuRef = useRef(null);
  const toggleMenu = () => setIsOpen(!isOpen);

  const [showHeroHome, setShowHeroHome] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsClick = () => {
    setShowSettings(true);
    setIsMenuOpen(false);
  };

  const handleCloseModal = () => {
    setShowSettings(false);
    setIsMenuOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.hamburger-menu')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside); // Thêm sự kiện click ra ngoài
    return () => document.removeEventListener('click', handleClickOutside); // Loại bỏ sự kiện khi component unmount
  }, []);

  return (
    <div className="hamburger-menu-container">
      {isMenuOpen && ( 
        <div className={`hamburger-menu ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <i className="hamburger_icon fa fa-bars"></i>
        </div>
      )}

      {isOpen && (
        <div className="side-menu" ref={menuRef}>
          <div className="logo-menu">
            <img className="logo_side-img" src="/img/logo-while.png" alt="Logo" />
            <h1 className="logo_menu-text">Biểu mẫu</h1>
          </div>
          <ul className="menu-list">
            <li className="menu_li">
              <i className="menu_icon fa-regular fa-file"></i>
              Tài liệu
            </li>
            <li className="menu_li">
              <i className="menu_icon fa-regular fa-file"></i>
              Trang tính
            </li>
            <li className="menu_li">
              <i className="menu_icon fa-regular fa-file"></i>
              Trang trình bày
            </li>
            <li className="menu_li">
              <i className="menu_icon fa-regular fa-file"></i>
              Biểu mẫu
            </li>
          </ul>
          <ul className="menu-list">
            <li className="menu_li" onClick={handleSettingsClick}>
              <i className="menu_icon fa-solid fa-gear"></i>
              Cài Đặt
            </li>
            <li className="menu_li">
              <i className="menu_icon fa-solid fa-question"></i>
              Trợ Giúp và phản hồi
            </li>
          </ul>
          <ul className="menu-list">
            <li
              className="menu_li"
              onClick={() => window.open('https://drive.google.com', '_blank')}
            >
              <i className="menu_icon fa-brands fa-google-drive"></i>
              Drive
            </li>
          </ul>
        </div>
      )}

      {showSettings && (
        <div>
          <div className="overlay" onClick={handleCloseModal}></div>
          <div className="modal">
            <Setting
              showHeroHome={showHeroHome}
              setShowHeroHome={setShowHeroHome}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
