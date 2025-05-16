import React, { useState, useEffect } from 'react';
import axios from '../../axios';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:5000/api/note/notes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotes(response.data.notes); // Lưu các ghi chú vào state
      } catch (err) {
        setError('Có lỗi xảy ra khi lấy ghi chú.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return <div>Đang tải ghi chú...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Danh Sách Ghi Chú</h1>
      <ul>
  {notes.length === 0 ? (
    <p>Không có ghi chú nào.</p>
  ) : (
    notes.map((note) => (
      <li key={note._id}>

        <p>{note.note}</p>

        <small>
          Người tạo: <strong>{note.userId?.username || 'Không xác định'}</strong>
        </small>

        <br />
        <small>Ngày tạo: {new Date(note.createdAt).toLocaleString()}</small>
      </li>
    ))
  )}
</ul>

    </div>
  );
};

export default NotesPage;
