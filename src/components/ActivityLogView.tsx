import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  UserCheck, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  Clock,
  Layers
} from 'lucide-react';
import { ActivityLog } from '../types';

interface ActivityLogViewProps {
  logs: ActivityLog[];
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [selectedAction, setSelectedAction] = useState<string>('All');

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.targetId && log.targetId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.performedBy && log.performedBy.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesModule = selectedModule === 'All' || log.module === selectedModule;
    const matchesAction = selectedAction === 'All' || log.action === selectedAction;

    return matchesSearch && matchesModule && matchesAction;
  });

  // Export CSV function
  const handleExportCsv = () => {
    if (logs.length === 0) return;

    const headers = ['Log ID', 'Timestamp', 'Action', 'Module', 'Description', 'Target ID', 'Performed By'];
    const rows = filteredLogs.map((log) => [
      `"${log.id}"`,
      `"${new Date(log.timestamp).toLocaleString()}"`,
      `"${log.action}"`,
      `"${log.module}"`,
      `"${log.description.replace(/"/g, '""')}"`,
      `"${log.targetId || ''}"`,
      `"${log.performedBy || 'Duty Social Worker'}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MSWDO_Activity_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: ActivityLog['action']) => {
    switch (action) {
      case 'CREATE':
        return { bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800', label: 'CREATE' };
      case 'UPDATE':
        return { bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800', label: 'UPDATE' };
      case 'DISBURSE':
        return { bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-800', label: 'DISBURSE' };
      case 'EVALUATE':
        return { bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800', label: 'EVALUATE' };
      case 'CLEAR':
        return { bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800', label: 'CLEAR ALL' };
      default:
        return { bg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700', label: action };
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = logs.filter((l) => l.timestamp.startsWith(todayStr)).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
              <History className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Audit & Activity Logs
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Real-time immutable system audit trail tracking beneficiary intakes, AICS updates, disbursements, and social case evaluations for complete municipal transparency.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={logs.length === 0}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Audit Trail (CSV)</span>
        </button>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Audit Records</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{logs.length}</div>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-sm text-slate-600 dark:text-slate-300">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's System Actions</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">{todayCount}</div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-sm text-blue-600 dark:text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Governance</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real-Time Cloud Audit Active</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-sm text-emerald-600 dark:text-emerald-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search log description, ID, or social worker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Module:</span>
          </div>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Modules</option>
            <option value="Constituents">Constituents</option>
            <option value="AICS Assistance">AICS Assistance</option>
            <option value="Disaster Relief">Disaster Relief</option>
            <option value="Queue">Queue</option>
            <option value="Reports">Reports</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider ml-2">
            <span>Action:</span>
          </div>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DISBURSE">DISBURSE</option>
            <option value="EVALUATE">EVALUATE</option>
            <option value="CLEAR">CLEAR</option>
          </select>
        </div>
      </div>

      {/* Activity Log List */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs italic">
            No activity log entries found matching the specified filters.
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredLogs.map((log) => {
              const badge = getActionBadge(log.action);
              const formattedDate = new Date(log.timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });

              return (
                <div 
                  key={log.id} 
                  className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {log.module}
                      </span>
                      {log.targetId && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                          ID: {log.targetId}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {log.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-slate-400" />
                        <span>By: <strong>{log.performedBy || 'Duty Social Worker'}</strong></span>
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
                      {formattedDate}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Ref: {log.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
