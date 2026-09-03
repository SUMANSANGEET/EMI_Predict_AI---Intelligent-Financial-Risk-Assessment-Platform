import React from 'react';
import { 
  ShieldCheck, 
  Moon, 
  Sun, 
  Bell, 
  Cpu,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { AuthUser, UserRole } from '../../types';
import { AUTH_USERS } from '../../data/mockDataset';

interface HeaderProps {
  currentUser: AuthUser;
  onSelectUser: (user: AuthUser) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onTriggerToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
  onOpenMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  isDarkMode,
  onToggleDarkMode,
  onTriggerToast,
  onOpenMobileSidebar
}) => {
  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30 transition-colors">
      {/* Left: Geometric Logo and Brand / Status */}
      <div className="flex items-center gap-3">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Open Navigation"
          >
            <Sliders className="w-4 h-4" />
          </button>
        )}

        {/* Geometric Balance Diamond Logo */}
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shrink-0 shadow-xs">
          <div className="w-4 h-4 border-2 border-white rotate-45"></div>
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          MLFlow<span className="text-blue-600">Stream</span>
          <span className="text-[10px] font-mono text-slate-400 font-normal ml-2 hidden sm:inline">EMIPredict AI</span>
        </span>
      </div>

      {/* Right: Status badge & User Persona Switcher */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Production Model Active Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700/60">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Production Model Active
          </span>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/90 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <select
            value={currentUser.role}
            onChange={(e) => {
              const selected = AUTH_USERS.find(u => u.role === e.target.value as UserRole);
              if (selected) {
                onSelectUser(selected);
                onTriggerToast(`Switched active persona to ${selected.roleLabel}`, 'info');
              }
            }}
            className="text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-200 pr-1 py-0.5 focus:outline-none cursor-pointer"
          >
            {AUTH_USERS.map((user) => (
              <option key={user.id} value={user.role} className="dark:bg-slate-800">
                {user.role === 'admin' ? 'Administrator' : user.roleLabel}
              </option>
            ))}
          </select>
        </div>

        {/* Health Check Bell */}
        <button
          onClick={() => onTriggerToast('System healthy: All 404,773 records & MLflow artifacts verified.', 'success')}
          title="Health Check"
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User profile info block */}
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 sm:pl-6">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
              {currentUser.role === 'admin' ? 'Administrator' : currentUser.role.toUpperCase()}
            </p>
          </div>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 object-cover"
          />
        </div>
      </div>
    </header>
  );
};

