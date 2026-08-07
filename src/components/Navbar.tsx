import React, { useState } from 'react';
import { 
  Home,
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
  Trash2,
  History,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  User,
  LogIn,
  LogOut,
  Sparkles,
  RefreshCw,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  waitingQueueCount: number;
  onOpenQuickScan: () => void;
  onOpenNewIntakeModal: () => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  onClearAllData?: () => void;
  onCleanDeduplicateData?: () => void;
  onReseedData?: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  waitingQueueCount,
  onOpenQuickScan,
  onOpenNewIntakeModal,
  globalSearchQuery,
  setGlobalSearchQuery,
  onClearAllData,
  onCleanDeduplicateData,
  onReseedData,
  isCollapsed,
  setIsCollapsed,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Building2 },
    { id: 'constituents', label: 'Beneficiaries', icon: Users },
    { id: 'aics', label: 'AICS & Crisis Aid', icon: HeartHandshake },
    { id: 'sectoral', label: 'Sectoral Services', icon: Layers },
    { id: 'disaster', label: 'DRRM Disaster Relief', icon: ShieldAlert },
    { id: 'queue', label: 'Helpdesk Queue', icon: Ticket, badge: waitingQueueCount > 0 ? waitingQueueCount : null },
    { id: 'reports', label: 'Case Reports (SCSR)', icon: FileText },
    { id: 'framework', label: 'System Framework', icon: BookOpen },
    { id: 'logs', label: 'Activity Logs', icon: History },
    { id: 'profile', label: 'User Profile', icon: User },
  ];

  const handleSelectTab = (id: string) => {
    if (id !== 'home' && !currentUser) {
      onOpenAuthModal();
    }
    setActiveTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 lg:hidden"
        />
      )}

      {/* Side Navigation Bar (Desktop & Mobile Drawer) */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900 border-r border-slate-800 text-white flex flex-col justify-between transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 bg-blue-600 rounded-sm flex items-center justify-center font-black text-white text-lg shrink-0 shadow-sm">
                M
              </div>
              {!isCollapsed && (
                <div className="animate-fade-in truncate">
                  <div className="font-black text-sm tracking-tight text-white leading-tight">MSWDO PORTAL</div>
                  <div className="text-[9px] text-blue-400 font-semibold tracking-wider uppercase">LGU Social Services</div>
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isProtected = item.id !== 'home' && !currentUser;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                  }`}
                  title={isCollapsed ? (isProtected ? `${item.label} (Sign In Required)` : item.label) : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isProtected && !isCollapsed && (
                      <Lock className="w-3 h-3 text-amber-400/80 shrink-0" />
                    )}

                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-white text-blue-700' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Session Footer & Data Tools */}
        <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/40">
          {currentUser ? (
            <div className="p-2 bg-slate-800/80 rounded border border-slate-700/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-blue-400/40">
                  {currentUser.fullName.charAt(0)}
                </div>
                {!isCollapsed && (
                  <div className="min-w-0 text-left">
                    <div className="text-xs font-bold text-slate-100 truncate">{currentUser.fullName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.role}</div>
                  </div>
                )}
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 bg-slate-900 hover:bg-rose-600 text-rose-400 hover:text-white rounded border border-slate-700 hover:border-rose-500 transition flex items-center justify-center shrink-0"
                  title="Log Out / Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className={`w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold uppercase tracking-wider transition ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
            >
              <LogIn className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Sign In / Register</span>}
            </button>
          )}

          {/* Desktop Collapse Button */}
          <div className="flex items-center justify-end pt-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded transition"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Top Bar Navigation Header */}
      <header className={`sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-sm transition-all duration-300 w-full overflow-hidden ${
        isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        {/* Government Compliance Banner */}
        <div className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold tracking-widest py-1 px-3 sm:px-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-1 overflow-hidden">
          <div className="flex items-center gap-2 max-w-full overflow-hidden">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="truncate">Real-time Firestore Database Connected &bull; MSWDO Portal</span>
          </div>
          <div className="hidden md:flex items-center gap-3 font-mono text-slate-400 text-[9px] shrink-0">
            <span>DSWD Standards Compliant</span>
            <span>|</span>
            <span>Date: {new Date().toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Main Header Bar Actions */}
        <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2 overflow-hidden">
          {/* Mobile Sidebar Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm border border-slate-700"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-slate-200" />
            </button>

            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 bg-blue-600 rounded-sm flex items-center justify-center font-bold text-white text-xs shadow-sm shrink-0">
                M
              </div>
              <div className="hidden min-[380px]:block">
                <h1 className="text-xs font-bold text-white tracking-tight leading-none">MSWDO</h1>
                <p className="text-[8px] text-slate-400 uppercase tracking-wider font-semibold">Social Welfare</p>
              </div>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="relative flex-1 min-w-0 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 bg-slate-800 text-slate-200 text-xs rounded-sm border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
            />
          </div>

          {/* Action Buttons & User Auth Profile */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-sm border border-slate-700 flex items-center gap-1.5 transition text-xs font-medium"
                  title="View Staff Profile & Settings"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center border border-blue-400/40 shrink-0">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="font-bold text-[11px] leading-tight text-slate-200 max-w-[110px] truncate">{currentUser.fullName}</span>
                    <span className="text-[9px] text-slate-400 leading-none truncate">{currentUser.role}</span>
                  </div>
                </button>

                
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-1 transition"
                title="Sign In or Register"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}

            <button
              onClick={onOpenQuickScan}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-1 transition"
              title="Scan QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="hidden md:inline">Scan QR</span>
            </button>

            <button
              onClick={onOpenNewIntakeModal}
              className="px-2 sm:px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              <span className="hidden sm:inline">New AICS Intake</span>
              <span className="sm:hidden">Intake</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
