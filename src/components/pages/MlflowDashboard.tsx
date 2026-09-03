import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  Clock, 
  Terminal, 
  CheckCircle2, 
  FileCode, 
  ArrowUpRight, 
  Activity, 
  FileText,
  Filter,
  BarChart,
  HelpCircle,
  FolderGit2
} from 'lucide-react';
import { 
  MLFLOW_CLASSIFICATION_RUNS, 
  MLFLOW_REGRESSION_RUNS, 
  REGISTERED_MODELS, 
  FEATURE_IMPORTANCES_DATA,
  BENCHMARK_METRICS 
} from '../../data/mockDataset';
import { MLflowRun, RegisteredModel, UserRole } from '../../types';

interface MlflowDashboardProps {
  userRole: UserRole;
  onTriggerToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

export const MlflowDashboard: React.FC<MlflowDashboardProps> = ({ userRole, onTriggerToast }) => {
  const [activeTab, setActiveTab] = useState<'runs' | 'registry' | 'charts' | 'features'>('runs');
  const [selectedExperiment, setSelectedExperiment] = useState<'classification' | 'regression'>('classification');
  const [selectedRun, setSelectedRun] = useState<MLflowRun>(MLFLOW_CLASSIFICATION_RUNS[0]);
  const [registeredModels, setRegisteredModels] = useState<RegisteredModel[]>(REGISTERED_MODELS);
  const [featureTab, setFeatureTab] = useState<'classification' | 'regression'>('classification');

  // Handle model stage promotion in registry
  const handlePromoteStage = (modelName: string, newStage: 'Production' | 'Staging' | 'Archived') => {
    if (userRole !== 'admin') {
      onTriggerToast('Permission denied: Only Admin / Lead ML Engineers can promote models to Production.', 'warning');
      return;
    }

    setRegisteredModels(prev => 
      prev.map(m => m.name === modelName ? { ...m, stage: newStage, updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19) } : m)
    );
    onTriggerToast(`Model '${modelName}' transitioned to stage: ${newStage.toUpperCase()} in MLflow Registry`, 'success');
  };

  const runsToDisplay = selectedExperiment === 'classification' 
    ? MLFLOW_CLASSIFICATION_RUNS 
    : MLFLOW_REGRESSION_RUNS;

  return (
    <div className="space-y-6">
      {/* Top MLflow Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-700/60 shadow-lg text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>MLflow Tracking Server 2.15.0</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-emerald-400">sqlite:///mlflow.db</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Model Performance Monitoring & MLOps Registry
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Systematic tracking of hyperparameters, validation metrics, confusion matrices, ROC-AUC curves, and production deployment artifacts for every trained candidate model.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Champion Accuracy</span>
              <strong className="text-base text-emerald-400 font-mono">95.78% (AUC 0.998)</strong>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Champion R²</span>
              <strong className="text-base text-blue-400 font-mono">0.9927 (RMSE ₹663)</strong>
            </div>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800">
          {[
            { id: 'runs', label: '1. Experiment Runs Comparison', icon: Layers },
            { id: 'registry', label: '2. MLflow Model Registry', icon: FolderGit2 },
            { id: 'charts', label: '3. Confusion Matrix & ROC Curves', icon: Activity },
            { id: 'features', label: '4. Feature Importance Rankings', icon: BarChart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2
                  ${isActive 
                    ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30' 
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'}
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: RUNS COMPARISON */}
      {activeTab === 'runs' && (
        <div className="space-y-6">
          {/* Experiment switch selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Select Active Experiment:
              </span>
              <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    setSelectedExperiment('classification');
                    setSelectedRun(MLFLOW_CLASSIFICATION_RUNS[0]);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                    selectedExperiment === 'classification' 
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  EMIPredict_Classification (3 Runs)
                </button>
                <button
                  onClick={() => {
                    setSelectedExperiment('regression');
                    setSelectedRun(MLFLOW_REGRESSION_RUNS[0]);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                    selectedExperiment === 'regression' 
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  EMIPredict_Regression (3 Runs)
                </button>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              Logged to SQLite tracking backend with artifact repositories
            </span>
          </div>

          {/* Runs Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Benchmark Runs Table ({selectedExperiment.toUpperCase()})</span>
              <span className="text-xs text-rose-500 font-semibold">Click a row to inspect parameters & artifacts</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Run Name & Algorithm</th>
                    <th className="py-2.5 px-3">Status</th>
                    {selectedExperiment === 'classification' ? (
                      <>
                        <th className="py-2.5 px-3">Accuracy</th>
                        <th className="py-2.5 px-3">Weighted F1</th>
                        <th className="py-2.5 px-3">Precision</th>
                        <th className="py-2.5 px-3">Recall</th>
                        <th className="py-2.5 px-3">ROC-AUC</th>
                      </>
                    ) : (
                      <>
                        <th className="py-2.5 px-3">R² Score</th>
                        <th className="py-2.5 px-3">RMSE (₹)</th>
                        <th className="py-2.5 px-3">MAE (₹)</th>
                        <th className="py-2.5 px-3">MAPE (%)</th>
                      </>
                    )}
                    <th className="py-2.5 px-3 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  {runsToDisplay.map((run) => {
                    const isSelected = selectedRun.run_id === run.run_id;
                    const isChampion = run.run_name.includes('XGBoost');

                    return (
                      <tr 
                        key={run.run_id}
                        onClick={() => setSelectedRun(run)}
                        className={`cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-rose-500/10 dark:bg-rose-500/15' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <td className="py-3 px-3 font-sans font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          {isChampion && (
                            <span className="text-amber-500" title="Production Champion Model">👑</span>
                          )}
                          <div>
                            <div>{run.run_name}</div>
                            <span className="text-[10px] text-slate-400 font-mono">{run.algorithm}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {run.status}
                          </span>
                        </td>
                        {selectedExperiment === 'classification' ? (
                          <>
                            <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                              {(run.metrics.accuracy * 100).toFixed(2)}%
                            </td>
                            <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                              {run.metrics.f1_score.toFixed(4)}
                            </td>
                            <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                              {run.metrics.precision.toFixed(4)}
                            </td>
                            <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                              {run.metrics.recall.toFixed(4)}
                            </td>
                            <td className="py-3 px-3 font-bold text-blue-500">
                              {run.metrics.roc_auc.toFixed(4)}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                              {run.metrics.r2_score.toFixed(4)}
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                              ₹{run.metrics.rmse.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                            </td>
                            <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                              ₹{run.metrics.mae.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                            </td>
                            <td className="py-3 px-3 text-amber-500 font-bold">
                              {run.metrics.mape_pct.toFixed(2)}%
                            </td>
                          </>
                        )}
                        <td className="py-3 px-3 text-right text-slate-400 text-[11px]">
                          {run.duration_seconds}s
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Run Deep Dive: Parameters & Artifacts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-blue-500" />
                <span>Logged Hyperparameters ({selectedRun.run_name})</span>
              </h4>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] space-y-1 text-slate-700 dark:text-slate-300">
                {Object.entries(selectedRun.params).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-slate-200/50 dark:border-slate-700/50 py-1">
                    <span className="text-slate-500 dark:text-slate-400">{key}:</span>
                    <strong className="text-slate-900 dark:text-white">{String(val)}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-emerald-500" />
                <span>Logged MLflow Artifacts & Checkpoints</span>
              </h4>

              <div className="space-y-2">
                {selectedRun.artifacts.map((art, idx) => (
                  <div 
                    key={idx} 
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">📄</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{art}</span>
                    </div>
                    <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                      Validated in artifacts/
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MODEL REGISTRY */}
      {activeTab === 'registry' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  MLflow Centralized Model Registry
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Versioned model artifacts with Stage Lifecycle control (Staging, Production, Archived)
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-500/10 text-blue-500">
                Governance & CI/CD Gateways Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {registeredModels.map((model) => (
                <div 
                  key={model.name}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        model.stage === 'Production' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                        model.stage === 'Staging' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                        'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        Stage: {model.stage}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 font-mono">
                        {model.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{model.algorithm}</p>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold">
                      v{model.version}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{model.key_metric}:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">{model.key_metric_value}</strong>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Task:</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{model.task}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Last Registered:</span>
                      <span className="font-mono">{model.updated_at}</span>
                    </div>
                  </div>

                  {/* Stage transition controls (Admin Only) */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Promote Stage:</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handlePromoteStage(model.name, 'Production')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                          model.stage === 'Production' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        Production
                      </button>
                      <button
                        onClick={() => handlePromoteStage(model.name, 'Staging')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                          model.stage === 'Staging' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-500/20'
                        }`}
                      >
                        Staging
                      </button>
                      <button
                        onClick={() => handlePromoteStage(model.name, 'Archived')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                          model.stage === 'Archived' ? 'bg-slate-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONFUSION MATRIX & EVALUATION CHARTS */}
      {activeTab === 'charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Confusion Matrix Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Confusion Matrix — Champion XGBoost (80,955 Test Records)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Exact counts across Eligible, High Risk, and Not Eligible ground truths
              </p>
            </div>

            <div className="overflow-x-auto pt-2">
              <div className="min-w-[320px] text-xs font-mono">
                <div className="grid grid-cols-4 gap-1 text-center">
                  <div className="p-2 text-[10px] font-bold text-slate-400">Actual \ Pred</div>
                  <div className="p-2 font-bold text-emerald-500 bg-emerald-500/10 rounded">Eligible</div>
                  <div className="p-2 font-bold text-amber-500 bg-amber-500/10 rounded">High_Risk</div>
                  <div className="p-2 font-bold text-rose-500 bg-rose-500/10 rounded">Not_Eligible</div>

                  {/* Row 1: Eligible */}
                  <div className="p-2 font-bold text-emerald-500 text-left">Eligible</div>
                  <div className="p-3 bg-emerald-600 text-white font-bold rounded shadow-xs">14,028</div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded">842</div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded">18</div>

                  {/* Row 2: High_Risk */}
                  <div className="p-2 font-bold text-amber-500 text-left">High_Risk</div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded">194</div>
                  <div className="p-3 bg-amber-500 text-white font-bold rounded shadow-xs">3,284</div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded">20</div>

                  {/* Row 3: Not_Eligible */}
                  <div className="p-2 font-bold text-rose-500 text-left">Not_Eligible</div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded">48</div>
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded">2,246</div>
                  <div className="p-3 bg-rose-600 text-white font-bold rounded shadow-xs">60,275</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Not_Eligible Precision:</span>
                <strong className="text-rose-500 font-mono">99.9% (60,275 / 60,313)</strong>
              </div>
              <div className="flex justify-between">
                <span>Eligible Precision:</span>
                <strong className="text-emerald-500 font-mono">98.3% (14,028 / 14,270)</strong>
              </div>
              <div className="flex justify-between">
                <span>High_Risk Recall:</span>
                <strong className="text-amber-500 font-mono">93.9% (3,284 / 3,498)</strong>
              </div>
            </div>
          </div>

          {/* ROC-AUC Curves Visualizer */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Class ROC Curves (One-vs-Rest)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                XGBoost classifier achieves near-perfect discrimination with Macro AUC = 0.9985
              </p>
            </div>

            {/* SVG ROC Curve */}
            <div className="h-60 w-full bg-slate-900 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
              <svg className="w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
                {/* Diagonal random guess line */}
                <line x1="0" y1="200" x2="300" y2="0" stroke="#475569" strokeDasharray="4 4" strokeWidth="1.5" />
                {/* ROC Eligible curve */}
                <path d="M 0,200 L 4,12 L 20,4 L 100,2 L 300,0" fill="none" stroke="#2ecc71" strokeWidth="3" />
                {/* ROC High_Risk curve */}
                <path d="M 0,200 L 10,24 L 40,8 L 150,4 L 300,0" fill="none" stroke="#f39c12" strokeWidth="2.5" />
                {/* ROC Not_Eligible curve */}
                <path d="M 0,200 L 2,4 L 10,1 L 80,0 L 300,0" fill="none" stroke="#e74c3c" strokeWidth="3" />
              </svg>

              <div className="flex justify-between text-[10px] text-slate-400 font-mono z-10 border-t border-slate-800 pt-1">
                <span>FPR = 0.0</span>
                <span>FPR = 0.5</span>
                <span>FPR = 1.0</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                Eligible AUC: 0.998
              </div>
              <div className="p-2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                High Risk AUC: 0.994
              </div>
              <div className="p-2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                Not Eligible AUC: 0.999
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FEATURE IMPORTANCE */}
      {activeTab === 'features' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Feature Importance Explanations & Rankings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Confirming that engineered financial ratios dominate first-principles credit assessment
              </p>
            </div>

            <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
              <button
                onClick={() => setFeatureTab('classification')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                  featureTab === 'classification' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Classification Features
              </button>
              <button
                onClick={() => setFeatureTab('regression')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                  featureTab === 'regression' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Regression Features
              </button>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {(featureTab === 'classification' ? FEATURE_IMPORTANCES_DATA.classification : FEATURE_IMPORTANCES_DATA.regression).map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-5 text-slate-400 font-mono text-[11px]">{i + 1}.</span>
                    <span>{f.feature}</span>
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-normal">
                      {f.category}
                    </span>
                  </span>
                  <strong className="font-mono text-slate-900 dark:text-white">
                    {(f.importance * 100).toFixed(1)}%
                  </strong>
                </div>

                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${(f.importance / 0.4) * 100}%` }}
                    className={`h-full rounded-full ${featureTab === 'classification' ? 'bg-rose-500' : 'bg-blue-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
