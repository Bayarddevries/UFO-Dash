import React, { useState, useCallback } from 'react';
import { generateSocialPostIdeas } from '../services/geminiService.ts';

const SocialPlanner: React.FC = () => {
  const [topic, setTopic] = useState<string>('The 1947 Roswell Incident');
  const [postIdeas, setPostIdeas] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setPostIdeas('');
    const ideas = await generateSocialPostIdeas(topic);
    setPostIdeas(ideas);
    setIsLoading(false);
  }, [topic]);

  // A simple markdown to HTML converter for display
  const renderMarkdown = (text: string) => {
    const html = text
      .split('\n')
      .map(line => {
        if (line.startsWith('* ')) {
          return `<li>${line.substring(2)}</li>`;
        }
        return line;
      })
      .join('');
    return <ul className="list-disc list-inside space-y-2">{React.createElement("div", { dangerouslySetInnerHTML: { __html: html } })}</ul>;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Social Media Post Planner</h1>
      <p className="text-slate-400 mb-6">Generate creative ideas for your social media channels.</p>
      
      <div className="bg-slate-950/50 border border-slate-800 rounded-lg shadow-lg p-6 space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-cyan-300 mb-2">
            Post Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The Tic Tac UAP"
            className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic.trim()}
          className="w-full px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : 'Generate Ideas'}
        </button>
      </div>

      {postIdeas && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Generated Ideas</h2>
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg shadow-lg p-6 text-slate-300">
            {renderMarkdown(postIdeas)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPlanner;