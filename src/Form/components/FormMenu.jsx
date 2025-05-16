import React from "react";
import "../styles/FormMenu.css";

const FormMenu = ({ onAddQuestion }) => {
  return (
    <div className="menu-container">
      <button className="formmenu-button" 
        title="Thêm câu hỏi"
        onClick={onAddQuestion}>
        <i class="formmenu_icon fa-solid fa-plus"></i>
      </button>
      <button className="formmenu-button" title="Nhập câu hỏi">
        <i class="formmenu_icon fa-solid fa-right-to-bracket"></i>
      </button>
      <button className="formmenu-button" title="Thêm tiêu đề và mô tả">
        <i class="formmenu_icon fa-solid fa-heading"></i>
      </button>
      <button className="formmenu-button" title="Thêm hình ảnh">
        <i class="formmenu_icon fa-regular fa-image"></i>
      </button>
      <button className="formmenu-button" title="Thêm video">
        <i class="formmenu_icon fa-solid fa-video"></i>
      </button>
      <button className="formmenu-button" title="Thêm phần">
        <i class="formmenu_icon fas fa-grip-lines"></i>
      </button>
    </div>
  );
};

export default FormMenu;
