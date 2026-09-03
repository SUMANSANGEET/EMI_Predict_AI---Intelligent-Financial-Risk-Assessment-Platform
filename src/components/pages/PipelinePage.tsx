import React, { useState } from 'react';
import { 
  GitBranch, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Terminal, 
  Cloud, 
  ShieldCheck, 
  Box, 
  Cpu, 
  ExternalLink,
  Check,
  Radio
} from 'lucide-react';
import { PIPELINE_STEPS } from '../../data/mockDataset';

interface PipelinePageProps {
  onTriggerToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

export const PipelinePage: React.FC<PipelinePageProps> = ({ onTriggerToast }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([0, 1, 2, 3, 4]);

  const handleRunBuild = () => {
    setIsSimulating(true);
    setCompletedSteps([]);
    setActiveStepIndex(0);
    onTriggerToast('Triggered automated deployment pipeline build...', 'info');

    let current = 0;
    const interval = setInterval(() => {
      setCompletedSteps(prev => [...prev, current]);
      current++;
      setActiveStepIndex(current < 5 ? current : 4);

      if (current >= 5) {
        clearInterval(interval);
        setIsSimulating(false);
        onTriggerToast('CI/CD Build Successful! Deployed to Streamlit Cloud.', 'success');
      }
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <GitBranch className="w-4 h-4" />
            <span>DevOps & Continuous Deployment</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Automated MLOps Deployment & Validation Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            GitHub Actions CI/CD workflow triggering automated test suites, MLflow model promotion, and Streamlit Cloud containerization.
          </p>
        </div>

        <button
          onClick={handleRunBuild}
          disabled={isSimulating}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition disabled:opacity-50"
        >
          {isSimulating ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Building Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Trigger Pipeline Rebuild</span>
            </>
          )}
        </button>
      </div>

      {/* Deployment Environment Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Production Target</span>
            <Cloud className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">Streamlit Community Cloud</div>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1 inline-flex items-center gap-1">
            <Radio className="w-2 h-2 fill-emerald-500 animate-pulse" />
            <span>Live • Publicly Accessible</span>
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Container Image</span>
            <Box className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">python:3.11-slim</div>
          <span className="text-[10px] text-slate-400 font-mono">Port: 8501 • Multi-Stage Optimized</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>MLflow Registry Check</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">Gate Passed (v2 Prod)</div>
          <span className="text-[10px] text-emerald-500 font-semibold">F1 &gt; 0.95 • R² &gt; 0.99</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Mean Response Latency</span>
            <Cpu className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">&lt; 14ms / inference</div>
          <span className="text-[10px] text-slate-400 font-mono">Pre-warmed joblib pipelines</span>
        </div>
      </div>

      {/* Interactive Step Navigator */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          CI/CD Pipeline Stages & Verification Logs
        </h3>

        {/* Horizontal step bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {PIPELINE_STEPS.map((step, idx) => {
            const isDone = completedSteps.includes(idx);
            const isCurrent = activeStepIndex === idx;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`
                  p-3.5 rounded-xl border cursor-pointer transition-all
                  ${isCurrent 
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5' 
                    : isDone
                    ? 'border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'}
                `}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400">STAGE {idx + 1}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : isCurrent && isSimulating ? (
                    <RotateCcw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-700" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{step.name}</h4>
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">{step.execution_time}</span>
              </div>
            );
          })}
        </div>

        {/* Selected Step Log Output Viewer */}
        <div className="p-5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-100">
                Execution Console: {PIPELINE_STEPS[activeStepIndex].name}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Exit Code: 0 (PASSED)
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
            {PIPELINE_STEPS[activeStepIndex].logs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 select-none">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
