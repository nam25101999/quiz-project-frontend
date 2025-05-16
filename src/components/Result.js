import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/results', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setResults(response.data.results);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Không thể tải kết quả.');
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return <div>Đang tải kết quả...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Kết quả của bạn</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <p>Bài thi: {result.examId}</p>
            <p>Kết quả: {JSON.stringify(result.userAnswers)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
