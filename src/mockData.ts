import { TrainingRegistration } from './types';

export const INITIAL_DATA: TrainingRegistration[] = [
  {
    id: "REG-9401",
    staffName: "Elena Rostova",
    staffId: "EMP-4102",
    initials: "ER",
    avatarBg: "bg-blue-900 text-white",
    platform: "Platform Alpha",
    program: "Advanced Cybersecurity Protocols",
    category: "Security Assurance",
    sessionDate: "2025-11-14",
    submittedAt: "2025-10-24 09:15",
    status: "Approved",
    remarks: "Fully cleared. Pre-requisites verified with Department Head.",
    secretaryLog: "Verified by Unit Platform Alpha Secretariat"
  },
  {
    id: "REG-9402",
    staffName: "Marcus Vance",
    staffId: "EMP-3882",
    initials: "MV",
    avatarBg: "bg-indigo-900 text-white",
    platform: "Platform Beta",
    program: "Strategic Risk Framework",
    category: "Risk Governance",
    sessionDate: "2025-11-18",
    submittedAt: "2025-10-24 10:04",
    status: "Approved",
    remarks: "Candidate authorized under Q4 Enterprise Risk Initiative.",
    secretaryLog: "Certified & Passed Secretary Desk Beta"
  },
  {
    id: "REG-9403",
    staffName: "Aaliyah Chen",
    staffId: "EMP-5019",
    initials: "AC",
    avatarBg: "bg-emerald-900 text-white",
    platform: "Platform Gamma",
    program: "Enterprise Architecture TOGAF",
    category: "Systems Architecture",
    sessionDate: "2025-12-02",
    submittedAt: "2025-10-24 10:45",
    status: "Pending",
    remarks: "Awaiting Platform Secretary schedule clearance confirmation.",
    secretaryLog: "Queued at Platform Gamma"
  },
  {
    id: "REG-9404",
    staffName: "Devon Kowalski",
    staffId: "EMP-2741",
    initials: "DK",
    avatarBg: "bg-rose-900 text-white",
    platform: "Platform Alpha",
    program: "DevOps Pipeline Automation",
    category: "Cloud Engineering",
    sessionDate: "2025-11-08",
    submittedAt: "2025-10-24 11:20",
    status: "Rejected",
    remarks: "Course prerequisites incomplete; missing foundational cert module 2.",
    rejectionTimestamp: "Yesterday, 03:00 PM",
    secretaryLog: "Declined by Sec Platform Alpha (Prerequisite Failed)"
  },
  {
    id: "REG-9405",
    staffName: "Priya Sundaram",
    staffId: "EMP-6294",
    initials: "PS",
    avatarBg: "bg-purple-900 text-white",
    platform: "Platform Beta",
    program: "Data Privacy Baseline",
    category: "Compliance & Audit",
    sessionDate: "2025-11-12",
    submittedAt: "2025-10-24 11:58",
    status: "Approved",
    remarks: "Compliance mandatory refresher approved for staff division.",
    secretaryLog: "Approved by Platform Beta Administration"
  },
  {
    id: "REG-9406",
    staffName: "Lucas H. Meyer",
    staffId: "EMP-1903",
    initials: "LHM",
    avatarBg: "bg-amber-900 text-white",
    platform: "Platform Gamma",
    program: "Advanced Cybersecurity Protocols",
    category: "Security Assurance",
    sessionDate: "2025-11-14",
    submittedAt: "2025-10-24 12:30",
    status: "Pending",
    remarks: "Queued for second review; seat availability verification pending.",
    secretaryLog: "Document verification in progress"
  },
  {
    id: "REG-9407",
    staffName: "Fatima Al-Mansoor",
    staffId: "EMP-7721",
    initials: "FA",
    avatarBg: "bg-teal-900 text-white",
    platform: "Platform Alpha",
    program: "Enterprise Architecture TOGAF",
    category: "Systems Architecture",
    sessionDate: "2025-12-02",
    submittedAt: "2025-10-24 13:10",
    status: "Approved",
    remarks: "Department approved budget allocation.",
    secretaryLog: "Endorsed by Secretary Unit Alpha"
  },
  {
    id: "REG-9408",
    staffName: "Julian Thorne",
    staffId: "EMP-3310",
    initials: "JT",
    avatarBg: "bg-cyan-900 text-white",
    platform: "Platform Beta",
    program: "Strategic Risk Framework",
    category: "Risk Governance",
    sessionDate: "2025-11-18",
    submittedAt: "2025-10-24 13:45",
    status: "Pending",
    remarks: "Awaiting line manager confirmation email copy.",
    secretaryLog: "Awaiting platform supervisor review"
  },
  {
    id: "REG-9409",
    staffName: "Chloe Dupont",
    staffId: "EMP-8245",
    initials: "CD",
    avatarBg: "bg-blue-800 text-white",
    platform: "Platform Gamma",
    program: "DevOps Pipeline Automation",
    category: "Cloud Engineering",
    sessionDate: "2025-11-08",
    submittedAt: "2025-10-24 14:12",
    status: "Approved",
    remarks: "Approved for cloud transformation squad deployment.",
    secretaryLog: "Endorsed by Secretary Unit Gamma"
  },
  {
    id: "REG-9410",
    staffName: "Kofi Boateng",
    staffId: "EMP-4982",
    initials: "KB",
    avatarBg: "bg-emerald-800 text-white",
    platform: "Platform Alpha",
    program: "Data Privacy Baseline",
    category: "Compliance & Audit",
    sessionDate: "2025-11-12",
    submittedAt: "2025-10-24 14:40",
    status: "Approved",
    remarks: "Cleared for regulatory cohort standard.",
    secretaryLog: "Auto-endorsed by Secretary Unit Alpha (Tier-1 Pass)"
  },
  {
    id: "REG-9411",
    staffName: "Seraphina Lin",
    staffId: "EMP-6119",
    initials: "SL",
    avatarBg: "bg-violet-900 text-white",
    platform: "Platform Beta",
    program: "Advanced Cybersecurity Protocols",
    category: "Security Assurance",
    sessionDate: "2025-11-14",
    submittedAt: "2025-10-24 15:05",
    status: "Approved",
    remarks: "Specialized SOC analyst training grant approved.",
    secretaryLog: "Approved by Platform Beta Administration"
  },
  {
    id: "REG-9412",
    staffName: "Tariq Morales",
    staffId: "EMP-5332",
    initials: "TM",
    avatarBg: "bg-red-900 text-white",
    platform: "Platform Gamma",
    program: "Strategic Risk Framework",
    category: "Risk Governance",
    sessionDate: "2025-11-18",
    submittedAt: "2025-10-24 15:30",
    status: "Rejected",
    remarks: "Department quota full for this session window.",
    rejectionTimestamp: "Yesterday, 04:15 PM",
    secretaryLog: "Declined by Sec Gamma (Department Quota Reached)"
  },
  {
    id: "REG-9413",
    staffName: "Beatriz Silva",
    staffId: "EMP-2049",
    initials: "BS",
    avatarBg: "bg-sky-900 text-white",
    platform: "Platform Alpha",
    program: "Enterprise Architecture TOGAF",
    category: "Systems Architecture",
    sessionDate: "2025-12-02",
    submittedAt: "2025-10-24 16:02",
    status: "Approved",
    remarks: "Architect trajectory validation confirmed.",
    secretaryLog: "Verified by Unit Platform Alpha Secretariat"
  },
  {
    id: "REG-9414",
    staffName: "Liam O'Connor",
    staffId: "EMP-8840",
    initials: "LO",
    avatarBg: "bg-indigo-800 text-white",
    platform: "Platform Beta",
    program: "DevOps Pipeline Automation",
    category: "Cloud Engineering",
    sessionDate: "2025-11-08",
    submittedAt: "2025-10-24 16:25",
    status: "Pending",
    remarks: "Review in progress by Technical Secretary lead.",
    secretaryLog: "Queued at Platform Beta"
  },
  {
    id: "REG-9415",
    staffName: "Naomi Takahashi",
    staffId: "EMP-7115",
    initials: "NT",
    avatarBg: "bg-fuchsia-900 text-white",
    platform: "Platform Gamma",
    program: "Data Privacy Baseline",
    category: "Compliance & Audit",
    sessionDate: "2025-11-12",
    submittedAt: "2025-10-24 16:50",
    status: "Approved",
    remarks: "Cleared without condition.",
    secretaryLog: "Endorsed by Secretary Unit Gamma"
  },
  {
    id: "REG-9416",
    staffName: "Arthur Pendelton",
    staffId: "EMP-3904",
    initials: "AP",
    avatarBg: "bg-amber-800 text-white",
    platform: "Platform Alpha",
    program: "Strategic Risk Framework",
    category: "Risk Governance",
    sessionDate: "2025-11-18",
    submittedAt: "2025-10-24 17:15",
    status: "Approved",
    remarks: "Internal operational compliance sign-off verified.",
    secretaryLog: "Auto-endorsed by Secretary Unit Alpha"
  },
  {
    id: "REG-9417",
    staffName: "Hanna Lindqvist",
    staffId: "EMP-4472",
    initials: "HL",
    avatarBg: "bg-cyan-800 text-white",
    platform: "Platform Beta",
    program: "Advanced Cybersecurity Protocols",
    category: "Security Assurance",
    sessionDate: "2025-11-14",
    submittedAt: "2025-10-25 08:30",
    status: "Pending",
    remarks: "Waiting on security clearance sign-off badge.",
    secretaryLog: "Document verification in progress"
  },
  {
    id: "REG-9418",
    staffName: "Zubair Hashmi",
    staffId: "EMP-9201",
    initials: "ZH",
    avatarBg: "bg-teal-800 text-white",
    platform: "Platform Gamma",
    program: "Enterprise Architecture TOGAF",
    category: "Systems Architecture",
    sessionDate: "2025-12-02",
    submittedAt: "2025-10-25 09:05",
    status: "Approved",
    remarks: "Approved for systems modernizing initiative.",
    secretaryLog: "Verified by Unit Platform Gamma Secretariat"
  },
  {
    id: "REG-9419",
    staffName: "Gemma Ward",
    staffId: "EMP-1823",
    initials: "GW",
    avatarBg: "bg-rose-800 text-white",
    platform: "Platform Alpha",
    program: "DevOps Pipeline Automation",
    category: "Cloud Engineering",
    sessionDate: "2025-11-08",
    submittedAt: "2025-10-25 09:40",
    status: "Rejected",
    remarks: "Duplicate submission detected; candidate already registered in batch A.",
    rejectionTimestamp: "Today, 10:15 AM",
    secretaryLog: "Declined by Sec Alpha (Duplicate detected)"
  },
  {
    id: "REG-9420",
    staffName: "Vikram Malhotra",
    staffId: "EMP-6734",
    initials: "VM",
    avatarBg: "bg-blue-900 text-white",
    platform: "Platform Beta",
    program: "Data Privacy Baseline",
    category: "Compliance & Audit",
    sessionDate: "2025-11-12",
    submittedAt: "2025-10-25 10:15",
    status: "Approved",
    remarks: "Cleared for European branch operations support.",
    secretaryLog: "Approved by Platform Beta Administration"
  },
  {
    id: "REG-9421",
    staffName: "Camila Fernandez",
    staffId: "EMP-5198",
    initials: "CF",
    avatarBg: "bg-emerald-900 text-white",
    platform: "Platform Gamma",
    program: "Advanced Cybersecurity Protocols",
    category: "Security Assurance",
    sessionDate: "2025-11-14",
    submittedAt: "2025-10-25 10:45",
    status: "Approved",
    remarks: "Executive audit approval logged.",
    secretaryLog: "Endorsed by Secretary Unit Gamma"
  },
  {
    id: "REG-9422",
    staffName: "Tobias Grau",
    staffId: "EMP-3409",
    initials: "TG",
    avatarBg: "bg-slate-800 text-white",
    platform: "Platform Alpha",
    program: "Strategic Risk Framework",
    category: "Risk Governance",
    sessionDate: "2025-11-18",
    submittedAt: "2025-10-25 11:20",
    status: "Pending",
    remarks: "Queued for morning secretary session batch.",
    secretaryLog: "Queued at Platform Alpha"
  },
  {
    id: "REG-9423",
    staffName: "Rochelle Adams",
    staffId: "EMP-7881",
    initials: "RA",
    avatarBg: "bg-indigo-900 text-white",
    platform: "Platform Beta",
    program: "Enterprise Architecture TOGAF",
    category: "Systems Architecture",
    sessionDate: "2025-12-02",
    submittedAt: "2025-10-25 12:00",
    status: "Approved",
    remarks: "Formal authorization complete.",
    secretaryLog: "Certified & Passed Secretary Desk Beta"
  },
  {
    id: "REG-9424",
    staffName: "Kenji Sato",
    staffId: "EMP-2311",
    initials: "KS",
    avatarBg: "bg-purple-900 text-white",
    platform: "Platform Gamma",
    program: "DevOps Pipeline Automation",
    category: "Cloud Engineering",
    sessionDate: "2025-11-08",
    submittedAt: "2025-10-25 13:10",
    status: "Pending",
    remarks: "Awaiting platform verification token confirmation.",
    secretaryLog: "Awaiting platform supervisor review"
  },
  {
    id: "REG-9425",
    staffName: "Amira El-Sayed",
    staffId: "EMP-9403",
    initials: "AE",
    avatarBg: "bg-teal-900 text-white",
    platform: "Platform Alpha",
    program: "Data Privacy Baseline",
    category: "Compliance & Audit",
    sessionDate: "2025-11-12",
    submittedAt: "2025-10-25 14:00",
    status: "Approved",
    remarks: "Confirmed attendance registry.",
    secretaryLog: "Auto-endorsed by Secretary Unit Alpha"
  },
  {
    id: "REG-9426",
    staffName: "Dominic Larson",
    staffId: "EMP-4602",
    initials: "DL",
    avatarBg: "bg-rose-900 text-white",
    platform: "Platform Beta",
    program: "Strategic Risk Framework",
    category: "Risk Governance",
    sessionDate: "2025-11-18",
    submittedAt: "2025-10-25 14:45",
    status: "Rejected",
    remarks: "Course prerequisites incomplete; missing foundational cert module 2.",
    rejectionTimestamp: "Today, 11:30 AM",
    secretaryLog: "Declined by Sec Beta (Prerequisite Failed)"
  },
  {
    id: "REG-9427",
    staffName: "Ingrid Nilsen",
    staffId: "EMP-8109",
    initials: "IN",
    avatarBg: "bg-emerald-900 text-white",
    platform: "Platform Gamma",
    program: "Advanced Cybersecurity Protocols",
    category: "Security Assurance",
    sessionDate: "2025-11-14",
    submittedAt: "2025-10-25 15:30",
    status: "Approved",
    remarks: "High priority enrollment confirmed.",
    secretaryLog: "Approved by Platform Gamma Administration"
  },
  {
    id: "REG-9428",
    staffName: "Mateo Ortiz",
    staffId: "EMP-3045",
    initials: "MO",
    avatarBg: "bg-blue-900 text-white",
    platform: "Platform Alpha",
    program: "Enterprise Architecture TOGAF",
    category: "Systems Architecture",
    sessionDate: "2025-12-02",
    submittedAt: "2025-10-25 16:15",
    status: "Pending",
    remarks: "Secretary checking Q4 division cap availability.",
    secretaryLog: "Queued at Platform Alpha"
  }
];

export const CANNED_REJECTION_REASONS = [
  "Schedule clash with high-priority project milestone.",
  "Prerequisite coursework not fulfilled on platform.",
  "Department annual allocation reached for current cycle.",
  "Duplicate submission detected for identical training calendar quarter.",
  "Candidate registered for overlapping session date."
];

export const SIMULATION_NAMES = [
  { name: "Sarah Tan", id: "ST-8924", init: "ST", bg: "bg-blue-900 text-white" },
  { name: "Ahmad Farhan", id: "AF-4012", init: "AF", bg: "bg-indigo-900 text-white" },
  { name: "Nadia Binti Rosli", id: "NR-9018", init: "NR", bg: "bg-emerald-900 text-white" },
  { name: "Kevin O'Connor", id: "KO-7231", init: "KO", bg: "bg-teal-900 text-white" },
  { name: "Li Wei Jing", id: "LW-3349", init: "LW", bg: "bg-purple-900 text-white" },
  { name: "Sanjay Krishnan", id: "SK-6210", init: "SK", bg: "bg-sky-900 text-white" },
  { name: "Nurul Aisyah", id: "STF-1042", init: "NA", bg: "bg-amber-900 text-white" },
  { name: "Darren Lim", id: "STF-2311", init: "DL", bg: "bg-rose-900 text-white" }
];

export const SIMULATION_PROGRAMS = [
  { title: "Advanced Cloud Architecture & Security", cat: "Cloud Infrastructure" },
  { title: "Data Analytics & PowerBI Masterclass", cat: "Business Intelligence" },
  { title: "Project Leadership & Agile Delivery", cat: "Operations Management" },
  { title: "DevSecOps & Automated Compliance", cat: "Security & DevOps" },
  { title: "AI Prompt Engineering & Production Safety", cat: "Applied AI" },
  { title: "Microservices Governance & API Management", cat: "Software Engineering" },
  { title: "Zero Trust Architecture Implementation", cat: "Cyber Defense" }
];

export const PLATFORMS: Array<'Platform Alpha' | 'Platform Beta' | 'Platform Gamma'> = [
  'Platform Alpha',
  'Platform Beta',
  'Platform Gamma'
];

const STORAGE_KEY = 'centralized_training_approvals_v1_1';

export function loadStoredRegistrations(): TrainingRegistration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load registrations from localStorage', err);
  }
  return [...INITIAL_DATA];
}

export function saveStoredRegistrations(data: TrainingRegistration[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save registrations', err);
  }
}

export function resetToInitialRegistrations(): TrainingRegistration[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing storage', err);
  }
  const fresh = JSON.parse(JSON.stringify(INITIAL_DATA));
  saveStoredRegistrations(fresh);
  return fresh;
}
