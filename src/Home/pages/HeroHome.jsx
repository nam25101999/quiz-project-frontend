import '../styles/HeroHome.css';
import React, { useState, useEffect, useRef } from 'react';

const HeroHome = ({ showHeroHome, setShowHeroHome }) => {
    const items = [
        { id: 1, image: '/img/heroHome/1.png', caption: 'Biểu mẫu trống', link: '/form-home' },
        { id: 2, image: '/img/heroHome/2.png', caption: 'Tiêu đề trang tính', link: '/topic2' },
        { id: 3, image: '/img/heroHome/3.png', caption: 'Câu hỏi kiểm tra mức độ', link: '/topic3' },
        { id: 4, image: '/img/heroHome/4.png', caption: 'Câu hỏi trắc nghiệm', link: '/topic4' },
        { id: 5, image: '/img/heroHome/5.png', caption: 'Đánh giá', link: '/topic5' },
    ];

    const [showTable, setShowTable] = useState(false);
    const tableRef = useRef(null);
    const buttonRef = useRef(null);

    const toggleTable = () => {
        setShowTable(!showTable);
    };

    const handleHideHeroHome = () => {
        setShowHeroHome(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tableRef.current && !tableRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
                setShowTable(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            {showHeroHome && (
                <div className="hero-home">
                    <header className="header_hero">
                        <div className="header_hero-left">Bắt đầu biểu mẫu mới</div>
                        <div className="header_hero-right">
                            <div className="library">
                                <p>Thư viện mẫu</p>
                                <div className="arrows-container">
                                    <div className="arrow-up"></div>
                                    <div className="arrow-down"></div>
                                </div>
                            </div>
                            <i
                                className="fas fa-ellipsis-v"
                                onClick={toggleTable}
                                ref={buttonRef}
                                style={{ cursor: 'pointer' }}
                            ></i>

                            {showTable && (
                                <div className="table-container" ref={tableRef}>
                                    <p className="table_container-text" onClick={handleHideHeroHome}>Ẩn tất cả mẫu</p>
                                </div>
                            )}
                        </div>
                    </header>
                    <div className="hero-grid">
                        {items.map((item) => (
                            <a key={item.id} href={item.link} className="hero-item">
                                <img src={item.image} alt={item.caption} className="hero-image" />
                                <p className="hero-caption">{item.caption}</p>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroHome;
