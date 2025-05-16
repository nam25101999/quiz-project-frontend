import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ExamList.css';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingExamId, setEditingExamId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/exam/list', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExams(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchExams();
    const handleClickOutside = (event) => {
      if (!event.target.closest('.menu-wrapper')) {
        setMenuOpen(null);
      }
    };
  
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
    
    
  }, []);

  const handleExamClick = (examId) => {
    navigate(`/exam/${examId}`);
  };

  const handleDeleteExam = async (examId) => {
    try {

      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/exam/delete/${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExams((prevExams) => prevExams.filter((exam) => exam._id !== examId));
      alert('Xóa bài thi thành công!');
    } catch (error) {
      console.error(error);
      alert('Đã xảy ra lỗi khi xóa bài thi.');
    }
  };

  const handleRenameExam = async (examId) => {
    if (!newTitle.trim()) {
      alert('Tên bài thi không được để trống!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/exam/${examId}/rename`,
        { newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExams((prevExams) =>
        prevExams.map((exam) =>
          exam._id === examId ? { ...exam, title: response.data.updatedExam.title } : exam
        )
      );
      alert('Đổi tên thành công!');
      setEditingExamId(null);
      setNewTitle('');
    } catch (error) {
      console.error('Lỗi khi đổi tên bài thi:', error.message);
      alert('Đã xảy ra lỗi khi đổi tên.');
    }
  };

  const handleOpenInNewTab = (examId) => {
    window.open(`/exam/${examId}`, '_blank');
  };

  const toggleMenu = (examId) => {
    setMenuOpen(menuOpen === examId ? null : examId);
  };

  const handleViewResults = (examId) => {
    navigate(`/exam-results/${examId}`);
  };

  const handleEditExam = (examId) => {
    navigate(`/edit-exam/${examId}`);
    
  };

  return (
    <div>
      <header className="header-exam">
            <div className="header-exam-list">
                <div className="left-header">
                    <h2>Biểu mẫu gần đây</h2>
                </div>
                <div className="right-header">
                    <select className="exam-select">                     
                        <option value="option1">
                          <div className="select-option">Do tôi sở hữu</div>
                          <span class="select-arrow">&#9662;</span>
                        </option>
                        <option value="option2">
                          <div className="select-option">Do mọi người sở hữu</div>
                          <span class="select-arrow">&#9662;</span>
                        </option>
                        <option value="option3">
                          <div className="select-option">Không cho mọi người sở hữu</div>
                          <span class="select-arrow">&#9662;</span>
                        </option>
                    </select>                   
                    <div className="icons-container">
                      <i class="icon_header-list fa-solid fa-list"></i>
                      <i class="icon_header-list fa-solid fa-hippo"></i>
                      <i class="icon_header-list fa-regular fa-folder"></i>
                    </div>
                </div>
            </div>
        </header>

      <div className="exam-list-container">
        <div className="exam-list">
          {exams.map((exam) => (
            <div key={exam._id} className="exam-item">
              <img
                src="https://ssl.gstatic.com/docs/templates/thumbnails/1zUQ4f2jZhbTd4yaCB5FlY4JdVbs61Ai6K9W_2EsJWwU_400_1.png"
                alt={exam.title}
                onClick={() => handleExamClick(exam._id)}
              />
                <div className="title_exam">
                  <h3>{exam.title}</h3>
                </div>
              <div className="exam_date">
                <p>Ngày tạo: {new Date(exam.createdAt).toLocaleDateString()}</p>
                
                <div className="menu-wrapper">
                  <i className="menu-wrapper_icon fa fa-ellipsis-v " onClick={() => toggleMenu(exam._id)} />
                  {menuOpen === exam._id && (
                    <div className="menu">
                      <button
                        className="menu-item"
                        onClick={() => {
                          setSelectedExamId(exam._id);
                          setIsModalOpen(true);
                        }}
                      >
                        Xóa
                      </button>
                      
                      <button
                        className="menu-item"
                        onClick={() => {
                          setEditingExamId(exam._id);
                          setNewTitle(exam.title);
                          setIsRenameModalOpen(true);
                          setMenuOpen(null);
                        }}
                      >
                        Đổi tên
                      </button>

                      <button
                        className="menu-item"
                        onClick={() => {
                          handleOpenInNewTab(exam._id);
                          setMenuOpen(null);
                        }}
                      >
                        Mở trong thẻ mới
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <footer className='footer_itemExam'>
                <button
                  className="view-results-button"
                  onClick={() => handleViewResults(exam._id)}
                >
                  Xem kết quả
                </button>

                <button
                  className="edit-exam-button"
                  onClick={() => handleEditExam(exam._id)}
                >
                  Sửa bài kiểm tra
                </button>
              </footer>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-content">
              <h1>Chuyển vào thùng rác?</h1>
              <p>"Câu hỏi trắc nghiệm trống" sẽ được chuyển vào thùng rác trong Drive và bị xóa vĩnh viễn sau 30 ngày.</p>
              <p>Nếu tệp này được chia sẻ, cộng tác viên vẫn tạo được bản sao của tệp cho đến khi tệp bị xóa vĩnh viễn.
              <span className='modal-content_text'>Tìm hiểu thêm</span>
              </p>
              <div className="modal-actions">
                <button onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button
                  onClick={() => {
                    handleDeleteExam(selectedExamId);
                    setIsModalOpen(false);
                  }}
                >
                  Chuyển vào thùng rác
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}

      {isRenameModalOpen && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-content_rename">
              <h1>Đổi tên</h1>
              <p>Vui lòng nhập tên mới cho mục này:</p>
              <input
                className='input_rename'
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder=""
              />
              <div className="modal-actions">
                <button onClick={() => setIsRenameModalOpen(false)}>Hủy</button>
                <button
                  onClick={() => {
                    handleRenameExam(editingExamId, newTitle); // Hàm đổi tên
                    setIsRenameModalOpen(false); // Đóng modal
                  }}
                >
                  OK
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamList;
