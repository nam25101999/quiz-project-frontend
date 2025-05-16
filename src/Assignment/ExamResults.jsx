import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './styles/ExamResults.css';

const ExamResults = () => {
  const { examId } = useParams();
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        
        const response = await axios.get('http://localhost:5000/api/results', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const resultsData = response.data.results;
        // Lọc kết quả theo examId từ URL
        const filteredResults = resultsData.filter(result => result.examId?._id === examId);
        setResults(filteredResults);

        // Tính toán thống kê kết quả
        const totalScore = filteredResults.reduce((sum, result) => sum + result.score, 0);
        const averageScore = filteredResults.length ? (totalScore / filteredResults.length).toFixed(2) : 0;

        // Tính tổng số câu hỏi trong bài thi (lấy từ một kết quả)
        const totalQuestions = filteredResults.length ? filteredResults[0].answers.length : 0;

        // Tính số câu đúng và sai
        const correctCount = filteredResults.reduce((count, result) => 
          count + result.answers.filter(answer => answer.isCorrect).length, 
          0);
        const incorrectCount = filteredResults.length * totalQuestions - correctCount;

        setStatistics({
          totalResults: filteredResults.length,
          averageScore,
          correctCount,
          incorrectCount,
          totalQuestions,
        });
      } catch (error) {
        setError('Có lỗi xảy ra khi tải kết quả.');
        console.error(error);
      }
    };

    fetchResults();
  }, [examId]);

  if (error) return <p>{error}</p>;

  return (
    <div className="exam-results-container">
      <h1>Kết quả bài thi</h1>

      {/* Thống kê kết quả */}
      <div className="exam-statistics">
        <h2>Thống kê kết quả</h2>
        <p>Số lượng bài làm: {statistics.totalResults || 0}</p>
        <p>Điểm trung bình: {statistics.averageScore || 0}</p>
        <p>Số câu đúng: {statistics.correctCount || 0}</p>
        <p>Số câu sai: {statistics.incorrectCount || 0}</p>
        <p>Tổng số câu hỏi: {statistics.totalQuestions || 0}</p>
      </div>

      {results.length === 0 ? (
        <p>Không có kết quả nào cho bài thi này.</p>
      ) : (
        results.map((result) => {
          const correctAnswers = result.answers.filter(answer => answer.isCorrect).length;
          const totalQuestionsInResult = result.answers.length;

          return (
            <div key={result._id} className="exam-result-card">
              <h2>Bài thi: {result.examId?.title || 'Không có tiêu đề'}</h2>
              {/* Điểm số người dùng trên tổng số câu hỏi */}
              <p>Điểm số: <strong>{correctAnswers}</strong> / {totalQuestionsInResult}</p>
              <p>Ngày làm: {new Date(result.createdAt).toLocaleString()}</p>
              <p>Người trả lời: {result.userId?.fullName|| 'Không có tên người trả lời'}</p>

              <details className="result-details">
                <summary>Chi tiết kết quả</summary>
                <ul>
                  {result.answers?.map((answer, index) => (
                    <li key={index} className={`result-answer ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                      <p><strong>Câu hỏi:</strong> {answer.questions?.questionText || 'Không có câu hỏi'}</p>
                      <p><strong>Đáp án đã chọn:</strong> {answer.selectedAnswer}</p>
                      <p className="answer-status">{answer.isCorrect ? 'Đúng' : 'Sai'}</p>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ExamResults;
