import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '', icon }) => {
  return (
    <div className={`bg-slate-950/50 border border-slate-800 rounded-lg shadow-lg backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
            {icon}
            {title}
        </h2>
      </div>
      <div className="p-4 h-[400px] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
