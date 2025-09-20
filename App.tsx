import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import SocialPlanner from './pages/SocialPlanner';
import { isApiKeySet } from './services/geminiService';

const ApiKeyBanner: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-slate-900 text-slate-200 p-4">
    <div className="max-w-2xl w-full p-8 text-center bg-slate-800 border border-red-500 rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold text-red-400 mb-4">Configuration Required</h1>
      <p className="mb-6 text-slate-300">
        Your Gemini API key is not set. To use this application, you must add your API key.
      </p>
      <div className="text-left bg-slate-900 p-4 rounded-md text-sm">
        <p className="font-semibold">Follow these steps:</p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Open the file: <code className="font-mono text-cyan-400">services/geminiService.ts</code></li>
            <li>
                Find the line with the <code className="font-mono text-yellow-400">'YOUR_API_KEY_HERE'</code> placeholder.
            </li>
            <li>Replace the placeholder with your actual Gemini API key.</li>
        </ol>
      </div>
    </div>
  </div>
);


const App: React.FC = () => {
  if (!isApiKeySet) {
    return <ApiKeyBanner />;
  }

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