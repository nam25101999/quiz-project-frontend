import React, { useState, useEffect, useRef } from 'react';
import '../styles/MoreMenu.css';

const MoreMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target) && 
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="more-menu">
      <button
        className="menu-button"
        onClick={toggleMenu}
        ref={buttonRef}
      >
        <i className="fa fa-ellipsis-v"></i>
        <i className="fa fa-ellipsis-v"></i>
        <i className="fa fa-ellipsis-v"></i>
      </button>

      {isOpen && (
        <div className="menu-dropdown" ref={menuRef}> {}
          <div className="icons-grid">
            <div className="icon-item"><i className="fa fa-user"></i><span>Home</span></div>
            <div className="icon-item"><i class="fa-solid fa-envelope"></i><span>Gmail</span></div>
            <div className="icon-item"><i class="fa-brands fa-google-drive"></i><span>Drive</span></div>
            <div className="icon-item"><i class="fa-solid fa-landmark"></i><span>Bank</span></div>
            <div className="icon-item"><i className="fa fa-bell"></i><span>Notifications</span></div>
            <div className="icon-item"><i className="fa fa-power-off"></i><span>Logout</span></div>
            <div className="icon-item"><i className="fa fa-calendar"></i><span>Calendar</span></div>
            <div className="icon-item"><i className="fa fa-flag"></i><span>Flag</span></div>
            <div className="icon-item"><i className="fa fa-search"></i><span>Search</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreMenu;
