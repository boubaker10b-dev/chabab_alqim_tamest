import { Member, Cohort, Supervisor, ActivityPhoto, AuditLog, PublicInfo, AuthUser } from '../types';
import {
  FALLBACK_PUBLIC_INFO,
  FALLBACK_MEMBERS,
  FALLBACK_COHORTS,
  FALLBACK_SUPERVISORS,
  FALLBACK_PHOTOS
} from './fallbackData';
import { SUPER_ADMIN_EMAIL, SUPER_ADMIN_ALT_EMAIL } from '../constants';

const API_BASE = '/api';

// Local storage keys for static/offline GitHub Pages hosting
const STORAGE_KEY_MEMBERS = 'tamest_static_members';
const STORAGE_KEY_COHORTS = 'tamest_static_cohorts';
const STORAGE_KEY_SUPERVISORS = 'tamest_static_supervisors';
const STORAGE_KEY_PHOTOS = 'tamest_static_photos';
const STORAGE_KEY_LOGS = 'tamest_static_logs';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

function getLocalMembers(): Member[] {
  return getStored<Member[]>(STORAGE_KEY_MEMBERS, FALLBACK_MEMBERS);
}

function getLocalCohorts(): Cohort[] {
  const base = getStored<Cohort[]>(STORAGE_KEY_COHORTS, FALLBACK_COHORTS);
  const sups = getLocalSupervisors();
  return base.map(c => {
    const assignedSups = sups
      .filter(s => s.status === 'approved' && s.assignedCohorts && s.assignedCohorts.includes(c.name))
      .map(s => `${s.firstName} ${s.lastName}`);
    return {
      ...c,
      supervisors: assignedSups
    };
  });
}

function getLocalSupervisors(): Supervisor[] {
  return getStored<Supervisor[]>(STORAGE_KEY_SUPERVISORS, FALLBACK_SUPERVISORS);
}

function getLocalPhotos(): ActivityPhoto[] {
  return getStored<ActivityPhoto[]>(STORAGE_KEY_PHOTOS, FALLBACK_PHOTOS);
}

function getLocalPublicInfo(): PublicInfo {
  const members = getLocalMembers();
  const cohorts = getLocalCohorts();
  const photos = getLocalPhotos();
  const maleMembers = members.filter((m) => m.gender === 'ذكر').length;
  const femaleMembers = members.filter((m) => m.gender === 'أنثى').length;

  return {
    project: {
      name: "مشروع شباب القيم تامست",
      association: "جمعية المعالي للعلوم والتربية",
      generalSupervisor: "بوبكر بخيتي",
      fee: 500,
      feeCurrency: "دج",
      paymentInfo: "تُسدد حضورياً في الحصة الافتتاحية الأولى (حصة التعارف)"
    },
    stats: {
      totalMembers: members.length,
      maleMembers,
      femaleMembers,
      cohortsCount: cohorts.length,
      photosCount: photos.length,
    },
    photos: photos.filter((p) => p.published),
  };
}

// Helper to check if running on a static hosting environment like GitHub Pages
const isStaticHost = (): boolean => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host.endsWith('github.io') || host.endsWith('pages.dev') || window.location.protocol === 'file:';
};

// Helper for authenticated headers
function getHeaders(userEmail?: string): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (userEmail) {
    headers['x-user-email'] = userEmail;
    headers['Authorization'] = `Bearer ${userEmail}`;
  }
  return headers;
}

export const api = {
  // Synchronous initial data for instant first-paint
  getInitialPublicInfo(): PublicInfo {
    return getLocalPublicInfo();
  },

  // 1. Public Info
  async getPublicInfo(): Promise<PublicInfo> {
    if (isStaticHost()) {
      return getLocalPublicInfo();
    }
    try {
      const res = await fetch(`${API_BASE}/public-info`);
      if (res.ok) {
        const text = await res.text();
        if (text && text.startsWith('{')) {
          return JSON.parse(text);
        }
      }
    } catch {
      // Network or static host fallback
    }
    return getLocalPublicInfo();
  },

  // 2. Submit Youth Registration
  async registerMember(payload: {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: 'ذكر' | 'أنثى';
    educationLevel: string;
    hobby: string;
    guardianName: string;
    guardianPhone: string;
    guardianConsent: boolean;
  }) {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Fallback for static host
    }

    // Static / Offline fallback
    const members = getLocalMembers();
    const newId = `mem-${Date.now()}`;
    const code = `#TK-2026-0${members.length + 90}`;
    const defaultCohort = payload.gender === 'ذكر' ? 'غزة العزة' : 'طوفان الأقصى';
    const newMember: Member = {
      id: newId,
      code,
      firstName: payload.firstName,
      lastName: payload.lastName,
      birthDate: payload.birthDate,
      gender: payload.gender,
      educationLevel: payload.educationLevel,
      hobby: payload.hobby,
      guardianName: payload.guardianName,
      guardianPhone: payload.guardianPhone,
      cohortName: defaultCohort,
      cohortId: payload.gender === 'ذكر' ? 'cohort-gaza' : 'cohort-toufan',
      subscriptionPaid: false,
      cardIssued: false,
      guardianConsent: payload.guardianConsent,
      createdAt: new Date().toISOString()
    };
    members.unshift(newMember);
    setStored(STORAGE_KEY_MEMBERS, members);

    return {
      success: true,
      message: 'تم تسجيل الانخراط بنجاح',
      registrationCode: code,
      memberName: `${payload.firstName} ${payload.lastName}`,
      notice: 'يرجى حفظ رمز التسجيل وتسديد مساهمة 500 دج حضورياً في الحصة الافتتاحية لاستلام بطاقة الانخراط الرسمية.'
    };
  },

  // 3. Submit Supervisor Application
  async applySupervisor(payload: {
    firstName: string;
    lastName: string;
    email: string;
    role: 'مشرف تربوي' | 'مشرف إداري';
    experience?: string;
  }) {
    try {
      const res = await fetch(`${API_BASE}/supervisors/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const sups = getLocalSupervisors();
    const newSup: Supervisor = {
      id: `sup-${Date.now()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email.trim().toLowerCase(),
      role: payload.role,
      status: 'pending',
      assignedCohorts: [],
      experience: payload.experience,
      isOwner: false,
      createdAt: new Date().toISOString()
    };
    sups.push(newSup);
    setStored(STORAGE_KEY_SUPERVISORS, sups);

    return {
      success: true,
      message: 'تم إرسال طلب الانضمام كشرف تربوي/إداري بنجاح، وهو قيد المراجعة والاعتماد.'
    };
  },

  // 4. Authenticate Login
  async login(email: string, password?: string): Promise<{ success: boolean; user: AuthUser; token: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });
      if (res.ok) {
        return await res.json();
      } else {
        const errJson = await res.json().catch(() => null);
        if (errJson && errJson.error) {
          throw new Error(errJson.error);
        }
      }
    } catch (e: any) {
      if (e.message && !e.message.includes('fetch') && !e.message.includes('NetworkError')) {
        throw e;
      }
      // Fallback below
    }

    const isOwner = cleanEmail === 'bobaker10b@gmail.com' || cleanEmail === 'rachiddjabellah@gmail.com' || cleanEmail === 'boubaker10b@gmail.com';

    if (isOwner) {
      if (cleanPassword !== 'admin2025') {
        throw new Error('كلمة المرور غير صحيحة. يرجى إدخال كلمة المرور الصحيحة.');
      }
      const isDjaballah = cleanEmail === 'rachiddjabellah@gmail.com';
      const user: AuthUser = {
        id: isDjaballah ? 'sup-owner-djaballah' : 'sup-owner',
        name: isDjaballah ? 'الأستاذ رشيد جاب الله' : 'بوبكر بخيتي',
        email: cleanEmail,
        role: isDjaballah ? 'المشرف العام التربوي' : 'المشرف العام والمالك',
        isOwner: true,
        status: 'approved',
        assignedCohorts: ['غزة العزة', 'طوفان الأقصى']
      };
      return { success: true, user, token: cleanEmail };
    }

    const sups = getLocalSupervisors();
    const match = sups.find((s) => s.email.toLowerCase() === cleanEmail && s.status === 'approved');
    if (match) {
      if (cleanPassword !== 'chabab-alqiam2027') {
        throw new Error('كلمة المرور غير صحيحة. كلمة المرور المعتمدة للمشرفين هي chabab-alqiam2027');
      }
      const user: AuthUser = {
        id: match.id,
        name: `${match.firstName} ${match.lastName}`,
        email: match.email,
        role: match.role,
        isOwner: !!match.isOwner,
        status: 'approved',
        assignedCohorts: match.assignedCohorts || []
      };
      return { success: true, user, token: cleanEmail };
    }

    throw new Error('البريد الإلكتروني غير مسجل أو لم يتم اعتماده بعد.');
  },

  // 5. Admin - Get Members
  async getMembers(userEmail: string): Promise<{
    members: Member[];
    total: number;
    paidCount: number;
    unpaidCount: number;
    maleCount: number;
    femaleCount: number;
  }> {
    try {
      const res = await fetch(`${API_BASE}/admin/members`, {
        headers: getHeaders(userEmail)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const members = getLocalMembers();
    const paidCount = members.filter((m) => m.subscriptionPaid).length;
    const maleCount = members.filter((m) => m.gender === 'ذكر').length;
    const femaleCount = members.filter((m) => m.gender === 'أنثى').length;

    return {
      members,
      total: members.length,
      paidCount,
      unpaidCount: members.length - paidCount,
      maleCount,
      femaleCount
    };
  },

  // 6. Admin - Add Member
  async addMember(userEmail: string, member: Partial<Member>): Promise<{ success: boolean; member: Member }> {
    try {
      const res = await fetch(`${API_BASE}/admin/members`, {
        method: 'POST',
        headers: getHeaders(userEmail),
        body: JSON.stringify(member)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const members = getLocalMembers();
    const newMember: Member = {
      id: `mem-${Date.now()}`,
      code: member.code || `#TK-2026-0${members.length + 90}`,
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      birthDate: member.birthDate || '',
      gender: member.gender || 'ذكر',
      educationLevel: member.educationLevel || '',
      hobby: member.hobby || '',
      guardianName: member.guardianName || '',
      guardianPhone: member.guardianPhone || '',
      cohortName: member.cohortName || 'غزة العزة',
      subscriptionPaid: member.subscriptionPaid || false,
      cardIssued: member.cardIssued || false,
      guardianConsent: true,
      createdAt: new Date().toISOString()
    };
    members.unshift(newMember);
    setStored(STORAGE_KEY_MEMBERS, members);
    return { success: true, member: newMember };
  },

  // 7. Admin - Update Member
  async updateMember(userEmail: string, id: string, updates: Partial<Member>): Promise<{ success: boolean; member: Member }> {
    try {
      const res = await fetch(`${API_BASE}/admin/members/${id}`, {
        method: 'PUT',
        headers: getHeaders(userEmail),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const members = getLocalMembers();
    const idx = members.findIndex((m) => m.id === id);
    if (idx !== -1) {
      members[idx] = { ...members[idx], ...updates };
      setStored(STORAGE_KEY_MEMBERS, members);
      return { success: true, member: members[idx] };
    }
    throw new Error('المنخرط غير موجود');
  },

  // 8. Admin - Delete Member
  async deleteMember(userEmail: string, id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/admin/members/${id}`, {
        method: 'DELETE',
        headers: getHeaders(userEmail)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    let members = getLocalMembers();
    members = members.filter((m) => m.id !== id);
    setStored(STORAGE_KEY_MEMBERS, members);
    return { success: true, message: 'تم حذف المنخرط بنجاح' };
  },

  // 9. Admin - Toggle Payment (500 DZD)
  async togglePayment(userEmail: string, id: string): Promise<{ success: boolean; member: Member }> {
    try {
      const res = await fetch(`${API_BASE}/admin/members/${id}/toggle-payment`, {
        method: 'PATCH',
        headers: getHeaders(userEmail)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const members = getLocalMembers();
    const idx = members.findIndex((m) => m.id === id);
    if (idx !== -1) {
      const current = members[idx];
      const paid = !current.subscriptionPaid;
      members[idx] = {
        ...current,
        subscriptionPaid: paid,
        paidAt: paid ? new Date().toISOString() : undefined,
        cardIssued: paid
      };
      setStored(STORAGE_KEY_MEMBERS, members);
      return { success: true, member: members[idx] };
    }
    throw new Error('المنخرط غير موجود');
  },

  // 10. Admin - Assign Cohort
  async assignCohort(userEmail: string, id: string, cohortName: string): Promise<{ success: boolean; member: Member }> {
    try {
      const res = await fetch(`${API_BASE}/admin/members/${id}/cohort`, {
        method: 'PATCH',
        headers: getHeaders(userEmail),
        body: JSON.stringify({ cohortName })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const members = getLocalMembers();
    const idx = members.findIndex((m) => m.id === id);
    if (idx !== -1) {
      members[idx].cohortName = cohortName;
      setStored(STORAGE_KEY_MEMBERS, members);
      return { success: true, member: members[idx] };
    }
    throw new Error('المنخرط غير موجود');
  },

  // 11. Admin - Get Cohorts
  async getCohorts(userEmail: string): Promise<{ cohorts: Cohort[] }> {
    try {
      const res = await fetch(`${API_BASE}/admin/cohorts`, {
        headers: getHeaders(userEmail)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return { cohorts: getLocalCohorts() };
  },

  // 12. Admin - Add Cohort
  async addCohort(userEmail: string, cohort: Partial<Cohort>): Promise<{ success: boolean; cohort: Cohort }> {
    try {
      const res = await fetch(`${API_BASE}/admin/cohorts`, {
        method: 'POST',
        headers: getHeaders(userEmail),
        body: JSON.stringify(cohort)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const cohorts = getLocalCohorts();
    const newCohort: Cohort = {
      id: `cohort-${Date.now()}`,
      name: cohort.name || '',
      category: cohort.category || 'شباب القيم',
      targetGender: cohort.targetGender || 'ذكر',
      supervisorName: cohort.supervisorName || '',
      location: cohort.location || '',
      description: cohort.description || '',
      createdAt: new Date().toISOString()
    };
    cohorts.push(newCohort);
    setStored(STORAGE_KEY_COHORTS, cohorts);
    return { success: true, cohort: newCohort };
  },

  // 13. Admin - Update Cohort
  async updateCohort(userEmail: string, id: string, updates: Partial<Cohort>): Promise<{ success: boolean; cohort: Cohort }> {
    try {
      const res = await fetch(`${API_BASE}/admin/cohorts/${id}`, {
        method: 'PUT',
        headers: getHeaders(userEmail),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const cohorts = getLocalCohorts();
    const idx = cohorts.findIndex((c) => c.id === id);
    if (idx !== -1) {
      cohorts[idx] = { ...cohorts[idx], ...updates };
      setStored(STORAGE_KEY_COHORTS, cohorts);
      return { success: true, cohort: cohorts[idx] };
    }
    throw new Error('الفوج غير موجود');
  },

  // 14. Admin - Delete Cohort
  async deleteCohort(userEmail: string, id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/admin/cohorts/${id}`, {
        method: 'DELETE',
        headers: getHeaders(userEmail)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    let cohorts = getLocalCohorts();
    cohorts = cohorts.filter((c) => c.id !== id);
    setStored(STORAGE_KEY_COHORTS, cohorts);
    return { success: true, message: 'تم حذف الفوج بنجاح' };
  },

  // 15. Admin - Get Supervisors
  async getSupervisors(userEmail: string): Promise<{
    supervisors: Supervisor[];
    pending: Supervisor[];
    approved: Supervisor[];
    frozen: Supervisor[];
  }> {
    try {
      const res = await fetch(`${API_BASE}/admin/supervisors`, {
        headers: getHeaders(userEmail)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const supervisors = getLocalSupervisors();
    return {
      supervisors,
      pending: supervisors.filter((s) => s.status === 'pending'),
      approved: supervisors.filter((s) => s.status === 'approved'),
      frozen: supervisors.filter((s) => s.status === 'frozen')
    };
  },

  // 16. Admin - Update Supervisor Status
  async updateSupervisorStatus(
    userEmail: string, 
    id: string, 
    status: 'approved' | 'frozen' | 'rejected',
    options?: { isCohortTeacher?: boolean; assignedCohorts?: string[] }
  ) {
    try {
      const res = await fetch(`${API_BASE}/admin/supervisors/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(userEmail),
        body: JSON.stringify({ status, ...options })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const supervisors = getLocalSupervisors();
    const idx = supervisors.findIndex((s) => s.id === id);
    if (idx !== -1) {
      if (status === 'rejected') {
        supervisors.splice(idx, 1);
      } else {
        supervisors[idx].status = status;
        if (status === 'approved' && options) {
          if (options.isCohortTeacher === false) {
            supervisors[idx].isCohortTeacher = false;
            supervisors[idx].assignedCohorts = [];
          } else if (options.isCohortTeacher === true) {
            supervisors[idx].isCohortTeacher = true;
            if (options.assignedCohorts) {
              supervisors[idx].assignedCohorts = options.assignedCohorts;
            }
          }
        }
      }
      setStored(STORAGE_KEY_SUPERVISORS, supervisors);
      return { success: true, supervisor: supervisors[idx] };
    }
    throw new Error('المشرف غير موجود');
  },

  // 17. Admin - Update Supervisor Role & Cohorts
  async updateSupervisorDetails(userEmail: string, id: string, payload: {
    role?: string;
    assignedCohorts?: string[];
    isCohortTeacher?: boolean;
    firstName?: string;
    lastName?: string;
  }) {
    try {
      const res = await fetch(`${API_BASE}/admin/supervisors/${id}/update`, {
        method: 'PATCH',
        headers: getHeaders(userEmail),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const supervisors = getLocalSupervisors();
    const idx = supervisors.findIndex((s) => s.id === id);
    if (idx !== -1) {
      if (Array.isArray(payload.assignedCohorts)) {
        for (const cName of payload.assignedCohorts) {
          const currentCount = supervisors.filter(s => s.id !== id && s.status === 'approved' && s.assignedCohorts?.includes(cName)).length;
          if (currentCount >= 4) {
            throw new Error(`الفوج «${cName}» مكتمل المشرفين (الحد الأقصى هو 4 مشرفين لكل فوج).`);
          }
        }
      }
      supervisors[idx] = { ...supervisors[idx], ...payload };
      setStored(STORAGE_KEY_SUPERVISORS, supervisors);
      return { success: true, supervisor: supervisors[idx] };
    }
    throw new Error('المشرف غير موجود');
  },

  // 18. Admin - Delete Supervisor
  async deleteSupervisor(userEmail: string, id: string) {
    try {
      const res = await fetch(`${API_BASE}/admin/supervisors/${id}`, {
        method: 'DELETE',
        headers: getHeaders(userEmail)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    let supervisors = getLocalSupervisors();
    supervisors = supervisors.filter((s) => s.id !== id);
    setStored(STORAGE_KEY_SUPERVISORS, supervisors);
    return { success: true, message: 'تم حذف المشرف بنجاح' };
  },

  // 19. Admin - Photos
  async getAdminPhotos(userEmail: string): Promise<{ photos: ActivityPhoto[] }> {
    try {
      const res = await fetch(`${API_BASE}/admin/photos`, {
        headers: getHeaders(userEmail)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return { photos: getLocalPhotos() };
  },

  async addPhoto(userEmail: string, photo: Partial<ActivityPhoto>) {
    try {
      const res = await fetch(`${API_BASE}/admin/photos`, {
        method: 'POST',
        headers: getHeaders(userEmail),
        body: JSON.stringify(photo)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const photos = getLocalPhotos();
    const newPhoto: ActivityPhoto = {
      id: `photo-${Date.now()}`,
      title: photo.title || '',
      description: photo.description || '',
      imageUrl: photo.imageUrl || '',
      category: photo.category || 'خرجة ميدانية',
      published: photo.published ?? true,
      order: photos.length + 1,
      createdAt: new Date().toISOString()
    };
    photos.push(newPhoto);
    setStored(STORAGE_KEY_PHOTOS, photos);
    return { success: true, photo: newPhoto };
  },

  async updatePhoto(userEmail: string, id: string, updates: Partial<ActivityPhoto>) {
    try {
      const res = await fetch(`${API_BASE}/admin/photos/${id}`, {
        method: 'PUT',
        headers: getHeaders(userEmail),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const photos = getLocalPhotos();
    const idx = photos.findIndex((p) => p.id === id);
    if (idx !== -1) {
      photos[idx] = { ...photos[idx], ...updates };
      setStored(STORAGE_KEY_PHOTOS, photos);
      return { success: true, photo: photos[idx] };
    }
    throw new Error('الصورة غير موجودة');
  },

  async togglePhotoVisibility(userEmail: string, id: string) {
    try {
      const res = await fetch(`${API_BASE}/admin/photos/${id}/visibility`, {
        method: 'PATCH',
        headers: getHeaders(userEmail)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const photos = getLocalPhotos();
    const idx = photos.findIndex((p) => p.id === id);
    if (idx !== -1) {
      photos[idx].published = !photos[idx].published;
      setStored(STORAGE_KEY_PHOTOS, photos);
      return { success: true, photo: photos[idx] };
    }
    throw new Error('الصورة غير موجودة');
  },

  async deletePhoto(userEmail: string, id: string) {
    try {
      const res = await fetch(`${API_BASE}/admin/photos/${id}`, {
        method: 'DELETE',
        headers: getHeaders(userEmail)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    let photos = getLocalPhotos();
    photos = photos.filter((p) => p.id !== id);
    setStored(STORAGE_KEY_PHOTOS, photos);
    return { success: true, message: 'تم حذف الصورة بنجاح' };
  },

  // 20. Admin - Audit Logs
  async getAuditLogs(userEmail: string): Promise<{ logs: AuditLog[] }> {
    try {
      const res = await fetch(`${API_BASE}/admin/audit-logs`, {
        headers: getHeaders(userEmail)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    return {
      logs: [
        {
          id: `log-${Date.now()}`,
          action: 'تسجيل دخول الإدارة العليا',
          details: `تسجيل دخول ناجح للمشرف (${userEmail})`,
          performedBy: userEmail,
          timestamp: new Date().toISOString()
        }
      ]
    };
  }
};
