import React from "react";
import "../styles/HomeContent.css";

const HomeContent = () => {
  return (
    <div className="home-content">
      <header className="home-header">
        <h1 className="home-title">Chào mừng đến với Trang chủ</h1>
        <p className="home-subtitle">
          Khám phá nội dung, tính năng, và nhiều điều thú vị khác tại đây!
        </p>
      </header>

      <section className="features-section">
        <h2 className="section-title">Tính năng nổi bật</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3 className="feature-title">Tính năng 1</h3>
            <p className="feature-description">
              Mô tả ngắn gọn về tính năng 1, điều gì khiến nó đặc biệt.
            </p>
          </div>
          <div className="feature-item">
            <h3 className="feature-title">Tính năng 2</h3>
            <p className="feature-description">
              Mô tả ngắn gọn về tính năng 2, lý do người dùng yêu thích.
            </p>
          </div>
          <div className="feature-item">
            <h3 className="feature-title">Tính năng 3</h3>
            <p className="feature-description">
              Mô tả ngắn gọn về tính năng 3, giải pháp mà nó mang lại.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2 className="section-title">Về chúng tôi</h2>
        <p className="about-text">
          Chúng tôi cam kết mang lại trải nghiệm tốt nhất cho người dùng thông qua
          các sản phẩm sáng tạo và chất lượng. Hãy cùng khám phá và phát triển với
          chúng tôi.
        </p>
      </section>

      <footer className="home-footer">
        <p className="footer-text">
          © 2024 Your Company. Tất cả các quyền được bảo lưu.
        </p>
      </footer>
    </div>
  );
};

export default HomeContent;
