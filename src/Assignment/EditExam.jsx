import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './styles/TakeExam.css';
import '../styles_main/base.css';

const EditExam = () => {
  const [exam, setExam] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [editedExam, setEditedExam] = useState(null);
  const { examId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      const token = localStorage.getItem('token');
  
      if (!token) {
        setErrorMessage('Đăng nhập vào đi em ơi =>>');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        
        const examResponse = await axios.get(`http://localhost:5000/api/exam/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExam(examResponse.data);
        setEditedExam(examResponse.data); // Set initial edited data
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          setErrorMessage('Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
          localStorage.removeItem('token');
        } else {
          setErrorMessage('Không thể lấy thông tin bài thi.');
        }
      }
    };

    fetchExam();
  }, [examId]);

  // Handle changes to the edited exam
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedExam(prevExam => {
      const updatedExam = {
        ...prevExam,
        [name]: value,
      };
      
      // Cập nhật lại số lần còn lại khi thay đổi maxAttempts
      updatedExam.remainingAttempts = updatedExam.maxAttempts - updatedExam.userAttempts;
      return updatedExam;
    });
  };

  const handleQuestionChange = (qIndex, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...editedExam.questions];
    updatedQuestions[qIndex] = {
      ...updatedQuestions[qIndex],
      [name]: value,
    };
    setEditedExam(prevExam => ({
      ...prevExam,
      questions: updatedQuestions,
    }));
  };

  const handleAnswerChange = (qIndex, aIndex, e) => {
    const { name, value } = e.target;
    const updatedAnswers = [...editedExam.questions[qIndex].answers];
    updatedAnswers[aIndex] = {
      ...updatedAnswers[aIndex],
      [name]: value,
    };
    const updatedQuestions = [...editedExam.questions];
    updatedQuestions[qIndex] = {
      ...updatedQuestions[qIndex],
      answers: updatedAnswers,
    };
    setEditedExam(prevExam => ({
      ...prevExam,
      questions: updatedQuestions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(`http://localhost:5000/api/exam/${examId}`, editedExam, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Bài kiểm tra đã được cập nhật!');
      navigate(`/exam/${examId}`); // Redirect after saving
    } catch (err) {
      console.error(err);
      setErrorMessage('Có lỗi xảy ra khi cập nhật bài kiểm tra.');
    }
  };

  if (!exam && !errorMessage) return <p>Loading...</p>;

  return (
    <div>
      {errorMessage && (
        <div className="error-message-container">
          <div className="error-message">
            <i className="fa-solid fa-circle-exclamation"></i>
            <p>{errorMessage}</p>
            <button onClick={() => navigate('/login')} className="go-to-login-button">
              Đăng nhập
            </button>
          </div>
        </div>
      )}

      <div className="take-exam-container">
        {exam && (
          <>
            <h2>Chỉnh sửa bài kiểm tra</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Tiêu đề bài kiểm tra:</label>
                <input
                  type="text"
                  name="title"
                  value={editedExam.title}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label>Số lần tối đa:</label>
                <input
                  type="number"
                  name="maxAttempts"
                  value={editedExam.maxAttempts}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label>Số lần còn lại:</label>
                <input
                  type="number"
                  name="remainingAttempts"
                  value={editedExam.remainingAttempts}
                  readOnly
                />
              </div>

              <div className="questions-container">
                {editedExam.questions.map((q, qIndex) => (
                  <div key={q._id} className="question-edit-container">
                    <div>
                      <label>Câu hỏi:</label>
                      <input
                        type="text"
                        name="questionText"
                        value={q.questionText}
                        onChange={(e) => handleQuestionChange(qIndex, e)}
                      />
                    </div>

                    <div className="answer-options">
                      {q.answers.map((a, aIndex) => (
                        <div key={a._id} className="answer-edit-container">
                          <label>Đáp án:</label>
                          <input
                            type="text"
                            name="text"
                            value={a.text}
                            onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                          />
                          <input
                            type="radio"
                            name={`correctAnswer-${qIndex}`}
                            checked={a.isCorrect}
                            onChange={(e) => {
                              const updatedAnswers = [...q.answers];
                              updatedAnswers[aIndex].isCorrect = !a.isCorrect;
                              handleAnswerChange(qIndex, aIndex, e);
                            }}
                          />
                          <label>Đáp án đúng</label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" className="submit-exam-btn">Cập nhật bài kiểm tra</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EditExam;
