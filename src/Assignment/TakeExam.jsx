import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './styles/TakeExam.css';
import '../styles_main/base.css';

const TakeExam = () => {
  const [user, setUser] = useState(null);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageA, setErrorMessageA] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [showRetryButton, setShowRetryButton] = useState(false);
  const { examId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [userAttempts, setUserAttempts] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(0);
  


  useEffect(() => {
    const fetchUserAndExam = async () => {
      const token = localStorage.getItem('token');
  
      // Kiểm tra xem token có hợp lệ không
      if (!token) {
        setErrorMessage('Đăng nhập vào đi em ơi =>>');
        return;
      }
  
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
  
        const examResponse = await axios.get(`http://localhost:5000/api/exam/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExam(examResponse.data);
  
        const userAttempts = Array.isArray(examResponse.data.userAttempts)
          ? examResponse.data.userAttempts
          : [];
  
        const userAttempt = userAttempts.find((attempt) => attempt.userId === decoded.id);
  
        const attempts = userAttempt ? userAttempt.attempts : 0;
        const maxAttempts = examResponse.data.maxAttempts;
  
        const remainingAttempts = maxAttempts - attempts;
  
        setUserAttempts(attempts);
        setRemainingAttempts(remainingAttempts);
  
        // Nếu số lần tham gia vượt quá, hiển thị thông báo
        if (remainingAttempts <= 0) {
          setErrorMessageA('Bạn đã đạt giới hạn số lần tham gia bài thi.');
        }
  
      } catch (err) {
        console.error(err);
  
        // Xử lý lỗi nếu token không hợp lệ hoặc không thể lấy thông tin bài thi
        if (err.response && err.response.status === 401) {
          setErrorMessage('Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
          localStorage.removeItem('token');  // Xóa token nếu không hợp lệ
        } else {
          setErrorMessage('Không thể lấy thông tin bài thi.');
        }
      }
    };
  
    fetchUserAndExam();
  }, [examId, navigate]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => {
      if (answer === null) {
        return prevAnswers.filter((ans) => ans.questionId !== questionId);
      }
  
      const existingAnswerIndex = prevAnswers.findIndex((ans) => ans.questionId === questionId);
      if (existingAnswerIndex >= 0) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex].selectedAnswer = answer;
        return updatedAnswers;
      }
      return [...prevAnswers, { questionId, selectedAnswer: answer }];
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/exam/submit',
        { examId, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const { score, remainingAttempts, userAttempts } = response.data;
  
      setSubmissionMessage(`Câu trả lời của bạn đã được ghi lại. Điểm của bạn là: ${score}`);
      setUserAttempts(userAttempts);
      setRemainingAttempts(remainingAttempts);
      setShowRetryButton(true);
    } catch (error) {
      console.error(error);
      alert('Hết cơ hội rồi em ơi');
    }
  
    setIsResultModalOpen(true);
  };
  

  const handleRetry = () => {
    setAnswers([]);
    setSubmissionMessage('');
    setShowRetryButton(false);
    navigate(`/exam/${examId}`);
  };
  const handleClearAnswer = (questionId) => {
    setAnswers((prevAnswers) => prevAnswers.filter((ans) => ans.questionId !== questionId));
  };

  const handleClearAllAnswers = () => {
    setAnswers([]);
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };
  if (!exam && !errorMessage) return <p>Loading...</p>;
  
  return (
    <div>
      {errorMessage && (
        <div className="error-message-container">
          <div className="error-message">
            <i class="fa-solid fa-circle-exclamation"></i>
            <p>{errorMessage}</p>
            <button onClick={() => navigate('/login')} className="go-to-login-button">
              Đăng nhập
            </button>
          </div>
        </div>
      )}
      {errorMessageA && (
        <div className="error-message-container">
          <div className="error-message">
            <i class="fa-solid fa-circle-exclamation"></i>
            <p>{errorMessageA}</p>
            <button onClick={() => navigate('/')} className="go-to-login-button">
              Quay Lại Trang Chủ
            </button>
          </div>
        </div>
      )}
    
    <div className="take-exam-container">
      {!errorMessageA && exam && (
        <>
          {exam && (
            <div>
              <h2>{exam.title}</h2>
              <p>Đã tham gia: {userAttempts} lần</p>
              <p>Số lần còn lại: {remainingAttempts}</p>
              {remainingAttempts <= 0 && <p>Không còn lần tham gia nào nữa.</p>}
            </div>
          )}
          <div className="header_exam">
            <div className="haha"></div>
              <div className="title_takeexam">
                <h1 className="exam-title">{exam.title}</h1>
              </div>
              <div className="account-container">
                <div className="email-container">
                  <p><strong>Email:</strong> {user?.email || 'Không rõ'}</p>
                  <p><strong>Tên đăng nhập:</strong> {user?.username || 'Không rõ'}</p>
                  <p><strong>Ngày sinh:</strong> {user.dob}</p>
                  <p><strong>Họ và tên:</strong> {user.fullName}</p>
                </div>
                <div className="change-account-container">
                  <button>Chuyển đổi tài khoản</button>
                </div>
              </div>
            </div>

            
            <div className="questions-container">
              {exam.questions.map((q) => {
                const selectedAnswer = answers.find((ans) => ans.questionId === q._id)?.selectedAnswer; // Lấy câu trả lời đã chọn
                return (
                  <div key={q._id} className="take-exam-question">
                    <p className="take-exam-question-text">{q.questionText}</p>
                    <div className="answer-options">
                      {q.answers.map((a) => (
                        <label key={a.text} className="take-exam-answer">
                          <input
                            type="radio"
                            name={q._id}
                            value={a.text}
                            checked={selectedAnswer === a.text}
                            onChange={() =>
                              handleAnswerChange(
                                q._id,
                                selectedAnswer === a.text ? null : a.text // Nếu đã chọn, bỏ chọn; nếu chưa chọn, chọn đáp án
                              )
                            }
                          />
                          {a.text}
                        </label>
                      ))}
                    </div>
                    {selectedAnswer && (
                      <button 
                        onClick={() => handleClearAnswer(q._id)} 
                        className="clear-answer-button"
                      >
                        Xóa lựa chọn
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
              <div className="button_assignment">
                <button 
                  onClick={handleSubmit} className="take-exam-submit-button">
                  Nộp bài
                </button>
                <div className="clear-all-container">
                  <button onClick={() => setIsModalOpen(true)} className="clear-all-button">
                    Xóa hết câu trả lời
                </button>
                </div>
              </div>
              <footer class="footer_takeexam">
                <div class="footer-content">
                  <p><strong>2N - Đưa kiến thức đến mọi người</strong></p>
                  <p>Chúng tôi cam kết bảo mật thông tin của bạn và mang đến trải nghiệm học tập tốt nhất.</p>
                  <p>&copy; 2024 2N. Tất cả quyền lợi được bảo lưu.</p>
                  <p><a href="#">Chính sách bảo mật</a> | <a href="#">Điều khoản sử dụng</a></p>
                </div>
              </footer>
            
        </>
      )}
        
    </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-content">
              <h1>Xóa hết câu trả lời trong biểu mẫu?</h1>
              <p>Thao tác này sẽ xóa câu trả lời của bạn khỏi tất cả câu hỏi. Bạn sẽ không thể hủy được thao tác này sau khi thực hiện.
              </p>
              <div className="modal-actions">
                <button onClick={handleModalCancel} className="modal-cancel-button">
                  Hủy
                </button>
                <button onClick={handleClearAllAnswers} className="modal-confirm-button">
                  Xóa hết câu trả lời
                </button>
              </div>
            </div>
            </div>
        </div>
      )}


      {isResultModalOpen && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-content">
              <h1>Kết quả bài thi</h1>
              {submissionMessage && (
                <div className="submission-message">
                  <p>{submissionMessage}</p>
                </div>
              )}

              {showRetryButton && (
                <button 
                  onClick={() => {
                    handleRetry();
                    setIsResultModalOpen(false);
                  }} 
                  className="retry-button">
                  Làm lại bài thi
                </button>
              )}

              <button
                onClick={() => setIsResultModalOpen(false)}
                className="close-result-modal-button"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TakeExam;
