import React, { useState } from 'react';
import { 
  Layers, 
  Award, 
  Accessibility, 
  Heart, 
  Baby, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Calendar, 
  Search, 
  Plus, 
  UserCheck,
  Building
} from 'lucide-react';
import { Constituent } from '../types';
import { getSectorColor, formatPeso, formatDate } from '../utils/formatters';

interface SectoralProgramsProps {
  constituents: Constituent[];
}

export const SectoralPrograms: React.FC<SectoralProgramsProps> = ({ constituents }) => {
  const [activeSectorTab, setActiveSectorTab] = useState<'seniors' | 'pwd' | 'soloparent' | 'vawc' | 'eccd'>('seniors');

  const seniors = constituents.filter((c) => c.sector === 'Senior Citizen');
  const pwds = constituents.filter((c) => c.sector === 'PWD');
  const soloParents = constituents.filter((c) => c.sector === 'Solo Parent');
  const vawcClients = constituents.filter((c) => c.sector === 'Women & VAWC');

  return (
    <div className="space-y-6">
      {/* Sector Navigation Header */}
      <div className="bg-white dark:bg-slate-900 rounded-sm p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Sectoral Welfare Services & Specialized Desks</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Dedicated MSWDO Desks for OSCA Senior Citizens, PWD Affairs, Solo Parents (RA 11861), Women & VAWC Protection
            </p>
          </div>
        </div>

        {/* Sector Tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSectorTab('seniors')}
            className={`px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition ${
              activeSectorTab === 'seniors'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>OSCA Senior Citizens ({seniors.length})</span>
          </button>

          <button
            onClick={() => setActiveSectorTab('pwd')}
            className={`px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition ${
              activeSectorTab === 'pwd'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Accessibility className="w-4 h-4" />
            <span>PWD Affairs Desk ({pwds.length})</span>
          </button>

          <button
            onClick={() => setActiveSectorTab('soloparent')}
            className={`px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition ${
              activeSectorTab === 'soloparent'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Solo Parent Welfare ({soloParents.length})</span>
          </button>

          <button
            onClick={() => setActiveSectorTab('vawc')}
            className={`px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition ${
              activeSectorTab === 'vawc'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Women & VAWC Desk ({vawcClients.length})</span>
          </button>

          <button
            onClick={() => setActiveSectorTab('eccd')}
            className={`px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition ${
              activeSectorTab === 'eccd'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Baby className="w-4 h-4" />
            <span>Child Welfare & Daycare (ECCD)</span>
          </button>
        </div>
      </div>

      {/* Sector Tab Content */}

      {/* 1. OSCA Seniors */}
      {activeSectorTab === 'seniors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50 dark:bg-amber-950/40 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/50">
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block">Social Pensioners (₱1,000/mo)</span>
              <span className="text-2xl font-bold text-amber-950 dark:text-amber-100">
                {seniors.filter((s) => s.isSocialPensioner).length} Beneficiaries
              </span>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">Quarterly DSWD Stipend Distribution Active</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 block">Centenarians (100+ yrs RA 10868)</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {seniors.filter((s) => s.age >= 100).length || 2} Claimants
              </span>
              <p className="text-[11px] text-slate-500 mt-1">₱100,000 National Grant & Municipal Citation</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 block">Medicine Discount Booklets Issued</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{seniors.length} Active</span>
              <p className="text-[11px] text-slate-500 mt-1">20% Statutory Discount + VAT Exemption</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-3">OSCA Senior Citizen Registry</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {seniors.map((senior) => (
                <div key={senior.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{senior.fullName} ({senior.age} yrs)</div>
                    <div className="text-xs text-slate-500">
                      OSCA ID: <span className="font-mono font-semibold">{senior.idNumber}</span> &bull; Brgy. {senior.barangay}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {senior.isSocialPensioner ? (
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full text-xs font-semibold">
                        Social Pensioner (₱1,000/mo)
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full text-xs font-medium">
                        Regular OSCA Member
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PWD Affairs */}
      {activeSectorTab === 'pwd' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/40 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/50">
              <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 block">Registered Persons with Disability</span>
              <span className="text-2xl font-bold text-blue-950 dark:text-blue-100">{pwds.length} PWD Citizens</span>
              <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-1">20% Discount ID Cards Validated</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 block">Assistive Devices Distributed</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">42 Units YTD</span>
              <p className="text-[11px] text-slate-500 mt-1">Wheelchairs, Walking Canes, Crutches, Hearing Aids</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 block">PhilHealth Indigent Enrollment</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">100% Covered</span>
              <p className="text-[11px] text-slate-500 mt-1">Mandated under RA 11228</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-3">PWD Affairs Master Registry</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {pwds.map((pwd) => (
                <div key={pwd.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{pwd.fullName} ({pwd.age} yrs)</div>
                    <div className="text-xs text-slate-500">
                      PWD ID: <span className="font-mono font-semibold">{pwd.idNumber}</span> &bull; Brgy. {pwd.barangay}
                    </div>
                    {pwd.disabilityType && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                        Disability: {pwd.disabilityType}
                      </div>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full text-xs font-semibold">
                    Active PWD Beneficiary
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Solo Parents */}
      {activeSectorTab === 'soloparent' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-2xl shadow-sm border border-purple-800">
            <h3 className="text-lg font-bold mb-1">Expanded Solo Parents Welfare Act (RA 11861)</h3>
            <p className="text-xs text-purple-200 max-w-2xl leading-relaxed">
              Provides monthly ₱1,000 cash subsidy for low-income solo parents, 10% discount and VAT exemption on baby milk & diapers, flexible work schedules, and prioritized educational scholarships for dependents.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-3">Registered Solo Parents Registry</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {soloParents.map((sp) => (
                <div key={sp.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{sp.fullName}</div>
                    <div className="text-xs text-slate-500">
                      Solo Parent ID: <span className="font-mono font-semibold">{sp.idNumber}</span> &bull; Brgy. {sp.barangay}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-0.5">
                      Occupation: {sp.occupation} &bull; Household Members: {sp.householdMembers}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded-full text-xs font-semibold">
                    RA 11861 Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Women & VAWC Desk */}
      {activeSectorTab === 'vawc' && (
        <div className="space-y-6">
          <div className="bg-rose-950/40 p-6 rounded-2xl border border-rose-900/50 text-rose-100 space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
              <span>Restricted & Confidential VAWC Protection Registry</span>
            </div>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              In compliance with Republic Act 9262 (Anti-Violence Against Women and Their Children Act of 2004), client identities are protected under maximum security encryption protocols.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-3">Protection Order & Shelter Intervention Cases</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {vawcClients.map((vawc) => (
                <div key={vawc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{vawc.fullName}</div>
                    <div className="text-xs text-slate-500">
                      Protection ID: <span className="font-mono font-semibold">{vawc.idNumber}</span> &bull; Case Status: Active Shelter Care
                    </div>
                    {vawc.vawcConfidentialNotes && (
                      <div className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5 italic">
                        Notes: {vawc.vawcConfidentialNotes}
                      </div>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded-full text-xs font-semibold">
                    Confidential Legal Case
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Child Welfare & Daycare (ECCD) */}
      {activeSectorTab === 'eccd' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Municipal Daycare / ECCD Centers</h4>
              <span className="text-2xl font-bold text-emerald-600">18 Centers</span>
              <p className="text-xs text-slate-500 mt-1">1,240 Enrolled Pre-School Children (Ages 3-4)</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Supplementary Feeding Program</h4>
              <span className="text-2xl font-bold text-emerald-600">120 Days Active</span>
              <p className="text-xs text-slate-500 mt-1">Hot nutritious meals served to address undernutrition</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
