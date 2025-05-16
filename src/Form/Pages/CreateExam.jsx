import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CreateExam.css';
import FormMenu from '../components/FormMenu';

const CreateExam = ({ title, setTitle }) => {
  
  const [questions, setQuestions] = useState([
    { questionText: '', answers: [{ text: '', isCorrect: false }] }
  ]);
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [maxAttempts, setMaxAttempts] = useState(1);
  const navigate = useNavigate();
  const [titleStyles, setTitleStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [descriptionStyles, setDescriptionStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    listType: 'none',
  });
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

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

  const validateForm = () => {
    if (!title) {
      setMessage('Title is required.');
      return false;
    }
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText) {
        setMessage(`Question ${i + 1} text is required.`);
        return false;
      }
      if (questions[i].answers.some(answer => !answer.text)) {
        setMessage(`All answers for Question ${i + 1} are required.`);
        return false;
      }
      const correctAnswerCount = questions[i].answers.filter(answer => answer.isCorrect).length;
      if (correctAnswerCount !== 1) {
        setMessage(`Exactly one correct answer is required for Question ${i + 1}.`);
        return false;
      }
    }
    return true;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!validateForm()) {
      return;
    }

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/exam/create',
        { title, 
          questions,
          maxAttempts, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Exam created successfully!');
      setTitle('');
      setMaxAttempts(1);
      setQuestions([{ questionText: '', answers: [{ text: '', isCorrect: false }] }]);
    } catch (error) {
      const errorMsg = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;
      setMessage('Error creating exam: ' + errorMsg);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => setDescription(e.target.value);

  // Cập nhật kiểu chữ cho tiêu đề
  const toggleTitleStyle = (style) => {
    setTitleStyles((prev) => ({
      ...prev,
      [style]: !prev[style],
    }));
  };

  // Cập nhật kiểu chữ cho mô tả
  const toggleDescriptionStyle = (style) => {
    setDescriptionStyles((prev) => ({
      ...prev,
      [style]: !prev[style],
    }));
  };

  // Chuyển đổi kiểu danh sách
  const toggleListType = () => {
    setDescriptionStyles((prev) => ({
      ...prev,
      listType: prev.listType === 'ordered' ? 'unordered' : 'ordered',
    }));
  };

  // Xóa định dạng tiêu đề
  const resetTitleFormatting = () => {
    setTitleStyles({
      bold: false,
      italic: false,
      underline: false,
    });
  };

  // Xóa định dạng mô tả
  const resetDescriptionFormatting = () => {
    setDescriptionStyles({
      bold: false,
      italic: false,
      underline: false,
      listType: 'none',
    });
  };

  // Kiểu chữ cho tiêu đề
  const titleStyle = {
    fontWeight: titleStyles.bold ? 'bold' : 'normal',
    fontStyle: titleStyles.italic ? 'italic' : 'normal',
    textDecoration: titleStyles.underline ? 'underline' : 'none',
  };

  // Kiểu chữ cho mô tả
  const descriptionStyle = {
    fontWeight: descriptionStyles.bold ? 'bold' : 'normal',
    fontStyle: descriptionStyles.italic ? 'italic' : 'normal',
    textDecoration: descriptionStyles.underline ? 'underline' : 'none',
  };
  
  const [showButtons, setShowButtons] = useState(false);
  const buttonClicked = useRef(false);

  const handleFocus = () => setShowButtons(true);

  const handleBlur = () => {
    if (!buttonClicked.current) {
      setShowButtons(false);
    }
    buttonClicked.current = false;
  };

  const [showDescriptionButtons, setShowDescriptionButtons] = useState(false);

  const handleDescriptionFocus = () => 
    setShowDescriptionButtons(true);


  const handleDescriptionBlur = () => {
    if (!buttonClicked.current) {
      setShowDescriptionButtons(false);
    }
    buttonClicked.current = false;
  };


  const handleButtonClick = () => {
    buttonClicked.current = true;
  };

  const handleImageUpload = (qIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      // Logic xử lý file ảnh ở đây
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result;
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].imageUrl = imageUrl; // Thêm URL của ảnh vào câu hỏi
        setQuestions(updatedQuestions);
      };
      reader.readAsDataURL(file); // Đọc file ảnh dưới dạng URL
    }
  };

  const handleQuestionTypeChange = (qIndex, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].questionType = e.target.value; // Cập nhật loại câu hỏi
    setQuestions(updatedQuestions);
  };

  const removeAnswer = (qIndex, aIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers.splice(aIndex, 1); // Xóa 1 đáp án tại vị trí aIndex
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index) => {
    setQuestions((prevQuestions) => prevQuestions.filter((_, qIndex) => qIndex !== index));
  };
  
  

  return (
    <div className='create_exam'>
      <form onSubmit={handleSubmit}>
        <div className="title_create">
          <div className="hihi"></div>
          <div className="input-create">
            <input
              className='title-input'
              type="text"
              value={title}
              onChange={handleTitleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              placeholder="Tiêu đề biểu mẫu"
              style={titleStyle}             
            />     
              {showButtons && (
              <div className="format-buttons" onMouseDown={handleButtonClick}>
                <button onClick={() => toggleTitleStyle('bold')}>
                  <i className="fas fa-bold"></i>
                </button>
                <button onClick={() => toggleTitleStyle('italic')}>
                  <i className="fas fa-italic"></i>
                </button>
                <button onClick={() => toggleTitleStyle('underline')}>
                  <i className="fas fa-underline"></i>
                </button>
                <button onClick={resetTitleFormatting}>
                  <i class="fa-solid fa-text-slash"></i>
                </button>
              </div>
              )}
              <div className="describe_create">
                <div className="description-input">
                  <input
                    className='description-textarea'
                    value={description}
                    onChange={handleDescriptionChange}
                    onFocus={handleDescriptionFocus}
                    onBlur={handleDescriptionBlur}
                    placeholder="Mô tả biểu mẫu"
                    style={descriptionStyle}
                  />
                </div>
          
                {showDescriptionButtons && (
                  <div className="format-buttons">
                    <button onClick={() => toggleDescriptionStyle('bold')}>
                      <i className="fas fa-bold"></i>
                    </button>
                    <button onClick={() => toggleDescriptionStyle('italic')}>
                      <i className="fas fa-italic"></i>
                    </button>
                    <button onClick={() => toggleDescriptionStyle('underline')}>
                      <i className="fas fa-underline"></i>
                    </button>
                    <button onClick={toggleListType}>
                      {descriptionStyles.listType === 'ordered' ? (
                        <i className="fas fa-list-ol"></i>
                      ) : (
                        <i className="fas fa-list-ul"></i>
                      )}
                    </button>
                    <button onClick={resetDescriptionFormatting}>
                      <i class="fa-solid fa-text-slash"></i>
                    </button>
                  </div>
                )}
              </div>      
            </div>  
          </div>      

          {questions.map((question, qIndex) => (
            <div className='question_form'>
            <div key={qIndex} className="question-container">
              <div className="question_input">
                {/* Input cho câu hỏi */}
                <div className="question-text-container">
                  <input 
                    className='question-text-container-input'
                    type="text"
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(qIndex, e)}
                    required
                    placeholder="Câu hỏi"
                  />
                </div>

                {/* Thêm hình ảnh icon cho câu hỏi */}
                <div className="question-image-container">
                  <input
                    type="file"
                    id={`image-upload-${qIndex}`}
                    onChange={(e) => handleImageUpload(qIndex, e)}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor={`image-upload-${qIndex}`}>
                    <i className="fa-regular fa-image" title="Upload Image"></i>
                  </label>
                </div>

                {/* Dropdown chọn loại câu hỏi */}
                <div className="question-type-container">
                  <select
                    value={question.questionType}
                    onChange={(e) => handleQuestionTypeChange(qIndex, e)}
                  >
                    <option value="Trắc nghiệm">Trắc nghiệm</option>
                    <option value="true-false">True/False</option>
                    <option value="fill-in-the-blank">Fill in the Blank</option>
                  </select>
                </div>
              </div>
              {/* Các câu trả lời */}
              {question.answers.map((answer, aIndex) => (
                <div className='answer' key={aIndex}>
                  <label>
                    <input
                      type="radio"
                      checked={answer.isCorrect}
                      onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                    />
                  </label>
                  <input
                    className='answer_input'
                    type="text"
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                    required
                    placeholder={`Đáp án ${aIndex + 1}`}
                  />
                  <div className="question-image-container">
                  <input
                    type="file"
                    id={`image-upload-${qIndex}`}
                    onChange={(e) => handleImageUpload(qIndex, e)}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor={`image-upload-${qIndex}`}>
                    <i className="fa-regular fa-image" title="Upload Image"></i>
                  </label>
                  </div>
                  <button 
                    className='button_remove'
                    type="button" 
                    onClick={() => removeAnswer(qIndex, aIndex)} 
                    disabled={question.answers.length <= 1}
                  >
                    <i class="remove-icon fa-solid fa-xmark"></i>
                  </button>

                  
                </div>
              ))}

              <span className='add-answerf' onClick={() => addAnswer(qIndex)}>Thêm tùy chọn</span>
              <span className='add-answer'> hoặc </span>
              <span className="add-answerl" onClick={() => addAnswer(qIndex)}>thêm "Câu trả lời khác"</span>
              

              <footer className='footer_question'>
                <div className='footer-icons'>
                  <i className="footer-icons-item fa-regular fa-copy"></i>
                  <i class="footer-icons-item fa-solid fa-trash"
                    onClick={() => removeQuestion(qIndex)}></i>
                  <span>Bắt buộc</span>
                  <div className="toggle-switch">
                    <input type="checkbox" id="required-toggle" />
                    <label htmlFor="required-toggle"></label>
                  </div>
                  <i className='footer-icons-item fas fa-ellipsis-v'></i>
                </div>
              </footer>
            </div>
            
            </div>
          ))}
          
        <FormMenu onAddQuestion={addQuestion} />
        <div>
          <div>
            <label>Số Lần Làm Lại (Max):</label>
            <input 
              type="number" 
              value={maxAttempts} 
              onChange={(e) => setMaxAttempts(e.target.value)} 
              min="1" 
              required 
            />
          </div>
          <button type="submit">Tạo Bài Kiểm Tra</button>
        </div>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default CreateExam;
