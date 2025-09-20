import React from 'react';
import { NavLink } from 'react-router-dom';
import DashboardIcon from './icons/DashboardIcon';
import ChatIcon from './icons/ChatIcon';
import SocialIcon from './icons/SocialIcon';
import UfoIcon from './icons/UfoIcon';

const commonLinkClass = 'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200';
const activeLinkClass = 'bg-slate-700 text-cyan-300';
const inactiveLinkClass = 'text-slate-400 hover:bg-slate-800 hover:text-white';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-slate-950/70 border-r border-slate-800 flex-shrink-0 flex flex-col p-4 space-y-4">
      <div className="flex items-center space-x-2 px-2 pb-4 border-b border-slate-800">
        <UfoIcon />
        <span className="text-xl font-semibold text-white">UFO Research Hub</span>
      </div>
      <nav className="flex-1 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
          <DashboardIcon />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/chat"
          className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
          <ChatIcon />
          <span>AI Assistant</span>
        </NavLink>
        <NavLink
          to="/social-planner"
          className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
          <SocialIcon />
          <span>Social Planner</span>
        </NavLink>
      </nav>
      <div className="px-4 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} - All Rights Reserved</p>
        <p className="mt-1">Powered by Gemini AI</p>
      </div>
    </div>
  );
};

export default Sidebar;
