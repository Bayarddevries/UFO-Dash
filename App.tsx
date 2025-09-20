import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import SocialPlanner from './pages/SocialPlanner';
import { isApiKeySet } from './services/geminiService';

const ApiKeyBanner: React.FC = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
        <div className="bg-slate-800 border border-red-500 rounded-lg p-8 max-w-2xl text-center shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-3xl font-bold text-red-300 mb-2">Configuration Required</h2>
            <p className="text-slate-300 text-lg mb-6">
                Your Gemini API key has not been set. The application cannot function without it.
            </p>
            <p className="text-slate-400">
                Please open the file below in your code editor and replace the placeholder with your actual API key:
            </p>
            <div className="mt-4 bg-slate-900 rounded-md p-3 text-cyan-300 font-mono text-center">
                services/geminiService.ts
            </div>
        </div>
    </div>
);


const App: React.FC = () => {
  return (
    <HashRouter>
      {!isApiKeySet && <ApiKeyBanner />}
      <div className={`flex h-screen bg-slate-900 font-mono ${!isApiKeySet ? 'blur-sm pointer-events-none' : ''}`} aria-hidden={!isApiKeySet}>
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