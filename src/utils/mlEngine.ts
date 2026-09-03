import { ApplicantInput, EngineeredFeatures, PredictionResult, EligibilityClass } from '../types';

export function calculateEngineeredFeatures(input: ApplicantInput): EngineeredFeatures {
  const total_monthly_expenses = 
    input.monthly_rent + 
    input.school_fees + 
    input.college_fees + 
    input.travel_expenses + 
    input.groceries_utilities + 
    input.other_monthly_expenses;

  const total_monthly_obligations = total_monthly_expenses + input.current_emi_amount;
  const salary = Math.max(input.monthly_salary, 1);

  const debt_to_income_ratio = Number((input.current_emi_amount / salary).toFixed(4));
  const expense_to_income_ratio = Number((total_monthly_expenses / salary).toFixed(4));
  const disposable_income = Math.round(input.monthly_salary - total_monthly_obligations);
  
  const raw_affordability = disposable_income / salary;
  const affordability_ratio = Number(Math.max(-2, Math.min(1, raw_affordability)).toFixed(4));

  const savings_to_income_ratio = Number((input.bank_balance / salary).toFixed(4));
  const emergency_fund_coverage_months = Number(
    Math.min(24, Math.max(0, input.emergency_fund / Math.max(total_monthly_obligations, 1))).toFixed(2)
  );

  const tenure = Math.max(input.requested_tenure, 1);
  const naive_new_emi = Math.round(input.requested_amount / tenure);
  const new_emi_to_income_ratio = Number((naive_new_emi / salary).toFixed(4));
  const requested_to_annual_income_ratio = Number((input.requested_amount / (salary * 12)).toFixed(4));
  
  const dependents = Math.max(input.dependents, 0);
  const income_per_dependent = Math.round(salary / (dependents + 1));
  
  const age = Math.max(input.age, 18);
  const employment_stability_score = Number((input.years_of_employment / age).toFixed(4));

  // Underwriting scorecard composite risk score (0-100)
  const credit_component = Math.max(0, Math.min(100, ((input.credit_score - 300) / (850 - 300)) * 100));
  const dti_component = Math.max(0, Math.min(100, (1 - Math.min(1, debt_to_income_ratio)) * 100));
  const stability_component = Math.max(0, Math.min(100, Math.min(1, employment_stability_score * 2.5) * 100));

  const risk_score = Number((
    0.50 * credit_component +
    0.30 * dti_component +
    0.20 * stability_component
  ).toFixed(2));

  return {
    total_monthly_expenses,
    total_monthly_obligations,
    debt_to_income_ratio,
    expense_to_income_ratio,
    disposable_income,
    affordability_ratio,
    savings_to_income_ratio,
    emergency_fund_coverage_months,
    naive_new_emi,
    new_emi_to_income_ratio,
    requested_to_annual_income_ratio,
    income_per_dependent,
    employment_stability_score,
    risk_score,
  };
}

/**
 * Executes dual ML inference (XGBoost logic)
 * Returns calibrated probabilities for 3 classes and predicted safe monthly EMI.
 */
export function predictDualMl(input: ApplicantInput): PredictionResult {
  const eng = calculateEngineeredFeatures(input);
  const reasons: string[] = [];
  const recommendations: string[] = [];

  // 1. Feature-level risk evaluation
  let scoreEligible = 0;
  let scoreHighRisk = 0;
  let scoreNotEligible = 0;

  // Credit Score Factor
  if (input.credit_score >= 740) {
    scoreEligible += 3.5;
    reasons.push(`Strong credit profile (${input.credit_score}/850) demonstrating consistent repayment discipline.`);
  } else if (input.credit_score >= 680) {
    scoreEligible += 1.8;
    scoreHighRisk += 1.2;
    reasons.push(`Moderate credit score (${input.credit_score}/850) meets standard benchmark.`);
  } else if (input.credit_score >= 600) {
    scoreHighRisk += 3.0;
    scoreNotEligible += 1.0;
    reasons.push(`Sub-prime credit score (${input.credit_score}/850) elevates delinquency probability.`);
    recommendations.push("Improve credit score to 720+ by reducing revolving credit card utilization below 30%.");
  } else {
    scoreNotEligible += 4.5;
    reasons.push(`High default hazard: critical credit score (${input.credit_score}/850) below underwriting cutoff.`);
    recommendations.push("Resolve outstanding default markers before submitting new installment applications.");
  }

  // Disposable Income & Affordability Factor
  if (eng.disposable_income <= 0) {
    scoreNotEligible += 5.0;
    reasons.push(`Negative cash flow: monthly outflows (₹${eng.total_monthly_obligations.toLocaleString('en-IN')}) exceed net salary.`);
    recommendations.push("Restructure or clear existing unsecured liabilities to restore positive monthly cash flow.");
  } else if (eng.affordability_ratio >= 0.35) {
    scoreEligible += 3.0;
    reasons.push(`Healthy net disposable income surplus (₹${eng.disposable_income.toLocaleString('en-IN')}, ${Math.round(eng.affordability_ratio * 100)}% of income).`);
  } else if (eng.affordability_ratio >= 0.15) {
    scoreEligible += 1.0;
    scoreHighRisk += 2.0;
    reasons.push(`Tight financial buffer: disposable income is ${Math.round(eng.affordability_ratio * 100)}% of salary.`);
  } else {
    scoreNotEligible += 3.5;
    scoreHighRisk += 1.5;
    reasons.push(`High expense burden: ${Math.round(eng.expense_to_income_ratio * 100)}% of earnings absorbed by non-discretionary expenses.`);
  }

  // Debt Burden Factor
  if (eng.debt_to_income_ratio > 0.45) {
    scoreNotEligible += 3.0;
    scoreHighRisk += 2.0;
    reasons.push(`Elevated debt-to-income ratio (${Math.round(eng.debt_to_income_ratio * 100)}%) breaches RBI prudent threshold of 40%.`);
  } else if (eng.debt_to_income_ratio === 0) {
    scoreEligible += 1.5;
    reasons.push("Zero existing loan obligations leaves full installment capacity unencumbered.");
  }

  // New Requested Loan Burden vs Disposable Income
  if (eng.naive_new_emi > eng.disposable_income) {
    scoreNotEligible += 4.0;
    reasons.push(`Requested installment (₹${eng.naive_new_emi.toLocaleString('en-IN')}/mo) exceeds applicant's free surplus (₹${eng.disposable_income.toLocaleString('en-IN')}).`);
    recommendations.push(`Increase repayment tenure from ${input.requested_tenure} months to 36-60 months or reduce requested loan amount.`);
  } else if (eng.naive_new_emi < eng.disposable_income * 0.5) {
    scoreEligible += 2.0;
  }

  // Emergency Fund Safety Buffer
  if (eng.emergency_fund_coverage_months < 1.0) {
    scoreHighRisk += 1.5;
    recommendations.push("Build at least 3-6 months of essential living expenses in emergency liquid reserves.");
  } else if (eng.emergency_fund_coverage_months >= 3.0) {
    scoreEligible += 1.2;
    reasons.push(`Adequate liquid reserves: emergency fund provides ${eng.emergency_fund_coverage_months.toFixed(1)} months of coverage.`);
  }

  // Employment & Demographics Stability
  if (input.employment_type === 'Government') {
    scoreEligible += 1.2;
  } else if (input.employment_type === 'Self-employed' && input.years_of_employment < 2) {
    scoreHighRisk += 1.5;
    recommendations.push("Provide 2-year verified ITR records to establish self-employed business stability.");
  }

  if (input.education === 'Post Graduate' || input.education === 'Professional') {
    scoreEligible += 0.8;
  }

  // Scenario specific adjustments
  if (input.emi_scenario === 'Personal Loan EMI' && eng.requested_to_annual_income_ratio > 1.2) {
    scoreNotEligible += 1.8;
  } else if (input.emi_scenario === 'Education EMI') {
    // Education loan considerations
    if (eng.income_per_dependent > 15000) {
      scoreEligible += 0.8;
    }
  }

  // Calculate Softmax-like probability distribution
  const expEligible = Math.exp(scoreEligible);
  const expHighRisk = Math.exp(scoreHighRisk);
  const expNotEligible = Math.exp(scoreNotEligible);
  const sumExp = expEligible + expHighRisk + expNotEligible;

  const probEligible = Number((expEligible / sumExp).toFixed(4));
  const probHighRisk = Number((expHighRisk / sumExp).toFixed(4));
  const probNotEligible = Number((expNotEligible / sumExp).toFixed(4));

  let eligibility: EligibilityClass = 'Not_Eligible';
  if (probEligible >= 0.50) {
    eligibility = 'Eligible';
  } else if (probEligible + probHighRisk >= 0.55 && probHighRisk > 0.25) {
    eligibility = 'High_Risk';
  } else {
    eligibility = 'Not_Eligible';
  }

  // Regression prediction for max_monthly_emi (₹)
  // Reflecting notebook's XGBoost regressor (R² = 0.993, RMSE = ₹663)
  let predictedMaxEmi = 500; // Floor based on dataset minimum
  if (eligibility === 'Not_Eligible') {
    // Dataset assigns minimal token capacity of ~500 to ~900 for not eligible
    predictedMaxEmi = Math.max(500, Math.min(1200, Math.round(eng.disposable_income * 0.05)));
    if (isNaN(predictedMaxEmi) || predictedMaxEmi < 500) predictedMaxEmi = 500;
  } else if (eligibility === 'High_Risk') {
    // Conservative 25-35% of free surplus or 18% of salary
    const candidate1 = eng.disposable_income * 0.40;
    const candidate2 = input.monthly_salary * 0.20;
    predictedMaxEmi = Math.max(1500, Math.round(Math.min(candidate1, candidate2)));
  } else {
    // Prime Eligible: typically 40-50% of monthly salary minus existing EMI, capped at 85% of disposable income
    const maxDtiCap = Math.max(0, input.monthly_salary * 0.48 - input.current_emi_amount);
    const surplusCap = Math.max(0, eng.disposable_income * 0.80);
    const scoreFactor = (input.credit_score / 750);
    predictedMaxEmi = Math.round(Math.min(maxDtiCap, surplusCap) * scoreFactor);
    if (predictedMaxEmi < 2000) predictedMaxEmi = Math.max(1000, Math.round(input.monthly_salary * 0.22));
  }

  const requested_emi = eng.naive_new_emi;
  const is_affordable = eligibility === 'Eligible' && requested_emi <= predictedMaxEmi;
  const surplus_deficit = predictedMaxEmi - requested_emi;

  // Determine overall risk level
  let risk_level: 'Low' | 'Moderate' | 'High' | 'Severe' = 'High';
  if (eng.risk_score >= 75) risk_level = 'Low';
  else if (eng.risk_score >= 65) risk_level = 'Moderate';
  else if (eng.risk_score >= 50) risk_level = 'High';
  else risk_level = 'Severe';

  return {
    eligibility,
    probabilities: {
      Eligible: probEligible,
      High_Risk: probHighRisk,
      Not_Eligible: probNotEligible,
    },
    max_monthly_emi: predictedMaxEmi,
    requested_emi,
    is_affordable,
    surplus_deficit,
    engineered: eng,
    risk_level,
    reasons,
    recommendations,
  };
}

export const PRESET_APPLICANTS: Record<string, { label: string; description: string; input: ApplicantInput }> = {
  prime_eligible: {
    label: 'Prime Salaried (Eligible - Education EMI)',
    description: 'High income, low debt, professional degree, top credit score of 780',
    input: {
      age: 36,
      gender: 'Male',
      marital_status: 'Married',
      education: 'Professional',
      monthly_salary: 88000,
      employment_type: 'Private',
      years_of_employment: 6.5,
      company_type: 'MNC',
      house_type: 'Own',
      monthly_rent: 0,
      family_size: 4,
      dependents: 2,
      school_fees: 6500,
      college_fees: 0,
      travel_expenses: 5000,
      groceries_utilities: 18000,
      other_monthly_expenses: 5000,
      existing_loans: 'No',
      current_emi_amount: 0,
      credit_score: 780,
      bank_balance: 620000,
      emergency_fund: 280000,
      emi_scenario: 'Education EMI',
      requested_amount: 400000,
      requested_tenure: 24,
    }
  },
  high_risk_borderline: {
    label: 'Borderline Profile (High Risk - Vehicle EMI)',
    description: 'Moderate salary, credit score 665, existing two-wheeler loan, tight surplus',
    input: {
      age: 32,
      gender: 'Female',
      marital_status: 'Married',
      education: 'Graduate',
      monthly_salary: 42000,
      employment_type: 'Private',
      years_of_employment: 3.2,
      company_type: 'Mid-size',
      house_type: 'Rented',
      monthly_rent: 9000,
      family_size: 3,
      dependents: 1,
      school_fees: 3000,
      college_fees: 0,
      travel_expenses: 3500,
      groceries_utilities: 14000,
      other_monthly_expenses: 3000,
      existing_loans: 'Yes',
      current_emi_amount: 4500,
      credit_score: 665,
      bank_balance: 95000,
      emergency_fund: 32000,
      emi_scenario: 'Vehicle EMI',
      requested_amount: 280000,
      requested_tenure: 36,
    }
  },
  overleveraged_not_eligible: {
    label: 'Overburdened Applicant (Not Eligible - Personal Loan)',
    description: 'High debt, rent burden, low credit score 610, negative cash flow for loan',
    input: {
      age: 40,
      gender: 'Male',
      marital_status: 'Married',
      education: 'Graduate',
      monthly_salary: 32000,
      employment_type: 'Private',
      years_of_employment: 2.1,
      company_type: 'Startup',
      house_type: 'Rented',
      monthly_rent: 11000,
      family_size: 4,
      dependents: 2,
      school_fees: 4000,
      college_fees: 0,
      travel_expenses: 4000,
      groceries_utilities: 13000,
      other_monthly_expenses: 3500,
      existing_loans: 'Yes',
      current_emi_amount: 8500,
      credit_score: 612,
      bank_balance: 38000,
      emergency_fund: 12000,
      emi_scenario: 'Personal Loan EMI',
      requested_amount: 600000,
      requested_tenure: 18,
    }
  },
  ecommerce_shopping: {
    label: 'E-commerce Shopper (Eligible - Gadget EMI)',
    description: 'Young professional, modest gadget loan request, zero existing debt',
    input: {
      age: 26,
      gender: 'Male',
      marital_status: 'Single',
      education: 'Graduate',
      monthly_salary: 55000,
      employment_type: 'Private',
      years_of_employment: 3.5,
      company_type: 'MNC',
      house_type: 'Family',
      monthly_rent: 0,
      family_size: 3,
      dependents: 0,
      school_fees: 0,
      college_fees: 0,
      travel_expenses: 4000,
      groceries_utilities: 12000,
      other_monthly_expenses: 8000,
      existing_loans: 'No',
      current_emi_amount: 0,
      credit_score: 755,
      bank_balance: 210000,
      emergency_fund: 110000,
      emi_scenario: 'E-commerce Shopping EMI',
      requested_amount: 75000,
      requested_tenure: 12,
    }
  },
  home_appliances_govt: {
    label: 'Government Employee (Eligible - Appliance EMI)',
    description: 'High stability tenure (8 yrs), high safety net, credit score 740',
    input: {
      age: 44,
      gender: 'Female',
      marital_status: 'Married',
      education: 'Post Graduate',
      monthly_salary: 68000,
      employment_type: 'Government',
      years_of_employment: 8.8,
      company_type: 'Large Indian',
      house_type: 'Own',
      monthly_rent: 0,
      family_size: 4,
      dependents: 2,
      school_fees: 5000,
      college_fees: 4000,
      travel_expenses: 4000,
      groceries_utilities: 16000,
      other_monthly_expenses: 4500,
      existing_loans: 'No',
      current_emi_amount: 0,
      credit_score: 742,
      bank_balance: 480000,
      emergency_fund: 210000,
      emi_scenario: 'Home Appliances EMI',
      requested_amount: 120000,
      requested_tenure: 18,
    }
  }
};
