import { 
  LoanRecord, 
  MLflowRun, 
  RegisteredModel, 
  AuthUser 
} from '../types';

export const BENCHMARK_METRICS = {
  totalRecords: 404773,
  rawFeatures: 22,
  engineeredFeatures: 14,
  encodedFeatures: 48,
  scenariosCount: 5,
  classDistribution: {
    Not_Eligible: { count: 312841, percentage: 77.3, color: '#e74c3c' },
    Eligible: { count: 74444, percentage: 18.4, color: '#2ecc71' },
    High_Risk: { count: 17488, percentage: 4.3, color: '#f39c12' }
  },
  imbalanceRatio: '17.9 : 4.3 : 1',
  championClassification: {
    model: 'XGBoost Classifier',
    accuracy: 0.9578,
    precision: 0.9745,
    recall: 0.9578,
    f1Score: 0.9632,
    rocAuc: 0.9985,
    status: 'Production Champion'
  },
  championRegression: {
    model: 'XGBoost Regressor',
    rmse: 663.0,
    mae: 174.9,
    r2Score: 0.9927,
    mape: 5.72,
    status: 'Production Champion'
  }
};

export const AUTH_USERS: AuthUser[] = [
  {
    id: 'usr-admin-01',
    name: 'P Suman Sangeet',
    email: 'sumansangeet789@gmail.com',
    role: 'admin',
    roleLabel: 'Admin & Lead ML Engineer',
    organization: 'INNOVEXIS Data Science & Gen AI Labs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-uw-02',
    name: 'Vikramaditya Rao',
    email: 'vikram.rao@hdfc-risk.com',
    role: 'underwriter',
    roleLabel: 'Chief Underwriting Officer',
    organization: 'Apex Retail Credit Risk Dept',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-fintech-03',
    name: 'Ananya Deshmukh',
    email: 'ananya@fintechpay.in',
    role: 'fintech',
    roleLabel: 'Digital Lending Integration Partner',
    organization: 'BharatPay Digital Checkout',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-recruiter-04',
    name: 'Senior Talent Acquisition Lead',
    email: 'recruiter@tech-ventures.com',
    role: 'recruiter',
    roleLabel: 'FinTech / AI Hiring Partner',
    organization: 'Global FinTech Recruiter Panel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  }
];

export const MLFLOW_CLASSIFICATION_RUNS: MLflowRun[] = [
  {
    run_id: 'run_xgb_cls_0921',
    run_name: 'XGBoost_Classifier_V2',
    model_type: 'classification',
    algorithm: 'XGBoost (Hist Gradient Boosting)',
    status: 'FINISHED',
    metrics: {
      accuracy: 0.9578,
      precision: 0.9745,
      recall: 0.9578,
      f1_score: 0.9632,
      roc_auc: 0.9985
    },
    params: {
      n_estimators: 250,
      max_depth: 7,
      learning_rate: 0.1,
      subsample: 0.85,
      colsample_bytree: 0.85,
      tree_method: 'hist',
      class_weight_strategy: 'balanced_sample_weights',
      random_state: 42
    },
    artifacts: ['model.bin', 'feature_importance.json', 'confusion_matrix.png', 'roc_curve.png'],
    duration_seconds: 56.4,
    created_at: '2026-09-03 21:24:05'
  },
  {
    run_id: 'run_rf_cls_0814',
    run_name: 'Random_Forest_Classifier_V1',
    model_type: 'classification',
    algorithm: 'Random Forest (150 Trees)',
    status: 'FINISHED',
    metrics: {
      accuracy: 0.8927,
      precision: 0.9570,
      recall: 0.8927,
      f1_score: 0.9158,
      roc_auc: 0.9922
    },
    params: {
      n_estimators: 150,
      max_depth: 12,
      min_samples_leaf: 5,
      class_weight: 'balanced',
      n_jobs: -1,
      random_state: 42
    },
    artifacts: ['model.pkl', 'rf_trees.summary', 'confusion_matrix.png'],
    duration_seconds: 73.2,
    created_at: '2026-09-03 21:22:52'
  },
  {
    run_id: 'run_lr_cls_0702',
    run_name: 'Logistic_Regression_Baseline',
    model_type: 'classification',
    algorithm: 'Multinomial Logistic Regression',
    status: 'FINISHED',
    metrics: {
      accuracy: 0.8439,
      precision: 0.9441,
      recall: 0.8439,
      f1_score: 0.8814,
      roc_auc: 0.9782
    },
    params: {
      C: 1.0,
      max_iter: 1000,
      class_weight: 'balanced',
      solver: 'lbfgs',
      random_state: 42
    },
    artifacts: ['model.pkl', 'coefficients.csv'],
    duration_seconds: 35.8,
    created_at: '2026-09-03 21:22:16'
  }
];

export const MLFLOW_REGRESSION_RUNS: MLflowRun[] = [
  {
    run_id: 'run_xgb_reg_1105',
    run_name: 'XGBoost_Regressor_V2',
    model_type: 'regression',
    algorithm: 'XGBoost Regressor (Squared Error)',
    status: 'FINISHED',
    metrics: {
      rmse: 663.016,
      mae: 174.916,
      r2_score: 0.9927,
      mape_pct: 5.719
    },
    params: {
      n_estimators: 300,
      max_depth: 7,
      learning_rate: 0.08,
      tree_method: 'hist',
      objective: 'reg:squarederror',
      random_state: 42
    },
    artifacts: ['regressor_model.bin', 'residuals_plot.png', 'actual_vs_pred.png'],
    duration_seconds: 18.2,
    created_at: '2026-09-03 21:38:16'
  },
  {
    run_id: 'run_rf_reg_1021',
    run_name: 'Random_Forest_Regressor_V1',
    model_type: 'regression',
    algorithm: 'Random Forest Regressor',
    status: 'FINISHED',
    metrics: {
      rmse: 1442.209,
      mae: 714.696,
      r2_score: 0.9656,
      mape_pct: 20.236
    },
    params: {
      n_estimators: 150,
      max_depth: 12,
      min_samples_leaf: 10,
      max_features: 'sqrt',
      random_state: 42
    },
    artifacts: ['rf_reg.pkl', 'feature_importances.json'],
    duration_seconds: 55.7,
    created_at: '2026-09-03 21:37:59'
  },
  {
    run_id: 'run_lr_reg_0910',
    run_name: 'Linear_Regression_Baseline',
    model_type: 'regression',
    algorithm: 'Ordinary Least Squares',
    status: 'FINISHED',
    metrics: {
      rmse: 3702.583,
      mae: 2502.521,
      r2_score: 0.7733,
      mape_pct: 160.944
    },
    params: {
      fit_intercept: true,
      positive: false
    },
    artifacts: ['ols_weights.csv'],
    duration_seconds: 8.9,
    created_at: '2026-09-03 21:37:03'
  }
];

export const REGISTERED_MODELS: RegisteredModel[] = [
  {
    name: 'emipredict_eligibility_model',
    version: 2,
    stage: 'Production',
    algorithm: 'XGBoost Classifier',
    task: 'Classification',
    key_metric: 'Weighted F1-Score',
    key_metric_value: '0.9632 (AUC 0.998)',
    updated_at: '2026-09-03 21:40:32'
  },
  {
    name: 'emipredict_max_emi_model',
    version: 2,
    stage: 'Production',
    algorithm: 'XGBoost Regressor',
    task: 'Regression',
    key_metric: 'R² Variance Explained',
    key_metric_value: '0.9927 (RMSE ₹663)',
    updated_at: '2026-09-03 21:40:39'
  },
  {
    name: 'emipredict_randomforest_audit',
    version: 1,
    stage: 'Staging',
    algorithm: 'Random Forest Dual Ensembles',
    task: 'Classification',
    key_metric: 'F1-Score',
    key_metric_value: '0.9158',
    updated_at: '2026-09-03 21:24:04'
  },
  {
    name: 'emipredict_baseline_linear',
    version: 1,
    stage: 'Archived',
    algorithm: 'Logistic + Linear Baselines',
    task: 'Regression',
    key_metric: 'R²',
    key_metric_value: '0.7733',
    updated_at: '2026-09-03 21:37:03'
  }
];

export const FEATURE_IMPORTANCES_DATA = {
  classification: [
    { feature: 'risk_score (Engineered)', importance: 0.284, category: 'Credit / Scorecard' },
    { feature: 'debt_to_income_ratio', importance: 0.178, category: 'Affordability' },
    { feature: 'credit_score', importance: 0.142, category: 'Credit History' },
    { feature: 'expense_to_income_ratio', importance: 0.098, category: 'Affordability' },
    { feature: 'new_emi_to_income_ratio', importance: 0.076, category: 'Loan Burden' },
    { feature: 'disposable_income', importance: 0.058, category: 'Cash Flow' },
    { feature: 'monthly_salary', importance: 0.043, category: 'Income' },
    { feature: 'employment_stability_score', importance: 0.035, category: 'Demographic' },
    { feature: 'emergency_fund_coverage_months', importance: 0.027, category: 'Liquid Buffer' },
    { feature: 'requested_to_annual_income', importance: 0.021, category: 'Loan Burden' },
    { feature: 'current_emi_amount', importance: 0.016, category: 'Obligation' },
    { feature: 'education_Professional', importance: 0.012, category: 'Demographic' },
    { feature: 'company_type_MNC', importance: 0.006, category: 'Stability' },
    { feature: 'house_type_Own', importance: 0.005, category: 'Asset' }
  ],
  regression: [
    { feature: 'monthly_salary', importance: 0.382, category: 'Income' },
    { feature: 'disposable_income', importance: 0.198, category: 'Cash Flow' },
    { feature: 'total_monthly_expenses', importance: 0.134, category: 'Obligation' },
    { feature: 'total_monthly_obligations', importance: 0.086, category: 'Obligation' },
    { feature: 'bank_balance', importance: 0.061, category: 'Liquidity' },
    { feature: 'travel_expenses', importance: 0.042, category: 'Discretionary' },
    { feature: 'groceries_utilities', importance: 0.031, category: 'Living' },
    { feature: 'emergency_fund', importance: 0.024, category: 'Liquidity' },
    { feature: 'current_emi_amount', importance: 0.019, category: 'Debt' },
    { feature: 'college_fees', importance: 0.014, category: 'Living' },
    { feature: 'other_monthly_expenses', importance: 0.009, category: 'Living' }
  ]
};

export const EDA_SCENARIO_DISTRIBUTION = [
  { scenario: 'Home Appliances EMI', total: 80988, eligibleRate: 18.2, highRiskRate: 4.1, notEligibleRate: 77.7, avgAmount: 185000, avgTenure: 14 },
  { scenario: 'Personal Loan EMI', total: 80980, eligibleRate: 15.4, highRiskRate: 3.8, notEligibleRate: 80.8, avgAmount: 550000, avgTenure: 38 },
  { scenario: 'E-commerce Shopping EMI', total: 80948, eligibleRate: 21.6, highRiskRate: 4.8, notEligibleRate: 73.6, avgAmount: 65000, avgTenure: 9 },
  { scenario: 'Education EMI', total: 80942, eligibleRate: 17.1, highRiskRate: 4.2, notEligibleRate: 78.7, avgAmount: 420000, avgTenure: 30 },
  { scenario: 'Vehicle EMI', total: 80942, eligibleRate: 19.8, highRiskRate: 4.5, notEligibleRate: 75.7, avgAmount: 310000, avgTenure: 48 }
];

export const EDA_DEMOGRAPHIC_STATS = {
  education: [
    { level: 'High School', eligiblePct: 8.6, totalShare: 18.2 },
    { level: 'Graduate', eligiblePct: 17.9, totalShare: 46.5 },
    { level: 'Post Graduate', eligiblePct: 24.3, totalShare: 21.8 },
    { level: 'Professional', eligiblePct: 31.2, totalShare: 13.5 }
  ],
  employment: [
    { type: 'Self-employed', eligiblePct: 14.1, totalShare: 24.2 },
    { type: 'Private', eligiblePct: 18.2, totalShare: 59.8 },
    { type: 'Government', eligiblePct: 27.8, totalShare: 16.0 }
  ],
  gender: [
    { gender: 'Male', share: 60.0, eligiblePct: 18.6 },
    { gender: 'Female', share: 40.0, eligiblePct: 18.1 }
  ]
};

export const CORRELATION_MATRIX_DATA = {
  labels: ['Salary', 'Balance', 'EmergFund', 'CurEMI', 'TotExp', 'DispInc', 'RiskScore', 'ReqAmt', 'MaxEMI'],
  values: [
    [1.00,  0.45,  0.41,  0.22,  0.72,  0.64,  0.48,  0.42,  0.53],
    [0.45,  1.00,  0.71,  0.08,  0.34,  0.31,  0.39,  0.21,  0.45],
    [0.41,  0.71,  1.00,  0.05,  0.29,  0.30,  0.36,  0.19,  0.41],
    [0.22,  0.08,  0.05,  1.00,  0.41, -0.42, -0.52,  0.18, -0.25],
    [0.72,  0.34,  0.29,  0.41,  1.00, -0.08, -0.21,  0.36,  0.48],
    [0.64,  0.31,  0.30, -0.42, -0.08,  1.00,  0.78,  0.19,  0.49],
    [0.48,  0.39,  0.36, -0.52, -0.21,  0.78,  1.00, -0.05,  0.44],
    [0.42,  0.21,  0.19,  0.18,  0.36,  0.19, -0.05,  1.00,  0.28],
    [0.53,  0.45,  0.41, -0.25,  0.48,  0.49,  0.44,  0.28,  1.00],
  ]
};

export const INITIAL_LOAN_RECORDS: LoanRecord[] = [
  {
    id: 'APP-40401',
    applicant_name: 'Aditya Swaminathan',
    application_date: '2026-09-02',
    age: 38,
    gender: 'Male',
    marital_status: 'Married',
    education: 'Professional',
    monthly_salary: 86100,
    employment_type: 'Private',
    years_of_employment: 5.8,
    company_type: 'Startup',
    house_type: 'Own',
    monthly_rent: 0,
    family_size: 3,
    dependents: 1,
    school_fees: 5500,
    college_fees: 0,
    travel_expenses: 4200,
    groceries_utilities: 16500,
    other_monthly_expenses: 4800,
    existing_loans: 'No',
    current_emi_amount: 0,
    credit_score: 765,
    bank_balance: 672100,
    emergency_fund: 324200,
    emi_scenario: 'Education EMI',
    requested_amount: 306000,
    requested_tenure: 16,
    emi_eligibility: 'Eligible',
    max_monthly_emi: 27775,
    status: 'Approved'
  },
  {
    id: 'APP-40402',
    applicant_name: 'Meenakshi Sundaram',
    application_date: '2026-09-02',
    age: 38,
    gender: 'Female',
    marital_status: 'Married',
    education: 'Graduate',
    monthly_salary: 21500,
    employment_type: 'Private',
    years_of_employment: 7.0,
    company_type: 'MNC',
    house_type: 'Family',
    monthly_rent: 0,
    family_size: 4,
    dependents: 2,
    school_fees: 3000,
    college_fees: 0,
    travel_expenses: 2500,
    groceries_utilities: 9500,
    other_monthly_expenses: 2500,
    existing_loans: 'Yes',
    current_emi_amount: 4100,
    credit_score: 714,
    bank_balance: 92500,
    emergency_fund: 26900,
    emi_scenario: 'E-commerce Shopping EMI',
    requested_amount: 128000,
    requested_tenure: 19,
    emi_eligibility: 'Not_Eligible',
    max_monthly_emi: 700,
    status: 'Rejected'
  },
  {
    id: 'APP-40403',
    applicant_name: 'Kavitha Nambiar',
    application_date: '2026-09-01',
    age: 58,
    gender: 'Female',
    marital_status: 'Married',
    education: 'High School',
    monthly_salary: 66800,
    employment_type: 'Private',
    years_of_employment: 2.2,
    company_type: 'Mid-size',
    house_type: 'Own',
    monthly_rent: 0,
    family_size: 3,
    dependents: 1,
    school_fees: 0,
    college_fees: 0,
    travel_expenses: 3800,
    groceries_utilities: 18200,
    other_monthly_expenses: 4200,
    existing_loans: 'No',
    current_emi_amount: 0,
    credit_score: 685,
    bank_balance: 440900,
    emergency_fund: 178100,
    emi_scenario: 'Vehicle EMI',
    requested_amount: 304000,
    requested_tenure: 83,
    emi_eligibility: 'Eligible',
    max_monthly_emi: 16170,
    status: 'Approved'
  },
  {
    id: 'APP-40404',
    applicant_name: 'Rohan Deshmukh',
    application_date: '2026-08-31',
    age: 38,
    gender: 'Female',
    marital_status: 'Married',
    education: 'Professional',
    monthly_salary: 82600,
    employment_type: 'Private',
    years_of_employment: 0.9,
    company_type: 'Mid-size',
    house_type: 'Rented',
    monthly_rent: 20000,
    family_size: 4,
    dependents: 2,
    school_fees: 8000,
    college_fees: 0,
    travel_expenses: 6000,
    groceries_utilities: 18000,
    other_monthly_expenses: 6000,
    existing_loans: 'Yes',
    current_emi_amount: 23700,
    credit_score: 660,
    bank_balance: 303200,
    emergency_fund: 70200,
    emi_scenario: 'Personal Loan EMI',
    requested_amount: 850000,
    requested_tenure: 15,
    emi_eligibility: 'Not_Eligible',
    max_monthly_emi: 500,
    status: 'Rejected'
  },
  {
    id: 'APP-40405',
    applicant_name: 'Pooja Agarwal',
    application_date: '2026-08-30',
    age: 48,
    gender: 'Female',
    marital_status: 'Married',
    education: 'Professional',
    monthly_salary: 57300,
    employment_type: 'Private',
    years_of_employment: 3.4,
    company_type: 'Mid-size',
    house_type: 'Family',
    monthly_rent: 0,
    family_size: 4,
    dependents: 2,
    school_fees: 4500,
    college_fees: 6000,
    travel_expenses: 4500,
    groceries_utilities: 14000,
    other_monthly_expenses: 3500,
    existing_loans: 'No',
    current_emi_amount: 0,
    credit_score: 770,
    bank_balance: 97300,
    emergency_fund: 28200,
    emi_scenario: 'Home Appliances EMI',
    requested_amount: 252000,
    requested_tenure: 7,
    emi_eligibility: 'Not_Eligible',
    max_monthly_emi: 500,
    status: 'Rejected'
  },
  {
    id: 'APP-40406',
    applicant_name: 'Rajeev Singhania',
    application_date: '2026-08-29',
    age: 33,
    gender: 'Male',
    marital_status: 'Single',
    education: 'Graduate',
    monthly_salary: 49000,
    employment_type: 'Government',
    years_of_employment: 4.5,
    company_type: 'Large Indian',
    house_type: 'Rented',
    monthly_rent: 8500,
    family_size: 2,
    dependents: 0,
    school_fees: 0,
    college_fees: 0,
    travel_expenses: 3000,
    groceries_utilities: 11000,
    other_monthly_expenses: 4000,
    existing_loans: 'Yes',
    current_emi_amount: 5000,
    credit_score: 668,
    bank_balance: 145000,
    emergency_fund: 55000,
    emi_scenario: 'Vehicle EMI',
    requested_amount: 240000,
    requested_tenure: 48,
    emi_eligibility: 'High_Risk',
    max_monthly_emi: 6800,
    status: 'Under Review'
  },
  {
    id: 'APP-40407',
    applicant_name: 'Tanvi Mukherjee',
    application_date: '2026-08-28',
    age: 29,
    gender: 'Female',
    marital_status: 'Single',
    education: 'Post Graduate',
    monthly_salary: 75000,
    employment_type: 'Private',
    years_of_employment: 4.1,
    company_type: 'MNC',
    house_type: 'Rented',
    monthly_rent: 14000,
    family_size: 2,
    dependents: 0,
    school_fees: 0,
    college_fees: 0,
    travel_expenses: 4500,
    groceries_utilities: 13000,
    other_monthly_expenses: 6500,
    existing_loans: 'No',
    current_emi_amount: 0,
    credit_score: 790,
    bank_balance: 380000,
    emergency_fund: 190000,
    emi_scenario: 'E-commerce Shopping EMI',
    requested_amount: 95000,
    requested_tenure: 12,
    emi_eligibility: 'Eligible',
    max_monthly_emi: 26500,
    status: 'Disbursed'
  },
  {
    id: 'APP-40408',
    applicant_name: 'Manoj Kumar Gupta',
    application_date: '2026-08-27',
    age: 46,
    gender: 'Male',
    marital_status: 'Married',
    education: 'Graduate',
    monthly_salary: 39000,
    employment_type: 'Self-employed',
    years_of_employment: 6.2,
    company_type: 'Startup',
    house_type: 'Own',
    monthly_rent: 0,
    family_size: 5,
    dependents: 3,
    school_fees: 6000,
    college_fees: 4000,
    travel_expenses: 3500,
    groceries_utilities: 15000,
    other_monthly_expenses: 3000,
    existing_loans: 'Yes',
    current_emi_amount: 6500,
    credit_score: 652,
    bank_balance: 88000,
    emergency_fund: 28000,
    emi_scenario: 'Home Appliances EMI',
    requested_amount: 150000,
    requested_tenure: 24,
    emi_eligibility: 'High_Risk',
    max_monthly_emi: 4200,
    status: 'Under Review'
  }
];

export const PIPELINE_STEPS = [
  {
    id: 'step-01',
    name: 'Data Extraction & Audit',
    action: 'Load 404,800 CSV records, validate schema, repair malformed floats & casings',
    status: 'success',
    execution_time: '1.42s',
    logs: [
      'Loaded dataset: 404,800 rows x 27 columns from cloud storage.',
      'Identified 3 malformed age values, 1,993 salary values, 1,952 balance values (collapsed repeated decimal points).',
      'Unified gender casing to binary Male/Female schema.',
      'Median-imputed missing values on rent (0.0), credit_score (701.0), balance (196,000.0), emergency (74,000.0).',
      'Winsorized 1st/99th percentiles on heavy-tailed financial variables.',
      'Deduplicated 27 post-capping exact clones -> 404,773 golden records retained.'
    ]
  },
  {
    id: 'step-02',
    name: 'Feature Engineering Pipeline',
    action: 'Derive 14 financial ratio & risk score features, drop leaky variables',
    status: 'success',
    execution_time: '2.18s',
    logs: [
      'Calculated total_monthly_expenses and total_monthly_obligations.',
      'Derived debt_to_income_ratio (DTI), expense_to_income_ratio, and disposable_income.',
      'Engineered affordability_ratio clipped to [-2, 1] range.',
      'Computed savings_to_income_ratio and emergency_fund_coverage_months (capped at 24).',
      'Dropped naive_new_emi from feature set to avoid target leakage with max_monthly_emi.',
      'Calculated 0-100 composite risk_score blending credit score, DTI, and employment stability.'
    ]
  },
  {
    id: 'step-03',
    name: 'ColumnTransformer & Train-Test Split',
    action: 'Stratified 80/20 train/test split, StandardScaler on 30 numerics, OneHotEncoder on 8 categoricals',
    status: 'success',
    execution_time: '3.04s',
    logs: [
      'Applied train_test_split(test_size=0.2, random_state=42, stratify=y_cls).',
      'Train set: 323,818 rows | Test set: 80,955 rows.',
      'Preserved exact class balance: 77.3% Not_Eligible, 18.4% Eligible, 4.3% High_Risk.',
      'OneHotEncoder fit solely on train split; transformed 8 categoricals into 18 binary columns.',
      'Final encoded feature space: 48 features.'
    ]
  },
  {
    id: 'step-04',
    name: 'MLflow Experiment Tracking & Benchmark',
    action: 'Train 3 Classifiers & 3 Regressors with balanced weighting; log parameters, metrics & artifacts',
    status: 'success',
    execution_time: '184.2s',
    logs: [
      'MLflow backend store initialized at sqlite:///mlflow.db.',
      'Experiment "EMIPredict_Classification" logged Logistic Regression (F1: 0.8814), Random Forest (F1: 0.9158), XGBoost (F1: 0.9632).',
      'Experiment "EMIPredict_Regression" logged Linear Regression (R2: 0.773), Random Forest (R2: 0.966), XGBoost (R2: 0.993).',
      'Logged confusion matrix, ROC curves (AUC 0.9985), and feature importances for champion models.'
    ]
  },
  {
    id: 'step-05',
    name: 'Model Registry & Deployment Packaging',
    action: 'Promote XGBoost models to Production, dump joblib artifacts for Streamlit inference',
    status: 'success',
    execution_time: '4.85s',
    logs: [
      'Registered "emipredict_eligibility_model" (version 1) -> Stage: Production.',
      'Registered "emipredict_max_emi_model" (version 1) -> Stage: Production.',
      'Saved artifacts/preprocessor.pkl, artifacts/best_classification_model.pkl, artifacts/best_regression_model.pkl.',
      'Automated container build verified with Dockerfile and requirements.txt.'
    ]
  }
];

export const RECRUITER_QA_ITEMS = [
  {
    question: 'How did you handle the severe 77% : 18% : 4% class imbalance in eligibility prediction?',
    answer: 'Rather than evaluating solely on misleading global accuracy (where predicting Not_Eligible everywhere yields 77%), I evaluated models using Weighted Precision, Recall, F1-Score, and Multi-Class OVR ROC-AUC. During model training, I applied balanced class weighting (`class_weight="balanced"` in scikit-learn and `compute_sample_weight("balanced")` in XGBoost) to heavily penalize misclassification of the critical High_Risk and Eligible cohorts.'
  },
  {
    question: 'Why did you drop `naive_new_emi` from the feature matrix before training?',
    answer: 'Data leakage prevention. In the notebook, `naive_new_emi` was defined as `requested_amount / requested_tenure`. Because the regression target `max_monthly_emi` is directly linked to installment capacity, retaining a feature with near-isomorphic derivation would cause synthetic target leakage and inflate test R² artificially. Dropping it ensured the model learned genuine financial capacity from salary, obligations, and liquidity.'
  },
  {
    question: 'Why integrate MLflow with a SQLite backend store rather than default local directories?',
    answer: 'Default MLflow filesystem tracking dumps scattered yaml files. Using `sqlite:///mlflow.db` introduces ACID compliance, enables robust queryability across experiments, supports the MLflow Model Registry for stage transitions (Staging -> Production -> Archived), and seamlessly maps to remote Postgres/Cloud SQL backends in enterprise production.'
  },
  {
    question: 'How does the dual-model architecture deliver higher business ROI than a single model?',
    answer: 'A single classification model only answers "Yes/No", which risks alienating borderline applicants. Combining classification with continuous regression delivers both a definitive risk decision (Eligible vs High Risk vs Not Eligible) AND an actionable affordability figure (Maximum Safe Monthly EMI). If an applicant requests ₹25,000/month but is only safe for ₹16,000/month, loan officers can offer restructured terms or longer tenures rather than an outright rejection.'
  }
];
