import React, { useState } from 'react';
import { 
  ShieldAlert, 
  PackageCheck, 
  Home, 
  Users, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Building, 
  Phone, 
  TrendingUp,
  PackagePlus,
  RefreshCw
} from 'lucide-react';
import { DisasterReliefEvent, EvacuationCenter } from '../types';

interface DisasterReliefManagerProps {
  disasterEvents: DisasterReliefEvent[];
  onUpdateDisasterEvents: (events: DisasterReliefEvent[]) => void;
}

export const DisasterReliefManager: React.FC<DisasterReliefManagerProps> = ({
  disasterEvents,
  onUpdateDisasterEvents,
}) => {
  const activeEvent = disasterEvents.find((d) => d.status === 'Active Response') || disasterEvents[0];

  const [dispatchFoodPacksCount, setDispatchFoodPacksCount] = useState<number>(50);

  const handleDispatchFoodPacks = () => {
    if (!activeEvent) return;
    if (activeEvent.familyFoodPacksStock < dispatchFoodPacksCount) return;

    const updatedEvents = disasterEvents.map((evt) => {
      if (evt.id === activeEvent.id) {
        return {
          ...evt,
          familyFoodPacksStock: evt.familyFoodPacksStock - dispatchFoodPacksCount,
          familyFoodPacksDistributed: evt.familyFoodPacksDistributed + dispatchFoodPacksCount,
        };
      }
      return evt;
    });

    onUpdateDisasterEvents(updatedEvents);
  };

  const handleUpdateEvacuationFamilies = (centerId: string, delta: number) => {
    if (!activeEvent) return;

    const updatedCenters = activeEvent.evacuationCenters.map((ec) => {
      if (ec.id === centerId) {
        const newCount = Math.max(0, ec.currentFamilies + delta);
        const newStatus = newCount >= ec.capacityFamilies ? 'At Capacity' : 'Open';
        return { ...ec, currentFamilies: newCount, status: newStatus as any };
      }
      return ec;
    });

    const updatedEvents = disasterEvents.map((evt) => {
      if (evt.id === activeEvent.id) {
        return { ...evt, evacuationCenters: updatedCenters };
      }
      return evt;
    });

    onUpdateDisasterEvents(updatedEvents);
  };

  return (
    <div className="space-y-6">
      {/* DRRM Command Banner */}
      <div className="bg-slate-900 rounded-sm p-6 border border-slate-800 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm border border-amber-500/30 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>MSWDO DRRM Emergency Operations Desk</span>
            </div>
            <h2 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>{activeEvent?.eventName || 'Disaster Relief Operations'}</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Declared: {activeEvent?.dateDeclared} &bull; DSWD Family Food Pack Stockpile & Evacuation Management
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold uppercase tracking-wider rounded-sm text-xs">
              {activeEvent?.status}
            </span>
          </div>
        </div>

        {/* Stockpile Metrics */}
        {activeEvent && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-xs block font-medium">Family Food Packs (FFPs) In Stock</span>
              <span className="text-2xl font-bold text-emerald-400">{activeEvent.familyFoodPacksStock} Packs</span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-xs block font-medium">FFPs Distributed to Evacuees</span>
              <span className="text-2xl font-bold text-blue-400">{activeEvent.familyFoodPacksDistributed} Packs</span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-xs block font-medium">Hygiene Kits Stockpile</span>
              <span className="text-2xl font-bold text-purple-400">{activeEvent.hygieneKitsStock} Kits</span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-xs block font-medium">Total Sheltered Evacuee Families</span>
              <span className="text-2xl font-bold text-amber-400">
                {activeEvent.evacuationCenters.reduce((acc, ec) => acc + ec.currentFamilies, 0)} Families
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Dispatch Action & Evacuation Centers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Dispatch Food Packs Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-emerald-600" />
            <span>Dispatch Relief Food Packs</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log distribution of DSWD Family Food Packs (FFPs) to Barangay Captains / Evacuation Center Team Lead.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Packs Quantity to Dispatch</label>
              <input
                type="number"
                min={1}
                max={activeEvent?.familyFoodPacksStock || 1000}
                value={dispatchFoodPacksCount}
                onChange={(e) => setDispatchFoodPacksCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-emerald-600 text-sm"
              />
            </div>

            <button
              onClick={handleDispatchFoodPacks}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Confirm Relief Distribution Log</span>
            </button>
          </div>
        </div>

        {/* Right Column: Evacuation Centers List (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" />
            <span>Active Municipal Evacuation Centers Occupancy</span>
          </h3>

          <div className="space-y-4">
            {activeEvent?.evacuationCenters.map((center) => {
              const occupancyPercent = Math.round((center.currentFamilies / center.capacityFamilies) * 100);
              return (
                <div
                  key={center.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <span>{center.name}</span>
                        <span className="text-xs text-slate-400 font-normal">(Brgy. {center.barangay})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Contact: {center.contactPerson}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          center.status === 'At Capacity'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {center.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Occupied: {center.currentFamilies} Families</span>
                      <span>Capacity: {center.capacityFamilies} Families ({occupancyPercent}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          occupancyPercent >= 90 ? 'bg-rose-500' : occupancyPercent >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, occupancyPercent)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Quick Adjust Count Buttons */}
                  <div className="flex items-center justify-end gap-2 text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 font-medium mr-2">Log Evacuee Families:</span>
                    <button
                      onClick={() => handleUpdateEvacuationFamilies(center.id, -5)}
                      className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-bold hover:bg-slate-300"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => handleUpdateEvacuationFamilies(center.id, -1)}
                      className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-bold hover:bg-slate-300"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleUpdateEvacuationFamilies(center.id, 1)}
                      className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleUpdateEvacuationFamilies(center.id, 5)}
                      className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500"
                    >
                      +5
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
