import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  HeartHandshake, 
  ShieldAlert, 
  Ticket, 
  FileText, 
  Layers, 
  Search, 
  Plus, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Megaphone, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  MapPin, 
  FileCheck, 
  Award, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { Constituent, AssistanceRequest, DisasterReliefEvent, QueueTicket, UserProfile } from '../types';
import { formatPeso, formatDate } from '../utils/formatters';

interface HomePageProps {
  constituents: Constituent[];
  assistanceRequests: AssistanceRequest[];
  disasterEvents: DisasterReliefEvent[];
  queueTickets: QueueTicket[];
  currentUser: UserProfile | null;
  onNavigateTab: (tab: string) => void;
  onOpenNewIntakeModal: () => void;
  onOpenQuickScan: () => void;
  onOpenAuthModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  constituents,
  assistanceRequests,
  disasterEvents,
  queueTickets,
  currentUser,
  onNavigateTab,
  onOpenNewIntakeModal,
  onOpenQuickScan,
  onOpenAuthModal,
}) => {
  const [quickSearch, setQuickSearch] = useState('');
  const [searchResult, setSearchResult] = useState<Constituent | null>(null);
  const [searched, setSearched] = useState(false);

  // Real-time calculations
  const totalConstituents = constituents.length;
  const totalDisbursed = assistanceRequests.reduce((sum, r) => sum + (r.disbursedAmount || 0), 0);
  const waitingTickets = queueTickets.filter(q => q.status === 'Waiting').length;
  const activeDisasters = disasterEvents.filter(d => d.status === 'Active Response').length;

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearch.trim()) return;
    const found = constituents.find(
      c =>
        c.fullName.toLowerCase().includes(quickSearch.trim().toLowerCase()) ||
        c.id.toLowerCase() === quickSearch.trim().toLowerCase() ||
        (c.idNumber && c.idNumber.toLowerCase().includes(quickSearch.trim().toLowerCase()))
    );
    setSearchResult(found || null);
    setSearched(true);
  };

  const services = [
    {
      id: 'aics',
      title: 'AICS & Crisis Assistance',
      description: 'Medical, burial, educational, and food emergency cash assistance for indigent families.',
      icon: HeartHandshake,
      badge: 'Priority Service',
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      tab: 'aics',
    },
    {
      id: 'constituents',
      title: 'Beneficiary Registry & IDs',
      description: 'Official master list registration, OSCA Senior IDs, PWD cards, and Solo Parent verification.',
      icon: Users,
      badge: `${totalConstituents} Registered`,
      color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      tab: 'constituents',
    },
    {
      id: 'disaster',
      title: 'Disaster Relief & DRRM',
      description: 'Evacuation center management, food pack distribution tracking, and emergency standby.',
      icon: ShieldAlert,
      badge: activeDisasters > 0 ? `${activeDisasters} Active Response` : 'Standby Mode',
      color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      tab: 'disaster',
    },
    {
      id: 'queue',
      title: 'Helpdesk & Kiosk Queue',
      description: 'Digital queuing system for priority seniors, PWDs, and walk-in social welfare intake.',
      icon: Ticket,
      badge: waitingTickets > 0 ? `${waitingTickets} In Line` : 'No Waiting',
      color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      tab: 'queue',
    },
    {
      id: 'sectoral',
      title: 'Sectoral Welfare Programs',
      description: 'Specialized programs for Senior Citizens, PWDs, Solo Parents, 4Ps, and Child Welfare.',
      icon: Layers,
      badge: '5 Active Sectors',
      color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      tab: 'sectoral',
    },
    {
      id: 'reports',
      title: 'Social Case Study Reports',
      description: 'Formal SCSR creation and DSWD case evaluations signed by case managers.',
      icon: FileText,
      badge: 'DSWD Format',
      color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      tab: 'reports',
    },
  ];

  const announcements = [
    {
      id: 1,
      date: 'August 10, 2026',
      title: 'Q3 Social Pension Stipend Pay-Out Schedule Announced',
      category: 'Senior Citizens (OSCA)',
      body: 'Distribution of the quarterly stipend (PHP 3,000) for verified senior citizens will commence at the Municipal Covered Court per Barangay cluster.',
    },
    {
      id: 2,
      date: 'August 08, 2026',
      title: 'Emergency Medical AICS Intake Processing Open',
      category: 'Crisis Intervention',
      body: 'Walk-in constituents seeking hospital bill subsidy or dialysis aid may proceed to Counter 2 with Barangay Indigency and Clinical Summary.',
    },
    {
      id: 3,
      date: 'August 05, 2026',
      title: 'Barangay Mobile PWD Registration Drive',
      category: 'Sectoral Welfare',
      body: 'The MSWDO Mobile Team will conduct free medical assessment and ID issuance in Barangays San Jose and Santa Maria this Friday.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between w-full max-w-full overflow-x-hidden">
      
      {/* Standalone Public Header Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-8 py-3 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Logo & LGU Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center font-black text-white text-base sm:text-xl shadow-md border border-blue-400/30 shrink-0">
              M
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-xs sm:text-base tracking-tight text-white truncate">
                  MSWDO BANSUD PORTAL
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded text-[10px] font-bold uppercase tracking-wider">
                  Official LGU
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                Municipal Social Welfare & Development Office &bull; Municipality of Bansud, Oriental Mindoro
              </p>
            </div>
          </div>

          {/* Navigation CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={onOpenQuickScan}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Scan ID QR</span>
            </button>

            {currentUser ? (
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-[0.99] whitespace-nowrap"
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Go to Staff Dashboard &rarr;</span>
                <span className="sm:hidden">Dashboard</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-[0.99] whitespace-nowrap"
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Staff Portal / Sign In</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Home Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Welcome Banner */}
        <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 text-white overflow-hidden p-6 sm:p-10 shadow-2xl">
          {/* Subtle Decorative Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Municipality of Bansud &bull; LGU Public Portal
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-md text-[11px] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Real-time Database Active
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Municipal Social Welfare & Development Office
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Serving our community with transparent, efficient, and compassionate social welfare services, emergency financial assistance (AICS), and sectoral support for Seniors, PWDs, and Solo Parents.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenNewIntakeModal}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition active:scale-[0.99]"
              >
                <Plus className="w-4 h-4" />
                <span>New AICS Intake</span>
              </button>

              <button
                onClick={() => onNavigateTab('constituents')}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-700 flex items-center gap-2 transition active:scale-[0.99]"
              >
                <UserPlus className="w-4 h-4 text-sky-400" />
                <span>Register Beneficiary</span>
              </button>

              <button
                onClick={onOpenQuickScan}
                className="px-5 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-700 flex items-center gap-2 transition"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Scan QR ID</span>
              </button>

              {currentUser ? (
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 transition ml-auto"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Open Staff Dashboard &rarr;</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 transition ml-auto"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Staff Portal Access</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Real-Time Live Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigateTab('constituents')}
            className="p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-xs hover:border-blue-500/50 cursor-pointer transition flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Total Beneficiaries</span>
              <div className="text-2xl font-black text-white">{totalConstituents}</div>
              <span className="text-[11px] text-blue-400 font-medium">Verified Records &rarr;</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-400 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div 
            onClick={() => onNavigateTab('aics')}
            className="p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-xs hover:border-emerald-500/50 cursor-pointer transition flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">AICS Funds Disbursed</span>
              <div className="text-2xl font-black text-emerald-400">{formatPeso(totalDisbursed)}</div>
              <span className="text-[11px] text-emerald-400 font-medium">Crisis Aid Released &rarr;</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
          </div>

          <div 
            onClick={() => onNavigateTab('queue')}
            className="p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-xs hover:border-amber-500/50 cursor-pointer transition flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Helpdesk Queue</span>
              <div className="text-2xl font-black text-amber-400">{waitingTickets} Waiting</div>
              <span className="text-[11px] text-amber-400 font-medium">Active Kiosk Desk &rarr;</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
          </div>

          <div 
            onClick={() => onNavigateTab('disaster')}
            className="p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-xs hover:border-rose-500/50 cursor-pointer transition flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Disaster Relief Operations</span>
              <div className="text-2xl font-black text-white">
                {activeDisasters > 0 ? `${activeDisasters} Active` : 'Standby'}
              </div>
              <span className="text-[11px] text-rose-400 font-medium">DRRM Evacuation &rarr;</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Services Hub Grid */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">MSWDO Core Service Modules</h2>
            <p className="text-xs text-slate-400">Direct access to municipal social welfare management functions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  onClick={() => onNavigateTab(service.tab)}
                  className="p-5 bg-slate-900 rounded-xl border border-slate-800 shadow-xs hover:shadow-md hover:border-blue-500/50 cursor-pointer transition flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border ${service.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {service.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition flex items-center justify-between">
                        <span>{service.title}</span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition" />
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-400">
                    <span>Access Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Search Verification Widget & Announcements Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Verification Widget */}
          <div className="lg:col-span-1 p-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Instant Beneficiary Lookup</h3>
                <p className="text-[11px] text-slate-400">Verify OSCA ID, PWD ID or Name</p>
              </div>
            </div>

            <form onSubmit={handleQuickSearch} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="e.g. Maria Santos or OSCA-2024-001"
                  value={quickSearch}
                  onChange={(e) => {
                    setQuickSearch(e.target.value);
                    setSearched(false);
                  }}
                  className="w-full px-3.5 py-2 bg-slate-800 text-slate-100 text-xs rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Verify Registration</span>
              </button>
            </form>

            {searched && (
              <div className="pt-2">
                {searchResult ? (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Record
                      </span>
                      <span className="text-[10px] text-slate-400">{searchResult.id}</span>
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">{searchResult.fullName}</div>
                      <div className="text-[11px] text-slate-300">{searchResult.sector} &bull; {searchResult.barangay}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Gov ID: {searchResult.idNumber || 'N/A'}</div>
                    </div>
                    <button
                      onClick={() => onNavigateTab('constituents')}
                      className="w-full py-1 text-[11px] font-bold text-blue-400 hover:underline text-left mt-1"
                    >
                      View Full Profile &rarr;
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-950/30 border border-rose-900 rounded-xl text-xs text-rose-300">
                    No registered constituent record found matching &quot;{quickSearch}&quot;.
                  </div>
                )}
              </div>
            )}

            {/* Emergency Hotline Contacts */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-rose-500" />
                Emergency Hotlines
              </span>
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>MSWDO Crisis Desk:</span>
                  <span className="font-mono font-bold text-white">(049) 555-0192</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>MDRRMO Disaster:</span>
                  <span className="font-mono font-bold text-white">(049) 555-9111</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>OSCA Senior Desk:</span>
                  <span className="font-mono font-bold text-white">(049) 555-0812</span>
                </div>
              </div>
            </div>
          </div>

          {/* Public Bulletins & Announcements */}
          <div className="lg:col-span-2 p-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800 flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Municipal Bulletins & Public Advisories</h3>
                  <p className="text-[11px] text-slate-400">Official announcements from MSWDO Head Office</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {announcements.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold rounded">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* Official LGU Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 sm:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-slate-200 flex items-center justify-center md:justify-start gap-1.5">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Municipal Social Welfare & Development Office</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Official Social Services Portal &bull; Government of the Philippines &bull; Data Privacy Act Compliant
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button onClick={() => onNavigateTab('framework')} className="hover:text-slate-200 transition">
              System Guidelines
            </button>
            <span>&bull;</span>
            <button onClick={onOpenAuthModal} className="hover:text-slate-200 transition">
              Staff Portal Sign In
            </button>
            <span>&bull;</span>
            <span className="text-emerald-400 font-mono">Real-time DB Operational</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
