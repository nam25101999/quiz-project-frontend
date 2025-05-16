import React, { useState } from "react";
import CreateExam from "./Pages/CreateExam";
import ExamResults from "../Assignment/ExamResults";
import SettingForm from "../Assignment/SettingForm";
import HeaderForm from "./components/HeaderForm";

const FormHome = () => {
  const [currentPage, setCurrentPage] = useState("createExam");
  const [title, setTitle] = useState("Mẫu không có tiêu đề");

  const renderPage = () => {
    switch (currentPage) {
      case "createExam":
        return <CreateExam title={title} setTitle={setTitle} />;
      case "examResults":
        return <ExamResults />;
      case "settings":
        return <SettingForm />;
      default:
        return <div>Trang không tồn tại!</div>;
    }
  };

  return (
    <div>
      {/* Pass setCurrentPage to HeaderForm */}
      <HeaderForm setCurrentPage={setCurrentPage} title={title} setTitle={setTitle} />
      
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default FormHome;
