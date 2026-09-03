import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  Save, 
  X,
  FileSpreadsheet,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { 
  LoanRecord, 
  UserRole, 
  EmiScenario, 
  EligibilityClass, 
  ApplicantInput,
  EducationLevel,
  EmploymentType,
  CompanyType,
  HouseType
} from '../../types';
import { INITIAL_LOAN_RECORDS } from '../../data/mockDataset';
import { predictDualMl } from '../../utils/mlEngine';

interface AdminCrudPageProps {
  userRole: UserRole;
  onTriggerToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

export const AdminCrudPage: React.FC<AdminCrudPageProps> = ({ userRole, onTriggerToast }) => {
  const [records, setRecords] = useState<LoanRecord[]>(INITIAL_LOAN_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [scenarioFilter, setScenarioFilter] = useState<string>('All');
  const [eligibilityFilter, setEligibilityFilter] = useState<string>('All');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LoanRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<LoanRecord | null>(null);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);

  // New record form draft
  const [newDraft, setNewDraft] = useState<Partial<LoanRecord>>({
    applicant_name: '',
    age: 32,
    gender: 'Male',
    marital_status: 'Married',
    education: 'Graduate',
    monthly_salary: 50000,
    employment_type: 'Private',
    years_of_employment: 4,
    company_type: 'MNC',
    house_type: 'Rented',
    monthly_rent: 8000,
    family_size: 3,
    dependents: 1,
    school_fees: 3000,
    college_fees: 0,
    travel_expenses: 3500,
    groceries_utilities: 14000,
    other_monthly_expenses: 3500,
    existing_loans: 'No',
    current_emi_amount: 0,
    credit_score: 740,
    bank_balance: 220000,
    emergency_fund: 110000,
    emi_scenario: 'E-commerce Shopping EMI',
    requested_amount: 80000,
    requested_tenure: 12,
    status: 'Approved'
  });

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch = 
        rec.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesScenario = scenarioFilter === 'All' || rec.emi_scenario === scenarioFilter;
      const matchesEligibility = eligibilityFilter === 'All' || rec.emi_eligibility === eligibilityFilter;

      return matchesSearch && matchesScenario && matchesEligibility;
    });
  }, [records, searchQuery, scenarioFilter, eligibilityFilter]);

  // Create new applicant record
  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'admin') {
      onTriggerToast('Permission denied: Only Admin has write privileges to add records.', 'warning');
      return;
    }

    if (!newDraft.applicant_name) {
      onTriggerToast('Please enter an applicant name.', 'warning');
      return;
    }

    const inputData: ApplicantInput = {
      age: Number(newDraft.age || 30),
      gender: newDraft.gender as any,
      marital_status: newDraft.marital_status as any,
      education: newDraft.education as any,
      monthly_salary: Number(newDraft.monthly_salary || 40000),
      employment_type: newDraft.employment_type as any,
      years_of_employment: Number(newDraft.years_of_employment || 2),
      company_type: newDraft.company_type as any,
      house_type: newDraft.house_type as any,
      monthly_rent: Number(newDraft.monthly_rent || 0),
      family_size: Number(newDraft.family_size || 3),
      dependents: Number(newDraft.dependents || 1),
      school_fees: Number(newDraft.school_fees || 0),
      college_fees: Number(newDraft.college_fees || 0),
      travel_expenses: Number(newDraft.travel_expenses || 3000),
      groceries_utilities: Number(newDraft.groceries_utilities || 12000),
      other_monthly_expenses: Number(newDraft.other_monthly_expenses || 3000),
      existing_loans: Number(newDraft.current_emi_amount || 0) > 0 ? 'Yes' : 'No',
      current_emi_amount: Number(newDraft.current_emi_amount || 0),
      credit_score: Number(newDraft.credit_score || 700),
      bank_balance: Number(newDraft.bank_balance || 100000),
      emergency_fund: Number(newDraft.emergency_fund || 50000),
      emi_scenario: newDraft.emi_scenario as any,
      requested_amount: Number(newDraft.requested_amount || 100000),
      requested_tenure: Number(newDraft.requested_tenure || 12),
    };

    const pred = predictDualMl(inputData);
    const newRecord: LoanRecord = {
      ...inputData,
      id: `APP-404${Math.floor(10 + Math.random() * 89)}`,
      applicant_name: newDraft.applicant_name,
      application_date: new Date().toISOString().slice(0, 10),
      emi_eligibility: pred.eligibility,
      max_monthly_emi: pred.max_monthly_emi,
      status: pred.eligibility === 'Eligible' ? 'Approved' : pred.eligibility === 'High_Risk' ? 'Under Review' : 'Rejected'
    };

    setRecords([newRecord, ...records]);
    setIsCreateModalOpen(false);
    onTriggerToast(`Created record for ${newRecord.applicant_name} with evaluated tier ${newRecord.emi_eligibility}`, 'success');
  };

  // Update existing record
  const handleUpdateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    if (userRole !== 'admin') {
      onTriggerToast('Permission denied: Only Admin can modify loan records.', 'warning');
      return;
    }

    const pred = predictDualMl(editingRecord);
    const updated: LoanRecord = {
      ...editingRecord,
      emi_eligibility: pred.eligibility,
      max_monthly_emi: pred.max_monthly_emi,
    };

    setRecords(records.map(r => r.id === updated.id ? updated : r));
    setEditingRecord(null);
    onTriggerToast(`Updated record ${updated.id} successfully.`, 'success');
  };

  // Delete record
  const handleDeleteRecord = (id: string) => {
    if (userRole !== 'admin') {
      onTriggerToast('Permission denied: Only Admin can delete loan records.', 'warning');
      return;
    }

    setRecords(records.filter(r => r.id !== id));
    setDeletingRecordId(null);
    onTriggerToast(`Deleted application ${id} from database.`, 'info');
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Application ID', 'Applicant Name', 'Date', 'Scenario', 'Salary', 'Credit Score',
      'Requested Amount', 'Tenure', 'Current EMI', 'Eligibility', 'Max Safe EMI', 'Status'
    ];

    const rows = filteredRecords.map(r => [
      r.id,
      `"${r.applicant_name}"`,
      r.application_date,
      `"${r.emi_scenario}"`,
      r.monthly_salary,
      r.credit_score,
      r.requested_amount,
      r.requested_tenure,
      r.current_emi_amount,
      r.emi_eligibility,
      r.max_monthly_emi,
      r.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EMIPredict_Loans_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onTriggerToast(`Exported ${filteredRecords.length} records to CSV format.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header with quick stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Underwriting Operations Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Financial Application Data Management (CRUD)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Search, create, update, and manage applicant profiles with dual-model real-time re-evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 inline-flex items-center gap-1.5 shadow-xs transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              if (userRole !== 'admin') {
                onTriggerToast('Admin role required to create records. Switch persona in header.', 'warning');
                return;
              }
              setIsCreateModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 min-w-[240px] bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by applicant name or ID (e.g., APP-40401)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={scenarioFilter}
            onChange={(e) => setScenarioFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="All">All Scenarios</option>
            <option value="Education EMI">Education EMI</option>
            <option value="E-commerce Shopping EMI">E-commerce Shopping EMI</option>
            <option value="Vehicle EMI">Vehicle EMI</option>
            <option value="Personal Loan EMI">Personal Loan EMI</option>
            <option value="Home Appliances EMI">Home Appliances EMI</option>
          </select>

          <select
            value={eligibilityFilter}
            onChange={(e) => setEligibilityFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="All">All Tiers</option>
            <option value="Eligible">Eligible</option>
            <option value="High_Risk">High Risk</option>
            <option value="Not_Eligible">Not Eligible</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Application ID</th>
                <th className="py-3 px-3">Applicant Name</th>
                <th className="py-3 px-3">EMI Product</th>
                <th className="py-3 px-3">Salary</th>
                <th className="py-3 px-3">Score</th>
                <th className="py-3 px-3">Req Loan</th>
                <th className="py-3 px-3">Eligibility</th>
                <th className="py-3 px-3">Max Safe EMI</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-500">{rec.id}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {rec.applicant_name}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{rec.emi_scenario}</td>
                  <td className="py-3 px-3 font-mono">₹{rec.monthly_salary.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`font-mono font-bold ${
                      rec.credit_score >= 740 ? 'text-emerald-500' :
                      rec.credit_score >= 680 ? 'text-blue-500' :
                      rec.credit_score >= 600 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {rec.credit_score}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">₹{rec.requested_amount.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.emi_eligibility === 'Eligible' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                      rec.emi_eligibility === 'High_Risk' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    }`}>
                      {rec.emi_eligibility}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    ₹{rec.max_monthly_emi.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingRecord(rec)}
                        title="View Full Profile"
                        className="p-1.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setEditingRecord(rec)}
                        title="Edit Application"
                        className="p-1.5 rounded text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletingRecordId(rec.id)}
                        title="Delete Application"
                        className="p-1.5 rounded text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add New Loan Applicant Profile
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Applicant Name</label>
                  <input
                    type="text"
                    required
                    value={newDraft.applicant_name}
                    onChange={(e) => setNewDraft({ ...newDraft, applicant_name: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    required
                    value={newDraft.monthly_salary}
                    onChange={(e) => setNewDraft({ ...newDraft, monthly_salary: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Credit Score (300-850)</label>
                  <input
                    type="number"
                    min="300"
                    max="850"
                    required
                    value={newDraft.credit_score}
                    onChange={(e) => setNewDraft({ ...newDraft, credit_score: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">EMI Scenario</label>
                  <select
                    value={newDraft.emi_scenario}
                    onChange={(e) => setNewDraft({ ...newDraft, emi_scenario: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="E-commerce Shopping EMI">E-commerce Shopping EMI</option>
                    <option value="Home Appliances EMI">Home Appliances EMI</option>
                    <option value="Vehicle EMI">Vehicle EMI</option>
                    <option value="Personal Loan EMI">Personal Loan EMI</option>
                    <option value="Education EMI">Education EMI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Requested Amount (₹)</label>
                  <input
                    type="number"
                    min="10000"
                    value={newDraft.requested_amount}
                    onChange={(e) => setNewDraft({ ...newDraft, requested_amount: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs"
                >
                  Submit Application & Run ML
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Application {editingRecord.id}
              </h3>
              <button onClick={() => setEditingRecord(null)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateRecord} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Applicant Name</label>
                <input
                  type="text"
                  value={editingRecord.applicant_name}
                  onChange={(e) => setEditingRecord({ ...editingRecord, applicant_name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly Salary</label>
                  <input
                    type="number"
                    value={editingRecord.monthly_salary}
                    onChange={(e) => setEditingRecord({ ...editingRecord, monthly_salary: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Credit Score</label>
                  <input
                    type="number"
                    value={editingRecord.credit_score}
                    onChange={(e) => setEditingRecord({ ...editingRecord, credit_score: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                >
                  Save Changes & Re-Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PROFILE MODAL */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Applicant Profile: {viewingRecord.applicant_name}
                </h3>
                <span className="text-[10px] font-mono text-slate-400">{viewingRecord.id} • Applied {viewingRecord.application_date}</span>
              </div>
              <button onClick={() => setViewingRecord(null)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 block">EMI Scenario</span>
                <strong>{viewingRecord.emi_scenario}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 block">Eligibility Tier</span>
                <strong className={
                  viewingRecord.emi_eligibility === 'Eligible' ? 'text-emerald-500' :
                  viewingRecord.emi_eligibility === 'High_Risk' ? 'text-amber-500' : 'text-rose-500'
                }>{viewingRecord.emi_eligibility}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 block">Monthly Salary</span>
                <strong className="font-mono">₹{viewingRecord.monthly_salary.toLocaleString()}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 block">Max Safe Monthly EMI</span>
                <strong className="font-mono">₹{viewingRecord.max_monthly_emi.toLocaleString()}</strong>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setViewingRecord(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {deletingRecordId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Confirm Record Deletion
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to delete application <strong>{deletingRecordId}</strong> from the database? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletingRecordId(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRecord(deletingRecordId)}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
