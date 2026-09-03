export type EmiScenario = 
  | 'E-commerce Shopping EMI'
  | 'Home Appliances EMI'
  | 'Vehicle EMI'
  | 'Personal Loan EMI'
  | 'Education EMI';

export type EligibilityClass = 'Eligible' | 'High_Risk' | 'Not_Eligible';

export type Gender = 'Male' | 'Female';
export type MaritalStatus = 'Married' | 'Single';
export type EducationLevel = 'High School' | 'Graduate' | 'Post Graduate' | 'Professional';
export type EmploymentType = 'Private' | 'Government' | 'Self-employed';
export type CompanyType = 'Startup' | 'Mid-size' | 'MNC' | 'Large Indian';
export type HouseType = 'Own' | 'Rented' | 'Family';
export type ExistingLoans = 'Yes' | 'No';

export interface ApplicantInput {
  age: number;
  gender: Gender;
  marital_status: MaritalStatus;
  education: EducationLevel;
  monthly_salary: number;
  employment_type: EmploymentType;
  years_of_employment: number;
  company_type: CompanyType;
  house_type: HouseType;
  monthly_rent: number;
  family_size: number;
  dependents: number;
  school_fees: number;
  college_fees: number;
  travel_expenses: number;
  groceries_utilities: number;
  other_monthly_expenses: number;
  existing_loans: ExistingLoans;
  current_emi_amount: number;
  credit_score: number;
  bank_balance: number;
  emergency_fund: number;
  emi_scenario: EmiScenario;
  requested_amount: number;
  requested_tenure: number;
}

export interface EngineeredFeatures {
  total_monthly_expenses: number;
  total_monthly_obligations: number;
  debt_to_income_ratio: number;
  expense_to_income_ratio: number;
  disposable_income: number;
  affordability_ratio: number;
  savings_to_income_ratio: number;
  emergency_fund_coverage_months: number;
  naive_new_emi: number;
  new_emi_to_income_ratio: number;
  requested_to_annual_income_ratio: number;
  income_per_dependent: number;
  employment_stability_score: number;
  risk_score: number;
}

export interface PredictionResult {
  eligibility: EligibilityClass;
  probabilities: {
    Eligible: number;
    High_Risk: number;
    Not_Eligible: number;
  };
  max_monthly_emi: number;
  requested_emi: number;
  is_affordable: boolean;
  surplus_deficit: number;
  engineered: EngineeredFeatures;
  risk_level: 'Low' | 'Moderate' | 'High' | 'Severe';
  reasons: string[];
  recommendations: string[];
}

export interface LoanRecord extends ApplicantInput {
  id: string;
  applicant_name: string;
  application_date: string;
  emi_eligibility: EligibilityClass;
  max_monthly_emi: number;
  status: 'Approved' | 'Under Review' | 'Rejected' | 'Disbursed';
}

export interface MLflowRun {
  run_id: string;
  run_name: string;
  model_type: 'classification' | 'regression';
  algorithm: string;
  status: 'FINISHED' | 'RUNNING' | 'FAILED';
  metrics: Record<string, number>;
  params: Record<string, any>;
  artifacts: string[];
  duration_seconds: number;
  created_at: string;
}

export interface RegisteredModel {
  name: string;
  version: number;
  stage: 'Production' | 'Staging' | 'Archived';
  algorithm: string;
  task: 'Classification' | 'Regression';
  key_metric: string;
  key_metric_value: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'underwriter' | 'fintech' | 'recruiter';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  organization: string;
  avatar: string;
}

export type NavigationPage = 
  | 'overview' 
  | 'predictor' 
  | 'eda' 
  | 'mlflow' 
  | 'crud' 
  | 'pipeline' 
  | 'portfolio'
  | 'streamlit_code';
