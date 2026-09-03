import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Filter, 
  TrendingUp, 
  Info, 
  PieChart, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase,
  Layers,
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { 
  EDA_SCENARIO_DISTRIBUTION, 
  EDA_DEMOGRAPHIC_STATS, 
  CORRELATION_MATRIX_DATA,
  INITIAL_LOAN_RECORDS 
} from '../../data/mockDataset';
import { EmiScenario } from '../../types';

export const EdaPage: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('All');
  const [minCreditScore, setMinCreditScore] = useState<number>(300);
  const [maxSalaryFilter, setMaxSalaryFilter] = useState<number>(180000);
  const [hoveredCell, setHoveredCell] = useState<{ x: string; y: string; value: number } | null>(null);

  // Filter scenario data
  const filteredScenarios = useMemo(() => {
    if (selectedScenario === 'All') return EDA_SCENARIO_DISTRIBUTION;
    return EDA_SCENARIO_DISTRIBUTION.filter(s => s.scenario === selectedScenario);
  }, [selectedScenario]);

  // Sample data points for interactive scatter
  const scatterPoints = useMemo(() => {
    return INITIAL_LOAN_RECORDS.filter(
      item => item.credit_score >= minCreditScore && item.monthly_salary <= maxSalaryFilter
    );
  }, [minCreditScore, maxSalaryFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Exploratory Data Analysis (EDA)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Financial Insights & Demographic Distributions (404K Records)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Interactive analytical exploration of financial capacity, creditworthiness, and scenario patterns across 404,773 records.
          </p>
        </div>

        {/* Global scenario filter dropdown */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-100 pr-3 py-1 focus:outline-none cursor-pointer"
          >
            <option value="All">All 5 Lending Scenarios</option>
            {EDA_SCENARIO_DISTRIBUTION.map(sc => (
              <option key={sc.scenario} value={sc.scenario}>{sc.scenario}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Section 1: Scenario Breakdown Stacked Bar Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Eligibility Rate Across EMI Product Lines (%)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive stacked comparison of Eligible (Green), High Risk (Amber), and Not Eligible (Red) tiers
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Eligible (~18.4%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>High Risk (~4.3%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span>Not Eligible (~77.3%)</span>
            </span>
          </div>
        </div>

        {/* Custom Interactive SVG / HTML Stacked Bar Visualizer */}
        <div className="space-y-3 pt-2">
          {filteredScenarios.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{item.scenario}</span>
                  <span className="text-[10px] font-normal text-slate-400">({item.total.toLocaleString()} apps)</span>
                </span>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-emerald-500 font-bold">{item.eligibleRate}% Elig</span>
                  <span className="text-amber-500 font-bold">{item.highRiskRate}% HighRisk</span>
                  <span className="text-rose-500 font-bold">{item.notEligibleRate}% NotElig</span>
                </div>
              </div>

              {/* Stacked bar */}
              <div className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden flex shadow-inner">
                <div 
                  style={{ width: `${item.eligibleRate}%` }} 
                  className="bg-emerald-500 h-full hover:opacity-90 transition-all cursor-pointer"
                  title={`${item.scenario} - Eligible: ${item.eligibleRate}%`}
                />
                <div 
                  style={{ width: `${item.highRiskRate}%` }} 
                  className="bg-amber-500 h-full hover:opacity-90 transition-all cursor-pointer"
                  title={`${item.scenario} - High Risk: ${item.highRiskRate}%`}
                />
                <div 
                  style={{ width: `${item.notEligibleRate}%` }} 
                  className="bg-rose-500 h-full hover:opacity-90 transition-all cursor-pointer"
                  title={`${item.scenario} - Not Eligible: ${item.notEligibleRate}%`}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                <span>Avg Ticket: ₹{(item.avgAmount / 1000).toFixed(0)}K</span>
                <span>Avg Repayment Duration: {item.avgTenure} Months</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Section 2: Credit Score vs Salary Scatter & Decision Boundaries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Credit Score vs Monthly Salary Decision Boundaries
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive applicant profiles plotted against underwriter approval thresholds
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Showing {scatterPoints.length} verified records
            </span>
          </div>

          {/* Interactive scatter plot canvas */}
          <div className="relative h-72 w-full bg-slate-900 rounded-xl p-4 overflow-hidden border border-slate-800 flex flex-col justify-between">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-20 pointer-events-none">
              <div className="border-r border-b border-slate-600"></div>
              <div className="border-r border-b border-slate-600"></div>
              <div className="border-r border-b border-slate-600"></div>
              <div className="border-b border-slate-600"></div>
            </div>

            {/* Threshold reference lines */}
            <div 
              className="absolute left-0 right-0 border-t border-dashed border-emerald-500/60 z-10 pointer-events-none" 
              style={{ bottom: '70%' }}
              title="Prime Cutoff (740+)"
            >
              <span className="absolute right-2 -top-4 text-[9px] font-mono text-emerald-400 bg-slate-900 px-1 rounded">
                Prime Credit Threshold (740)
              </span>
            </div>

            <div 
              className="absolute left-0 right-0 border-t border-dashed border-amber-500/60 z-10 pointer-events-none" 
              style={{ bottom: '45%' }}
              title="Sub-prime Threshold (650)"
            >
              <span className="absolute right-2 -top-4 text-[9px] font-mono text-amber-400 bg-slate-900 px-1 rounded">
                Borderline Threshold (650)
              </span>
            </div>

            {/* Render scatter points */}
            <div className="relative w-full h-full">
              {scatterPoints.map((item, idx) => {
                const xPct = Math.max(5, Math.min(95, ((item.monthly_salary - 15000) / 100000) * 100));
                const yPct = Math.max(5, Math.min(95, ((item.credit_score - 550) / 300) * 100));
                
                const dotColor = 
                  item.emi_eligibility === 'Eligible' ? 'bg-emerald-400 ring-emerald-500/40 shadow-emerald-400/50' :
                  item.emi_eligibility === 'High_Risk' ? 'bg-amber-400 ring-amber-500/40 shadow-amber-400/50' :
                  'bg-rose-400 ring-rose-500/40 shadow-rose-400/50';

                return (
                  <div
                    key={idx}
                    style={{ left: `${xPct}%`, bottom: `${yPct}%` }}
                    className={`absolute w-3.5 h-3.5 rounded-full ring-4 shadow-md transform -translate-x-1/2 translate-y-1/2 cursor-pointer transition-transform hover:scale-150 ${dotColor}`}
                    title={`${item.applicant_name} | Salary: ₹${item.monthly_salary.toLocaleString()} | Score: ${item.credit_score} | Tier: ${item.emi_eligibility} | Max EMI: ₹${item.max_monthly_emi.toLocaleString()}`}
                  />
                );
              })}
            </div>

            {/* Axis labels */}
            <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800 z-10">
              <span>Salary: ₹15,000</span>
              <span>Salary: ₹60,000</span>
              <span>Salary: ₹120,000+</span>
            </div>
          </div>

          {/* Scatter filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400">Min Credit Score Cutoff</span>
                <strong className="text-slate-800 dark:text-slate-200">{minCreditScore}</strong>
              </div>
              <input
                type="range"
                min="300"
                max="750"
                step="25"
                value={minCreditScore}
                onChange={(e) => setMinCreditScore(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400">Max Salary Filter</span>
                <strong className="text-slate-800 dark:text-slate-200">₹{(maxSalaryFilter / 1000).toFixed(0)}K</strong>
              </div>
              <input
                type="range"
                min="30000"
                max="180000"
                step="10000"
                value={maxSalaryFilter}
                onChange={(e) => setMaxSalaryFilter(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer accent-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Demographic & Stability Segment Ratios */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Demographic Approval Bias</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Approval Rate by Degree & Sector
          </h3>

          <div className="space-y-4 text-xs">
            {/* Education levels */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">Education Level:</span>
              <div className="space-y-2">
                {EDA_DEMOGRAPHIC_STATS.education.map((ed, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{ed.level}</span>
                      <strong className="text-emerald-500">{ed.eligiblePct}%</strong>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${ed.eligiblePct}%` }}
                        className="bg-purple-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employment sectors */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">Employment Sector:</span>
              <div className="space-y-2">
                {EDA_DEMOGRAPHIC_STATS.employment.map((emp, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{emp.type}</span>
                      <strong className="text-emerald-500">{emp.eligiblePct}%</strong>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${emp.eligiblePct}%` }}
                        className="bg-blue-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Section 3: Interactive Correlation Heatmap */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Feature Correlation Matrix (Pearson Coefficients)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hover over any cell to see the pairwise correlation and financial risk explanation
            </p>
          </div>
          {hoveredCell && (
            <div className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs font-mono font-bold text-rose-500">
              {hoveredCell.x} × {hoveredCell.y} = r: {hoveredCell.value.toFixed(2)}
            </div>
          )}
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pt-2">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-10 gap-1 text-[10px] text-center font-mono">
              <div className="p-1"></div>
              {CORRELATION_MATRIX_DATA.labels.map((l, i) => (
                <div key={i} className="p-1 font-bold text-slate-500 truncate" title={l}>
                  {l.slice(0, 7)}
                </div>
              ))}

              {CORRELATION_MATRIX_DATA.labels.map((rowLabel, rIdx) => (
                <React.Fragment key={rIdx}>
                  <div className="p-1 font-bold text-slate-500 text-left truncate flex items-center" title={rowLabel}>
                    {rowLabel.slice(0, 8)}
                  </div>
                  {CORRELATION_MATRIX_DATA.values[rIdx].map((val, cIdx) => {
                    let cellBg = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
                    if (val === 1.0) cellBg = 'bg-slate-300 dark:bg-slate-700 text-slate-900 font-bold';
                    else if (val >= 0.6) cellBg = 'bg-rose-500 text-white font-bold';
                    else if (val >= 0.4) cellBg = 'bg-rose-400 text-white font-semibold';
                    else if (val >= 0.2) cellBg = 'bg-rose-200 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200';
                    else if (val <= -0.4) cellBg = 'bg-blue-600 text-white font-bold';
                    else if (val <= -0.2) cellBg = 'bg-blue-300 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200';

                    return (
                      <div
                        key={cIdx}
                        onMouseEnter={() => setHoveredCell({ x: rowLabel, y: CORRELATION_MATRIX_DATA.labels[cIdx], value: val })}
                        className={`p-2 rounded cursor-pointer transition-all hover:scale-110 ${cellBg}`}
                        title={`${rowLabel} vs ${CORRELATION_MATRIX_DATA.labels[cIdx]}: r = ${val}`}
                      >
                        {val.toFixed(2)}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Legend for correlation */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span>
            <span>Negative Inversion (e.g. Current EMI vs Max Affordable EMI: -0.25)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-500 inline-block"></span>
            <span>Strong Positive Driver (e.g. Salary vs Max EMI: +0.53)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
