import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Building2, 
  Mail, 
  Phone, 
  IdCard, 
  Calendar, 
  Save, 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  Lock, 
  KeyRound, 
  AlertCircle, 
  FileText, 
  Edit3, 
  UserCog, 
  LogOut,
  Building,
  Shield,
  Activity,
  Award
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface UserProfileViewProps {
  currentUser: UserProfile | null;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

const BARANGAY_OPTIONS = [
  'Municipal Main Office',
  'Alcadesma',
  'Bato',
  'Conrazon',
  'Malo',
  'Manihala',
  'Pag-asa',
  'Poblacion',
  'Proper Bansud',
  'Rosacara',
  'Salcedo',
  'Sumagui',
  'Proper Tiguisan',
  'Villa Pagasa'
];

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentUser,
  onUpdateUser,
  onOpenAuthModal,
  onLogout
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [contactNumber, setContactNumber] = useState(currentUser?.contactNumber || '');
  const [assignedBarangay, setAssignedBarangay] = useState(currentUser?.assignedBarangay || 'Municipal Main Office');
  const [role, setRole] = useState<UserRole>(currentUser?.role || 'Social Worker / Case Manager');
  const [employeeId, setEmployeeId] = useState(currentUser?.employeeOrBeneficiaryId || 'MSWDO-EMP-2026-001');
  const [emergencyContact, setEmergencyContact] = useState('0917-888-9900 (Office Dispatch)');
  const [designationNotes, setDesignationNotes] = useState('Authorized Case Manager for Sectoral Intake & AICS Aid Evaluation.');

  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <Shield className="w-12 h-12 text-blue-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase">No Active User Authenticated</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Please sign in to view and manage your staff profile, contact details, and assigned barangay access.</p>
        <button
          onClick={onOpenAuthModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition"
        >
          <UserCheck className="w-4 h-4" />
          <span>Sign In / Register Staff Account</span>
        </button>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      fullName: fullName.trim() || currentUser.fullName,
      email: email.trim() || currentUser.email,
      contactNumber: contactNumber.trim() || currentUser.contactNumber,
      assignedBarangay,
      role,
      employeeOrBeneficiaryId: employeeId.trim() || currentUser.employeeOrBeneficiaryId
    };

    onUpdateUser(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-sm border border-slate-800 p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full flex items-center justify-center font-black text-2xl sm:text-3xl border-2 border-blue-400/40 shadow-lg shrink-0">
            {currentUser.fullName.charAt(0)}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-300 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-500/30">
                {currentUser.role}
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Account Verified</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold uppercase text-white tracking-tight">
              {currentUser.fullName}
            </h2>

            <div className="text-xs text-slate-300 flex flex-wrap items-center gap-y-1 gap-x-3">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Barangay / Unit: <strong>{currentUser.assignedBarangay}</strong></span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <IdCard className="w-3.5 h-3.5 text-blue-400" />
                <span>ID: <strong>{currentUser.employeeOrBeneficiaryId}</strong></span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Staff Details</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-1.5 transition"
            >
              <span>Cancel Editing</span>
            </button>
          )}

          <button
            onClick={onOpenAuthModal}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-1.5 transition"
          >
            <UserCog className="w-4 h-4 text-blue-400" />
            <span>Accounts</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition"
            title="Sign Out / Log Out of MSWDO System"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>User profile and contact information saved successfully!</span>
        </div>
      )}

      {/* Main Grid: Info Cards vs Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Account Summary & Status */}
        <div className="space-y-6">
          {/* Status & Clearance Card */}
          <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">Account Status & Security</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-sm">
                <span className="text-slate-500 dark:text-slate-400">Account Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active / Operational</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-sm">
                <span className="text-slate-500 dark:text-slate-400">Security Access Level:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Tier-2 Staff Access</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-sm">
                <span className="text-slate-500 dark:text-slate-400">Registered Date:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{currentUser.registeredDate || '2024-01-15'}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-sm">
                <span className="text-slate-500 dark:text-slate-400">Assigned Jurisdiction:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{currentUser.assignedBarangay}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Badges */}
          <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">Officer Activity Overview</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-sm border border-slate-200 dark:border-slate-700/80">
                <div className="text-xl font-black text-slate-900 dark:text-white">124</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Intakes Handled</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-sm border border-slate-200 dark:border-slate-700/80">
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">98%</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Resolution Rate</div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-sm border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Award className="w-4 h-4 text-blue-500" />
                <span>Authorized DSWD Encoder</span>
              </div>
              <p className="text-[11px] text-blue-700 dark:text-blue-400">
                Authorized for AICS Crisis Intake, Sectoral Profiling, and SCSR Case Report drafting in accordance with RA 11861 & OSCA standards.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-base uppercase tracking-wider text-slate-900 dark:text-white">
                  {isEditing ? 'Edit Profile & Contact Details' : 'Official Staff Profile Details'}
                </h3>
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                ID: {currentUser.id}
              </span>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      <span>Full Name & Professional Designator *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-sm border border-slate-300 dark:border-slate-700 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                      <span>Official Email Address *</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-sm border border-slate-300 dark:border-slate-700 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-500" />
                      <span>Contact Mobile / Landline *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-sm border border-slate-300 dark:border-slate-700 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Assigned Barangay / Office Unit *</span>
                    </label>
                    <select
                      value={assignedBarangay}
                      onChange={(e) => setAssignedBarangay(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-sm border border-slate-300 dark:border-slate-700 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      {BARANGAY_OPTIONS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      <span>Official Staff Role *</span>
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-sm border border-slate-300 dark:border-slate-700 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Admin / Municipal Administrator">Admin / Municipal Administrator</option>
                      <option value="Head Social Welfare Officer">Head Social Welfare Officer</option>
                      <option value="Social Worker / Case Manager">Social Worker / Case Manager</option>
                      <option value="Barangay Focal Person">Barangay Focal Person</option>
                      <option value="Constituent / Beneficiary">Constituent / Beneficiary</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <IdCard className="w-3.5 h-3.5 text-blue-500" />
                      <span>Employee / Gov ID Number *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-sm border border-slate-300 dark:border-slate-700 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-500" />
                      <span>Emergency Hotline Contact</span>
                    </label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-sm border border-slate-300 dark:border-slate-700 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>Designation Scope / Operational Notes</span>
                    </label>
                    <textarea
                      rows={2}
                      value={designationNotes}
                      onChange={(e) => setDesignationNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-sm border border-slate-300 dark:border-slate-700 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-sm text-xs font-bold uppercase tracking-wider transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Read-only view */
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-sm border border-slate-200 dark:border-slate-700/80 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3 text-blue-500" />
                      <span>Full Name</span>
                    </div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{currentUser.fullName}</div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-sm border border-slate-200 dark:border-slate-700/80 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-500" />
                      <span>Official Staff Role</span>
                    </div>
                    <div className="font-bold text-sm text-blue-600 dark:text-blue-400">{currentUser.role}</div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-sm border border-slate-200 dark:border-slate-700/80 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-blue-500" />
                      <span>Email Address</span>
                    </div>
                    <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">{currentUser.email}</div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-sm border border-slate-200 dark:border-slate-700/80 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-500" />
                      <span>Contact Mobile</span>
                    </div>
                    <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">{currentUser.contactNumber || '0917-555-0192'}</div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-sm border border-slate-200 dark:border-slate-700/80 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Assigned Barangay Unit</span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{currentUser.assignedBarangay}</div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-sm border border-slate-200 dark:border-slate-700/80 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <IdCard className="w-3.5 h-3.5 text-blue-500" />
                      <span>Employee ID Clearance</span>
                    </div>
                    <div className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">{currentUser.employeeOrBeneficiaryId}</div>
                  </div>
                </div>

                {/* Additional Office Notes */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-sm border border-slate-200 dark:border-slate-700/80 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>Operational Scope & Designation Notes</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {designationNotes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
