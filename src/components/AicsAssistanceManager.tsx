import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Plus, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Check, 
  FileCheck2, 
  ShieldCheck, 
  ChevronRight, 
  Building2, 
  DollarSign, 
  Filter, 
  Search,
  UserCheck
} from 'lucide-react';
import { AssistanceRequest, AssistanceType, AssistanceStatus, Constituent, AIAssessmentResult } from '../types';
import { formatPeso, formatDate, getStatusBadge, getSectorColor } from '../utils/formatters';

interface AicsAssistanceManagerProps {
  assistanceRequests: AssistanceRequest[];
  constituents: Constituent[];
  onAddRequest: (newRequest: AssistanceRequest) => void;
  onUpdateRequest: (updatedRequest: AssistanceRequest) => void;
  isNewModalOpen: boolean;
  setIsNewModalOpen: (open: boolean) => void;
}

export const AicsAssistanceManager: React.FC<AicsAssistanceManagerProps> = ({
  assistanceRequests,
  constituents,
  onAddRequest,
  onUpdateRequest,
  isNewModalOpen,
  setIsNewModalOpen,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected for Printable General Intake Sheet or Evaluation
  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null);
  const [printableGisRequest, setPrintableGisRequest] = useState<AssistanceRequest | null>(null);

  // AI State
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIAssessmentResult | null>(null);

  // New Intake Form
  const [formData, setFormData] = useState({
    constituentId: constituents[0]?.id || '',
    assistanceType: 'Medical Assistance' as AssistanceType,
    institution: 'Municipal District Hospital',
    requestedAmount: 5000,
    situationNotes: 'Urgent medical bills and maintenance prescription aid requested for chronic illness treatment.',
    socialWorkerAssigned: 'Grace Lim, RSW',
    checklist: {
      barangayIndigency: true,
      medicalCertificateOrHospitalBill: true,
      funeralContractOrDeathCertificate: false,
      schoolRegistrationOrID: false,
      validGovernmentID: true,
    },
  });

  const assistanceTypesList: AssistanceType[] = [
    'Medical Assistance',
    'Burial & Funeral Aid',
    'Educational Support',
    'Food & Non-Food Aid',
    'Transportation Aid',
    'Emergency Cash Aid',
  ];

  // Filtering
  const filteredRequests = assistanceRequests.filter((r) => {
    const matchesSearch =
      r.constituentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.barangay.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesType = typeFilter === 'All' || r.assistanceType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Call Server-side AI Assessment Endpoint
  const handleRunAiAssessment = async (requestToEvaluate: AssistanceRequest) => {
    setIsAiLoading(true);
    setAiResult(null);

    const targetConstituent = constituents.find((c) => c.id === requestToEvaluate.constituentId);

    try {
      const response = await fetch('/api/ai/assess-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          constituentName: requestToEvaluate.constituentName,
          sector: requestToEvaluate.sector,
          assistanceType: requestToEvaluate.assistanceType,
          monthlyIncome: targetConstituent?.monthlyIncome || 3000,
          familyMembersCount: targetConstituent?.householdMembers || 3,
          situationNotes: requestToEvaluate.situationNotes,
          requestedAmount: requestToEvaluate.requestedAmount,
          barangay: requestToEvaluate.barangay,
        }),
      });

      const data = await response.json();
      if (data.success && data.assessment) {
        setAiResult(data.assessment);

        // Update the request with AI result
        const updated = {
          ...requestToEvaluate,
          recommendedAmount: data.assessment.recommendedAmount || requestToEvaluate.requestedAmount,
          aiAssessment: data.assessment,
        };
        onUpdateRequest(updated);
        setSelectedRequest(updated);
      }
    } catch (error) {
      console.error('AI Assessment failed:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const constituentObj = constituents.find((c) => c.id === formData.constituentId) || constituents[0];

    const newRequest: AssistanceRequest = {
      id: `AICS-2026-${String(assistanceRequests.length + 101).padStart(4, '0')}`,
      constituentId: constituentObj.id,
      constituentName: constituentObj.fullName,
      barangay: constituentObj.barangay,
      sector: constituentObj.sector,
      assistanceType: formData.assistanceType,
      institution: formData.institution,
      requestedAmount: Number(formData.requestedAmount),
      recommendedAmount: Number(formData.requestedAmount) * 0.9, // default recommendation
      disbursedAmount: 0,
      dateRequested: new Date().toISOString().split('T')[0],
      status: 'Pending Intake',
      situationNotes: formData.situationNotes,
      socialWorkerAssigned: formData.socialWorkerAssigned,
      checklist: formData.checklist,
    };

    onAddRequest(newRequest);
    setIsNewModalOpen(false);
  };

  const handleStatusChange = (request: AssistanceRequest, newStatus: AssistanceStatus) => {
    const updated: AssistanceRequest = {
      ...request,
      status: newStatus,
      dateDisbursed: newStatus === 'Disbursed' ? new Date().toISOString().split('T')[0] : request.dateDisbursed,
      disbursedAmount: newStatus === 'Disbursed' ? (request.recommendedAmount || request.requestedAmount) : request.disbursedAmount,
    };
    onUpdateRequest(updated);
    if (selectedRequest?.id === request.id) {
      setSelectedRequest(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Control */}
      <div className="bg-white dark:bg-slate-900 rounded-sm p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>AICS Crisis Assistance & Financial Relief</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Assistance to Individuals in Crisis Situations &bull; DSWD / Municipal Intake
            </p>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Process New AICS Request</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Constituent Name, AICS ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Claim Statuses</option>
              <option value="Pending Intake">Pending Intake</option>
              <option value="Under Evaluation">Under Evaluation</option>
              <option value="Approved for Payment">Approved for Payment</option>
              <option value="Disbursed">Disbursed</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

          {/* Assistance Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Assistance Types</option>
              {assistanceTypesList.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AICS Intake Requests List */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-300 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Claim ID & Date</th>
                <th className="py-3 px-4">Beneficiary & Barangay</th>
                <th className="py-3 px-4">Assistance Category</th>
                <th className="py-3 px-4">Requested / Approved Aid</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Social Worker Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No AICS assistance claims found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const badge = getStatusBadge(req.status);
                  return (
                    <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">{req.id}</div>
                        <div className="text-[11px] text-slate-400">{formatDate(req.dateRequested)}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{req.constituentName}</div>
                        <div className="text-[11px] text-slate-500">Brgy. {req.barangay} &bull; <span className="font-semibold text-blue-600">{req.sector}</span></div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{req.assistanceType}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{req.institution}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {formatPeso(req.recommendedAmount || req.requestedAmount)}
                        </div>
                        {req.disbursedAmount > 0 && (
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            Disbursed: {formatPeso(req.disbursedAmount)}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badge.bg}`}>
                          {badge.text}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setAiResult(req.aiAssessment || null);
                            }}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                            <span>Evaluate Intake</span>
                          </button>

                          <button
                            onClick={() => setPrintableGisRequest(req)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium"
                            title="Print General Intake Sheet (GIS)"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Intake Details & AI Social Evaluation Tool */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl space-y-4 my-8">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold">AICS Social Intake Evaluation</h3>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">
                    {selectedRequest.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Assigned Social Worker: {selectedRequest.socialWorkerAssigned}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-1 hover:bg-slate-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-slate-800 dark:text-slate-200 text-xs">
              {/* Applicant Summary Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[11px]">Beneficiary Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedRequest.constituentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Assistance Type</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedRequest.assistanceType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Target Institution</span>
                  <span className="font-semibold">{selectedRequest.institution}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Requested Amount</span>
                  <span className="font-bold text-emerald-600">{formatPeso(selectedRequest.requestedAmount)}</span>
                </div>
              </div>

              {/* Intake Notes */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Social Worker Intake Situation Notes:</h4>
                <p className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 italic">
                  "{selectedRequest.situationNotes}"
                </p>
              </div>

              {/* AI Intake Evaluation Trigger Box */}
              <div className="bg-gradient-to-br from-blue-900/10 via-indigo-900/10 to-slate-900/10 p-5 rounded-2xl border-2 border-blue-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300 flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-blue-500" />
                      <span>Social Case Assessment Assistant</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Evaluates DSWD indigency criteria, crisis urgency level, recommended financial aid range, and document checklists.
                    </p>
                  </div>

                  <button
                    onClick={() => handleRunAiAssessment(selectedRequest)}
                    disabled={isAiLoading}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-md flex items-center gap-2 transition disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{isAiLoading ? 'Analyzing Case...' : 'Run Case Evaluation'}</span>
                  </button>
                </div>

                {/* AI Result Cards */}
                {aiResult && (
                  <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-900 dark:text-white">AI Eligibility Evaluation:</span>
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {aiResult.eligibilityStatus}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                      <strong>Social Assessment Summary:</strong> {aiResult.assessmentSummary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-[11px] text-slate-400 block font-semibold">Recommended Financial Aid (PHP)</span>
                        <span className="text-lg font-bold text-emerald-600">{formatPeso(aiResult.recommendedAmount)}</span>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-[11px] text-slate-400 block font-semibold">Crisis Urgency Rating</span>
                        <span className="text-sm font-bold text-amber-600">{aiResult.urgencyLevel}</span>
                      </div>
                    </div>

                    {/* Required Documents List */}
                    {aiResult.requiredDocuments && (
                      <div>
                        <span className="text-slate-500 font-semibold block mb-1">Required Verification Documents:</span>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-0.5">
                          {aiResult.requiredDocuments.map((doc, idx) => (
                            <li key={idx}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Update Claim Status:</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedRequest, 'Under Evaluation')}
                    className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 font-semibold rounded-lg"
                  >
                    Set Under Evaluation
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedRequest, 'Approved for Payment')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
                  >
                    Approve for Voucher Disbursement
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedRequest, 'Disbursed')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg"
                  >
                    Mark Funds Disbursed
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedRequest, 'Declined')}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold rounded-lg"
                  >
                    Decline Claim
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Printable General Intake Sheet (GIS) & Certificate of Indigency Recommendation */}
      {printableGisRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 my-8">
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-xs font-mono text-slate-500">Form MSWDO-AICS-GIS-2026</span>
              <button onClick={() => setPrintableGisRequest(null)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Official Municipal Document Header */}
            <div className="text-center space-y-1">
              <div className="text-[11px] uppercase tracking-widest text-slate-500 font-serif">Republic of the Philippines</div>
              <div className="text-xs uppercase tracking-wider font-bold text-slate-800">Province &bull; Municipality of San Lorenzo</div>
              <div className="text-sm font-extrabold text-blue-900 tracking-tight">OFFICE OF THE MUNICIPAL SOCIAL WELFARE & DEVELOPMENT</div>
              <div className="text-base font-serif font-bold text-slate-900 uppercase pt-2 border-t border-slate-300 mt-2">
                GENERAL INTAKE SHEET & SOCIAL WORKER RECOMMENDATION
              </div>
            </div>

            {/* General Intake Form Content */}
            <div className="space-y-4 text-xs font-serif leading-relaxed">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">Control No. / Date</span>
                  <span className="font-bold">{printableGisRequest.id} ({formatDate(printableGisRequest.dateRequested)})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">Beneficiary Name</span>
                  <span className="font-bold text-sm">{printableGisRequest.constituentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">Sector Category</span>
                  <span className="font-semibold">{printableGisRequest.sector}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">Barangay Address</span>
                  <span className="font-semibold">Brgy. {printableGisRequest.barangay}</span>
                </div>
              </div>

              <div>
                <h5 className="font-bold font-sans uppercase text-[11px] text-slate-700 mb-1">I. NATURE OF ASSISTANCE REQUESTED</h5>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 font-semibold text-blue-900">
                  {printableGisRequest.assistanceType} &bull; Target Institution: {printableGisRequest.institution}
                </div>
              </div>

              <div>
                <h5 className="font-bold font-sans uppercase text-[11px] text-slate-700 mb-1">II. SOCIAL WORKER CASE FINDINGS & INTAKE STATEMENT</h5>
                <p className="p-3 bg-slate-50 rounded border border-slate-200 italic">
                  "{printableGisRequest.situationNotes}"
                </p>
              </div>

              <div>
                <h5 className="font-bold font-sans uppercase text-[11px] text-slate-700 mb-1">III. FINANCIAL AID RECOMMENDATION</h5>
                <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 font-sans flex justify-between items-center">
                  <span>Recommended Disbursement Amount:</span>
                  <span className="text-lg font-bold">{formatPeso(printableGisRequest.recommendedAmount || printableGisRequest.requestedAmount)}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-2 gap-8 font-sans">
                <div className="text-center space-y-1">
                  <div className="border-b border-slate-800 pb-1 font-bold">{printableGisRequest.socialWorkerAssigned}</div>
                  <div className="text-[10px] text-slate-500">Municipal Social Worker / Case Manager</div>
                </div>

                <div className="text-center space-y-1">
                  <div className="border-b border-slate-800 pb-1 font-bold">HON. MUNICIPAL MAYOR / MSWDO HEAD</div>
                  <div className="text-[10px] text-slate-500">Approved for Municipal Treasurer Disbursement</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-500 flex items-center gap-2 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official General Intake Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Process New AICS Intake Sheet Form */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                <HeartHandshake className="w-5 h-5 text-blue-600" />
                <span>New AICS Crisis Assistance Intake</span>
              </h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Select Beneficiary</label>
                <select
                  value={formData.constituentId}
                  onChange={(e) => setFormData({ ...formData, constituentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {constituents.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.id}) &bull; Brgy. {c.barangay} [{c.sector}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Assistance Category</label>
                  <select
                    value={formData.assistanceType}
                    onChange={(e) => setFormData({ ...formData, assistanceType: e.target.value as AssistanceType })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {assistanceTypesList.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target Hospital / Partner Entity</label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Requested Financial Aid (PHP)</label>
                <input
                  type="number"
                  required
                  value={formData.requestedAmount}
                  onChange={(e) => setFormData({ ...formData, requestedAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Social Worker Intake Situation Notes</label>
                <textarea
                  rows={3}
                  required
                  value={formData.situationNotes}
                  onChange={(e) => setFormData({ ...formData, situationNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the medical crisis, funeral expenditure, or emergency situation..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-md"
                >
                  Submit Intake Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
