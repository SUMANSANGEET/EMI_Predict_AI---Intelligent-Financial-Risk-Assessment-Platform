import React from 'react';
import { 
  Home, 
  Zap, 
  BarChart3, 
  Layers, 
  Database, 
  GitBranch, 
  Briefcase, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders,
  FileCode2
} from 'lucide-react';
import { NavigationPage, AuthUser } from '../../types';
import { PRESET_APPLICANTS } from '../../utils/mlEngine';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  currentUser: AuthUser;
  onApplyPreset: (key: string) => void;
  selectedPresetKey: string;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const StreamlitSidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onApplyPreset,
  selectedPresetKey,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems: { id: NavigationPage; label: string; icon: any; badge?: string }[] = [
    { id: 'overview', label: 'Overview & Architecture', icon: Home },
    { id: 'predictor', label: 'Prediction Dashboard', icon: Zap, badge: 'Dual ML' },
    { id: 'eda', label: 'Data Explorer & Insights', icon: BarChart3, badge: '404K' },
    { id: 'mlflow', label: 'MLflow MLOps & Registry', icon: Layers, badge: 'R² 0.993' },
    { id: 'crud', label: 'Admin Data Management', icon: Database, badge: 'CRUD' },
    { id: 'pipeline', label: 'CI/CD & Cloud Pipeline', icon: GitBranch },
    { id: 'portfolio', label: 'Recruiter Showcase', icon: Briefcase, badge: 'Resume' },
    { id: 'streamlit_code', label: 'Streamlit Code (app.py)', icon: FileCode2, badge: 'Python' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50 w-64
        bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800
        transition-all duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center shrink-0">
              <div className="w-3.5 h-3.5 border-2 border-white rotate-45"></div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-white tracking-tight text-sm">MLFlow</span>
                <span className="font-bold text-blue-500 tracking-tight text-sm">Stream</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">FinTech Risk Console</p>
            </div>
          </div>

          {/* Mobile Close */}
          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded"
          >
            ✕
          </button>
        </div>

        {/* Quick Applicant Preset Selector for Evaluation */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <Sliders className="w-3 h-3 text-blue-400" />
              <span>Preset Profile</span>
            </label>
            <span className="text-[9px] text-blue-400 font-mono">1-Click Test</span>
          </div>

          <select
            value={selectedPresetKey}
            onChange={(e) => {
              onApplyPreset(e.target.value);
            }}
            className="w-full text-xs font-medium bg-slate-900 text-slate-200 border border-slate-700 rounded p-1.5 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            {Object.entries(PRESET_APPLICANTS).map(([key, item]) => (
              <option key={key} value={key} className="bg-slate-900 text-white">
                {item.label}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
            {PRESET_APPLICANTS[selectedPresetKey]?.description}
          </p>
        </div>

        {/* Navigation links styled with Geometric Balance active border & square markers */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] uppercase font-bold text-slate-500 px-3 my-2 tracking-widest">
            Main Console
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded transition-colors text-left
                  ${isActive 
                    ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-600 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 font-normal'}
                `}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`
                    w-4 h-4 rounded-xs shrink-0 flex items-center justify-center
                    ${isActive ? 'bg-blue-600/20 text-blue-400' : 'border border-slate-700 text-slate-500'}
                  `}>
                    <Icon className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-xs truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`
                    text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider
                    ${isActive 
                      ? 'bg-blue-600/30 text-blue-300' 
                      : 'bg-slate-800 text-slate-400'}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Active Persona Permissions Pill */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 px-1">
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-slate-300 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1 text-blue-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Access Tier</span>
                </span>
                <span className="text-[10px] font-mono uppercase text-green-400">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                {currentUser.role === 'admin' 
                  ? 'Full administrative CRUD & MLflow registry promotion' 
                  : 'Auditing, real-time prediction & metric inspection'}
              </p>
            </div>
          </div>
        </nav>

        {/* Node Status Dock from Geometric Balance design */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Node Status</span>
            <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Healthy
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[88%] transition-all duration-500"></div>
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-mono">
            <span>v4.1.2-stable</span>
            <span className="text-slate-400">P Suman Sangeet</span>
          </div>
        </div>
      </aside>
    </>
  );
};

