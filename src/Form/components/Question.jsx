import React, { useState, useEffect, useRef } from 'react';
import '../styles/Question.css';

const Question = () =>{

    const [questions, setQuestions] = useState([
        { questionText: '', answers: [{ text: '', isCorrect: false }] }
      ]);
      const [message, setMessage] = useState('');

      

      const handleQuestionChange = (index, e) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].questionText = e.target.value;
        setQuestions(updatedQuestions);
      };
      
      const handleAnswerChange = (qIndex, aIndex, e) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].answers[aIndex].text = e.target.value;
        setQuestions(updatedQuestions);
      };
      const handleCorrectAnswerChange = (qIndex, aIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].answers.forEach((answer, index) => {
          answer.isCorrect = index === aIndex;
        });
        setQuestions(updatedQuestions);
      };
      const addQuestion = () => {
        setQuestions([...questions, { questionText: '', answers: [{ text: '', isCorrect: false }] }]);
      };
      const addAnswer = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].answers.push({ text: '', isCorrect: false });
        setQuestions(updatedQuestions);
      };


    return (
        <div className="question_content">
            {questions.map((question, qIndex) => (
                <div key={qIndex}>
                    <h3>Question {qIndex + 1}</h3>
                    <div>
                    <label>Question Text:</label>
                    <input
                        type="text"
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(qIndex, e)}
                        required
                        placeholder="Enter question text"
                    />
                    </div>
                    {question.answers.map((answer, aIndex) => (
                    <div key={aIndex}>
                        <label>Answer {aIndex + 1}:</label>
                        <input
                        type="text"
                        value={answer.text}
                        onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                        required
                        placeholder="Enter answer text"
                        />
                        <label>
                        Correct Answer:
                        <input
                            type="radio"
                            checked={answer.isCorrect}
                            onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                        />
                        </label>
                    </div>
                    ))}
                    <button type="button" onClick={() => addAnswer(qIndex)}>Add Answer</button>
                </div>
                ))}
                <button type="button" onClick={addQuestion}>Add Question</button>
                <div>
                <button type="submit">Create Exam</button>
                </div>
                {message && <p>{message}</p>}
            </div>
    )
}

export default Question;