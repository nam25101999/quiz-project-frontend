import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExamResults = () => {
  const [results, setResults] = useState([]);
  const [groupedResults, setGroupedResults] = useState({});
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
        setResults(resultsData);

        // Nhóm kết quả theo examId
        const grouped = resultsData.reduce((acc, result) => {
          const examId = result.examId?._id || 'unknown';
          if (!acc[examId]) acc[examId] = [];
          acc[examId].push(result);
          return acc;
        }, {});

        setGroupedResults(grouped);
      } catch (error) {
        setError('Có lỗi xảy ra khi tải kết quả.');
        console.error(error);
      }
    };

    fetchResults();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="exam-results-container">
      <h1>Kết quả bài thi của bạn</h1>
      {Object.keys(groupedResults).length === 0 ? (
        <p>Không có kết quả nào.</p>
      ) : (
        Object.entries(groupedResults).map(([examId, results]) => (
          <div key={examId} className="exam-result-group">
            <h2>Bài thi: {results[0].examId?.title || 'Không có tiêu đề'}</h2>
            {results.map((result) => (
              <div key={result._id} className="exam-result-card">
                <p>Điểm số: <strong>{result.score}</strong></p>
                <p>Ngày làm: {new Date(result.createdAt).toLocaleString()}</p>
                <p>Người trả lời: {result.userId?.username || 'Không có tên người trả lời'}</p>

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
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ExamResults;
