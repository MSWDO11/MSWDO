import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ProtectedAccessBarrier } from './components/ProtectedAccessBarrier';
import { DashboardOverview } from './components/DashboardOverview';
import { ConstituentRegistry } from './components/ConstituentRegistry';
import { AicsAssistanceManager } from './components/AicsAssistanceManager';
import { SectoralPrograms } from './components/SectoralPrograms';
import { DisasterReliefManager } from './components/DisasterReliefManager';
import { QueueHelpdeskKiosk } from './components/QueueHelpdeskKiosk';
import { SocialCaseStudyReports } from './components/SocialCaseStudyReports';
import { ActivityLogView } from './components/ActivityLogView';
import { SystemFrameworkView } from './components/SystemFrameworkView';
import { UserProfileView } from './components/UserProfileView';
import { QuickQrScannerModal } from './components/QuickQrScannerModal';
import { AuthModal } from './components/AuthModal';

import { Constituent, AssistanceRequest, DisasterReliefEvent, QueueTicket, SocialCaseStudyReport, ActivityLog, UserProfile } from './types';
import { 
  subscribeConstituents, 
  subscribeAssistanceRequests, 
  subscribeDisasterEvents, 
  subscribeQueueTickets, 
  subscribeReports,
  subscribeActivityLogs,
  saveConstituent,
  saveAssistanceRequest,
  saveDisasterEvent,
  saveQueueTicket,
  saveReport,
  cleanAndDeduplicateAllData,
  resetAndReseedDatabase,
  seedInitialDataIfEmpty
} from './lib/db';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mswdo_active_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Master State Data connected to Firestore
  const [constituents, setConstituents] = useState<Constituent[]>([]);
  const [assistanceRequests, setAssistanceRequests] = useState<AssistanceRequest[]>([]);
  const [disasterEvents, setDisasterEvents] = useState<DisasterReliefEvent[]>([]);
  const [queueTickets, setQueueTickets] = useState<QueueTicket[]>([]);
  const [reports, setReports] = useState<SocialCaseStudyReport[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Global search & Modal Triggers
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isQuickScanOpen, setIsQuickScanOpen] = useState<boolean>(false);
  const [isNewIntakeModalOpen, setIsNewIntakeModalOpen] = useState<boolean>(false);

  // Firestore Real-Time Subscriptions
  useEffect(() => {
    const unsubConstituents = subscribeConstituents(setConstituents);
    const unsubAssistance = subscribeAssistanceRequests(setAssistanceRequests);
    const unsubDisaster = subscribeDisasterEvents(setDisasterEvents);
    const unsubQueue = subscribeQueueTickets(setQueueTickets);
    const unsubReports = subscribeReports(setReports);
    const unsubLogs = subscribeActivityLogs(setActivityLogs);

    return () => {
      unsubConstituents();
      unsubAssistance();
      unsubDisaster();
      unsubQueue();
      unsubReports();
      unsubLogs();
    };
  }, []);

  // Handlers connected to Firestore
  const handleAddConstituent = async (newConstituent: Constituent) => {
    await saveConstituent(newConstituent, false);
  };

  const handleUpdateConstituent = async (updatedConstituent: Constituent) => {
    await saveConstituent(updatedConstituent, true);
  };

  const handleAddAssistanceRequest = async (newRequest: AssistanceRequest) => {
    await saveAssistanceRequest(newRequest, false);
  };

  const handleUpdateAssistanceRequest = async (updatedRequest: AssistanceRequest) => {
    await saveAssistanceRequest(updatedRequest, true);
  };

  const handleUpdateDisasterEvents = async (updatedEvents: DisasterReliefEvent[]) => {
    for (const event of updatedEvents) {
      await saveDisasterEvent(event);
    }
  };

  const handleUpdateQueueTickets = async (updatedTickets: QueueTicket[]) => {
    // Only save tickets that differ from current state
    for (const ticket of updatedTickets) {
      const existing = queueTickets.find(t => t.id === ticket.id);
      if (!existing || JSON.stringify(existing) !== JSON.stringify(ticket)) {
        await saveQueueTicket(ticket);
      }
    }
  };

  const handleAddReport = async (newReport: SocialCaseStudyReport) => {
    await saveReport(newReport);
  };

  const handleCleanDeduplicateData = async () => {
    const res = await cleanAndDeduplicateAllData();
    alert(`Deduplication Sweep Complete!\nRemoved ${res.deletedCount} duplicate record(s) across real-time collections.`);
  };

  const handleReseedData = async () => {
    if (confirm('Re-seed fresh sample real-time records into database?')) {
      await seedInitialDataIfEmpty();
    }
  };

  const handleClearAllData = async () => {
    await resetAndReseedDatabase();
  };

  const waitingQueueCount = queueTickets.filter((q) => q.status === 'Waiting').length;

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mswdo_active_user');
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col antialiased selection:bg-blue-500 selection:text-white w-full max-w-full overflow-x-hidden">
      {!currentUser || activeTab === 'home' ? (
        /* Standalone Full-View Home Portal for Unauthenticated or Public Visitors */
        <HomePage
          constituents={constituents}
          assistanceRequests={assistanceRequests}
          disasterEvents={disasterEvents}
          queueTickets={queueTickets}
          currentUser={currentUser}
          onNavigateTab={(tab) => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
              setActiveTab('home');
            } else {
              setActiveTab(tab);
            }
          }}
          onOpenNewIntakeModal={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
              setActiveTab('home');
            } else {
              setActiveTab('aics');
              setIsNewIntakeModalOpen(true);
            }
          }}
          onOpenQuickScan={() => setIsQuickScanOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      ) : (
        /* Internal Staff & Beneficiary Dashboard Layout */
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            waitingQueueCount={waitingQueueCount}
            onOpenQuickScan={() => setIsQuickScanOpen(true)}
            onOpenNewIntakeModal={() => {
              setActiveTab('aics');
              setIsNewIntakeModalOpen(true);
            }}
            globalSearchQuery={globalSearchQuery}
            setGlobalSearchQuery={setGlobalSearchQuery}
            onClearAllData={handleClearAllData}
            onCleanDeduplicateData={handleCleanDeduplicateData}
            onReseedData={handleReseedData}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
          />

          <main className={`flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300 ${
            isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}>
            {!currentUser ? (
              <ProtectedAccessBarrier
                tabName={activeTab}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                onReturnHome={() => setActiveTab('home')}
              />
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <DashboardOverview
                    constituents={constituents}
                    assistanceRequests={assistanceRequests}
                    disasterEvents={disasterEvents}
                    queueTickets={queueTickets}
                    reports={reports}
                    activityLogs={activityLogs}
                    currentUser={currentUser}
                    onOpenAuthModal={() => setIsAuthModalOpen(true)}
                    onNavigateTab={setActiveTab}
                    onOpenNewIntakeModal={() => {
                      setActiveTab('aics');
                      setIsNewIntakeModalOpen(true);
                    }}
                    onOpenRegisterConstituentModal={() => setActiveTab('constituents')}
                    onOpenQuickScan={() => setIsQuickScanOpen(true)}
                  />
                )}

            {activeTab === 'constituents' && (
              <ConstituentRegistry
                constituents={constituents}
                assistanceRequests={assistanceRequests}
                onAddConstituent={handleAddConstituent}
                onUpdateConstituent={handleUpdateConstituent}
                globalSearchQuery={globalSearchQuery}
              />
            )}

            {activeTab === 'aics' && (
              <AicsAssistanceManager
                assistanceRequests={assistanceRequests}
                constituents={constituents}
                onAddRequest={handleAddAssistanceRequest}
                onUpdateRequest={handleUpdateAssistanceRequest}
                isNewModalOpen={isNewIntakeModalOpen}
                setIsNewModalOpen={setIsNewIntakeModalOpen}
              />
            )}

            {activeTab === 'sectoral' && (
              <SectoralPrograms constituents={constituents} />
            )}

            {activeTab === 'disaster' && (
              <DisasterReliefManager
                disasterEvents={disasterEvents}
                onUpdateDisasterEvents={handleUpdateDisasterEvents}
              />
            )}

            {activeTab === 'queue' && (
              <QueueHelpdeskKiosk
                queueTickets={queueTickets}
                constituents={constituents}
                onUpdateQueueTickets={handleUpdateQueueTickets}
              />
            )}

            {activeTab === 'reports' && (
              <SocialCaseStudyReports
                reports={reports}
                constituents={constituents}
                assistanceRequests={assistanceRequests}
                onAddReport={handleAddReport}
              />
            )}

            {activeTab === 'framework' && (
              <SystemFrameworkView onNavigateTab={setActiveTab} />
            )}

            {activeTab === 'logs' && (
              <ActivityLogView logs={activityLogs} />
            )}

            {activeTab === 'profile' && (
              <UserProfileView
                currentUser={currentUser}
                onUpdateUser={(updatedUser) => {
                  setCurrentUser(updatedUser);
                  localStorage.setItem('mswdo_active_user', JSON.stringify(updatedUser));
                }}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                onLogout={handleLogout}
              />
            )}
          </>
        )}
      </main>
      </>
      )}

      {/* Quick QR Scanner Modal */}
      <QuickQrScannerModal
        isOpen={isQuickScanOpen}
        onClose={() => setIsQuickScanOpen(false)}
        constituents={constituents}
        assistanceRequests={assistanceRequests}
      />

      {/* User Authentication Login & Register Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          localStorage.setItem('mswdo_active_user', JSON.stringify(user));
          setActiveTab('dashboard');
        }}
        onLogout={handleLogout}
      />

      {/* Footer */}
      <footer className={`bg-slate-900 text-slate-400 border-t border-slate-800 text-[11px] py-6 px-4 mt-12 transition-all duration-300 ${
        currentUser && activeTab !== 'home' ? (isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64') : 'w-full'
      }`}>
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-bold text-slate-200 uppercase tracking-wide">Municipal Social Welfare & Development Office (MSWDO) Portal</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Republic of the Philippines &bull; Local Government Unit Information System</div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            DSWD Standards Compliant
          </div>
        </div>
      </footer>
    </div>
  );
}
