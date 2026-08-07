export type SectorCategory = 
  | 'Senior Citizen'
  | 'PWD'
  | 'Solo Parent'
  | 'Indigent / 4Ps'
  | 'Child & Youth'
  | 'Women & VAWC'
  | 'General Constituent';

export type CivilStatus = 'Single' | 'Married' | 'Widowed' | 'Separated' | 'Solo Parent';

export interface Constituent {
  id: string; // e.g. MSWDO-2026-0012
  fullName: string;
  birthDate: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  civilStatus: CivilStatus;
  sector: SectorCategory;
  barangay: string;
  address: string;
  contactNumber: string;
  monthlyIncome: number;
  occupation: string;
  householdMembers: number;
  is4PsBeneficiary: boolean;
  isSocialPensioner: boolean;
  idNumber: string; // OSCA / PWD / Solo Parent / National ID
  qrCodeData: string;
  registeredDate: string;
  status: 'Active' | 'Inactive' | 'Deceased' | 'Transferred';
  disabilityType?: string; // For PWDs
  vawcConfidentialNotes?: string; // Restricted notes
  photoUrl?: string;
}

export type AssistanceType = 
  | 'Medical Assistance'
  | 'Burial & Funeral Aid'
  | 'Educational Support'
  | 'Food & Non-Food Aid'
  | 'Transportation Aid'
  | 'Emergency Cash Aid';

export type AssistanceStatus = 
  | 'Pending Intake'
  | 'Under Evaluation'
  | 'Approved for Payment'
  | 'Disbursed'
  | 'Declined';

export interface RequirementsChecklist {
  barangayIndigency: boolean;
  medicalCertificateOrHospitalBill: boolean;
  funeralContractOrDeathCertificate: boolean;
  schoolRegistrationOrID: boolean;
  validGovernmentID: boolean;
}

export interface AIAssessmentResult {
  eligibilityStatus: string;
  recommendedAmount: number;
  assessmentSummary: string;
  requiredDocuments: string[];
  recommendedServices: string[];
  urgencyLevel: string;
}

export interface AssistanceRequest {
  id: string; // e.g. AICS-2026-0089
  constituentId: string;
  constituentName: string;
  barangay: string;
  sector: SectorCategory;
  assistanceType: AssistanceType;
  institution: string; // e.g., "Municipal District Hospital", "Heavenly Memorial", etc.
  requestedAmount: number;
  recommendedAmount: number;
  disbursedAmount: number;
  dateRequested: string;
  dateDisbursed?: string;
  status: AssistanceStatus;
  situationNotes: string;
  socialWorkerAssigned: string;
  checklist: RequirementsChecklist;
  aiAssessment?: AIAssessmentResult;
}

export interface EvacuationCenter {
  id: string;
  name: string;
  barangay: string;
  capacityFamilies: number;
  currentFamilies: number;
  status: 'Open' | 'At Capacity' | 'Closed';
  contactPerson: string;
}

export interface DisasterReliefEvent {
  id: string;
  eventName: string;
  dateDeclared: string;
  status: 'Active Response' | 'Recovery Phase' | 'Closed';
  familyFoodPacksStock: number;
  familyFoodPacksDistributed: number;
  hygieneKitsStock: number;
  hygieneKitsDistributed: number;
  evacuationCenters: EvacuationCenter[];
}

export interface QueueTicket {
  id: string;
  ticketNumber: string; // e.g., P-101, R-204
  category: 'Priority (Senior/PWD/Pregnant)' | 'Regular Intake' | 'Inquiry & ID Reissuance';
  constituentName: string;
  purpose: string;
  deskAssigned?: number;
  status: 'Waiting' | 'In Desk' | 'Completed' | 'Skipped';
  issuedTime: string;
}

export interface SocialCaseStudyReport {
  id: string;
  constituentId: string;
  intakeId: string;
  dateCreated: string;
  title: string;
  problemPresented: string;
  familyBackground: string;
  evaluativeAssessment: string;
  recommendation: string;
  socialWorkerName: string;
  caseWorkerSignatureTitle: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'DISBURSE' | 'EVALUATE' | 'CLEAR';
  module: 'Constituents' | 'AICS Assistance' | 'Disaster Relief' | 'Queue' | 'Reports' | 'System';
  description: string;
  targetId?: string;
  performedBy?: string;
}

export type UserRole = 
  | 'Admin / Municipal Administrator'
  | 'Head Social Welfare Officer'
  | 'Social Worker / Case Manager'
  | 'Barangay Focal Person'
  | 'Constituent / Beneficiary';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  employeeOrBeneficiaryId: string;
  assignedBarangay: string;
  contactNumber?: string;
  avatarUrl?: string;
  registeredDate: string;
}

