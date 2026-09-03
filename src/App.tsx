import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { StreamlitSidebar } from './components/common/StreamlitSidebar';
import { OverviewPage } from './components/pages/OverviewPage';
import { PredictorPage } from './components/pages/PredictorPage';
import { EdaPage } from './components/pages/EdaPage';
import { MlflowDashboard } from './components/pages/MlflowDashboard';
import { AdminCrudPage } from './components/pages/AdminCrudPage';
import { PipelinePage } from './components/pages/PipelinePage';
import { PortfolioPage } from './components/pages/PortfolioPage';
import { StreamlitCodePage } from './components/pages/StreamlitCodePage';

import { NavigationPage, AuthUser, ApplicantInput } from './types';
import { AUTH_USERS } from './data/mockDataset';
import { PRESET_APPLICANTS } from './utils/mlEngine';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('overview');
  const [currentUser, setCurrentUser] = useState<AuthUser>(AUTH_USERS[0]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('prime_eligible');
  const [currentInput, setCurrentInput] = useState<ApplicantInput>(
    PRESET_APPLICANTS.prime_eligible.input
  );

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleTriggerToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleApplyPreset = (key: string) => {
    if (PRESET_APPLICANTS[key]) {
      setSelectedPresetKey(key);
      setCurrentInput(PRESET_APPLICANTS[key].input);
      handleTriggerToast(`Loaded "${PRESET_APPLICANTS[key].label}" profile`, 'info');
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Header */}
      <Header
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onTriggerToast={handleTriggerToast}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      {/* Main Content Layout with Fixed Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <StreamlitSidebar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          currentUser={currentUser}
          onApplyPreset={handleApplyPreset}
          selectedPresetKey={selectedPresetKey}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Page View Container */}
        <main className="flex-1 p-4 sm:p-6 flex flex-col gap-6 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
          {currentPage === 'overview' && (
            <OverviewPage
              onNavigate={(page) => setCurrentPage(page)}
              onApplyPreset={handleApplyPreset}
            />
          )}

          {currentPage === 'predictor' && (
            <PredictorPage
              currentInput={currentInput}
              onChangeInput={setCurrentInput}
              onTriggerToast={handleTriggerToast}
            />
          )}

          {currentPage === 'eda' && <EdaPage />}

          {currentPage === 'mlflow' && (
            <MlflowDashboard
              userRole={currentUser.role}
              onTriggerToast={handleTriggerToast}
            />
          )}

          {currentPage === 'crud' && (
            <AdminCrudPage
              userRole={currentUser.role}
              onTriggerToast={handleTriggerToast}
            />
          )}

          {currentPage === 'pipeline' && (
            <PipelinePage onTriggerToast={handleTriggerToast} />
          )}

          {currentPage === 'portfolio' && <PortfolioPage />}

          {currentPage === 'streamlit_code' && (
            <StreamlitCodePage onTriggerToast={handleTriggerToast} />
          )}
        </main>
      </div>

      {/* Floating Geometric Balance Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto p-3 rounded-lg border shadow-lg flex items-center justify-between gap-3 text-xs font-medium transition-all
              ${toast.type === 'success' ? 'bg-slate-900 text-white border-green-500/50 dark:bg-slate-900' : ''}
              ${toast.type === 'warning' ? 'bg-slate-900 text-white border-amber-500/50 dark:bg-slate-900' : ''}
              ${toast.type === 'info' ? 'bg-slate-900 text-white border-blue-500/50 dark:bg-slate-900' : ''}
            `}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
              {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => handleDismissToast(toast.id)}
              className="text-slate-400 hover:text-white shrink-0 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
