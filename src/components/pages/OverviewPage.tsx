import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Database, 
  ArrowRight, 
  Award, 
  FileText, 
  Activity, 
  Sparkles,
  GitBranch,
  Layers,
  Clock,
  Building2,
  GraduationCap,
  Car,
  ShoppingBag,
  Tv,
  Briefcase,
  FileCode2
} from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import { BENCHMARK_METRICS, EDA_SCENARIO_DISTRIBUTION } from '../../data/mockDataset';
import { NavigationPage } from '../../types';

interface OverviewPageProps {
  onNavigate: (page: NavigationPage) => void;
  onApplyPreset: (key: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate, onApplyPreset }) => {
  const [activeScenarioTab, setActiveScenarioTab] = useState<string>('all');

  return (
    <div className="space-y-6">
      {/* Hero / Executive Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-slate-700/50">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INNOVEXIS Data Science & Gen AI Internship Project</span>
            <span className="text-slate-400">•</span>
            <span>Author: P Suman Sangeet</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            💳 EMIPredict AI – Intelligent Financial Risk Assessment Platform
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            A production-grade dual machine learning system (Classification + Regression) trained on <strong className="text-white">404,773 financial profiles</strong> across 5 lending scenarios. Automates customer risk tiering and predicts maximum safe monthly installment capacity in real time with comprehensive MLflow MLOps tracking.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('predictor')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Launch Prediction Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('mlflow')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition"
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Inspect MLflow Experiment Runs</span>
            </button>

            <button
              onClick={() => onNavigate('eda')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition"
            >
              <span>Explore 404K Insights</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('streamlit_code')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-semibold text-xs sm:text-sm border border-blue-500/30 transition"
            >
              <FileCode2 className="w-4 h-4 text-blue-400" />
              <span>Inspect app.py Source</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <MetricCard
          label="Total Financial Records"
          value="404,773"
          delta="48 Features"
          deltaType="positive"
          subtitle="Cleaned, deduplicated & scaled"
          icon={<Database className="w-4 h-4" />}
        />
        <MetricCard
          label="Classification Accuracy"
          value="95.8%"
          delta="+11.4% vs Baseline"
          deltaType="positive"
          subtitle="XGBoost 3-class classifier"
          icon={<ShieldCheck className="w-4 h-4" />}
          highlight={true}
        />
        <MetricCard
          label="Weighted F1-Score"
          value="0.963"
          delta="Imbalance Handled"
          deltaType="positive"
          subtitle="77% / 18% / 4% distribution"
          icon={<Award className="w-4 h-4" />}
        />
        <MetricCard
          label="Max EMI R² Variance"
          value="0.993"
          delta="Top Precision"
          deltaType="positive"
          subtitle="Explains 99.3% variance"
          icon={<TrendingUp className="w-4 h-4" />}
          highlight={true}
        />
        <MetricCard
          label="Regression RMSE"
          value="₹663"
          delta="MAE: ₹175"
          deltaType="positive"
          subtitle="Mean absolute percentage: 5.7%"
          icon={<Activity className="w-4 h-4" />}
        />
      </div>

      {/* Dual Problem & Solution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* The Business Challenge */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-sm">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <span>THE BUSINESS PROBLEM</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Traditional Manual Underwriting is Slow, Fragmented, and Costly
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Financial institutions and digital lending portals struggle to evaluate loan repayment capacity at scale. Manual underwriting takes <strong>4 to 7 business days</strong>, incurs heavy operational costs, and leads to inconsistent loan approvals when applicants take on obligations misaligned with their income, existing debt, and emergency reserves.
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span><strong>Underwriting Bottlenecks:</strong> Walk-in and e-commerce checkouts lose up to 45% of drop-off customers due to slow paper-based verification.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span><strong>Binary Rejections:</strong> Traditional tools only output a binary Yes/No, denying creditworthy applicants who simply needed lower monthly installments.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span><strong>Default Hazards:</strong> Lending without modeling non-discretionary expenses (groceries, school fees, rent) elevates portfolio default risk by 28%.</span>
            </div>
          </div>
        </div>

        {/* The Dual ML Solution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <span>THE DUAL-ML SOLUTION</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Simultaneous Risk Classification & Safe EMI Affordability Prediction
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            EMIPredict AI transforms raw financial data into automated, explainable lending decisions by running dual machine learning pipelines simultaneously:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1">
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Eligibility Classifier</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Predicts applicant risk tier: <strong>Eligible</strong>, <strong>High_Risk</strong>, or <strong>Not_Eligible</strong> with 95.8% accuracy.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">2</span>
                <span>Safe Max-EMI Regressor</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Predicts exact maximum safe monthly installment (₹) with <strong>99.3% R²</strong> and <strong>₹663 RMSE</strong>.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
            <strong>Business Win:</strong> Converts binary rejections into tailored counter-offers by instantly showing the safe monthly borrowing capacity.
          </div>
        </div>
      </div>

      {/* End-to-End MLOps Architecture Diagram */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">End-to-End Production Pipeline Architecture</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">From raw data cleaning through MLflow registry to real-time inference</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Automated MLOps Workflow
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
          {[
            { step: '01', name: '404K Records', desc: '5 EMI Lending Scenarios, 22 Variables', color: 'border-blue-500/40 bg-blue-500/5' },
            { step: '02', name: 'Data Audit', desc: 'Repair Malformed Decimals & Casings', color: 'border-amber-500/40 bg-amber-500/5' },
            { step: '03', name: 'Feature Engineering', desc: '14 Ratios + Composite Risk Score', color: 'border-purple-500/40 bg-purple-500/5' },
            { step: '04', name: 'Dual Modeling', desc: 'XGBoost, RF, Logistic & Linear', color: 'border-rose-500/40 bg-rose-500/5' },
            { step: '05', name: 'MLflow Tracking', desc: 'Params, Metrics, Artifacts & Registry', color: 'border-indigo-500/40 bg-indigo-500/5' },
            { step: '06', name: 'Champion Export', desc: 'Saved Joblib Pipelines in /artifacts', color: 'border-cyan-500/40 bg-cyan-500/5' },
            { step: '07', name: 'Streamlit Deployment', desc: 'Real-Time Inference & CRUD UI', color: 'border-emerald-500/40 bg-emerald-500/5' },
          ].map((item, idx) => (
            <div key={idx} className={`p-3 rounded-xl border ${item.color} flex flex-col justify-between`}>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 block">{item.step}</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{item.name}</h4>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Lending Scenarios Quick Cards */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Five Core EMI Lending Product Lines</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">80,000+ applicants per scenario analyzed across banking and fintech operations</p>
          </div>
          <div className="text-xs font-medium text-slate-500">
            Total Cohort: 404,773 Profiles
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {EDA_SCENARIO_DISTRIBUTION.map((sc, i) => {
            const icons = [
              <Tv className="w-4 h-4 text-amber-500" />,
              <Building2 className="w-4 h-4 text-purple-500" />,
              <ShoppingBag className="w-4 h-4 text-emerald-500" />,
              <GraduationCap className="w-4 h-4 text-blue-500" />,
              <Car className="w-4 h-4 text-rose-500" />
            ];

            return (
              <div 
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-rose-500/40 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-700 shadow-xs">
                    {icons[i]}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {sc.eligibleRate}% Eligible
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{sc.scenario}</h4>
                <div className="mt-3 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Cohort Size:</span>
                    <strong className="text-slate-700 dark:text-slate-200">{sc.total.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Loan:</span>
                    <strong className="text-slate-700 dark:text-slate-200">₹{(sc.avgAmount / 1000).toFixed(0)}K</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Tenure:</span>
                    <strong className="text-slate-700 dark:text-slate-200">{sc.avgTenure} mos</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recruiter Resume Summary Callout Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/30 text-white space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
          <Briefcase className="w-4 h-4" />
          <span>Recruiter-Ready Resume Bullet Points</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          &ldquo;Engineered an end-to-end FinTech machine learning platform on <strong>404,773 financial records</strong> and 48 encoded features to automate EMI affordability and risk assessment. Built dual classification and regression pipelines predicting customer eligibility (<strong>95.8% accuracy, 0.963 F1</strong>) and maximum safe monthly installment (<strong>R² 0.993, RMSE ₹663</strong>). Logged all experiments, parameters, artifacts and models using <strong>MLflow Model Registry</strong>, and deployed an interactive multi-page <strong>Streamlit application</strong> with full CRUD operations and role-based access control.&rdquo;
        </p>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 inline-flex items-center gap-1.5 transition"
          >
            <span>View Full Recruiter Technical Showcase & FAQ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-400">Author: P Suman Sangeet • INNOVEXIS Internship</span>
        </div>
      </div>
    </div>
  );
};
