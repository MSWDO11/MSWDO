import React, { useState } from 'react';
import { 
  Ticket, 
  Volume2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Award, 
  UserPlus, 
  Building2, 
  Check, 
  X
} from 'lucide-react';
import { QueueTicket, Constituent } from '../types';

interface QueueHelpdeskKioskProps {
  queueTickets: QueueTicket[];
  constituents: Constituent[];
  onUpdateQueueTickets: (tickets: QueueTicket[]) => void;
}

export const QueueHelpdeskKiosk: React.FC<QueueHelpdeskKioskProps> = ({
  queueTickets,
  constituents,
  onUpdateQueueTickets,
}) => {
  const [selectedDesk, setSelectedDesk] = useState<number>(1);
  const [audioPlayedTicket, setAudioPlayedTicket] = useState<string | null>(null);

  // New Ticket State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    category: 'Priority (Senior/PWD/Pregnant)' as const,
    constituentName: 'Maria Clara Santos',
    purpose: 'AICS Medical Assistance Intake',
  });

  const activeInDeskTickets = queueTickets.filter((q) => q.status === 'In Desk');
  const waitingTickets = queueTickets.filter((q) => q.status === 'Waiting');

  const handleCallNextTicket = () => {
    if (waitingTickets.length === 0) return;

    // Prioritize Priority Lane tickets
    const priorityNext = waitingTickets.find((t) => t.category.includes('Priority')) || waitingTickets[0];

    const updated = queueTickets.map((t) => {
      if (t.id === priorityNext.id) {
        return {
          ...t,
          status: 'In Desk' as const,
          deskAssigned: selectedDesk,
        };
      }
      return t;
    });

    onUpdateQueueTickets(updated);
    setAudioPlayedTicket(priorityNext.ticketNumber);

    // Audio chime effect
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
    } catch {}
  };

  const handleCompleteTicket = (ticketId: string) => {
    const updated = queueTickets.map((t) => {
      if (t.id === ticketId) {
        return { ...t, status: 'Completed' as const };
      }
      return t;
    });
    onUpdateQueueTickets(updated);
  };

  const handleIssueTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = newTicketForm.category.includes('Priority') ? 'P' : 'R';
    const count = queueTickets.filter((t) => t.ticketNumber.startsWith(prefix)).length + 101;

    const newTicket: QueueTicket = {
      id: `Q-${Date.now()}`,
      ticketNumber: `${prefix}-${count}`,
      category: newTicketForm.category,
      constituentName: newTicketForm.constituentName,
      purpose: newTicketForm.purpose,
      status: 'Waiting',
      issuedTime: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
    };

    onUpdateQueueTickets([...queueTickets, newTicket]);
    setIsTicketModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action */}
      <div className="bg-white dark:bg-slate-900 rounded-sm p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Walk-In Helpdesk & Priority Queue Terminal</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Live Counter Management with Senior Citizen, PWD, and Pregnant Priority Lane Support
            </p>
          </div>

          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Queue Ticket</span>
          </button>
        </div>

        {/* Counter Display Banner */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((deskNum) => {
            const currentTicket = activeInDeskTickets.find((t) => t.deskAssigned === deskNum);
            const isMySelectedDesk = selectedDesk === deskNum;

            return (
              <div
                key={deskNum}
                onClick={() => setSelectedDesk(deskNum)}
                className={`p-5 rounded-sm border cursor-pointer transition relative overflow-hidden ${
                  isMySelectedDesk
                    ? 'bg-slate-900 text-white border-purple-500 shadow-sm border-l-4 border-l-purple-500'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isMySelectedDesk ? 'text-purple-300' : 'text-slate-500'}`}>
                    MSWDO COUNTER {deskNum}
                  </span>
                  {isMySelectedDesk && (
                    <span className="bg-purple-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">
                      ACTIVE
                    </span>
                  )}
                </div>

                {currentTicket ? (
                  <div className="space-y-1">
                    <div className="text-3xl font-black font-mono text-purple-400 tracking-wider">
                      {currentTicket.ticketNumber}
                    </div>
                    <div className="font-bold text-xs truncate">{currentTicket.constituentName}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{currentTicket.purpose}</div>

                    <div className="pt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteTicket(currentTicket.id);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Complete Intake</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-400 text-xs italic">
                    Counter Available &bull; No Active Ticket
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call Next Button Bar */}
        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Volume2 className="w-6 h-6 text-purple-600 animate-pulse" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">Desk Counter #{selectedDesk} Control Panel</div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                {waitingTickets.length} Citizens currently waiting in queue
              </div>
            </div>
          </div>

          <button
            onClick={handleCallNextTicket}
            disabled={waitingTickets.length === 0}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-2 transition disabled:opacity-50"
          >
            <Volume2 className="w-4 h-4" />
            <span>CALL NEXT QUEUE TICKET (DESK #{selectedDesk})</span>
          </button>
        </div>
      </div>

      {/* Waiting List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600" />
          <span>Active Waiting Queue ({waitingTickets.length} Waiting)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Ticket No.</th>
                <th className="py-3 px-4">Lane Category</th>
                <th className="py-3 px-4">Constituent Name</th>
                <th className="py-3 px-4">Purpose of Intake</th>
                <th className="py-3 px-4">Issued Time</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {queueTickets.map((ticket) => {
                const isPriority = ticket.category.includes('Priority');
                return (
                  <tr key={ticket.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-sm text-purple-600 dark:text-purple-400">
                      {ticket.ticketNumber}
                    </td>

                    <td className="py-3 px-4">
                      {isPriority ? (
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                          ⭐ PRIORITY LANE (Senior/PWD)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full font-medium text-[10px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          Regular Lane
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{ticket.constituentName}</td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{ticket.purpose}</td>

                    <td className="py-3 px-4 font-mono text-slate-400">{ticket.issuedTime}</td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          ticket.status === 'In Desk'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 animate-pulse'
                            : ticket.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {ticket.status} {ticket.deskAssigned ? `(Desk #${ticket.deskAssigned})` : ''}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Issue Queue Ticket */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                <Ticket className="w-5 h-5 text-purple-600" />
                <span>Issue Helpdesk Queue Ticket</span>
              </h3>
              <button onClick={() => setIsTicketModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueTicketSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Queue Lane Category</label>
                <select
                  value={newTicketForm.category}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                >
                  <option value="Priority (Senior/PWD/Pregnant)">Priority Lane (Senior Citizens, PWDs, Pregnant)</option>
                  <option value="Regular Intake">Regular Intake Lane</option>
                  <option value="Inquiry & ID Reissuance">Inquiry & ID Reissuance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Constituent Name</label>
                <input
                  type="text"
                  required
                  value={newTicketForm.constituentName}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, constituentName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  required
                  value={newTicketForm.purpose}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold shadow-md"
                >
                  Print Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
