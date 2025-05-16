import React, { useState, useEffect } from 'react';
import '../styles/SearchBar.css';
import api from '../../axios';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  // Hàm debounce để giảm số lần gọi API
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      }
    }, 500); // Delay 500ms sau khi người dùng ngừng gõ

    return () => clearTimeout(timeoutId); // Dọn dẹp timeout mỗi khi query thay đổi
  }, [query]);

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Vui lòng nhập nội dung tìm kiếm.');
      return;
    }

    setLoading(true); // Bắt đầu tải

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để tìm kiếm.');
        setLoading(false); // Dừng tải
        return;
      }

      // Gửi yêu cầu tìm kiếm đến backend
      const response = await api.get('http://localhost:5000/api/exam/search', {
        params: { search: query },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        setResults(response.data.exams);
        setError('');
      } else {
        setResults([]);
        setError(response.data.message || 'Không tìm thấy kết quả.');
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
      setError(`Lỗi: ${error.response ? error.response.data.message : 'Có lỗi xảy ra khi tìm kiếm.'}`);
    } finally {
      setLoading(false); // Dừng tải khi xong
    }
  };

  return (
    <div className='search'>
      <div
        className={`search-bar ${isActive ? 'active' : ''}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <button className='button_search' onClick={handleSearch} disabled={loading}>
          <i className="icon_search fa-solid fa-magnifying-glass"></i>
        </button>
        <input
          className='input_search'
          type="text"
          placeholder="Tìm kiếm bài thi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}
      
      {/* Thêm loading indicator */}
      {loading && <p className="loading">Đang tìm kiếm...</p>}

      <div className="search-results">
        {results.map((result) => (
          <div key={result._id}>
            <h3>{result.title}</h3>
            <p>{result.questions.length} câu hỏi</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
