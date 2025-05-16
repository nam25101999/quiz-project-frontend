import React, { useState } from 'react';
import HeaderHome from "./pages/HeaderHome";
import HeroHome from "./pages/HeroHome";
import ExamList from './pages/ExamList';

const Home = () => {
    const [showHeroHome, setShowHeroHome] = useState(true);

    return (
        <div>
            <HeaderHome />
            <HeroHome showHeroHome={showHeroHome} setShowHeroHome={setShowHeroHome} />
            <ExamList />

        </div>
    );
};

export default Home;
