import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, Form } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.css';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ExamList from './Home/pages/ExamList';
import UpdateProfile from './components/UpdateProfile';
import Profile from './components/Profile';
import NotePage from './Note/pages/NotePage';
import NotesPage from './Note/pages/NotesPage';
import ExamDetails from './components/ExamDetails';
import FormHome from './Form/FormHome';
import Home from './Home/Home';
import TakeExam from './Assignment/TakeExam';
import ExamResults from './Assignment/ExamResults';
import EditExam from './Assignment/EditExam';
import Cre from './Test/Cre'

const PrivateRoute = ({ element }) => {

  const isAuthenticated = localStorage.getItem('token');

  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <div>
        {/* Routes */}
        <Routes>
          {/* Hiển thị trang đăng nhập riêng biệt */}
          <Route path="/login" element={<Login />} />
          
          {/* Các route bảo vệ cho những trang yêu cầu người dùng đã đăng nhập */}
          <Route
            path="/"
            element={
              <PrivateRoute element={
                <>                  
                  <main>
                    
                    <nav>
                      <Home />    
                      <Link to="/exam-list">Danh Sách Bài Tập</Link>
                      <Link to="/form-home">Tạo</Link>
                    </nav>
                    <Routes>
                      
                      <Route path="/exam-details" element={<ExamDetails />} />
                    </Routes>
                  </main>
                </>
              } />
            }
          />

          {/* Các route cho phần đăng ký và cập nhật thông tin người dùng */}
          <Route path="/form-home" element={<FormHome />} />
          <Route path="/edit-exam/:examId" element={<EditExam />} />

          <Route path="/exam-list" element={<ExamList />}></Route>
          <Route path="/exam/:examId" element={<TakeExam />} />
          <Route path="/exam-results/:examId" element={<ExamResults />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/update-profile" element={<PrivateRoute element={<UpdateProfile />} />} />

          <Route path="/notes" element={<PrivateRoute element={<NotesPage />} />} />
          <Route path="/note-page" element={<PrivateRoute element={<NotePage />} />} />



          <Route path="/hi" element={<Cre />} />




        </Routes>
      </div>
    </Router>
  );
};

export default App;
