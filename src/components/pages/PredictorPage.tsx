import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Download, 
  Copy, 
  Sliders, 
  RotateCcw, 
  TrendingUp, 
  Activity, 
  HelpCircle,
  FileCheck,
  Percent,
  Calculator,
  Building,
  Briefcase,
  PiggyBank,
  Wallet
} from 'lucide-react';
import { 
  ApplicantInput, 
  PredictionResult, 
  EmiScenario, 
  EducationLevel, 
  EmploymentType, 
  CompanyType, 
  HouseType,
  Gender,
  MaritalStatus,
  ExistingLoans
} from '../../types';
import { predictDualMl, PRESET_APPLICANTS } from '../../utils/mlEngine';
import { MetricCard } from '../common/MetricCard';

interface PredictorPageProps {
  currentInput: ApplicantInput;
  onChangeInput: (input: ApplicantInput) => void;
  onTriggerToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

export const PredictorPage: React.FC<PredictorPageProps> = ({
  currentInput,
  onChangeInput,
  onTriggerToast
}) => {
  // Live prediction evaluation
  const prediction: PredictionResult = useMemo(() => {
    return predictDualMl(currentInput);
  }, [currentInput]);

  const [copied, setCopied] = useState(false);
  const [stressSalaryDelta, setStressSalaryDelta] = useState<number>(0);
  const [stressExpenseDelta, setStressExpenseDelta] = useState<number>(0);

  // Trigger celebratory confetti on high-score eligible prediction
  const handleTriggerCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onTriggerToast('Applicant Approved! Prime eligible credit profile verified.', 'success');
  };

  // Helper to update specific input property
  const updateField = <K extends keyof ApplicantInput>(field: K, value: ApplicantInput[K]) => {
    onChangeInput({
      ...currentInput,
      [field]: value
    });
  };

  // Sensitivity analysis evaluation
  const stressedInput = useMemo<ApplicantInput>(() => {
    const adjustedSalary = Math.max(5000, currentInput.monthly_salary * (1 + stressSalaryDelta / 100));
    const adjustedExpensesMultiplier = (1 + stressExpenseDelta / 100);
    return {
      ...currentInput,
      monthly_salary: adjustedSalary,
      monthly_rent: currentInput.monthly_rent * adjustedExpensesMultiplier,
      travel_expenses: currentInput.travel_expenses * adjustedExpensesMultiplier,
      groceries_utilities: currentInput.groceries_utilities * adjustedExpensesMultiplier,
      other_monthly_expenses: currentInput.other_monthly_expenses * adjustedExpensesMultiplier,
    };
  }, [currentInput, stressSalaryDelta, stressExpenseDelta]);

  const stressedPrediction = useMemo(() => {
    return predictDualMl(stressedInput);
  }, [stressedInput]);

  const handleCopyJson = () => {
    const exportData = {
      applicant_data: currentInput,
      engineered_features: prediction.engineered,
      prediction_output: {
        eligibility: prediction.eligibility,
        probabilities: prediction.probabilities,
        max_safe_monthly_emi: prediction.max_monthly_emi,
        requested_emi: prediction.requested_emi,
        affordability_surplus: prediction.surplus_deficit
      },
      evaluation_timestamp: new Date().toISOString()
    };

    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onTriggerToast('Underwriting assessment copied to clipboard in JSON format.', 'success');
  };

  const handleDownloadReport = () => {
    const textReport = `
============================================================
EMIPredict AI - UNDERWRITING ASSESSMENT REPORT
============================================================
Evaluated at: ${new Date().toLocaleString()}
EMI Lending Scenario: ${currentInput.emi_scenario}
Requested Loan Amount: Rs ${currentInput.requested_amount.toLocaleString('en-IN')}
Requested Tenure: ${currentInput.requested_tenure} months
Estimated Monthly Installment: Rs ${prediction.requested_emi.toLocaleString('en-IN')}/month

------------------------------------------------------------
DUAL ML ASSESSMENT RESULTS
------------------------------------------------------------
1. Eligibility Decision: ${prediction.eligibility.toUpperCase()}
   - Probability [Eligible]: ${(prediction.probabilities.Eligible * 100).toFixed(1)}%
   - Probability [High_Risk]: ${(prediction.probabilities.High_Risk * 100).toFixed(1)}%
   - Probability [Not_Eligible]: ${(prediction.probabilities.Not_Eligible * 100).toFixed(1)}%

2. Maximum Safe Monthly EMI: Rs ${prediction.max_monthly_emi.toLocaleString('en-IN')}/month
   - Installment Affordable: ${prediction.is_affordable ? 'YES' : 'NO'}
   - Surplus / Deficit: Rs ${prediction.surplus_deficit.toLocaleString('en-IN')}

------------------------------------------------------------
KEY ENGINEERED RATIOS
------------------------------------------------------------
- Credit Score: ${currentInput.credit_score} / 850
- Monthly Salary: Rs ${currentInput.monthly_salary.toLocaleString('en-IN')}
- Total Monthly Obligations: Rs ${prediction.engineered.total_monthly_obligations.toLocaleString('en-IN')}
- Net Disposable Income: Rs ${prediction.engineered.disposable_income.toLocaleString('en-IN')}
- Debt-to-Income Ratio (DTI): ${(prediction.engineered.debt_to_income_ratio * 100).toFixed(1)}%
- Affordability Ratio: ${(prediction.engineered.affordability_ratio * 100).toFixed(1)}%
- Emergency Fund Coverage: ${prediction.engineered.emergency_fund_coverage_months} months
- Underwriting Risk Score: ${prediction.engineered.risk_score} / 100 (${prediction.risk_level} Risk)

------------------------------------------------------------
DECISION REASONS:
${prediction.reasons.map(r => `* ${r}`).join('\n')}

RECOMMENDATIONS:
${prediction.recommendations.map(r => `* ${r}`).join('\n')}
============================================================
`;
    const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EMIPredict_Assessment_${currentInput.emi_scenario.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onTriggerToast('Downloaded formal underwriting decision memo.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>XGBoost Dual-Model Engine (Live Inference)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Real-Time EMI Risk & Affordability Predictor
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Adjust applicant financial parameters below to inspect live feature engineering and dual ML prediction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyJson}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 inline-flex items-center gap-1.5 shadow-xs transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Memo</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs (Left) and Live Dual Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Column (7 Cols) - Streamlit styled widgets */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Loan Demand & EMI Scenario */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>1. Loan Product & Installment Demand</span>
              </h3>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-600/10 border border-blue-600/20 px-2 py-0.5 rounded">
                Naive EMI: ₹{prediction.engineered.naive_new_emi.toLocaleString('en-IN')}/mo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Lending Scenario
                </label>
                <select
                  value={currentInput.emi_scenario}
                  onChange={(e) => updateField('emi_scenario', e.target.value as EmiScenario)}
                  className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="E-commerce Shopping EMI">E-commerce Shopping EMI</option>
                  <option value="Home Appliances EMI">Home Appliances EMI</option>
                  <option value="Vehicle EMI">Vehicle EMI</option>
                  <option value="Personal Loan EMI">Personal Loan EMI</option>
                  <option value="Education EMI">Education EMI</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Requested Loan Amount</span>
                  <strong className="text-slate-900 dark:text-white">₹{currentInput.requested_amount.toLocaleString('en-IN')}</strong>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="1430000"
                  step="10000"
                  value={currentInput.requested_amount}
                  onChange={(e) => updateField('requested_amount', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>₹20K</span>
                  <span>₹700K</span>
                  <span>₹1.43M</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Requested Repayment Tenure</span>
                  <strong className="text-slate-900 dark:text-white">{currentInput.requested_tenure} Months ({(currentInput.requested_tenure / 12).toFixed(1)} yrs)</strong>
                </div>
                <input
                  type="range"
                  min="3"
                  max="96"
                  step="1"
                  value={currentInput.requested_tenure}
                  onChange={(e) => updateField('requested_tenure', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>3 mos</span>
                  <span>24 mos</span>
                  <span>48 mos</span>
                  <span>96 mos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Financial Capacity & Liquidity */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-emerald-500" />
              <span>2. Income, Credit Profile & Liquidity Reserves</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-700 dark:text-slate-300">Monthly Net Salary</span>
                  <strong className="text-slate-900 dark:text-white">₹{currentInput.monthly_salary.toLocaleString('en-IN')}</strong>
                </div>
                <input
                  type="range"
                  min="12000"
                  max="175900"
                  step="1000"
                  value={currentInput.monthly_salary}
                  onChange={(e) => updateField('monthly_salary', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>₹12K</span>
                  <span>₹90K</span>
                  <span>₹176K</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-700 dark:text-slate-300">CIBIL Credit Score</span>
                  <strong className={`font-bold ${
                    currentInput.credit_score >= 740 ? 'text-emerald-500' :
                    currentInput.credit_score >= 680 ? 'text-blue-500' :
                    currentInput.credit_score >= 600 ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    {currentInput.credit_score} / 850
                  </strong>
                </div>
                <input
                  type="range"
                  min="300"
                  max="850"
                  step="5"
                  value={currentInput.credit_score}
                  onChange={(e) => updateField('credit_score', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span className="text-rose-400">300 (Poor)</span>
                  <span className="text-amber-400">650 (Fair)</span>
                  <span className="text-emerald-400">850 (Prime)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bank Savings Balance (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={currentInput.bank_balance}
                  onChange={(e) => updateField('bank_balance', Number(e.target.value))}
                  className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Emergency Liquid Fund (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={currentInput.emergency_fund}
                  onChange={(e) => updateField('emergency_fund', Number(e.target.value))}
                  className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Monthly Expenses & Existing Debts */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-amber-500" />
                <span>3. Monthly Outflows & Existing Debt Obligations</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Total: ₹{prediction.engineered.total_monthly_obligations.toLocaleString('en-IN')}/mo
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Monthly Rent</label>
                <input
                  type="number"
                  min="0"
                  value={currentInput.monthly_rent}
                  onChange={(e) => updateField('monthly_rent', Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Current Active EMI</label>
                <input
                  type="number"
                  min="0"
                  value={currentInput.current_emi_amount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateField('current_emi_amount', val);
                    updateField('existing_loans', val > 0 ? 'Yes' : 'No');
                  }}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Groceries & Utilities</label>
                <input
                  type="number"
                  min="0"
                  value={currentInput.groceries_utilities}
                  onChange={(e) => updateField('groceries_utilities', Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">School Fees</label>
                <input
                  type="number"
                  min="0"
                  value={currentInput.school_fees}
                  onChange={(e) => updateField('school_fees', Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">College Fees</label>
                <input
                  type="number"
                  min="0"
                  value={currentInput.college_fees}
                  onChange={(e) => updateField('college_fees', Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Travel & Other</label>
                <input
                  type="number"
                  min="0"
                  value={currentInput.travel_expenses + currentInput.other_monthly_expenses}
                  onChange={(e) => {
                    const half = Math.round(Number(e.target.value) / 2);
                    updateField('travel_expenses', half);
                    updateField('other_monthly_expenses', half);
                  }}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Demographic & Employment Profile */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-500" />
              <span>4. Demographics & Employment Stability</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Age ({currentInput.age} yrs)</label>
                <input
                  type="number"
                  min="18"
                  max="75"
                  value={currentInput.age}
                  onChange={(e) => updateField('age', Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Employment (yrs)</label>
                <input
                  type="number"
                  min="0.1"
                  max="40"
                  step="0.5"
                  value={currentInput.years_of_employment}
                  onChange={(e) => updateField('years_of_employment', Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Education</label>
                <select
                  value={currentInput.education}
                  onChange={(e) => updateField('education', e.target.value as EducationLevel)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                >
                  <option value="High School">High School</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Job Sector</label>
                <select
                  value={currentInput.employment_type}
                  onChange={(e) => updateField('employment_type', e.target.value as EmploymentType)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                >
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                  <option value="Self-employed">Self-employed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Company Scale</label>
                <select
                  value={currentInput.company_type}
                  onChange={(e) => updateField('company_type', e.target.value as CompanyType)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                >
                  <option value="Startup">Startup</option>
                  <option value="Mid-size">Mid-size</option>
                  <option value="MNC">MNC</option>
                  <option value="Large Indian">Large Indian</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">House Ownership</label>
                <select
                  value={currentInput.house_type}
                  onChange={(e) => updateField('house_type', e.target.value as HouseType)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                >
                  <option value="Own">Own Property</option>
                  <option value="Rented">Rented</option>
                  <option value="Family">Family Owned</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Dependents</label>
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={currentInput.dependents}
                  onChange={(e) => updateField('dependents', Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Marital Status</label>
                <select
                  value={currentInput.marital_status}
                  onChange={(e) => updateField('marital_status', e.target.value as MaritalStatus)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                >
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Column (5 Cols) - Live Dual Prediction */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Eligibility Classification Banner */}
          <div className={`
            p-6 rounded-2xl border transition-all duration-300
            ${prediction.eligibility === 'Eligible' 
              ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-slate-900/5 dark:to-slate-900 border-emerald-500/40 shadow-emerald-500/5 shadow-lg' 
              : prediction.eligibility === 'High_Risk'
              ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-900/5 dark:to-slate-900 border-amber-500/40 shadow-amber-500/5 shadow-lg'
              : 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-slate-900/5 dark:to-slate-900 border-rose-500/40 shadow-rose-500/5 shadow-lg'}
          `}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1️⃣ EMI Eligibility Risk Classification
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                XGBoost Model
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              {prediction.eligibility === 'Eligible' && (
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              )}
              {prediction.eligibility === 'High_Risk' && (
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <AlertTriangle className="w-7 h-7" />
                </div>
              )}
              {prediction.eligibility === 'Not_Eligible' && (
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                  <XCircle className="w-7 h-7" />
                </div>
              )}

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {prediction.eligibility === 'Eligible' && 'Eligible (Approved)'}
                  {prediction.eligibility === 'High_Risk' && 'High Risk (Manual Audit)'}
                  {prediction.eligibility === 'Not_Eligible' && 'Not Eligible (Declined)'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Risk Tier: <strong className="text-slate-900 dark:text-white">{prediction.risk_level} Hazard</strong> • Score: <strong>{prediction.engineered.risk_score} / 100</strong>
                </p>
              </div>
            </div>

            {/* Probability Breakdown Bar */}
            <div className="space-y-1.5 pt-1 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span>Model Probability Distribution</span>
                <span className="font-mono">
                  {(prediction.probabilities[prediction.eligibility] * 100).toFixed(1)}% Confidence
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                <div 
                  style={{ width: `${prediction.probabilities.Eligible * 100}%` }}
                  className="bg-emerald-500 h-full transition-all duration-300"
                  title={`Eligible: ${(prediction.probabilities.Eligible * 100).toFixed(1)}%`}
                />
                <div 
                  style={{ width: `${prediction.probabilities.High_Risk * 100}%` }}
                  className="bg-amber-500 h-full transition-all duration-300"
                  title={`High Risk: ${(prediction.probabilities.High_Risk * 100).toFixed(1)}%`}
                />
                <div 
                  style={{ width: `${prediction.probabilities.Not_Eligible * 100}%` }}
                  className="bg-rose-500 h-full transition-all duration-300"
                  title={`Not Eligible: ${(prediction.probabilities.Not_Eligible * 100).toFixed(1)}%`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-medium pt-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Eligible ({(prediction.probabilities.Eligible * 100).toFixed(0)}%)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>High Risk ({(prediction.probabilities.High_Risk * 100).toFixed(0)}%)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Not Eligible ({(prediction.probabilities.Not_Eligible * 100).toFixed(0)}%)</span>
                </span>
              </div>
            </div>

            {/* Quick action button for celebration on eligible */}
            {prediction.eligibility === 'Eligible' && (
              <button
                onClick={handleTriggerCelebrate}
                className="w-full mt-4 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/30"
              >
                <span>🎉 Generate Formal Sanction Letter</span>
              </button>
            )}
          </div>

          {/* Card 2: Maximum Safe Monthly EMI Regression */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2️⃣ Maximum Safe Monthly EMI
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                XGBoost Regressor
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  ₹{prediction.max_monthly_emi.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 block mt-0.5">
                  Safe monthly installment limit
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Requested EMI:</span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  ₹{prediction.requested_emi.toLocaleString('en-IN')}/mo
                </span>
              </div>
            </div>

            {/* Affordability Delta Comparison */}
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              prediction.surplus_deficit >= 0
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300'
            }`}>
              <span className="font-semibold">
                {prediction.surplus_deficit >= 0 ? 'Surplus Headroom:' : 'Deficit Shortfall:'}
              </span>
              <span className="font-bold text-sm">
                {prediction.surplus_deficit >= 0 ? '+' : ''}₹{prediction.surplus_deficit.toLocaleString('en-IN')}/mo
              </span>
            </div>

            {/* Engineered Key Ratios Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Debt-to-Income (DTI)</span>
                <strong className={`text-xs ${prediction.engineered.debt_to_income_ratio > 0.40 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                  {(prediction.engineered.debt_to_income_ratio * 100).toFixed(1)}%
                </strong>
                <span className="text-[9px] text-slate-400 block">Cap: 40.0%</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Disposable Surplus</span>
                <strong className={`text-xs ${prediction.engineered.disposable_income < 0 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                  ₹{prediction.engineered.disposable_income.toLocaleString('en-IN')}
                </strong>
                <span className="text-[9px] text-slate-400 block">{(prediction.engineered.affordability_ratio * 100).toFixed(0)}% of salary</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Emergency Coverage</span>
                <strong className="text-xs text-slate-800 dark:text-slate-200">
                  {prediction.engineered.emergency_fund_coverage_months} mos
                </strong>
                <span className="text-[9px] text-slate-400 block">Rec: 3.0+ mos</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[10px] text-slate-400 block">Stability Index</span>
                <strong className="text-xs text-slate-800 dark:text-slate-200">
                  {prediction.engineered.employment_stability_score}
                </strong>
                <span className="text-[9px] text-slate-400 block">Tenure / Age ratio</span>
              </div>
            </div>
          </div>

          {/* Underwriting Reasoning & Corrective Actions */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Underwriting Drivers & Advisory</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Key Factors:</span>
                <ul className="space-y-1">
                  {prediction.reasons.map((r, idx) => (
                    <li key={idx} className="text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {prediction.recommendations.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block mb-1">
                    Corrective Actions to Reach &quot;Eligible&quot; Tier:
                  </span>
                  <ul className="space-y-1">
                    {prediction.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Stress Testing Slider Accordion */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-rose-500" />
                <span>Macro Stress Testing Simulator</span>
              </h4>
              <button
                onClick={() => {
                  setStressSalaryDelta(0);
                  setStressExpenseDelta(0);
                }}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 inline-flex items-center gap-1"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Salary Shock Simulation</span>
                  <strong className={stressSalaryDelta < 0 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}>
                    {stressSalaryDelta > 0 ? '+' : ''}{stressSalaryDelta}%
                  </strong>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="5"
                  value={stressSalaryDelta}
                  onChange={(e) => setStressSalaryDelta(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Inflation / Expense Spike</span>
                  <strong className={stressExpenseDelta > 0 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}>
                    {stressExpenseDelta > 0 ? '+' : ''}{stressExpenseDelta}%
                  </strong>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="40"
                  step="5"
                  value={stressExpenseDelta}
                  onChange={(e) => setStressExpenseDelta(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {(stressSalaryDelta !== 0 || stressExpenseDelta !== 0) && (
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span>Stressed Eligibility:</span>
                    <strong className={
                      stressedPrediction.eligibility === 'Eligible' ? 'text-emerald-500' :
                      stressedPrediction.eligibility === 'High_Risk' ? 'text-amber-500' : 'text-rose-500'
                    }>
                      {stressedPrediction.eligibility}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span>Stressed Safe EMI:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono">
                      ₹{stressedPrediction.max_monthly_emi.toLocaleString('en-IN')}/mo
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
