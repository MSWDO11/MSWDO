import React, { useState } from 'react';
import { 
  FileText, 
  FilePlus, 
  Printer, 
  X, 
  Download,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import { SocialCaseStudyReport, Constituent, AssistanceRequest } from '../types';
import { formatDate } from '../utils/formatters';

interface SocialCaseStudyReportsProps {
  reports: SocialCaseStudyReport[];
  constituents: Constituent[];
  assistanceRequests: AssistanceRequest[];
  onAddReport: (newReport: SocialCaseStudyReport) => void;
}

export const SocialCaseStudyReports: React.FC<SocialCaseStudyReportsProps> = ({
  reports,
  constituents,
  assistanceRequests,
  onAddReport,
}) => {
  const [selectedReportForPrint, setSelectedReportForPrint] = useState<SocialCaseStudyReport | null>(null);

  // AI Draft Modal State
  const [isAiDraftModalOpen, setIsAiDraftModalOpen] = useState<boolean>(false);
  const [selectedConstituentId, setSelectedConstituentId] = useState<string>(constituents[0]?.id || '');
  const [selectedIntakeId, setSelectedIntakeId] = useState<string>(assistanceRequests[0]?.id || '');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Download All SCSR Archive as CSV
  const handleDownloadAllCsv = () => {
    if (reports.length === 0) return;

    const headers = [
      'Report ID',
      'Constituent ID',
      'Constituent Name',
      'Date Created',
      'Title',
      'Problem Presented',
      'Family Background',
      'Evaluative Assessment',
      'Recommendation',
      'Social Worker Name',
      'Designation'
    ];

    const rows = reports.map((report) => {
      const constituent = constituents.find((c) => c.id === report.constituentId);
      return [
        `"${(report.id || '').replace(/"/g, '""')}"`,
        `"${(report.constituentId || '').replace(/"/g, '""')}"`,
        `"${(constituent?.fullName || report.constituentId || '').replace(/"/g, '""')}"`,
        `"${(report.dateCreated || '').replace(/"/g, '""')}"`,
        `"${(report.title || '').replace(/"/g, '""')}"`,
        `"${(report.problemPresented || '').replace(/"/g, '""')}"`,
        `"${(report.familyBackground || '').replace(/"/g, '""')}"`,
        `"${(report.evaluativeAssessment || '').replace(/"/g, '""')}"`,
        `"${(report.recommendation || '').replace(/"/g, '""')}"`,
        `"${(report.socialWorkerName || '').replace(/"/g, '""')}"`,
        `"${(report.caseWorkerSignatureTitle || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MSWDO_SCSR_Archive_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Single Report as CSV
  const handleDownloadSingleReportCsv = (report: SocialCaseStudyReport) => {
    const constituent = constituents.find((c) => c.id === report.constituentId);
    const headers = ['Field', 'Value'];
    const data = [
      ['Report ID', report.id],
      ['Date Created', report.dateCreated],
      ['Title', report.title],
      ['Constituent ID', report.constituentId],
      ['Constituent Name', constituent?.fullName || report.constituentId],
      ['Barangay', constituent?.barangay || ''],
      ['Problem Presented', report.problemPresented],
      ['Family Background', report.familyBackground],
      ['Evaluative Assessment', report.evaluativeAssessment],
      ['Recommendation', report.recommendation],
      ['Social Worker', report.socialWorkerName],
      ['Designation', report.caseWorkerSignatureTitle]
    ];

    const rows = data.map(([field, val]) => `"${field}","${(val || '').replace(/"/g, '""')}"`);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${report.id}_Case_Summary.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateScsrWithAi = async () => {
    const targetConstituent = constituents.find((c) => c.id === selectedConstituentId) || constituents[0];
    const targetIntake = assistanceRequests.find((a) => a.id === selectedIntakeId) || assistanceRequests[0];

    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/draft-social-case-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          constituent: targetConstituent,
          intake: targetIntake,
        }),
      });

      const data = await response.json();
      if (data.success && data.report) {
        const scsrObj: SocialCaseStudyReport = {
          id: `SCSR-2026-${String(reports.length + 101).padStart(4, '0')}`,
          constituentId: targetConstituent.id,
          intakeId: targetIntake.id,
          dateCreated: new Date().toISOString().split('T')[0],
          title: data.report.title || 'SOCIAL CASE STUDY REPORT',
          problemPresented: data.report.problemPresented || targetIntake.situationNotes,
          familyBackground: data.report.familyBackground || `Family resides in Brgy. ${targetConstituent.barangay} with monthly income of PHP ${targetConstituent.monthlyIncome}.`,
          evaluativeAssessment: data.report.evaluativeAssessment || 'Beneficiary meets the indigency criteria under MSWDO policies.',
          recommendation: data.report.recommendation || `Financial aid approval for PHP ${targetIntake.requestedAmount}.`,
          socialWorkerName: 'Grace Lim, RSW',
          caseWorkerSignatureTitle: data.report.caseWorkerSignatureTitle || 'Registered Social Worker (RSW) / Case Manager',
        };

        onAddReport(scsrObj);
        setIsAiDraftModalOpen(false);
        setSelectedReportForPrint(scsrObj);
      }
    } catch (error) {
      console.error('Failed to generate SCSR:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Control */}
      <div className="bg-white dark:bg-slate-900 rounded-sm p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Social Case Study Reports (SCSR Archive)</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive DSWD Case Assessments for Court, Hospital, and Municipal Mayor Subsidies
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadAllCsv}
              disabled={reports.length === 0}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700"
              title="Download all case reports as CSV spreadsheet"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Archive CSV</span>
            </button>

            <button
              onClick={() => setIsAiDraftModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition"
            >
              <FilePlus className="w-4 h-4 text-blue-200" />
              <span>Auto-Draft SCSR</span>
            </button>
          </div>
        </div>

        {/* Existing Reports List */}
        <div className="mt-6 space-y-3">
          {reports.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs italic">
              No Social Case Study Reports generated yet. Click 'AI Auto-Draft SCSR' above to create one.
            </div>
          ) : (
            reports.map((report) => {
              const constituent = constituents.find((c) => c.id === report.constituentId);
              return (
                <div
                  key={report.id}
                  className="p-5 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{report.title}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                        {report.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Beneficiary: <strong>{constituent?.fullName || report.constituentId}</strong> &bull; Date Created: {formatDate(report.dateCreated)}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                      "{report.problemPresented}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadSingleReportCsv(report)}
                      className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                      title="Download case report as CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>CSV</span>
                    </button>

                    <button
                      onClick={() => setSelectedReportForPrint(report)}
                      className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Printer className="w-4 h-4 text-blue-600" />
                      <span>View & Export PDF</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal: AI SCSR Generator */}
      {isAiDraftModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                <FilePlus className="w-5 h-5 text-blue-600" />
                <span>Generate Official Social Case Study Report</span>
              </h3>
              <button onClick={() => setIsAiDraftModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Select Beneficiary</label>
                <select
                  value={selectedConstituentId}
                  onChange={(e) => setSelectedConstituentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {constituents.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.id}) &bull; Brgy. {c.barangay}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Link to AICS Claim Intake</label>
                <select
                  value={selectedIntakeId}
                  onChange={(e) => setSelectedIntakeId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {assistanceRequests.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.assistanceType} ({a.id}) - Requested: PHP {a.requestedAmount}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-900 dark:text-blue-300 leading-relaxed text-[11px]">
                ⚡ AI will analyze household demographics, problem background, and DSWD case policies to synthesize a complete 5-part Social Case Study Report.
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAiDraftModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateScsrWithAi}
                  disabled={isGenerating}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isGenerating ? 'Synthesizing SCSR...' : 'Generate SCSR Document'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Printable SCSR Document & PDF Export */}
      {selectedReportForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-8 shadow-2xl space-y-6 my-8 font-serif leading-relaxed printable-scsr-document">
            <div className="flex justify-between items-center border-b pb-4 no-print">
              <span className="text-xs font-mono text-slate-500">{selectedReportForPrint.id}</span>
              <button onClick={() => setSelectedReportForPrint(null)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Document Header */}
            <div className="text-center space-y-1">
              <div className="text-xs uppercase tracking-widest text-slate-500 font-sans">Republic of the Philippines &bull; Province of Oriental Mindoro</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800 font-sans">MUNICIPAL GOVERNMENT OF BANSUD</div>
              <div className="text-sm font-extrabold text-blue-900 tracking-tight font-sans">
                OFFICE OF THE MUNICIPAL SOCIAL WELFARE & DEVELOPMENT
              </div>
              <div className="text-base font-bold text-slate-900 uppercase pt-3 border-t border-slate-300 mt-2 font-sans">
                {selectedReportForPrint.title}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-5 text-xs">
              <div>
                <h5 className="font-bold uppercase font-sans text-blue-900 text-[11px] border-b pb-1 mb-1">I. PROBLEM PRESENTED</h5>
                <p className="p-3 bg-slate-50 rounded border text-slate-800">{selectedReportForPrint.problemPresented}</p>
              </div>

              <div>
                <h5 className="font-bold uppercase font-sans text-blue-900 text-[11px] border-b pb-1 mb-1">II. FAMILY BACKGROUND & ECONOMIC CONDITION</h5>
                <p className="p-3 bg-slate-50 rounded border text-slate-800">{selectedReportForPrint.familyBackground}</p>
              </div>

              <div>
                <h5 className="font-bold uppercase font-sans text-blue-900 text-[11px] border-b pb-1 mb-1">III. EVALUATIVE ASSESSMENT</h5>
                <p className="p-3 bg-slate-50 rounded border text-slate-800">{selectedReportForPrint.evaluativeAssessment}</p>
              </div>

              <div>
                <h5 className="font-bold uppercase font-sans text-blue-900 text-[11px] border-b pb-1 mb-1">IV. SPECIFIC RECOMMENDATIONS</h5>
                <p className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-950 font-semibold">{selectedReportForPrint.recommendation}</p>
              </div>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-2 gap-8 font-sans">
                <div className="text-center space-y-1">
                  <div className="border-b border-slate-800 pb-1 font-bold">{selectedReportForPrint.socialWorkerName}</div>
                  <div className="text-[10px] text-slate-500">{selectedReportForPrint.caseWorkerSignatureTitle}</div>
                </div>

                <div className="text-center space-y-1">
                  <div className="border-b border-slate-800 pb-1 font-bold">APPROVED BY MUNICIPAL MAYOR</div>
                  <div className="text-[10px] text-slate-500">Chief Executive / Disbursing Authority</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t font-sans no-print">
              <button
                onClick={() => handleDownloadSingleReportCsv(selectedReportForPrint)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-300 transition"
              >
                <FileDown className="w-4 h-4 text-emerald-600" />
                <span>Export CSV Data</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-500 flex items-center gap-2 shadow-md transition"
              >
                <Printer className="w-4 h-4" />
                <span>Export PDF / Print Official Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
