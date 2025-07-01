
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  colorClass?: string; // e.g. bg-blue-500
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, colorClass = "bg-primary" }) => {
  return (
    <div className={`p-6 rounded-xl shadow-lg flex items-center space-x-4 transition-all duration-300 hover:shadow-xl hover:scale-105 ${colorClass} text-white dark:text-gray-100`}>
      {icon && <div className="p-3 bg-white/20 rounded-full">{icon}</div>}
      <div>
        <p className="text-sm font-medium uppercase tracking-wider opacity-80">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
