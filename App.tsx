import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Chat from './pages/Chat.tsx';
import SocialPlanner from './pages/SocialPlanner.tsx';
import { isApiKeySet, saveApiKey } from './services/geminiService.ts';
import UfoIcon from './components/icons/UfoIcon.tsx';


const ApiKeySetup: React.FC<{ onKeySaved: () => void }> = ({ onKeySaved }) => {
  const [localKey, setLocalKey] = useState('');

  const handleSave = () => {
    if (localKey.trim()) {
      saveApiKey(localKey.trim());
      onKeySaved();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-900 text-slate-200 p-4 font-mono">
      <div className="max-w-xl w-full p-8 text-center bg-slate-800/50 border border-slate-700 rounded-lg shadow-2xl backdrop-blur-sm">
        <div className="flex justify-center mb-4">
          <UfoIcon />
        </div>
        <h1 className="text-2xl font-bold text-cyan-300 mb-3">Welcome to the UFO Research Hub</h1>
        <p className="mb-6 text-slate-400">
          To begin, please enter your Google Gemini API key. Your key is stored securely in your browser and is never sent to anyone except Google.
        </p>
        <div className="space-y-4">
           <input
            type="password"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your Gemini API key"
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-500"
            aria-label="Gemini API Key"
          />
          <button
            onClick={handleSave}
            disabled={!localKey.trim()}
            className="w-full px-4 py-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            Save & Continue
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-6">
            You can get a key from {' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                Google AI Studio
            </a>.
        </p>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [keyIsSet, setKeyIsSet] = useState(isApiKeySet());

  if (!keyIsSet) {
    return <ApiKeySetup onKeySaved={() => setKeyIsSet(true)} />;
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