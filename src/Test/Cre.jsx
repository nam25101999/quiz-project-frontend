import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateExam = () => {
  const navigate = useNavigate();
  
  const [examTitle, setExamTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([{ text: '', isCorrect: false }]);
  const [message, setMessage] = useState('');

  // Xử lý thêm câu hỏi
  const handleAddQuestion = () => {
    if (questionText.trim() === '') {
      setMessage('Câu hỏi không được để trống.');
      return;
    }

    const newQuestion = {
      questionText,
      options,
    };

    setQuestions([...questions, newQuestion]);
    setQuestionText('');
    setOptions([{ text: '', isCorrect: false }]);
    setMessage('');
  };

  // Xử lý thêm đáp án cho câu hỏi
  const handleAddOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index].text = event.target.value;
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (index) => {
    const newOptions = [...options];
    newOptions[index].isCorrect = !newOptions[index].isCorrect;
    setOptions(newOptions);
  };

  // Xử lý tạo bài thi
  const handleCreateExam = async () => {
    if (examTitle.trim() === '' || questions.length === 0) {
      setMessage('Tên bài thi và câu hỏi không được để trống.');
      return;
    }

    const examData = {
      title: examTitle,
      questions,
    };

    try {
      const response = await axios.post('/api/exams', examData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Giả sử bạn lưu token trong localStorage
        },
      });
      setMessage('Bài thi đã được tạo thành công!');
      navigate(`/exam/${response.data.examId}`);
    } catch (error) {
      setMessage('Có lỗi xảy ra khi tạo bài thi.');
    }
  };

  return (
    <div>
      <h2>Tạo Bài Kiểm Tra</h2>

      {message && <div className="message">{message}</div>}

      <div>
        <label>Tên Bài Thi:</label>
        <input 
          type="text" 
          value={examTitle} 
          onChange={(e) => setExamTitle(e.target.value)} 
        />
      </div>

      {questions.map((question, index) => (
        <div key={index}>
          <h3>Câu hỏi {index + 1}:</h3>
          <p>{question.questionText}</p>
          <ul>
            {question.options.map((option, i) => (
              <li key={i}>{option.text} {option.isCorrect && '(Đúng)'}</li>
            ))}
          </ul>
        </div>
      ))}

      <div>
        <label>Câu Hỏi:</label>
        <input 
          type="text" 
          value={questionText} 
          onChange={(e) => setQuestionText(e.target.value)} 
        />
        <div>
          {options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e)}
                placeholder={`Đáp án ${index + 1}`}
              />
              <input
                type="checkbox"
                checked={option.isCorrect}
                onChange={() => handleCorrectAnswerChange(index)}
              />
              <label>Đáp án đúng</label>
            </div>
          ))}
          <button onClick={handleAddOption}>Thêm Đáp Án</button>
        </div>

        <button onClick={handleAddQuestion}>Thêm Câu Hỏi</button>
      </div>

      <button onClick={handleCreateExam}>Tạo Bài Thi</button>
    </div>
  );
};

export default CreateExam;
