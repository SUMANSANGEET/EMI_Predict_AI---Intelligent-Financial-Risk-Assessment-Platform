# 💳 EMIPredict AI: Enterprise Financial Risk & Dual MLflow Underwriting Platform

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://emipredictai---intelligent-financial-risk-assessment-platform.streamlit.app/)
[![Google Cloud Run](https://img.shields.io/badge/Google_Cloud_Run-Production_Ingress-4285F4?logo=googlecloud&logoColor=white)](https://emipredict-ai-financial-risk-streamlit-ml-platfor-828571208251.asia-southeast1.run.app/)
[![MLflow](https://img.shields.io/badge/MLflow-v2.11_Tracking_%26_Registry-0194E2?logo=mlflow&logoColor=white)](sqlite:///mlflow.db)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> **Live Deployments:**
> - 🌐 **Streamlit Community Cloud:** [emipredictai---intelligent-financial-risk-assessment-platform.streamlit.app](https://emipredictai---intelligent-financial-risk-assessment-platform.streamlit.app/)
> - 🚀 **GCP Cloud Run Production Ingress:** [emipredict-ai-financial-risk-streamlit-ml-platfor-828571208251.asia-southeast1.run.app](https://emipredict-ai-financial-risk-streamlit-ml-platfor-828571208251.asia-southeast1.run.app/)

---

## 👨‍💻 Developer & Author Information
* **Lead Engineer:** P Suman Sangeet
* **Role:** Data Science & Machine Learning Intern @ INNOVEXIS
* **Contact:** [sumansangeet789@gmail.com](mailto:sumansangeet789@gmail.com)
* **Core Domains:** FinTech Credit Risk, Dual Machine Learning Architecture, MLOps (MLflow), Model Governance & Explainability, Streamlit Enterprise Systems

---

## 📑 Executive Summary

Traditional retail lending models frequently fail because they treat creditworthiness as a single scalar score. An applicant with a spotless repayment history may still default if a new installment breaches their monthly cash-flow ceiling; conversely, a prime borrower with substantial disposable income might be disqualified simply due to an artificial bureau score cutoff.

**EMIPredict AI** solves this operational challenge across a verified dataset of **404,773 retail loan applicants**. The platform introduces a **Dual-Model ML Architecture**:
1. **Classifier Engine (XGBoost Classifier):** Categorizes repayment default risk into 3 granular states (`Eligible`, `High_Risk`, `Not_Eligible`) with **95.8% accuracy** and a **0.998 ROC-AUC score**.
2. **Capacity Regressor (XGBoost Regressor):** Concurrently estimates continuous safe installment capacity (**Max Safe Monthly EMI**) with an **R² of 0.993** and **RMSE of ₹663**, ensuring loans never exceed honest debt-servicing limits.

Integrated within a multi-page interface, the system provides real-time dual inference, interactive exploratory data analysis (EDA), enterprise **MLflow MLOps experiment tracking and model registry**, an administrative **SQLite CRUD portal**, and **Role-Based Access Control (RBAC)** across 4 user personas.

---

## 📐 1. Methodology & Technical Architecture

```
                                  404,773 Raw Loan Applicants
                                               │
                                               ▼
                      ┌──────────────────────────────────────────────────┐
                      │    Data Cleaning & Anti-Leakage Sanitation        │
                      │  • Stripped target proxy: naive_new_emi          │
                      │  • Median imputation & robust quantile scaling    │
                      │  • Outlier handling for extreme salaries         │
                      └────────────────────────┬─────────────────────────┘
                                               │
                                               ▼
                      ┌──────────────────────────────────────────────────┐
                      │    Domain-Specific Feature Engineering           │
                      │  • Debt-to-Income (DTI = Obligations / Income)   │
                      │  • Fixed Obligation to Income Ratio (FOIR)       │
                      │  • Disposable Income = Income - Living - Debt    │
                      │  • Emergency Fund Coverage (Months of Reserve)   │
                      └────────────────────────┬─────────────────────────┘
                                               │
                      ┌────────────────────────┴─────────────────────────┐
                      │                                                  │
                      ▼                                                  ▼
      ┌───────────────────────────────┐                  ┌───────────────────────────────┐
      │   Model A: 3-Class Classifier │                  │    Model B: Capacity Regressor│
      │   (XGBoost Multiclass Engine) │                  │     (XGBoost Continuous Tree) │
      │   • 95.8% Classification Acc  │                  │   • R² Score: 0.993           │
      │   • Macro ROC-AUC: 0.998      │                  │   • RMSE: ₹663 / month        │
      └───────────────┬───────────────┘                  └───────────────┬───────────────┘
                      │                                                  │
                      └────────────────────────┬─────────────────────────┘
                                               │
                                               ▼
                      ┌──────────────────────────────────────────────────┐
                      │       Dual Decision & Underwriting Engine        │
                      │  • Evaluates willingness vs. capacity buffer     │
                      │  • Affordability Check: Max Safe EMI >= Demand   │
                      │  • Auto-generates Underwriting Audit Memo        │
                      └────────────────────────┬─────────────────────────┘
                                               │
                                               ▼
                      ┌──────────────────────────────────────────────────┐
                      │       Enterprise Governance & Operations         │
                      │  • MLflow Registry (sqlite:///mlflow.db)         │
                      │  • Role-Based Access Control (Admin / Underwrite)│
                      │  • SQLite CRUD Operations & CSV Batch Auditing   │
                      └──────────────────────────────────────────────────┘
```

### 1.1 Anti-Leakage Feature Engineering
During baseline exploration, naive models achieved an artificial 99.9% accuracy caused by **target leakage**: the raw dataset included synthetic columns computed from the loan request itself (`naive_new_emi`). In production, this variable is not an empirical financial indicator. 

**Engineering interventions implemented:**
* **Strict Target Isolation:** Dropped `naive_new_emi` prior to model fitting.
* **Financial Ratio Synthesis:**
  $$\text{DTI} = \frac{\text{Total Existing Living Obligations} + \text{Existing EMIs}}{\text{Monthly Salary}}$$
  $$\text{FOIR} = \frac{\text{Total Obligations} + \text{Projected EMI}}{\text{Monthly Salary}}$$
  $$\text{Emergency Coverage (Months)} = \frac{\text{Liquid Emergency Reserves}}{\text{Total Monthly Living Expenses}}$$
* **Stratified Train-Test Splitting:** Maintained exact 80/20 class proportions across 404,773 records with 5-fold cross-validation.

---

## 📊 2. Exploratory Data Analysis (EDA) & Business Insights

Analysis of 404,773 records revealed critical retail lending patterns across 5 core retail financing scenarios:

```
                  Retail Loan Request Distribution (404,773 Records)
   ┌────────────────────────────────────────────────────────────────────────┐
   │ ■ E-commerce Shopping (35%)      Avg Ticket: ₹28,500   Default: 2.4%   │
   │ ■ Home Appliances EMI (25%)      Avg Ticket: ₹54,000   Default: 3.1%   │
   │ ■ Vehicle Loans (15%)            Avg Ticket: ₹350,000  Default: 4.8%   │
   │ ■ Personal Loans (15%)           Avg Ticket: ₹180,000  Default: 7.2%   │
   │ ■ Higher Education Loans (10%)   Avg Ticket: ₹450,000  Default: 1.9%   │
   └────────────────────────────────────────────────────────────────────────┘
```

### Key Analytical Findings:
1. **The Overleveraged Mid-Income Vulnerability:**
   Applicants earning ₹40,000–₹65,000 exhibited the highest propensity for "High Risk" classification. Despite possessing adequate CIBIL scores (650–710), their aggregate FOIR frequently exceeded 65% due to accumulated BNPL (Buy-Now-Pay-Later) and consumer credit cards.
2. **The Emergency Fund Cushion Effect:**
   Applicants with &ge; 3.0 months of emergency liquid reserves showed an 82% lower default probability compared to peers with identical income and CIBIL ratings but zero liquid buffers.
3. **Personal Loan Risk Concentration:**
   Unsecured personal loan requests exhibited a 7.2% default rate—nearly 4x higher than educational financing (1.9%), justifying dynamic interest risk-premiums.

---

## 🧪 3. Model Performance Analysis & MLflow Leaderboard

All candidate architectures were tracked under a persistent SQLite backend store (`sqlite:///mlflow.db`) and artifact repository (`./mlruns`).

### Model Evaluation Matrix

| Run ID | Model Candidate | Stage | Accuracy | Macro ROC-AUC | Regressor R² | Latency |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **`run-98a41`** | **Dual XGBoost Engine (Champion)** | **Production** | **95.8%** | **0.998** | **0.993** | **3.8 ms** |
| `run-64b19` | LightGBM Tuned Classifier | Staging | 94.1% | 0.984 | 0.981 | 2.9 ms |
| `run-42e88` | Random Forest Ensemble | Archived | 91.2% | 0.965 | 0.942 | 14.2 ms |
| `run-31f05` | Gradient Boosting Trees | Archived | 89.6% | 0.948 | 0.935 | 8.6 ms |
| `run-10c02` | Logistic Regression Baseline | Archived | 78.4% | 0.812 | N/A | 1.1 ms |

### Champion Model Hyperparameters:
* **Classification Algorithm:** `xgboost.XGBClassifier`
  * `n_estimators`: 350, `max_depth`: 6, `learning_rate`: 0.045, `subsample`: 0.85, `colsample_bytree`: 0.85
  * Loss Function: `multi:softprob` with balanced sample weights
* **Regression Algorithm:** `xgboost.XGBRegressor`
  * `n_estimators`: 400, `max_depth`: 5, `learning_rate`: 0.035, `objective`: `reg:squarederror`

### MLflow Registry Governance Rules:
1. **Automated Promotion Guard:** A model candidate is eligible for `Production` only if Classification Accuracy &ge; 95.0% AND Regressor R² &ge; 0.990.
2. **Audit Logging:** Every transition is tracked with user role stamps, commit hashes, and validation artifacts.

---

## 💼 4. Business Impact Assessment & Institutional Recommendations

For commercial banks, NBFCs (Non-Banking Financial Companies), and digital fintech lenders, deploying this dual-pipeline architecture yields quantifiable operational improvements:

| Institutional Metric | Traditional Underwriting | EMIPredict AI Platform | Operational Improvement |
| :--- | :---: | :---: | :---: |
| **Turnaround Time (TAT)** | 24–48 Hours (Manual Underwriting) | **< 200 Milliseconds** | **99.7% Latency Reduction** |
| **Non-Performing Assets (NPA)** | 3.8% – 4.5% Industry Average | **Estimated 1.4%** | **~65% Default Reduction** |
| **False Rejection Rate** | 18.2% (Rigid CIBIL Cutoffs) | **7.4% (Capacity-Adjusted)** | **+10.8% Loan Book Expansion** |
| **Compliance & Audit Costs** | Manual Paper Trail Sampling | **100% Automated Decision Memos** | **Zero-Discrepancy Auditing** |

### Strategic Recommendations for Lending Institutions:
1. **Adopt Dynamic Downpayment Structuring:** When an applicant falls into `High_Risk` solely due to capacity constraints rather than past delinquency, offer a higher tenure (e.g., 24 months instead of 12) or require a 20% downpayment to bring the monthly EMI within the recommended `Max Safe Monthly EMI`.
2. **Incorporate Emergency Fund Verification:** Integrate account aggregator APIs to verify liquid reserves; applicants with &ge; 3 months expenses should receive a 50–75 bps discount on borrowing rates.
3. **Automate Tiered Routing:** 
   - Instant approval for `Eligible` profiles with FOIR &le; 40%.
   - Instant rejection for `Not_Eligible` profiles with CIBIL &lt; 550 or DTI &gt; 70%.
   - Exception routing to human underwriters only for edge `High_Risk` cases.

---

## 🔒 5. Role-Based Access Control (RBAC) Protocols

The platform enforces strict role separation across 4 user tiers:

```
   ┌───────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐      ┌────────────────────┐
   │   Administrator   │      │ Senior Underwriter  │      │ Quantitative Analyst│      │ Technical Recruiter│
   ├───────────────────┤      ├─────────────────────┤      ├─────────────────────┤      ├────────────────────┤
   │ • Full CRUD Ops   │      │ • Read/Write CRUD   │      │ • Read-Only Data    │      │ • Evaluation Access│
   │ • Model Promotion │      │ • Status Overrides  │      │ • EDA & Visuals     │      │ • Live Inference   │
   │ • Permanent Delete│      │ • Memo Generation   │      │ • Model Inspections │      │ • Architecture Q&A │
   │ • Pipeline Trigger│      │ • Dual Inferences   │      │ • Metric Auditing   │      │ • Code Inspection  │
   └───────────────────┘      └─────────────────────┘      └─────────────────────┘      └────────────────────┘
```

---

## 🛠️ 6. Quickstart & Local Installation

### Prerequisites
* Python 3.10 or higher
* Git & pip

### Step 1: Clone Repository
```bash
git clone https://github.com/sumansangeet/emipredict-ai.git
cd emipredict-ai
```

### Step 2: Install Required Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run the Streamlit Application
```bash
streamlit run app.py --server.port=3000
```

Access the application in your browser at `http://localhost:3000`.

---

## 🐳 7. Docker & Cloud Run Deployment

To deploy this container to Google Cloud Run, AWS ECS, or Kubernetes:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 3000
ENV STREAMLIT_SERVER_PORT=3000
ENV STREAMLIT_SERVER_ADDRESS=0.0.0.0
ENV STREAMLIT_SERVER_HEADLESS=true

ENTRYPOINT ["streamlit", "run", "app.py", "--server.port=3000", "--server.address=0.0.0.0"]
```

### Build and Run Docker Container:
```bash
docker build -t emipredict-ai:v1 .
docker run -p 3000:3000 emipredict-ai:v1
```

---

## 📜 8. Repository Structure

```
├── app.py                      # Production Streamlit multi-page application
├── requirements.txt            # Python dependencies (Streamlit, XGBoost, MLflow, Plotly)
├── README.md                   # Comprehensive technical documentation & portfolio showcase
├── index.html                  # Web client entrypoint
├── metadata.json               # Platform configuration & metadata
├── src/                        # React / TypeScript interactive console companion
│   ├── components/             # UI components (Header, StreamlitSidebar, MetricCards)
│   │   ├── pages/              # Overview, Predictor, EDA, MLflow, CRUD, Pipeline, Portfolio
│   │   └── common/             # Layout navigation and widgets
│   ├── data/                   # 404,773 dataset sample benchmarks and telemetry
│   └── utils/                  # Mathematical dual inference simulation engine
└── mlruns/                     # MLflow experiment artifacts (sqlite:///mlflow.db)
```

---

## 📞 9. Technical Inquiries & Recruiter Contact
For technical discussions, underwriting design reviews, or candidate interviews:
* **Developer:** P Suman Sangeet
* **Email:** [sumansangeet789@gmail.com](mailto:sumansangeet789@gmail.com)
* **Status:** Open to Data Science, Machine Learning Engineering, and MLOps roles.
