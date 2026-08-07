import React from 'react';
import { Lock, ShieldCheck, LogIn, ArrowLeft, Building2, Users, HeartHandshake, ShieldAlert, FileText } from 'lucide-react';

interface ProtectedAccessBarrierProps {
  tabName: string;
  onOpenAuthModal: () => void;
  onReturnHome: () => void;
}

export const ProtectedAccessBarrier: React.FC<ProtectedAccessBarrierProps> = ({
  tabName,
  onOpenAuthModal,
  onReturnHome,
}) => {
  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Executive Dashboard & Analytics';
      case 'constituents': return 'Beneficiary Masterlist & OSCA/PWD Records';
      case 'aics': return 'AICS Financial Assistance & Intake Manager';
      case 'sectoral': return 'Sectoral Welfare Services';
      case 'disaster': return 'Disaster Relief & Evacuation Management';
      case 'queue': return 'Helpdesk & Priority Kiosk Queue';
      case 'reports': return 'Social Case Study Reports (SCSR)';
      case 'framework': return 'System Framework & Guidelines';
      case 'logs': return 'Audit & Activity Logs';
      case 'profile': return 'Staff User Profile';
      default: return 'Internal Staff Portal';
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 text-center sm:text-left">
        
        {/* Header Icon & Title */}
        <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              Protected Staff Access Gate
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Sign In Required for {getTabLabel(tabName)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Internal MSWDO social welfare management records are restricted to authorized municipality social workers and staff.
            </p>
          </div>
        </div>

        {/* Security / Compliance Info Box */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Why sign in is mandatory:
          </h3>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
              <span><strong>Data Privacy Protection:</strong> Protect sensitive indigent beneficiary records, OSCA/PWD ID details, and monthly financial aid history.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
              <span><strong>Audit & Accountability:</strong> Maintain DSWD-compliant audit logs for all financial disbursals and Social Case Study Reports (SCSR).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
              <span><strong>Case Manager Authorization:</strong> Only licensed social workers (RSW) may approve AICS assistance vouchers and disaster relief distributions.</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={onReturnHome}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Home Page</span>
          </button>

          <button
            onClick={onOpenAuthModal}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Staff Register</span>
          </button>
        </div>

      </div>
    </div>
  );
};
