import React from 'react';
import { 
  BookOpen, 
  Target, 
  Layers, 
  Workflow, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  HeartHandshake, 
  FileText, 
  ArrowRight,
  Zap,
  Database,
  Lock,
  Bell,
  Smartphone
} from 'lucide-react';

interface SystemFrameworkViewProps {
  onNavigateTab: (tab: string) => void;
}

export const SystemFrameworkView: React.FC<SystemFrameworkViewProps> = ({ onNavigateTab }) => {
  const systemObjectives = [
    {
      title: "Simplify Delivery",
      desc: "Simplify the delivery of social services through digital automation and streamlined workflows.",
      icon: Zap,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Reduce Paperwork & Errors",
      desc: "Eliminate manual errors and excessive physical paperwork in constituent and beneficiary management.",
      icon: FileText,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Enhance Transparency",
      desc: "Improve accountability in municipal aid distribution with verifiable digital audit trails.",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Empower MSWDO Staff",
      desc: "Equip social welfare officers with efficient tools for live monitoring, case studies, and reporting.",
      icon: Users,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Inclusive Accessibility",
      desc: "Enhance constituent accessibility through user-friendly kiosk queues, QR identification, and SMS alerts.",
      icon: Smartphone,
      color: "text-sky-500 bg-sky-500/10 border-sky-500/20"
    }
  ];

  const conceptualFramework = {
    inputs: [
      { label: "Beneficiary Profiling Data", detail: "Demographics, OSCA/PWD/Solo Parent/4Ps sectors, household income, barangay" },
      { label: "AICS & Crisis Aid Requests", detail: "Medical bills, funeral contracts, enrollment IDs, emergency disaster needs" },
      { label: "Program & DSWD Standards", detail: "RA 11861, OSCA guidelines, indigency criteria, disaster evacuation capacity" }
    ],
    process: [
      { label: "Digital Record Management", detail: "Firestore database sync, QR profile scanning, sector-specific registries" },
      { label: "Automated Tracking & AI Evaluation", detail: "AI indigency assessment, social case study report auto-generation, status tracking" },
      { label: "Live Queue & Helpdesk Dispatch", detail: "Priority kiosk queue management, real-time ticket serving, SMS notification queue" }
    ],
    outputs: [
      { label: "Accelerated Service Delivery", detail: "Reduced queue wait times from hours to minutes for financial and food assistance" },
      { label: "Reduced Operating Costs", detail: "Drastic reduction in printed paper forms, duplicate payouts, and clerical overhead" },
      { label: "Complete Municipal Transparency", detail: "Exportable executive summaries, audit activity logs, and verified DSWD compliance" }
    ]
  };

  const featureMatrix = [
    {
      feature: "Online Beneficiary Registration & Verification",
      scope: "Profiling & Sectoral Registries",
      status: "Operational",
      link: "constituents",
      description: "Complete profiling for Senior Citizens, PWDs, Solo Parents, and 4Ps with QR code generation."
    },
    {
      feature: "Real-Time Parcel & Aid Distribution Tracking",
      scope: "AICS & Disaster Relief",
      status: "Operational",
      link: "aics",
      description: "Tracks disbursement amounts, institution receipts, and disaster pack distribution across barangays."
    },
    {
      feature: "Automated Notifications for Beneficiaries",
      scope: "Helpdesk & Walk-In Queue",
      status: "Operational",
      link: "queue",
      description: "SMS alert triggers and queue ticket calling for senior citizens, pregnant, and PWD priority lanes."
    },
    {
      feature: "Staff Program Monitoring Dashboard",
      scope: "Command Center Analytics",
      status: "Operational",
      link: "dashboard",
      description: "Visual charts for aid disbursement by type, barangay distribution, and live audit stream."
    },
    {
      feature: "Secure Database with Role-Based Compliance",
      scope: "Firestore & Security Rules",
      status: "Operational",
      link: "logs",
      description: "Strict data access, VAWC confidentiality restrictions, and timestamped audit log trails."
    }
  ];

  const keyBenefits = [
    { title: "Reduced Administrative Workload", detail: "Automated intake scoring and auto-filled case study reports save up to 15 hours of staff paperwork weekly." },
    { title: "Improved Service Speed", detail: "Constituents receive crisis financial support in same-day processing via digital verification." },
    { title: "Enhanced Transparency", detail: "Zero duplicate aid claims through unique constituent QR codes and immutable transaction history." },
    { title: "Targeted Communication", detail: "Direct broadcast capability for sectoral assemblies, disaster relief distribution, and payout schedules." },
    { title: "Data-Driven Governance", detail: "Real-time analytics empower the Municipal Mayor and MSWDO Head to allocate budget effectively." }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-sm border border-slate-800 p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-sm border border-blue-500/30">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Official LGU Operational Framework & System Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
            MSWDO Portal System Framework & Objectives
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            The Municipal Social Welfare and Development Office (MSWDO) Portal is a centralized digital platform designed to modernize social service delivery in local government units by digitizing records, automating workflows, and ensuring full transparency in municipal aid distribution.
          </p>
        </div>
      </div>

      {/* System Objectives Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white">Core System Objectives</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemObjectives.map((obj, i) => {
            const Icon = obj.icon;
            return (
              <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`p-2 rounded-sm border ${obj.color}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">OBJ-0{i + 1}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase">{obj.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{obj.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conceptual Framework Diagram: Inputs -> Process -> Outputs */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-amber-500" />
              <span>Conceptual Framework (IPO Model)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Data flow and operational transformation pipeline</p>
          </div>
          <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2.5 py-1 rounded-sm border border-amber-500/20 uppercase font-mono">
            Input-Process-Output Model
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* Inputs Column */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-sm border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-slate-700">
              <Database className="w-4 h-4" />
              <span>1. System Inputs</span>
            </div>
            <div className="space-y-3">
              {conceptualFramework.inputs.map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-3 rounded-sm border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">{item.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Process Column */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-sm border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-slate-700">
              <Workflow className="w-4 h-4" />
              <span>2. Operational Process</span>
            </div>
            <div className="space-y-3">
              {conceptualFramework.process.map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-3 rounded-sm border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">{item.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Outputs Column */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-sm border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-slate-700">
              <TrendingUp className="w-4 h-4" />
              <span>3. Strategic Outputs</span>
            </div>
            <div className="space-y-3">
              {conceptualFramework.outputs.map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-3 rounded-sm border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">{item.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Features Implementation Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>System Features & Module Alignment</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live operational status of core system capabilities</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-4">Feature Name</th>
                <th className="py-3 px-4">Portal Scope</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Access Module</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {featureMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{item.feature}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">{item.scope}</td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-xs">{item.description}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onNavigateTab(item.link)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-sm font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1 transition shadow-sm"
                    >
                      <span>Open Module</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Benefits & Impact */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>Expected System Benefits</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {keyBenefits.map((b, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-sm border border-slate-200 dark:border-slate-700/80 space-y-1">
              <h4 className="font-bold text-xs uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                <span>{b.title}</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-3">{b.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
