import React, { useState } from 'react';
import axios from '../../axios';

const NotePage = () => {
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  // Hàm để xử lý khi người dùng nhập ghi chú
  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  // Hàm gửi ghi chú đến backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lấy token từ localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Bạn cần đăng nhập để lưu ghi chú.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/note/notes', 
        { note },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Thêm token vào header Authorization
          }
        }
      );
      setMessage('Ghi chú đã được lưu thành công!');
      setNote('');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage('Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setMessage('Có lỗi xảy ra khi lưu ghi chú.');
      }
    }
  };

  return (
    <div>
      <h1>Ghi chú của bạn</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={note}
          onChange={handleNoteChange}
          placeholder="Nhập ghi chú của bạn ở đây..."
          rows="4"
          cols="50"
        ></textarea>
        <br />
        <button type="submit">Lưu Ghi Chú</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default NotePage;
