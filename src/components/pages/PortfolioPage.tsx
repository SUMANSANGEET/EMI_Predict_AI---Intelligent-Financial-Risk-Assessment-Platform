import React from 'react';
import { 
  Briefcase, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Github, 
  Mail, 
  Linkedin, 
  Cpu, 
  Layers, 
  FileCode2, 
  ShieldCheck,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { RECRUITER_QA_ITEMS, BENCHMARK_METRICS } from '../../data/mockDataset';

export const PortfolioPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>Candidate Portfolio & Engineering Rationale</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Recruiter & Lead Underwriter Technical Showcase
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            System architecture decisions, production-ready MLOps practices, and project accomplishments by P Suman Sangeet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="mailto:sumansangeet789@gmail.com"
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Candidate</span>
          </a>
        </div>
      </div>

      {/* Profile Card with Geometric Balance */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 font-bold text-xl">
              SS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">P Suman Sangeet</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600/10 text-blue-600 border border-blue-600/20 uppercase tracking-wider">
                  Data Science Intern
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                INNOVEXIS Data Science & Gen AI Internship • B.Tech Candidate
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-3">
                <span>📧 sumansangeet789@gmail.com</span>
                <span>📍 India</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Dataset Scale</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">404,773 Records</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Production Champion</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">Dual XGBoost</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Architectural Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-sm">
            <Cpu className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Dual ML Pipeline Architecture</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Engineered simultaneously running 3-class classification (95.8% accuracy, 0.998 AUC) and continuous installment regression (R² 0.993, ₹663 RMSE).
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
            <Layers className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">MLflow Enterprise Tracking</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Persistent SQLite tracking backend (<code className="text-blue-500 font-mono">sqlite:///mlflow.db</code>) with full parameter logging, artifact checkpointing, and centralized Model Registry stage promotions.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Rigorous Anti-Leakage Controls</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Dropped isomorphic naive variables (<code className="text-blue-500 font-mono">naive_new_emi</code>) and preserved honest financial capacity signals with balanced class weighting.
          </p>
        </div>
      </div>

      {/* Recruiter Technical Q&A Accordion */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Technical Interview & Underwriting Defense Q&A
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Direct answers to critical architectural decisions and statistical modeling choices.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {RECRUITER_QA_ITEMS.map((item, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0">
                  Q{idx + 1}:
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.question}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
