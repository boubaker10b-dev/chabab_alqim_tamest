export type Gender = 'ذكر' | 'أنثى';

export type EducationLevel = 
  | 'السنة الرابعة ابتدائي'
  | 'السنة الخامسة ابتدائي'
  | 'السنة الأولى متوسط'
  | 'السنة الثانية متوسط'
  | 'السنة الثالثة متوسط'
  | 'السنة الرابعة متوسط'
  | 'السنة الأولى ثانوي'
  | 'السنة الثانية ثانوي'
  | 'السنة الثالثة ثانوي (بكالوريا)';

export interface Member {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: Gender;
  educationLevel: string;
  hobby: string;
  guardianName: string;
  guardianPhone: string;
  cohortId?: string | null;
  cohortName: string;
  subscriptionPaid: boolean;
  paidAt?: string;
  cardIssued: boolean;
  guardianConsent: boolean;
  createdAt: string;
}

export interface Cohort {
  id: string;
  name: string;
  category: 'شباب القيم' | 'فتيات القيم';
  targetGender: Gender;
  supervisorName: string;
  supervisors?: string[];
  location: string;
  description: string;
  membersCount?: number;
  paidCount?: number;
  createdAt: string;
}

export interface Supervisor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'مشرف تربوي' | 'مشرف إداري' | 'المشرف العام والمالك' | string;
  status: 'pending' | 'approved' | 'frozen';
  isCohortTeacher?: boolean;
  assignedCohorts: string[];
  experience?: string;
  isOwner?: boolean;
  createdAt: string;
}

export interface ActivityPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  published: boolean;
  order: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface PublicInfo {
  project: {
    name: string;
    association: string;
    generalSupervisor: string;
    fee: number;
    feeCurrency: string;
    paymentInfo: string;
  };
  stats: {
    totalMembers: number;
    maleMembers: number;
    femaleMembers: number;
    cohortsCount: number;
    photosCount: number;
  };
  photos: ActivityPhoto[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isOwner: boolean;
  status: 'approved';
  assignedCohorts: string[];
}
