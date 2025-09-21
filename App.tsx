import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.js';
import Dashboard from './pages/Dashboard.js';
import Chat from './pages/Chat.js';
import SocialPlanner from './pages/SocialPlanner.js';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-900 font-mono">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/social-planner" element={<SocialPlanner />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;