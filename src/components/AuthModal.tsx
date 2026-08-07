import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  User, 
  Mail, 
  ShieldCheck, 
  Building2, 
  Phone, 
  IdCard, 
  KeyRound, 
  CheckCircle2, 
  UserPlus, 
  LogIn, 
  LogOut,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

const DEFAULT_DEMO_USERS: UserProfile[] = [
  {
    id: 'USR-ADM-001',
    fullName: 'Admin Officer / Municipal Administrator',
    email: 'admin@mswdo.gov.ph',
    role: 'Admin / Municipal Administrator',
    employeeOrBeneficiaryId: 'MSWDO-ADM-2026-001',
    assignedBarangay: 'Municipal Main Office',
    contactNumber: '0917-888-0000',
    registeredDate: '2024-01-01',
  },
  {
    id: 'USR-001',
    fullName: 'Mrs. Maria Santos, RSW',
    email: 'm.santos@mswdo.gov.ph',
    role: 'Head Social Welfare Officer',
    employeeOrBeneficiaryId: 'MSWDO-EMP-2024-001',
    assignedBarangay: 'Municipal Main Office',
    contactNumber: '0917-555-0192',
    registeredDate: '2024-01-15',
  },
  {
    id: 'USR-002',
    fullName: 'Juan Dela Cruz, RSW',
    email: 'j.delacruz@mswdo.gov.ph',
    role: 'Social Worker / Case Manager',
    employeeOrBeneficiaryId: 'MSWDO-EMP-2025-042',
    assignedBarangay: 'Poblacion 1',
    contactNumber: '0918-444-2091',
    registeredDate: '2025-03-10',
  },
  {
    id: 'USR-003',
    fullName: 'Ana Reyes',
    email: 'a.reyes@sanisidro.gov.ph',
    role: 'Barangay Focal Person',
    employeeOrBeneficiaryId: 'BGY-FP-2025-009',
    assignedBarangay: 'San Isidro',
    contactNumber: '0919-333-8821',
    registeredDate: '2025-06-01',
  },
  {
    id: 'USR-004',
    fullName: 'Lourdes Ramos (OSCA Senior)',
    email: 'lourdes.ramos@gmail.com',
    role: 'Constituent / Beneficiary',
    employeeOrBeneficiaryId: 'OSCA-2026-0812',
    assignedBarangay: 'Santa Maria',
    contactNumber: '0920-111-9988',
    registeredDate: '2026-01-20',
  },
];

const MUNICIPAL_BARANGAYS = [
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

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout
}) => {
  const [activeMode, setActiveMode] = useState<'login' | 'register'>('login');
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Social Worker / Case Manager');
  const [regIdNumber, setRegIdNumber] = useState('');
  const [regBarangay, setRegBarangay] = useState('Poblacion');
  const [regContact, setRegContact] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  if (!isOpen) return null;

  const handleDemoSelect = (user: UserProfile) => {
    onLogin(user);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginIdentifier || !loginPassword) {
      setLoginError('Please enter your Email or Employee/Beneficiary ID and Password.');
      return;
    }

    const storedUsersJson = localStorage.getItem('mswdo_user_accounts');
    let allUsers = [...DEFAULT_DEMO_USERS];
    if (storedUsersJson) {
      try {
        const customUsers: UserProfile[] = JSON.parse(storedUsersJson);
        allUsers = [...customUsers, ...DEFAULT_DEMO_USERS];
      } catch (err) {
        console.error('Failed to parse user accounts', err);
      }
    }

    const matchedUser = allUsers.find(
      (u) => 
        u.email.toLowerCase() === loginIdentifier.trim().toLowerCase() ||
        u.employeeOrBeneficiaryId.toLowerCase() === loginIdentifier.trim().toLowerCase()
    );

    if (matchedUser) {
      onLogin(matchedUser);
      onClose();
    } else {
      const newCustomUser: UserProfile = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        fullName: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : loginIdentifier,
        email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier.toLowerCase()}@mswdo.gov.ph`,
        role: 'Social Worker / Case Manager',
        employeeOrBeneficiaryId: loginIdentifier.startsWith('MSWDO') ? loginIdentifier : `MSWDO-EMP-${Date.now().toString().slice(-4)}`,
        assignedBarangay: 'Poblacion 1',
        registeredDate: new Date().toISOString().split('T')[0]
      };
      onLogin(newCustomUser);
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regFullName || !regEmail || !regIdNumber || !regPassword) {
      setRegError('Please fill in all required fields (*).');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please recheck your entry.');
      return;
    }

    const newUser: UserProfile = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      fullName: regFullName,
      email: regEmail,
      role: regRole,
      employeeOrBeneficiaryId: regIdNumber,
      assignedBarangay: regBarangay,
      contactNumber: regContact,
      registeredDate: new Date().toISOString().split('T')[0]
    };

    const storedUsersJson = localStorage.getItem('mswdo_user_accounts');
    let existingUsers: UserProfile[] = [];
    if (storedUsersJson) {
      try { existingUsers = JSON.parse(storedUsersJson); } catch (e) { existingUsers = []; }
    }
    existingUsers.push(newUser);
    localStorage.setItem('mswdo_user_accounts', JSON.stringify(existingUsers));

    setRegSuccess('Registration successful! Logging you in...');
    setTimeout(() => {
      onLogin(newUser);
      onClose();
    }, 800);
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'Admin / Municipal Administrator':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Head Social Welfare Officer':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Social Worker / Case Manager':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Barangay Focal Person':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modern Clean Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">MSWDO Portal Access</h3>
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-semibold rounded-md border border-blue-200 dark:border-blue-900">
                  LGU System
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Municipal Social Welfare & Development Office</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Currently Active User Banner */}
        {currentUser && (
          <div className="px-5 py-3 bg-emerald-50/80 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-emerald-200 truncate">
                  Signed in as: {currentUser.fullName}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-emerald-400/90 truncate">
                  {currentUser.role} &bull; {currentUser.assignedBarangay}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition shrink-0 shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Modern Segmented Tab Switcher */}
        <div className="p-4 pb-0">
          <div className="p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveMode('login')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
                activeMode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => setActiveMode('register')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
                activeMode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Account</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeMode === 'login' ? (
            <div className="space-y-5">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-medium flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email address or Government ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. m.santos@mswdo.gov.ph or MSWDO-EMP-042"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Keep me signed in</span>
                  </label>
                  <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium">Forgot password?</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition active:scale-[0.99]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Account</span>
                </button>
              </form>
            </div>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {regError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane D. Dela Cruz, RSW"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="officer@mswdo.gov.ph"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mobile Contact
                  </label>
                  <input
                    type="text"
                    placeholder="0917-000-0000"
                    value={regContact}
                    onChange={(e) => setRegContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Account Role *
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                  >
                    <option value="Constituent / Beneficiary">Constituent / Beneficiary</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Employee / Gov ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MSWDO-EMP-2026-099"
                    value={regIdNumber}
                    onChange={(e) => setRegIdNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Assigned Barangay *
                  </label>
                  <select
                    value={regBarangay}
                    onChange={(e) => setRegBarangay(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                  >
                    {MUNICIPAL_BARANGAYS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition active:scale-[0.99]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Clean Modern Footer */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Encrypted LGU Data Clearance</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium text-xs transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
