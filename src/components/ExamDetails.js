import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ExamDetails = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/exam/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExam(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchExamDetails();
  }, [examId]);

  if (!exam) return <p>Loading...</p>;

  return (
    <div>
      <h1>{exam.title}</h1>
      <ul>
        {exam.questions.map((question, index) => (
          <li key={index}>
            <h3>{question.questionText}</h3>
            <ul>
              {question.answers.map((answer, i) => (
                <li key={i} style={{ color: answer.isCorrect ? 'green' : 'black' }}>
                  {answer.text}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamDetails;
