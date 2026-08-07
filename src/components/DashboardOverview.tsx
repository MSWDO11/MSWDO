import React, { useState, useEffect } from 'react';
import { 
  Users, 
  HeartHandshake, 
  Clock, 
  ShieldAlert, 
  Plus, 
  ShieldCheck,
  QrCode, 
  ArrowUpRight, 
  FileCheck2, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  Award,
  ChevronRight,
  PackageCheck,
  BarChart3,
  PieChart as PieIcon,
  Download,
  History,
  FileSpreadsheet,
  BookOpen,
  UserCheck,
  UserPlus,
  Building2,
  Ticket,
  FileText,
  Sparkles,
  Phone,
  MapPin,
  CreditCard,
  Lock,
  Shield,
  User,
  Sliders,
  FileCheck,
  Info,
  Calendar,
  ExternalLink,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';
import { Constituent, AssistanceRequest, DisasterReliefEvent, QueueTicket, SocialCaseStudyReport, ActivityLog, UserProfile, UserRole } from '../types';
import { formatPeso, formatDate, getStatusBadge } from '../utils/formatters';

interface DashboardOverviewProps {
  constituents: Constituent[];
  assistanceRequests: AssistanceRequest[];
  disasterEvents: DisasterReliefEvent[];
  queueTickets: QueueTicket[];
  reports?: SocialCaseStudyReport[];
  activityLogs?: ActivityLog[];
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenNewIntakeModal: () => void;
  onOpenRegisterConstituentModal: () => void;
  onOpenQuickScan: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  constituents,
  assistanceRequests,
  disasterEvents,
  queueTickets,
  reports = [],
  activityLogs = [],
  currentUser,
  onOpenAuthModal,
  onNavigateTab,
  onOpenNewIntakeModal,
  onOpenRegisterConstituentModal,
  onOpenQuickScan,
}) => {
  // Determine initial view role mode
  const getInitialRoleView = (): 'admin' | 'staff' | 'beneficiary' => {
    if (!currentUser) return 'staff';
    if (currentUser.role === 'Admin / Municipal Administrator') return 'admin';
    if (currentUser.role === 'Constituent / Beneficiary') return 'beneficiary';
    return 'staff';
  };

  const [activeRoleView, setActiveRoleView] = useState<'admin' | 'staff' | 'beneficiary'>(getInitialRoleView());
  const [chartViewMode, setChartViewMode] = useState<'type' | 'barangay'>('type');

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'Admin / Municipal Administrator') setActiveRoleView('admin');
      else if (currentUser.role === 'Constituent / Beneficiary') setActiveRoleView('beneficiary');
      else setActiveRoleView('staff');
    }
  }, [currentUser]);

  // Global Key Metrics
  const totalConstituents = constituents.length;
  const totalSeniors = constituents.filter((c) => c.sector === 'Senior Citizen').length;
  const totalPWDs = constituents.filter((c) => c.sector === 'PWD').length;
  const totalSoloParents = constituents.filter((c) => c.sector === 'Solo Parent').length;
  const totalIndigents = constituents.filter((c) => c.sector === 'Indigent / 4Ps').length;

  const totalAicsDisbursed = assistanceRequests.reduce(
    (acc, curr) => acc + (curr.disbursedAmount || 0),
    0
  );

  const pendingRequests = assistanceRequests.filter(
    (r) => r.status === 'Pending Intake' || r.status === 'Under Evaluation'
  );

  const activeDisaster = disasterEvents.find((d) => d.status === 'Active Response');
  const activeEvacueeFamilies = activeDisaster
    ? activeDisaster.evacuationCenters.reduce((acc, c) => acc + c.currentFamilies, 0)
    : 0;

  const waitingQueue = queueTickets.filter((q) => q.status === 'Waiting');
  const priorityWaiting = waitingQueue.filter((q) => q.category.includes('Priority')).length;

  // Chart Data 1: Aid Disbursed by Assistance Type
  const aidByTypeMap: Record<string, number> = {};
  assistanceRequests.forEach((req) => {
    const type = req.assistanceType || 'General Financial Aid';
    aidByTypeMap[type] = (aidByTypeMap[type] || 0) + (req.disbursedAmount || req.recommendedAmount || 0);
  });

  const aidByTypeData = Object.keys(aidByTypeMap).map((type) => ({
    name: type.replace(' Medical Assistance', '').replace(' Assistance', ''),
    amount: aidByTypeMap[type],
  }));

  // Chart Data 2: Beneficiaries by Barangay
  const barangayMap: Record<string, number> = {};
  constituents.forEach((c) => {
    const bgy = c.barangay ? `Brgy. ${c.barangay}` : 'Other';
    barangayMap[bgy] = (barangayMap[bgy] || 0) + 1;
  });

  const barangayData = Object.keys(barangayMap).map((bgy) => ({
    name: bgy,
    count: barangayMap[bgy],
  }));

  // Chart Data 3: Sectoral Pie Chart
  const sectorPieData = [
    { name: 'Senior Citizens', value: totalSeniors, color: '#f59e0b' },
    { name: 'PWDs', value: totalPWDs, color: '#3b82f6' },
    { name: 'Solo Parents', value: totalSoloParents, color: '#a855f7' },
    { name: '4Ps & Indigents', value: totalIndigents, color: '#10b981' },
    { name: 'Others', value: Math.max(0, totalConstituents - (totalSeniors + totalPWDs + totalSoloParents + totalIndigents)), color: '#64748b' }
  ].filter(d => d.value > 0);

  // Beneficiary specific data filtering — only match the logged-in user's own record
  const myConstituentRecord = constituents.find(
    (c) =>
      (currentUser?.employeeOrBeneficiaryId && c.idNumber === currentUser.employeeOrBeneficiaryId) ||
      (currentUser?.fullName && c.fullName.toLowerCase() === currentUser.fullName.toLowerCase())
  ) || null;

  const myAssistanceRequests = myConstituentRecord
    ? assistanceRequests.filter(
        (r) => r.constituentId === myConstituentRecord.id
      )
    : [];

  const myQueueTicket = myConstituentRecord
    ? queueTickets.find((q) => q.constituentName.toLowerCase() === myConstituentRecord.fullName.toLowerCase())
    : null;

  // Export Executive Summary CSV
  const handleExportExecutiveSummary = () => {
    const headers = ['Metric', 'Value'];
    const summaryRows = [
      ['Total Registered Constituents', totalConstituents],
      ['Senior Citizens (OSCA)', totalSeniors],
      ['Persons with Disability (PWD)', totalPWDs],
      ['Solo Parents (RA 11861)', totalSoloParents],
      ['4Ps & Indigent Families', totalIndigents],
      ['Total AICS Aid Disbursed (PHP)', totalAicsDisbursed],
      ['Pending AICS Intake Requests', pendingRequests.length],
      ['Social Case Study Reports Generated', reports.length],
      ['Walk-in Queue Waiting Tickets', waitingQueue.length],
      ['Priority Lane Waiting', priorityWaiting]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...summaryRows.map(r => `"${r[0]}","${r[1]}"`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MSWDO_Executive_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Role Dashboard Mode Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {activeRoleView === 'admin' ? '👑' : activeRoleView === 'staff' ? '💼' : '👤'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {activeRoleView === 'admin' ? 'Admin Executive Command Center' : activeRoleView === 'staff' ? 'Staff Operational Workstation' : 'Beneficiary / Citizen Portal'}
              </h2>
              <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-sm ${
                activeRoleView === 'admin' 
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300' 
                  : activeRoleView === 'staff'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
              }`}>
                {currentUser?.role || (activeRoleView === 'admin' ? 'Admin Access' : activeRoleView === 'staff' ? 'Staff Access' : 'Beneficiary Access')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {currentUser ? `Logged in as: ${currentUser.fullName} (${currentUser.assignedBarangay})` : 'Select a dashboard persona below or sign in to switch account roles.'}
            </p>
          </div>
        </div>

        {/* View Switcher — only visible to Admin */}
        {currentUser?.role === 'Admin / Municipal Administrator' && (
          <div className="flex flex-wrap items-center gap-2 max-w-full">
            <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 flex flex-wrap sm:flex-nowrap items-center text-xs max-w-full overflow-x-auto">
              <button
                onClick={() => setActiveRoleView('admin')}
                className={`px-2.5 sm:px-3 py-1.5 font-bold text-[10px] sm:text-[11px] uppercase rounded-sm transition flex items-center gap-1.5 ${
                  activeRoleView === 'admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => setActiveRoleView('staff')}
                className={`px-2.5 sm:px-3 py-1.5 font-bold text-[10px] sm:text-[11px] uppercase rounded-sm transition flex items-center gap-1.5 ${
                  activeRoleView === 'staff'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                <span>Staff</span>
              </button>
              <button
                onClick={() => setActiveRoleView('beneficiary')}
                className={`px-2.5 sm:px-3 py-1.5 font-bold text-[10px] sm:text-[11px] uppercase rounded-sm transition flex items-center gap-1.5 ${
                  activeRoleView === 'beneficiary'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Beneficiary</span>
              </button>
            </div>

            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-1.5 transition"
                title="Switch Account Role / Sign In"
              >
                <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden lg:inline">Accounts</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          VIEW 1: ADMIN DASHBOARD (Executive Municipal Command & Audit)
         ========================================================================= */}
      {activeRoleView === 'admin' && (
        <div className="space-y-6 animate-fade-in">
          {/* Admin Header Banner */}
          <div className="bg-slate-900 text-white rounded-sm p-6 border border-slate-800 relative overflow-hidden shadow-sm">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-300 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm border border-purple-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Executive Municipal Administration & Portal Governance</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                  MSWDO Municipal Governance & Financial Command Center
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Full system oversight: budget allocations, executive financial audits, staff user account authorization, and cross-barangay disaster response controls.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportExecutiveSummary}
                  className="px-3.5 py-2.5 bg-purple-900/80 hover:bg-purple-800 text-purple-100 rounded-sm text-xs font-bold uppercase tracking-wider border border-purple-700 flex items-center gap-2 transition"
                >
                  <FileSpreadsheet className="w-4 h-4 text-purple-300" />
                  <span>Export Executive Audit</span>
                </button>
                <button
                  onClick={() => onNavigateTab('framework')}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-2 transition"
                >
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>System Framework</span>
                </button>
                <button
                  onClick={() => onNavigateTab('logs')}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-2 transition"
                >
                  <History className="w-4 h-4 text-emerald-400" />
                  <span>Security Audit Logs</span>
                </button>
              </div>
            </div>
          </div>

          {/* Admin KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 border-l-2 border-l-purple-600 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total AICS Disbursed</span>
                <div className="w-8 h-8 rounded-sm bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-mono">
                  <HeartHandshake className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{formatPeso(totalAicsDisbursed)}</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Total Crisis Relief Grants Disbursed</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 border-l-2 border-l-blue-600 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Masterlist Population</span>
                <div className="w-8 h-8 rounded-sm bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalConstituents}</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Across 12 Municipal Barangays</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 border-l-2 border-l-emerald-600 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Audit Logs</span>
                <div className="w-8 h-8 rounded-sm bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono">
                  <History className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{activityLogs.length} Actions</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Encrypted Security Log Entries</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 border-l-2 border-l-amber-500 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Social Case Studies</span>
                <div className="w-8 h-8 rounded-sm bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{reports.length} Reports</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Official Case Studies Generated</p>
              </div>
            </div>
          </div>

          {/* Admin Management Section: System Staff & Roles Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>System User Accounts & Authorization Roles</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Registered municipal staff, social workers, and beneficiary accounts</p>
                </div>
                {onOpenAuthModal && (
                  <button
                    onClick={onOpenAuthModal}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create / Register User</span>
                  </button>
                )}
              </div>

              {/* Accounts Directory */}
              <div className="space-y-2">
                {[
                  { name: 'Admin Officer / Municipal Administrator', email: 'admin@mswdo.gov.ph', role: 'Admin / Municipal Administrator', bgy: 'Municipal Main Office', id: 'MSWDO-ADM-2026-001' },
                  { name: 'Mrs. Maria Santos, RSW', email: 'm.santos@mswdo.gov.ph', role: 'Head Social Welfare Officer', bgy: 'Municipal Main Office', id: 'MSWDO-EMP-2024-001' },
                  { name: 'Juan Dela Cruz, RSW', email: 'j.delacruz@mswdo.gov.ph', role: 'Social Worker / Case Manager', bgy: 'Poblacion 1', id: 'MSWDO-EMP-2025-042' },
                  { name: 'Ana Reyes', email: 'a.reyes@sanisidro.gov.ph', role: 'Barangay Focal Person', bgy: 'San Isidro', id: 'BGY-FP-2025-009' },
                  { name: 'Lourdes Ramos (OSCA Senior)', email: 'lourdes.ramos@gmail.com', role: 'Constituent / Beneficiary', bgy: 'Santa Maria', id: 'OSCA-2026-0812' }
                ].map((u) => (
                  <div key={u.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-sm border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{u.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                            {u.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {u.email} &bull; {u.bgy}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 shrink-0 self-start sm:self-auto">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Audit Feed */}
            <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-500" />
                  <span>Real-time Audit Logs</span>
                </h3>
                <button
                  onClick={() => onNavigateTab('logs')}
                  className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Full Trail
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {activityLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-sm border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">{log.action} &bull; {log.module}</span>
                      <span className="text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                      {log.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Financial Aid & Barangay Population Analytics</span>
                </h3>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-sm border border-slate-200 dark:border-slate-700 text-xs">
                  <button
                    onClick={() => setChartViewMode('type')}
                    className={`px-3 py-1 font-bold text-[10px] uppercase rounded-sm transition ${
                      chartViewMode === 'type' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    By Type
                  </button>
                  <button
                    onClick={() => setChartViewMode('barangay')}
                    className={`px-3 py-1 font-bold text-[10px] uppercase rounded-sm transition ${
                      chartViewMode === 'barangay' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    By Barangay
                  </button>
                </div>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chartViewMode === 'type' ? (
                    <BarChart data={aidByTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(val) => `₱${val / 1000}k`} />
                      <Tooltip formatter={(value: any) => [`₱${Number(value).toLocaleString()}`, 'Disbursed Amount']} />
                      <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <BarChart data={barangayData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip formatter={(value: any) => [`${value} Citizens`, 'Registered Beneficiaries']} />
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sector Demographics Donut */}
            <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-amber-500" />
                  <span>Sectoral Demographics</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Special population sectors in municipality</p>

                <div className="h-48 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sectorPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                        {sectorPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-100 dark:border-slate-800 pt-3">
                {sectorPieData.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                    <span className="truncate">{s.name}: {s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: STAFF DASHBOARD (Social Worker / Case Manager Workstation)
         ========================================================================= */}
      {activeRoleView === 'staff' && (
        <div className="space-y-6 animate-fade-in">
          {/* Welcome & Operational Banner */}
          <div className="bg-slate-900 rounded-sm p-6 border border-slate-800 text-white relative overflow-hidden shadow-sm">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm border border-blue-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>MSWDO Staff Case Workstation &bull; Operational Portal</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                  Social Welfare & Case Evaluation Workstation
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Evaluate AICS crisis intakes, conduct social case studies (SCSR), register new constituents with OSCA/PWD IDs, and manage walk-in helpdesk queue tickets.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={onOpenNewIntakeModal}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4 text-blue-200" />
                  <span>Process AICS Intake</span>
                </button>
                <button
                  onClick={onOpenRegisterConstituentModal}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-2 transition"
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Register Constituent</span>
                </button>
                <button
                  onClick={onOpenQuickScan}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-2 transition"
                  title="Scan QR Code ID"
                >
                  <QrCode className="w-4 h-4 text-sky-400" />
                  <span>QR Scan</span>
                </button>
              </div>
            </div>

            {activeDisaster && (
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>
                    <strong>ACTIVE DISASTER RESPONSE:</strong> {activeDisaster.eventName} ({activeEvacueeFamilies} Families in Evacuation)
                  </span>
                </div>
                <button
                  onClick={() => onNavigateTab('disaster')}
                  className="text-blue-400 hover:text-blue-300 font-bold uppercase text-[11px] tracking-wider flex items-center gap-1 underline"
                >
                  <span>Relief Desk</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Staff Workload KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 border-l-2 border-l-amber-500 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Intake Reviews</span>
                <div className="w-8 h-8 rounded-sm bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{pendingRequests.length}</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Awaiting Social Worker Evaluation</p>
              </div>
              <button
                onClick={() => onNavigateTab('aics')}
                className="mt-3 text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                <span>Evaluate Intakes</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 border-l-2 border-l-purple-600 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Walk-in Queue Waiting</span>
                <div className="w-8 h-8 rounded-sm bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-mono">
                  <Ticket className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{waitingQueue.length} Tickets</div>
                <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">{priorityWaiting} Priority Lane tickets</p>
              </div>
              <button
                onClick={() => onNavigateTab('queue')}
                className="mt-3 text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                <span>Call Next Ticket</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 border-l-2 border-l-blue-600 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Case Reports (SCSR)</span>
                <div className="w-8 h-8 rounded-sm bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{reports.length} Reports</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Official Social Case Studies</p>
              </div>
              <button
                onClick={() => onNavigateTab('reports')}
                className="mt-3 text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                <span>Draft SCSR Study</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 border-l-2 border-l-emerald-600 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered Citizens</span>
                <div className="w-8 h-8 rounded-sm bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalConstituents}</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Masterlist Profiles Enrolled</p>
              </div>
              <button
                onClick={() => onNavigateTab('constituents')}
                className="mt-3 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                <span>Browse Registry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main Content Grid: Recent Intakes Stream & Walk-in Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Recent AICS Crisis Claims Queue</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Intakes requiring social worker verification, recommendation, and disbursal clearance</p>
                </div>
                <button
                  onClick={() => onNavigateTab('aics')}
                  className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>View All ({assistanceRequests.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {assistanceRequests.slice(0, 5).map((req) => {
                  const badge = getStatusBadge(req.status);
                  return (
                    <div
                      key={req.id}
                      className="p-4 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">{req.constituentName}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                            {req.id}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                            {req.sector}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          <strong className="text-slate-800 dark:text-slate-200">{req.assistanceType}</strong> &bull; Brgy. {req.barangay} &bull; {req.institution}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                          "{req.situationNotes}"
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                        <div className="text-right">
                          <div className="text-xs font-black text-slate-900 dark:text-white font-mono">
                            {formatPeso(req.recommendedAmount || req.requestedAmount)}
                          </div>
                          <div className="text-[10px] text-slate-400">Req: {formatDate(req.dateRequested)}</div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${badge.bg}`}>
                          {badge.text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Helpdesk Queue Widget */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Live Helpdesk Queue</span>
                  </h3>
                  <button
                    onClick={() => onNavigateTab('queue')}
                    className="text-[11px] font-bold uppercase text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Open Desk
                  </button>
                </div>

                <div className="space-y-3">
                  {queueTickets.slice(0, 4).map((ticket) => (
                    <div key={ticket.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-mono font-black text-sm text-purple-600 dark:text-purple-400">{ticket.ticketNumber}</div>
                        <div className="font-semibold text-slate-900 dark:text-white">{ticket.constituentName}</div>
                        <div className="text-[10px] text-slate-500">{ticket.purpose}</div>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm ${
                        ticket.status === 'In Desk' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: BENEFICIARY / CITIZEN DASHBOARD (Personal Citizen Portal)
         ========================================================================= */}
      {activeRoleView === 'beneficiary' && (
        <div className="space-y-6 animate-fade-in">
          {/* Beneficiary Portal Welcome Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white rounded-sm p-6 border border-emerald-900/60 shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-300 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm border border-emerald-500/30">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Citizen Beneficiary Portal &bull; MSWDO LGU</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold uppercase text-white tracking-tight">
                  Welcome, {currentUser?.fullName || 'Citizen'}!
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Track your AICS assistance claims, access your digital OSCA/PWD/Solo Parent QR ID, monitor walk-in helpdesk queue tickets, and view municipal social welfare guidelines.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={onOpenNewIntakeModal}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4 text-emerald-100" />
                  <span>Request AICS Assistance</span>
                </button>
                <button
                  onClick={onOpenQuickScan}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-2 transition"
                >
                  <QrCode className="w-4 h-4 text-sky-400" />
                  <span>Show My QR ID</span>
                </button>
              </div>
            </div>
          </div>

          {/* Citizen Main Grid: Digital ID Card & Assistance Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Digital ID Card Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Digital Citizen ID Card</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded font-bold">
                  VERIFIED
                </span>
              </div>

              {/* ID Card Display Frame */}
              {myConstituentRecord ? (
              <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-sm border border-slate-800 space-y-4 shadow-md relative overflow-hidden">
                <div className="flex items-start justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="text-[9px] font-bold tracking-widest text-emerald-400 uppercase">MUNICIPALITY OF MSWDO</div>
                    <div className="text-xs font-extrabold uppercase text-white">{myConstituentRecord.sector} CARD</div>
                  </div>
                  <div className="w-7 h-7 bg-emerald-600 rounded flex items-center justify-center font-black text-white text-xs">
                    M
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 font-mono">CITIZEN NAME</div>
                    <div className="font-extrabold text-sm text-white uppercase">{myConstituentRecord.fullName}</div>
                    <div className="text-[11px] text-slate-300">Brgy. {myConstituentRecord.barangay} &bull; Age {myConstituentRecord.age}</div>
                  </div>

                  {/* QR Code graphic */}
                  <div className="p-2 bg-white rounded shadow-sm text-slate-950 shrink-0">
                    <QrCode className="w-10 h-10" />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>ID #: {myConstituentRecord.idNumber}</span>
                  <span>REG: {myConstituentRecord.registeredDate}</span>
                </div>
              </div>
              ) : (
              <div className="p-5 bg-slate-800/60 rounded-sm border border-dashed border-slate-700 text-center space-y-3">
                <CreditCard className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">Your beneficiary profile is not yet linked to this account.</p>
                <p className="text-[11px] text-slate-500">Please visit the MSWDO office to register your OSCA/PWD/Solo Parent ID so it can be linked to your portal account.</p>
              </div>
              )}

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-sm border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  <span>Municipal Identification Clearance</span>
                </div>
                <p className="text-[11px]">
                  Present this QR ID at the municipal hall kiosk or barangay health center for instant walk-in intake & priority desk routing.
                </p>
              </div>
            </div>

            {/* My AICS Assistance Requests Stream */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>My AICS Crisis Assistance Claims & Tracker</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Real-time status tracking for medical, burial, educational, and crisis financial aid</p>
                </div>
                <button
                  onClick={onOpenNewIntakeModal}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Request</span>
                </button>
              </div>

              {myAssistanceRequests.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-sm space-y-3">
                  <HeartHandshake className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>You have no pending or past AICS assistance requests recorded in the portal.</p>
                  <button
                    onClick={onOpenNewIntakeModal}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-sm text-xs font-bold uppercase inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Apply for AICS Aid Now</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myAssistanceRequests.map((req) => {
                    const badge = getStatusBadge(req.status);
                    return (
                      <div
                        key={req.id}
                        className="p-5 rounded-sm border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 dark:text-white text-sm">{req.assistanceType}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-bold">
                                {req.id}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Hospital / Provider: <strong>{req.institution}</strong> &bull; Date Filed: {formatDate(req.dateRequested)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm ${badge.bg}`}>
                              {badge.text}
                            </span>
                          </div>
                        </div>

                        {/* Status Stepper Tracker */}
                        <div className="grid grid-cols-4 gap-2 pt-1 text-[10px] font-bold uppercase text-center">
                          <div className="p-2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                            1. Intake Submitted
                          </div>
                          <div className={`p-2 rounded border ${
                            req.status !== 'Pending Intake' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 border-slate-300'
                          }`}>
                            2. Case Worker Review
                          </div>
                          <div className={`p-2 rounded border ${
                            req.status === 'Approved for Payment' || req.status === 'Disbursed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 border-slate-300'
                          }`}>
                            3. Aid Approved
                          </div>
                          <div className={`p-2 rounded border ${
                            req.status === 'Disbursed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 border-slate-300'
                          }`}>
                            4. Cash Disbursed
                          </div>
                        </div>

                        <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Approved / Recommended Amount:</span>
                          <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                            {formatPeso(req.disbursedAmount || req.recommendedAmount || req.requestedAmount)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: My Walk-in Queue Ticket & Municipal Hotlines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>My Active Walk-in Queue Ticket</span>
                </h3>
                <button
                  onClick={() => onNavigateTab('queue')}
                  className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Get Queue Kiosk Ticket
                </button>
              </div>

              {myQueueTicket ? (
                <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-sm border border-purple-200 dark:border-purple-900 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-black text-2xl text-purple-700 dark:text-purple-300">{myQueueTicket.ticketNumber}</div>
                    <div className="text-slate-600 dark:text-slate-300 font-semibold">{myQueueTicket.purpose}</div>
                    <div className="text-[11px] text-slate-500">Assigned Desk: Desk #{myQueueTicket.deskAssigned || 1}</div>
                  </div>
                  <span className="px-3 py-1 bg-purple-600 text-white font-bold uppercase text-xs rounded-sm shadow-xs">
                    {myQueueTicket.status}
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-sm border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 space-y-2">
                  <p>You currently do not have an active walk-in helpdesk queue ticket.</p>
                  <button
                    onClick={() => onNavigateTab('queue')}
                    className="px-3 py-1.5 bg-purple-600 text-white font-bold uppercase text-[11px] rounded-sm inline-flex items-center gap-1"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Get Queue Ticket for Today</span>
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>Municipal Assistance Hotlines</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-sm border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white">MSWDO Main Hotline</div>
                  <div className="font-mono text-blue-600 dark:text-blue-400 font-semibold">(02) 8888-0192</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-sm border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white">MDRRMO Disaster Unit</div>
                  <div className="font-mono text-rose-600 dark:text-rose-400 font-semibold">0917-911-9111</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
