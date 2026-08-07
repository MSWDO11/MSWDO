import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  QrCode, 
  Eye, 
  Edit3, 
  Award, 
  Calendar, 
  MapPin, 
  Phone, 
  Briefcase, 
  Heart, 
  ShieldCheck, 
  Printer, 
  X, 
  Check, 
  Building
} from 'lucide-react';
import { Constituent, SectorCategory, AssistanceRequest } from '../types';
import { getSectorColor, formatDate, formatPeso } from '../utils/formatters';

interface ConstituentRegistryProps {
  constituents: Constituent[];
  assistanceRequests: AssistanceRequest[];
  onAddConstituent: (newConstituent: Constituent) => void;
  onUpdateConstituent: (updatedConstituent: Constituent) => void;
  globalSearchQuery: string;
}

export const ConstituentRegistry: React.FC<ConstituentRegistryProps> = ({
  constituents,
  assistanceRequests,
  onAddConstituent,
  onUpdateConstituent,
  globalSearchQuery,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedBarangay, setSelectedBarangay] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(globalSearchQuery || '');

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [viewingConstituent, setViewingConstituent] = useState<Constituent | null>(null);
  const [qrModalConstituent, setQrModalConstituent] = useState<Constituent | null>(null);

  // New Constituent Form State
  const [formData, setFormData] = useState<Partial<Constituent>>({
    fullName: '',
    birthDate: '1980-01-01',
    gender: 'Female',
    civilStatus: 'Single',
    sector: 'Indigent / 4Ps',
    barangay: 'Poblacion',
    address: '',
    contactNumber: '0917-000-0000',
    monthlyIncome: 3000,
    occupation: 'Self-Employed / Vendor',
    householdMembers: 4,
    is4PsBeneficiary: false,
    isSocialPensioner: false,
    idNumber: '',
    disabilityType: '',
  });

  const barangaysList = [
    'Poblacion',
    'San Jose',
    'Santa Maria',
    'San Roque',
    'Santo Tomas',
    'Magsaysay',
    'San Fernando',
    'San Vicente',
  ];

  const sectorsList: SectorCategory[] = [
    'Senior Citizen',
    'PWD',
    'Solo Parent',
    'Indigent / 4Ps',
    'Child & Youth',
    'Women & VAWC',
    'General Constituent',
  ];

  // Filtering
  const filteredConstituents = constituents.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.barangay.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector = selectedSector === 'All' || c.sector === selectedSector;
    const matchesBarangay = selectedBarangay === 'All' || c.barangay === selectedBarangay;

    return matchesSearch && matchesSector && matchesBarangay;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.barangay) return;

    // Calculate age from birthDate
    const birthYear = new Date(formData.birthDate || '1980-01-01').getFullYear();
    const currentYear = new Date().getFullYear();
    const calculatedAge = currentYear - birthYear;

    const newConstituentObj: Constituent = {
      id: `MSWDO-${new Date().getFullYear()}-${String(constituents.length + 1).padStart(4, '0')}`,
      fullName: formData.fullName || 'Anonymous Constituent',
      birthDate: formData.birthDate || '1980-01-01',
      age: calculatedAge > 0 ? calculatedAge : 30,
      gender: formData.gender as any || 'Female',
      civilStatus: formData.civilStatus as any || 'Single',
      sector: formData.sector as any || 'Indigent / 4Ps',
      barangay: formData.barangay || 'Poblacion',
      address: formData.address || `Brgy. ${formData.barangay}`,
      contactNumber: formData.contactNumber || '0917-000-0000',
      monthlyIncome: Number(formData.monthlyIncome) || 0,
      occupation: formData.occupation || 'Unemployed',
      householdMembers: Number(formData.householdMembers) || 1,
      is4PsBeneficiary: Boolean(formData.is4PsBeneficiary),
      isSocialPensioner: Boolean(formData.isSocialPensioner),
      idNumber: formData.idNumber || `GOV-${Math.floor(100000 + Math.random() * 900000)}`,
      qrCodeData: `MSWDO-REF-${Date.now()}`,
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      disabilityType: formData.disabilityType,
    };

    onAddConstituent(newConstituentObj);
    setIsNewModalOpen(false);
    // Reset form
    setFormData({
      fullName: '',
      birthDate: '1980-01-01',
      gender: 'Female',
      civilStatus: 'Single',
      sector: 'Indigent / 4Ps',
      barangay: 'Poblacion',
      address: '',
      contactNumber: '0917-000-0000',
      monthlyIncome: 3000,
      occupation: 'Self-Employed / Vendor',
      householdMembers: 4,
      is4PsBeneficiary: false,
      isSocialPensioner: false,
      idNumber: '',
      disabilityType: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Control */}
      <div className="bg-white dark:bg-slate-900 rounded-sm p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Constituent Registry & Sectoral Masterlist</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Municipal Database of Beneficiaries ({constituents.length} Registered Citizens)
            </p>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Constituent</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Name, MSWDO ID, OSCA/PWD ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Sector Category Dropdown */}
          <div className="relative">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Special Sectors</option>
              {sectorsList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Barangay Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedBarangay}
              onChange={(e) => setSelectedBarangay(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Barangays ({barangaysList.length})</option>
              {barangaysList.map((b) => (
                <option key={b} value={b}>
                  Brgy. {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Constituents Grid / Table */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-300 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Beneficiary & ID</th>
                <th className="py-3 px-4">Sector & ID No.</th>
                <th className="py-3 px-4">Barangay & Address</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Monthly Income</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredConstituents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching constituent records found.
                  </td>
                </tr>
              ) : (
                filteredConstituents.map((person) => {
                  const sectorBadgeClass = getSectorColor(person.sector);
                  return (
                    <tr key={person.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {person.photoUrl ? (
                            <img
                              src={person.photoUrl}
                              alt={person.fullName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                              {person.fullName.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{person.fullName}</span>
                              {person.is4PsBeneficiary && (
                                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-semibold px-1.5 py-0.2 rounded">
                                  4Ps
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">{person.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Sector */}
                      <td className="py-3 px-4">
                        <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${sectorBadgeClass}`}>
                          {person.sector}
                        </span>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          ID: {person.idNumber || 'N/A'}
                        </div>
                      </td>

                      {/* Barangay */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">Brgy. {person.barangay}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{person.address}</div>
                      </td>

                      {/* Demographics */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800 dark:text-slate-200">
                          {person.age} yrs &bull; {person.gender}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {person.civilStatus} ({person.householdMembers} hh members)
                        </div>
                      </td>

                      {/* Income */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {formatPeso(person.monthlyIncome)}
                        </div>
                        <div className="text-[11px] text-slate-500">{person.occupation}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-medium px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                          <span>{person.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingConstituent(person)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setQrModalConstituent(person)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium"
                            title="Generate QR ID Card"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Full Constituent Profile */}
      {viewingConstituent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl space-y-4">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold">
                  {viewingConstituent.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{viewingConstituent.fullName}</h3>
                  <p className="text-xs text-blue-300 font-mono">{viewingConstituent.id} &bull; Brgy. {viewingConstituent.barangay}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingConstituent(null)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-slate-800 dark:text-slate-200 text-xs">
              {/* Personal Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[11px]">Special Sector</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{viewingConstituent.sector}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Sector ID Number</span>
                  <span className="font-mono font-semibold">{viewingConstituent.idNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Age & Gender</span>
                  <span className="font-semibold">{viewingConstituent.age} yrs old, {viewingConstituent.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Civil Status</span>
                  <span className="font-semibold">{viewingConstituent.civilStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Monthly Household Income</span>
                  <span className="font-bold text-emerald-600">{formatPeso(viewingConstituent.monthlyIncome)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Contact Number</span>
                  <span className="font-mono">{viewingConstituent.contactNumber}</span>
                </div>
              </div>

              {/* Special Flags */}
              <div className="flex flex-wrap gap-2">
                {viewingConstituent.is4PsBeneficiary && (
                  <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Verified 4Ps Beneficiary
                  </span>
                )}
                {viewingConstituent.isSocialPensioner && (
                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Active DSWD Social Pensioner
                  </span>
                )}
                {viewingConstituent.disabilityType && (
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                    ♿ PWD: {viewingConstituent.disabilityType}
                  </span>
                )}
              </div>

              {/* AICS Assistance Claim History */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>AICS Aid History ({assistanceRequests.filter(a => a.constituentId === viewingConstituent.id).length} Claims)</span>
                </h4>

                {assistanceRequests.filter(a => a.constituentId === viewingConstituent.id).length === 0 ? (
                  <p className="text-slate-400 italic">No previous financial assistance recorded for this citizen.</p>
                ) : (
                  <div className="space-y-2">
                    {assistanceRequests
                      .filter(a => a.constituentId === viewingConstituent.id)
                      .map(a => (
                        <div key={a.id} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{a.assistanceType} ({a.id})</div>
                            <div className="text-[11px] text-slate-500">{a.institution} &bull; {formatDate(a.dateRequested)}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-emerald-600">{formatPeso(a.disbursedAmount || a.recommendedAmount)}</div>
                            <span className="text-[10px] font-semibold text-blue-600">{a.status}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setViewingConstituent(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: QR Code ID Card Generator */}
      {qrModalConstituent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <QrCode className="w-5 h-5 text-blue-600" />
                <span>Municipal ID Card & QR Token</span>
              </h3>
              <button onClick={() => setQrModalConstituent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Official ID Badge */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white border-2 border-blue-500/40 shadow-xl space-y-4">
              <div className="flex justify-between items-start border-b border-blue-400/30 pb-3">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-300" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Municipal Social Welfare Office</div>
                    <div className="text-xs font-semibold text-white">CONSTITUENT IDENTIFICATION CARD</div>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30 font-mono">
                  VERIFIED
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* QR Box */}
                <div className="w-24 h-24 bg-white rounded-xl p-2 flex flex-col items-center justify-center border-2 border-blue-400">
                  <QrCode className="w-16 h-16 text-slate-900" />
                  <span className="text-[8px] text-slate-600 font-mono font-bold mt-1">SCAN MSWDO</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="font-bold text-base text-white">{qrModalConstituent.fullName}</div>
                  <div className="text-blue-300 text-xs font-semibold">{qrModalConstituent.sector}</div>
                  <div className="text-slate-300 text-[11px]">ID No: <span className="font-mono font-bold">{qrModalConstituent.idNumber}</span></div>
                  <div className="text-slate-300 text-[11px]">Brgy. {qrModalConstituent.barangay}</div>
                  <div className="text-slate-400 text-[10px] font-mono mt-1">REF: {qrModalConstituent.id}</div>
                </div>
              </div>

              <div className="text-[9px] text-slate-400 text-center border-t border-blue-400/20 pt-2 italic">
                Property of Municipal Government &bull; Valid for AICS Assistance & Sectoral Benefits
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-500 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official ID Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Constituent Form */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>Register New Constituent</span>
              </h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name (First, Middle, Last)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Corazon Ramos"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Special Sector</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sectorsList.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Sector ID Number</label>
                  <input
                    type="text"
                    placeholder="OSCA / PWD / Solo Parent ID"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Barangay</label>
                  <select
                    value={formData.barangay}
                    onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {barangaysList.map((b) => (
                      <option key={b} value={b}>Brgy. {b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Monthly Income (PHP)</label>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is4PsBeneficiary}
                    onChange={(e) => setFormData({ ...formData, is4PsBeneficiary: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">4Ps Beneficiary</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSocialPensioner}
                    onChange={(e) => setFormData({ ...formData, isSocialPensioner: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Social Pensioner</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-md"
                >
                  Save Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
