import React, { useState } from 'react';
import '../styles/Setting.css';

const Setting = ({ showHeroHome, setShowHeroHome, onClose }) => {
  const [option1, setOption1] = useState(false);
  const [option2, setOption2] = useState(false);

  const handleOption1Change = () => setOption1(!option1);
  const handleOption2Change = () => setOption2(!option2);

  return (
    <div className="settings-container">
      <h2 className="settings-title">Cài đặt</h2>
      <div className="settings-language">
        <p className="settings-language-title">Ngôn ngữ</p>
        <a className="settings-language-text" href="#">
          Tiếng Việt
        </a>
      </div>
      <div className="setting-option">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={option1}
            onChange={handleOption1Change}
            className="setting-checkbox"
          />
          Luôn hiển thị các điều khiển từ phải sang trái
        </label>
      </div>
      <p className="settings-language-title">Mẫu</p>
      <div className="setting-option">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={option2}
            onChange={handleOption2Change}
            className="setting-checkbox"
          />
          Hiển thị mẫu gần đây trên màn hình chính
        </label>
      </div>
      <button className="settings-close-btn" onClick={onClose}>
        OK
      </button>
    </div>
  );
};

export default Setting;
