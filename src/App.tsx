import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './app/page';
import GamePlayer from './app/play/[slug]/page';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black font-sans selection:bg-emerald-500/30 selection:text-emerald-500">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play/:slug" element={<GamePlayer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
