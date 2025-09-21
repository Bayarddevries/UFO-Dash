import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageSender } from '../types.ts';
import { initChat } from '../services/geminiService.ts';
// FIX: Aliased the Chat type from @google/genai to avoid conflict with the component name.
import type { Chat as GeminiChat, GenerateContentResponse } from '@google/genai';


const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', sender: MessageSender.Model, text: 'Hello! I am your UFO research assistant. How can I help you analyze data or draft requests today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // FIX: Use the aliased GeminiChat type for the chatRef.
  const chatRef = useRef<GeminiChat | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = initChat();
  }, []);
  
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: MessageSender.User, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const modelMessageId = (Date.now() + 1).toString();
    const initialModelMessage: ChatMessage = { id: modelMessageId, sender: MessageSender.Model, text: '', isStreaming: true };
    setMessages(prev => [...prev, initialModelMessage]);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: input });
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setMessages(prev => prev.map(msg => msg.id === modelMessageId ? { ...msg, text: fullText } : msg));
      }
      setMessages(prev => prev.map(msg => msg.id === modelMessageId ? { ...msg, isStreaming: false } : msg));

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: MessageSender.Model,
        text: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => prev.filter(msg => msg.id !== modelMessageId)); // remove streaming placeholder
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-slate-950/50 border border-slate-800 rounded-lg shadow-2xl">
      <h1 className="text-2xl font-bold text-cyan-300 p-4 border-b border-slate-800">AI Research Assistant</h1>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === MessageSender.User ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg p-3 rounded-lg ${msg.sender === MessageSender.User ? 'bg-cyan-800 text-white' : 'bg-slate-700 text-slate-200'}`}>
              <p className="whitespace-pre-wrap">{msg.text}{msg.isStreaming && <span className="inline-block w-2 h-4 bg-slate-300 animate-pulse ml-1"></span>}</p>
            </div>
          </div>
        ))}
         <div ref={chatBottomRef} />
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-2 bg-slate-800 rounded-lg p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? "Thinking..." : "Ask about data, FOIA requests, etc."}
            className="flex-1 bg-transparent focus:outline-none text-slate-200 placeholder-slate-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Wait' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;