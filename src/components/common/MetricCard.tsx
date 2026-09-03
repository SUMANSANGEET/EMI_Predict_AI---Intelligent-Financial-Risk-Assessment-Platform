import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, HelpCircle } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: string | number;
  deltaType?: 'positive' | 'negative' | 'neutral' | 'inverse';
  subtitle?: string;
  helpText?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  delta,
  deltaType = 'positive',
  subtitle,
  helpText,
  icon,
  highlight = false
}) => {
  const getDeltaStyles = () => {
    switch (deltaType) {
      case 'positive':
        return 'text-green-500 font-bold text-xs';
      case 'negative':
        return 'text-rose-500 font-bold text-xs';
      case 'inverse':
        return 'text-amber-500 font-bold text-xs';
      default:
        return 'text-slate-500 font-bold text-xs';
    }
  };

  return (
    <div className={`
      p-4 rounded-xl border shadow-sm transition-all
      ${highlight 
        ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800/80 ring-1 ring-blue-500/10' 
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}
    `}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
          {label}
        </p>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-1.5">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight font-sans">
          {value}
        </h3>
        {delta && (
          <span className={`inline-flex items-center ml-1 ${getDeltaStyles()}`}>
            {deltaType === 'positive' && '↑ '}
            {deltaType === 'negative' && '↓ '}
            <span>{delta}</span>
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-tight truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};

