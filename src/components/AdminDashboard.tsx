import React, { useState, useEffect, useMemo } from 'react';
import { Member, Cohort, Supervisor, ActivityPhoto, AuditLog, AuthUser, Gender } from '../types';
import { api } from '../services/api';
import { LOGO_PROJECT, LOGO_ASSOCIATION, EDUCATION_LEVELS, HOBBIES, SUPER_ADMIN_EMAIL } from '../constants';
import { 
  Users, UserCheck, Shield, CreditCard, Clock, Layers, Search, Filter, 
  ArrowUpDown, Download, Plus, CheckCircle, XCircle, Printer, Edit, Trash2, 
  RefreshCw, MoveRight, Eye, EyeOff, ShieldAlert, LogOut, Check, ArrowRightLeft,
  Calendar, FileText, BadgeCheck, AlertCircle, MapPin
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: AuthUser;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onBackToHome
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'cohorts' | 'supervisors' | 'cards' | 'gallery' | 'logs'>('members');

  // Data states
  const [members, setMembers] = useState<Member[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [photos, setPhotos] = useState<ActivityPhoto[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Filters & sorting for Members tab
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'ذكر' | 'أنثى'>('all');
  const [filterCohort, setFilterCohort] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [sortField, setSortField] = useState<'name' | 'code' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [selectedMemberForCard, setSelectedMemberForCard] = useState<Member | null>(null);
  const [selectedMemberForCohort, setSelectedMemberForCohort] = useState<Member | null>(null);
  const [selectedCohortForPrint, setSelectedCohortForPrint] = useState<Cohort | null>(null);
  const [selectedCohortForSupervisors, setSelectedCohortForSupervisors] = useState<Cohort | null>(null);
  const [selectedSupervisorForAssign, setSelectedSupervisorForAssign] = useState<Supervisor | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddCohortModal, setShowAddCohortModal] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
  const [editCohortForm, setEditCohortForm] = useState({
    name: '',
    location: '',
    description: '',
    category: 'شباب القيم' as 'شباب القيم' | 'فتيات القيم',
    supervisorName: ''
  });

  // Add Member Form State
  const [newMemberForm, setNewMemberForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '2011-05-15',
    gender: 'ذكر' as Gender,
    educationLevel: 'السنة الثالثة متوسط',
    hobby: 'حفظ وتجويد القرآن الكريم',
    guardianName: '',
    guardianPhone: '',
    cohortName: 'غزة العزة',
    subscriptionPaid: false
  });

  // Add Cohort Form State
  const [newCohortForm, setNewCohortForm] = useState({
    name: '',
    category: 'شباب القيم' as 'شباب القيم' | 'فتيات القيم',
    supervisorName: '',
    location: 'تامست',
    description: ''
  });

  // Add Photo Form State
  const [newPhotoForm, setNewPhotoForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'خرجة ميدانية',
    published: true
  });

  // Load all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [membersRes, cohortsRes] = await Promise.all([
        api.getMembers(currentUser.email),
        api.getCohorts(currentUser.email)
      ]);
      setMembers(membersRes.members);
      setCohorts(cohortsRes.cohorts);

      if (currentUser.isOwner) {
        const [supRes, photoRes, logRes] = await Promise.all([
          api.getSupervisors(currentUser.email),
          api.getAdminPhotos(currentUser.email),
          api.getAuditLogs(currentUser.email)
        ]);
        setSupervisors(supRes.supervisors);
        setPhotos(photoRes.photos);
        setAuditLogs(logRes.logs);
      }
    } catch (err: any) {
      console.error(err);
      notify('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const notify = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // ---------------- MEMBERS ACTIONS ----------------
  const handleTogglePayment = async (memberId: string) => {
    try {
      const res = await api.togglePayment(currentUser.email, memberId);
      setMembers(prev => prev.map(m => m.id === memberId ? res.member : m));
      notify(`تم تحديث حالة الاشتراك للمنخرط (${res.member.firstName} ${res.member.lastName})`);
    } catch (err: any) {
      notify(err.message);
    }
  };

  const handleAssignCohort = async (memberId: string, cohortName: string) => {
    try {
      const res = await api.assignCohort(currentUser.email, memberId, cohortName);
      setMembers(prev => prev.map(m => m.id === memberId ? res.member : m));
      setSelectedMemberForCohort(null);
      notify(`تم نقل المنخرط إلى فوج: ${cohortName}`);
    } catch (err: any) {
      notify(err.message);
    }
  };

  const handleDeleteMember = async (member: Member) => {
    if (!window.confirm(`هل أنت متأكد من حذف المنخرط (${member.firstName} ${member.lastName}) نهائياً؟`)) {
      return;
    }
    try {
      await api.deleteMember(currentUser.email, member.id);
      setMembers(prev => prev.filter(m => m.id !== member.id));
      notify(`تم حذف المنخرط (${member.firstName} ${member.lastName}) بنجاح`);
    } catch (err: any) {
      notify(err.message);
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.addMember(currentUser.email, newMemberForm);
      setMembers(prev => [res.member, ...prev]);
      setShowAddMemberModal(false);
      setNewMemberForm({
        firstName: '',
        lastName: '',
        birthDate: '2011-05-15',
        gender: 'ذكر',
        educationLevel: 'السنة الثالثة متوسط',
        hobby: 'حفظ وتجويد القرآن الكريم',
        guardianName: '',
        guardianPhone: '',
        cohortName: 'غزة العزة',
        subscriptionPaid: false
      });
      notify(`تمت إضافة المنخرط (${res.member.firstName} ${res.member.lastName}) بنجاح`);
    } catch (err: any) {
      notify(err.message);
    }
  };

  // ---------------- COHORTS ACTIONS ----------------
  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.addCohort(currentUser.email, {
        name: newCohortForm.name,
        category: newCohortForm.category,
        supervisorName: newCohortForm.supervisorName,
        location: newCohortForm.location,
        description: newCohortForm.description
      });
      setCohorts(prev => [...prev, res.cohort]);
      setShowAddCohortModal(false);
      setNewCohortForm({
        name: '',
        category: 'شباب القيم',
        supervisorName: '',
        location: 'تامست',
        description: ''
      });
      notify(`تم إنشاء فوج (${res.cohort.name}) بنجاح`);
    } catch (err: any) {
      notify(err.message);
    }
  };

  const handleDeleteCohort = async (cohort: Cohort) => {
    if (!window.confirm(`تأكيد حذف فوج (${cohort.name})؟ سيتم تحويل المنخرطين التابعين له لحالة قيد التوزيع.`)) {
      return;
    }
    try {
      await api.deleteCohort(currentUser.email, cohort.id);
      setCohorts(prev => prev.filter(c => c.id !== cohort.id));
      setMembers(prev => prev.map(m => m.cohortName === cohort.name ? { ...m, cohortName: 'قيد التوزيع' } : m));
      notify(`تم حذف فوج (${cohort.name})`);
    } catch (err: any) {
      notify(err.message);
    }
  };

  const handleOpenEditCohort = (cohort: Cohort) => {
    setEditingCohort(cohort);
    setEditCohortForm({
      name: cohort.name,
      location: cohort.location || '',
      description: cohort.description || '',
      category: cohort.category,
      supervisorName: cohort.supervisorName || ''
    });
  };

  const handleSaveEditCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCohort) return;
    if (!editCohortForm.name.trim() || !editCohortForm.location.trim()) {
      notify('يرجى ملء اسم الفوج والمكان.');
      return;
    }
    try {
      const res = await api.updateCohort(currentUser.email, editingCohort.id, {
        name: editCohortForm.name.trim(),
        location: editCohortForm.location.trim(),
        description: editCohortForm.description.trim(),
        category: editCohortForm.category,
        supervisorName: editCohortForm.supervisorName.trim()
      });
      setCohorts(prev => prev.map(c => c.id === editingCohort.id ? res.cohort : c));
      if (editingCohort.name !== res.cohort.name) {
        setMembers(prev => prev.map(m => m.cohortName === editingCohort.name ? { ...m, cohortName: res.cohort.name } : m));
      }
      setEditingCohort(null);
      notify(`تم تعديل اسم ومكان فوج «${res.cohort.name}» بنجاح.`);
    } catch (err: any) {
      notify(err.message || 'فشل تعديل الفوج.');
    }
  };

  // ---------------- SUPERVISORS ACTIONS ----------------
  const handleUpdateSupervisorStatus = async (
    id: string, 
    status: 'approved' | 'frozen' | 'rejected',
    options?: { isCohortTeacher?: boolean; assignedCohorts?: string[] }
  ) => {
    try {
      await api.updateSupervisorStatus(currentUser.email, id, status, options);
      if (status === 'rejected') {
        setSupervisors(prev => prev.filter(s => s.id !== id));
        notify('تم رفض طلب المشرف.');
      } else {
        setSupervisors(prev => prev.map(s => {
          if (s.id === id) {
            return {
              ...s,
              status,
              isCohortTeacher: options?.isCohortTeacher !== undefined ? options.isCohortTeacher : s.isCohortTeacher,
              assignedCohorts: options?.assignedCohorts !== undefined ? options.assignedCohorts : s.assignedCohorts
            };
          }
          return s;
        }));
        const cohortsRes = await api.getCohorts(currentUser.email);
        setCohorts(cohortsRes.cohorts);
        notify(`تم تحديث حالة المشرف إلى: ${status === 'approved' ? (options?.isCohortTeacher ? 'معتمد كأستاذ فوج' : 'مشرف معتمد (بدون فوج)') : 'مجمد'}`);
      }
    } catch (err: any) {
      notify(err.message || 'حدث خطأ');
    }
  };

  const handleUnassignCohortTeacher = async (sup: Supervisor) => {
    if (!window.confirm(`هل أنت متأكد من سحب صفة أستاذ فوج عن المشرف (${sup.firstName} ${sup.lastName}) والاحتفاظ به كمشرف عام معتمد؟`)) {
      return;
    }
    try {
      await api.updateSupervisorDetails(currentUser.email, sup.id, {
        isCohortTeacher: false,
        assignedCohorts: []
      });
      setSupervisors(prev => prev.map(s => s.id === sup.id ? { ...s, isCohortTeacher: false, assignedCohorts: [] } : s));
      const cohortsRes = await api.getCohorts(currentUser.email);
      setCohorts(cohortsRes.cohorts);
      notify(`تم سحب صفة أستاذ فوج عن المشرف (${sup.firstName} ${sup.lastName}) وأصبح مشرفاً عاماً معتمداً.`);
    } catch (err: any) {
      notify(err.message || 'فشلت العملية');
    }
  };

  const handleAddSupervisorToCohort = async (cohort: Cohort, supervisorEmail: string) => {
    try {
      const sup = supervisors.find(s => s.email === supervisorEmail);
      if (!sup) return;
      const currentAssigned = sup.assignedCohorts || [];
      if (currentAssigned.includes(cohort.name)) {
        notify('المشرف مسند لهذا الفوج بالفعل.');
        return;
      }
      const newAssigned = [...currentAssigned, cohort.name];
      await api.updateSupervisorDetails(currentUser.email, sup.id, {
        assignedCohorts: newAssigned,
        isCohortTeacher: true
      });
      setSupervisors(prev => prev.map(s => s.id === sup.id ? { ...s, assignedCohorts: newAssigned, isCohortTeacher: true } : s));
      const cohortsRes = await api.getCohorts(currentUser.email);
      setCohorts(cohortsRes.cohorts);
      notify(`تم إسناد المشرف (${sup.firstName} ${sup.lastName}) إلى فوج «${cohort.name}».`);
    } catch (err: any) {
      notify(err.message || 'فشل إسناد المشرف للفوج');
    }
  };

  const handleRemoveSupervisorFromCohort = async (cohort: Cohort, supervisorName: string) => {
    try {
      const cleanName = supervisorName.replace(/^أ\.\s*/, '').trim();
      const sup = supervisors.find(s => `${s.firstName} ${s.lastName}`.trim() === cleanName || `${s.lastName} ${s.firstName}`.trim() === cleanName);
      if (!sup) {
        notify('تم تحديث قائمة المشرفين.');
        return;
      }
      const newAssigned = (sup.assignedCohorts || []).filter(c => c !== cohort.name);
      await api.updateSupervisorDetails(currentUser.email, sup.id, {
        assignedCohorts: newAssigned,
        isCohortTeacher: newAssigned.length > 0
      });
      setSupervisors(prev => prev.map(s => s.id === sup.id ? { ...s, assignedCohorts: newAssigned, isCohortTeacher: newAssigned.length > 0 } : s));
      const cohortsRes = await api.getCohorts(currentUser.email);
      setCohorts(cohortsRes.cohorts);
      notify(`تمت إزالة المشرف (${sup.firstName} ${sup.lastName}) من فوج «${cohort.name}».`);
    } catch (err: any) {
      notify(err.message || 'فشلت إزالة المشرف');
    }
  };

  const handleUpdateSupervisorRole = async (id: string, newRole: string) => {
    try {
      await api.updateSupervisorDetails(currentUser.email, id, { role: newRole });
      setSupervisors(prev => prev.map(s => s.id === id ? { ...s, role: newRole } : s));
      notify('تم تحديث صفة المشرف.');
    } catch (err: any) {
      notify(err.message);
    }
  };

  const handleAssignSupervisorCohorts = async (id: string, cohortList: string[]) => {
    try {
      await api.updateSupervisorDetails(currentUser.email, id, { assignedCohorts: cohortList });
      setSupervisors(prev => prev.map(s => s.id === id ? { ...s, assignedCohorts: cohortList } : s));
      notify('تم تحديث توزيع المشرف على الأفواج.');
    } catch (err: any) {
      notify(err.message);
    }
  };

  const handleDeleteSupervisor = async (id: string, name: string) => {
    if (!window.confirm(`إلغاء اعتماد وحذف المشرف (${name}) فوراً وسحب وصوله للمنظومة؟`)) {
      return;
    }
    try {
      await api.deleteSupervisor(currentUser.email, id);
      setSupervisors(prev => prev.filter(s => s.id !== id));
      notify(`تم سحب صلاحيات وحذف المشرف (${name}) بنجاح`);
    } catch (err: any) {
      notify(err.message);
    }
  };

  // ---------------- PHOTOS ACTIONS ----------------
  const handleTogglePhotoVisibility = async (id: string) => {
    try {
      const res = await api.togglePhotoVisibility(currentUser.email, id);
      setPhotos(prev => prev.map(p => p.id === id ? res.photo : p));
      notify(`تم ${res.photo.published ? 'نشر' : 'إخفاء'} الصورة.`);
    } catch (err: any) {
      notify(err.message);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف الصورة من المعرض؟')) return;
    try {
      await api.deletePhoto(currentUser.email, id);
      setPhotos(prev => prev.filter(p => p.id !== id));
      notify('تم حذف الصورة من المعرض.');
    } catch (err: any) {
      notify(err.message);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.addPhoto(currentUser.email, newPhotoForm);
      setPhotos(prev => [res.photo, ...prev]);
      setShowAddPhotoModal(false);
      setNewPhotoForm({
        title: '',
        description: '',
        imageUrl: '',
        category: 'خرجة ميدانية',
        published: true
      });
      notify('تمت إضافة الصورة بنجاح.');
    } catch (err: any) {
      notify(err.message);
    }
  };

  // ---------------- FILTERED MEMBERS ----------------
  const filteredMembers = useMemo(() => {
    return members
      .filter(m => {
        // For regular supervisors: only show members of their assigned cohort(s)
        if (!currentUser.isOwner) {
          const supervisorCohorts = currentUser.assignedCohorts || [];
          if (!supervisorCohorts.includes(m.cohortName)) {
            return false;
          }
        }
        const fullText = `${m.firstName} ${m.lastName} ${m.code} ${m.guardianPhone}`.toLowerCase();
        const matchesQuery = fullText.includes(searchQuery.toLowerCase());
        const matchesGender = filterGender === 'all' || m.gender === filterGender;
        const matchesCohort = filterCohort === 'all' || m.cohortName === filterCohort;
        const matchesPayment = 
          filterPayment === 'all' || 
          (filterPayment === 'paid' && m.subscriptionPaid) || 
          (filterPayment === 'unpaid' && !m.subscriptionPaid);

        return matchesQuery && matchesGender && matchesCohort && matchesPayment;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          const nameA = `${a.firstName} ${a.lastName}`;
          const nameB = `${b.firstName} ${b.lastName}`;
          return sortOrder === 'asc' ? nameA.localeCompare(nameB, 'ar') : nameB.localeCompare(nameA, 'ar');
        }
        if (sortField === 'code') {
          return sortOrder === 'asc' ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code);
        }
        return sortOrder === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [members, searchQuery, filterGender, filterCohort, filterPayment, sortField, sortOrder]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["الرمز", "الاسم", "اللقب", "الجنس", "تاريخ الميلاد", "المستوى الدراسي", "الهواية", "اسم الولي", "رقم هاتف الولي", "الفوج المسند", "حالة الاشتراك (500 دج)"];
    const rows = filteredMembers.map(m => [
      m.code,
      m.firstName,
      m.lastName,
      m.gender,
      m.birthDate,
      m.educationLevel,
      m.hobby,
      m.guardianName,
      m.guardianPhone,
      m.cohortName,
      m.subscriptionPaid ? "مسدد" : "غير مسدد"
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `قائمة_منخرطي_شباب_القيم_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculation
  const maleCount = members.filter(m => m.gender === 'ذكر').length;
  const femaleCount = members.filter(m => m.gender === 'أنثى').length;
  const paidCount = members.filter(m => m.subscriptionPaid).length;
  const pendingSupervisorsCount = supervisors.filter(s => s.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#f7faf8] py-8 px-4 sm:px-6 lg:px-8 text-right">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Action toast */}
        {actionMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#003a29] text-white px-6 py-3 rounded-2xl shadow-2xl border border-[#aff0d2]/50 flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-5 h-5 text-[#aff0d2]" />
            <span className="text-sm font-bold">{actionMessage}</span>
          </div>
        )}

        {/* Top Header Command Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#0d533d]/15 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#003a29]">
                لوحة الإدارة المركزية - الإشراف العام للفوج
              </h1>
              <span className="px-3 py-1 rounded-full bg-[#eefdf6] text-[#003a29] border border-[#0d533d]/20 text-xs font-black flex items-center gap-1 shadow-xs">
                <BadgeCheck className="w-4 h-4 text-[#003a29]" />
                المرجع الأعلى للقرارات
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#404944]">
              منظومة الضبط والمصادقة الميدانية لمشروع شباب القيم تامست - جمعية المعالي للعلوم والتربية
            </p>
          </div>

          {/* User Identity & Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3 bg-[#e8f7f0] px-4 py-2 rounded-2xl border border-[#0d533d]/20">
              <div className="w-10 h-10 rounded-xl bg-[#0d533d] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Shield className="w-5 h-5 text-[#aff0d2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#003a29] font-bold">
                  {currentUser.isOwner ? 'الحساب المالك والمشرف العام (كامل الصلاحيات)' : 'مشرف معتمد'}
                </span>
                <span className="font-mono text-xs sm:text-sm font-black text-[#003a29] dir-ltr select-all">
                  {currentUser.email}
                </span>
              </div>
            </div>

            <button
              onClick={onBackToHome}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#0d533d]/20 text-[#003a29] text-xs sm:text-sm font-bold hover:bg-[#eefdf6] transition-colors cursor-pointer"
            >
              العودة للموقع العام
            </button>
            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab] transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Statistics KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#0d533d]/15 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#404944]">
              <span className="text-xs font-bold">إجمالي المسجلين</span>
              <Users className="w-5 h-5 text-[#003a29]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#003a29] tabular-nums">
                {members.length}
              </span>
              <span className="text-xs text-[#404944]">منخرط</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#0d533d]/15 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#404944]">
              <span className="text-xs font-bold">الذكور (الفتيان)</span>
              <span className="text-xs font-bold text-[#003554]">شباب</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#003554] tabular-nums">
                {maleCount}
              </span>
              <span className="text-xs text-[#404944]">
                {members.length ? Math.round((maleCount / members.length) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#0d533d]/15 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#404944]">
              <span className="text-xs font-bold">الإناث (الفتيات)</span>
              <span className="text-xs font-bold text-[#0d533d]">فتيات</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#0d533d] tabular-nums">
                {femaleCount}
              </span>
              <span className="text-xs text-[#404944]">
                {members.length ? Math.round((femaleCount / members.length) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#0d533d]/15 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#404944]">
              <span className="text-xs font-bold">الاشتراكات (500 دج)</span>
              <CreditCard className="w-5 h-5 text-[#0d533d]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#0d533d] tabular-nums">
                {paidCount}
              </span>
              <span className="text-xs text-[#404944]">مسدد</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#0d533d]/15 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#404944]">
              <span className="text-xs font-bold">طلبات المشرفين</span>
              <Clock className="w-5 h-5 text-[#ba1a1a]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className={`text-2xl sm:text-3xl font-black tabular-nums ${pendingSupervisorsCount > 0 ? 'text-[#ba1a1a]' : 'text-[#404944]'}`}>
                {pendingSupervisorsCount}
              </span>
              <span className="text-xs text-[#ba1a1a]">قيد الفحص</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#0d533d]/15 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#404944]">
              <span className="text-xs font-bold">الأفواج الميدانية</span>
              <Layers className="w-5 h-5 text-[#003a29]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#003a29] tabular-nums">
                {cohorts.length}
              </span>
              <span className="text-xs text-[#404944]">أفواج</span>
            </div>
          </div>
        </div>

        {/* Primary Interactive Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'members'
                ? 'bg-[#003a29] text-white shadow-md'
                : 'bg-white text-[#404944] border border-[#0d533d]/15 hover:bg-[#eefdf6]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>إدارة تسجيلات الشباب والفتيات</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs tabular-nums">
              {members.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cohorts')}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'cohorts'
                ? 'bg-[#003a29] text-white shadow-md'
                : 'bg-white text-[#404944] border border-[#0d533d]/15 hover:bg-[#eefdf6]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>إدارة الأفواج وتوزيع المجموعات</span>
          </button>

          {currentUser.isOwner && (
            <button
              onClick={() => setActiveTab('supervisors')}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'supervisors'
                  ? 'bg-[#003a29] text-white shadow-md'
                  : 'bg-white text-[#404944] border border-[#0d533d]/15 hover:bg-[#eefdf6]'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>إدارة المشرفين والصلاحيات</span>
              {pendingSupervisorsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping" />
              )}
            </button>
          )}

          <button
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-[#003a29] text-white shadow-md'
                : 'bg-white text-[#404944] border border-[#0d533d]/15 hover:bg-[#eefdf6]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>الاشتراكات وبطاقات الانخراط</span>
          </button>

          {currentUser.isOwner && (
            <>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-[#003a29] text-white shadow-md'
                    : 'bg-white text-[#404944] border border-[#0d533d]/15 hover:bg-[#eefdf6]'
                }`}
              >
                <span>معرض الصور والنشاطات</span>
              </button>

              <button
                onClick={() => setActiveTab('logs')}
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'logs'
                    ? 'bg-[#003a29] text-white shadow-md'
                    : 'bg-white text-[#404944] border border-[#0d533d]/15 hover:bg-[#eefdf6]'
                }`}
              >
                <span>سجل العمليات والتدقيق الأمني</span>
              </button>
            </>
          )}
        </div>

        {/* ---------------- TAB 1: MEMBERS MANAGEMENT ---------------- */}
        {activeTab === 'members' && (
          <div className="flex flex-col gap-4">

            {/* Supervisor scope notice */}
            {!currentUser.isOwner && (
              <div className="bg-[#e8f7f0] border border-[#0d533d]/20 rounded-2xl p-4 flex items-center justify-between text-right">
                <div className="flex items-center gap-2.5">
                  <BadgeCheck className="w-5 h-5 text-[#0d533d] shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#003a29] block">
                      صلاحية المشرف الميداني:
                    </span>
                    <span className="text-xs text-[#404944]">
                      أنت تدير منخرطي الفوج المسند إليك ({currentUser.assignedCohorts?.join('، ') || 'المسند'}). يمكنك إضافة منخرطين جدد لهذا الفوج فقط.
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Filter and Smart Search Toolbar */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#0d533d]/15 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                
                {/* Search */}
                <div className="md:col-span-4 relative">
                  <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-[#707973]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="البحث بالاسم واللقب، الرمز، أو الهاتف..."
                    className="w-full pr-10 pl-4 py-2.5 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d] transition-all"
                  />
                </div>

                {/* Filter Gender */}
                <div className="md:col-span-2">
                  <select
                    value={filterGender}
                    onChange={(e: any) => setFilterGender(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0d533d]"
                  >
                    <option value="all">الجنس: الكل</option>
                    <option value="ذكر">شباب (ذكور فقط)</option>
                    <option value="أنثى">فتيات (إناث فقط)</option>
                  </select>
                </div>

                {/* Filter Cohort */}
                <div className="md:col-span-3">
                  <select
                    value={filterCohort}
                    onChange={(e) => setFilterCohort(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0d533d]"
                  >
                    <option value="all">الفوج: جميع الأفواج</option>
                    {cohorts.map((c) => (
                      <option key={c.id} value={c.name}>{c.name} ({c.category})</option>
                    ))}
                    <option value="قيد التوزيع">قيد التوزيع</option>
                  </select>
                </div>

                {/* Filter Payment */}
                <div className="md:col-span-3">
                  <select
                    value={filterPayment}
                    onChange={(e: any) => setFilterPayment(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0d533d]"
                  >
                    <option value="all">الاشتراك: الكل</option>
                    <option value="paid">مسدد (500 دج)</option>
                    <option value="unpaid">غير مسدد بعد</option>
                  </select>
                </div>

              </div>

              {/* Bottom Toolbar Action Strip */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-slate-100 text-xs sm:text-sm text-[#404944]">
                <div className="flex items-center gap-3">
                  <span>نتائج الفرز: <strong className="text-[#003a29] font-black">{filteredMembers.length}</strong> منخرطاً</span>
                  <span>•</span>
                  <span>الاشتراك المعتمد: 500 دج / الحصة الأولى</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    }}
                    className="px-3 py-2 rounded-xl bg-[#eefdf6] border border-[#0d533d]/20 text-[#003a29] text-xs font-bold flex items-center gap-1.5 hover:bg-[#ddece5] cursor-pointer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>ترتيب: {sortOrder === 'asc' ? 'تصاعدي' : 'تنازلي'}</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 rounded-xl bg-[#eefdf6] border border-[#0d533d]/20 text-[#003a29] text-xs font-bold flex items-center gap-1.5 hover:bg-[#ddece5] cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#003a29]" />
                    <span>تصدير Excel (CSV)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!currentUser.isOwner && currentUser.assignedCohorts?.[0]) {
                        setNewMemberForm(prev => ({ ...prev, cohortName: currentUser.assignedCohorts[0] }));
                      }
                      setShowAddMemberModal(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#003a29] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#0d533d] shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة منخرط جديد</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Table of Members */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#0d533d]/15 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-[#eefdf6] text-[#404944] text-xs font-black border-b border-[#0d533d]/10">
                      <th className="p-4">الرمز</th>
                      <th className="p-4">الاسم واللقب</th>
                      <th className="p-4">الجنس</th>
                      <th className="p-4">المستوى الدراسي</th>
                      <th className="p-4">بيانات الولي (محمية)</th>
                      <th className="p-4">الفوج المسند</th>
                      <th className="p-4">حالة الاشتراك (500 دج)</th>
                      <th className="p-4 text-center">الإجراءات والبطاقة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-[#111e1a]">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-[#404944]">
                          لا توجد نتائج تطابق خيارات البحث الحالية.
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-[#eefdf6]/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-[#707973]">{member.code}</td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-[#003a29] text-sm sm:text-base">
                                {member.firstName} {member.lastName}
                              </span>
                              <span className="text-[11px] text-[#707973] truncate max-w-[150px]">
                                الهواية: {member.hobby}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              member.gender === 'ذكر' 
                                ? 'bg-[#cce5ff] text-[#003554]' 
                                : 'bg-[#eefdf6] text-[#003a29] border border-[#0d533d]/20'
                            }`}>
                              {member.gender === 'ذكر' ? 'ذكر (شباب)' : 'أنثى (فتيات)'}
                            </span>
                          </td>
                          <td className="p-4 font-medium">{member.educationLevel}</td>
                          <td className="p-4">
                            <div className="flex flex-col text-xs">
                              <span className="font-bold text-[#404944]">{member.guardianName}</span>
                              <span className="font-mono text-[#003a29] font-bold dir-ltr">
                                {member.guardianPhone}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full bg-[#e8f7f0] text-[#003a29] font-bold text-xs border border-[#0d533d]/15">
                              {member.cohortName}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleTogglePayment(member.id)}
                              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                member.subscriptionPaid
                                  ? 'bg-[#aff0d2] text-[#003a29] hover:bg-[#86c5a9]'
                                  : 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab]'
                              }`}
                              title="انقر لتغيير حالة الاشتراك"
                            >
                              {member.subscriptionPaid ? (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>مسدد (500 دج)</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>غير مسدد (تأكيد)</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Print membership card */}
                              <button
                                onClick={() => setSelectedMemberForCard(member)}
                                className="p-2 rounded-xl bg-[#eefdf6] text-[#003a29] hover:bg-[#003a29] hover:text-white transition-colors cursor-pointer"
                                title="إصدار وطباعة بطاقة الانخراط الرسمية"
                              >
                                <CreditCard className="w-4 h-4" />
                              </button>

                              {/* Reassign Cohort (Admin only) */}
                              {currentUser.isOwner && (
                                <button
                                  onClick={() => setSelectedMemberForCohort(member)}
                                  className="p-2 rounded-xl bg-[#eefdf6] text-[#003a29] hover:bg-[#ddece5] transition-colors cursor-pointer"
                                  title="نقل إلى فوج آخر"
                                >
                                  <ArrowRightLeft className="w-4 h-4" />
                                </button>
                              )}

                              {/* Delete member */}
                              {currentUser.isOwner && (
                                <button
                                  onClick={() => handleDeleteMember(member)}
                                  className="p-2 rounded-xl bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab] transition-colors cursor-pointer"
                                  title="حذف المنخرط"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ---------------- TAB 2: COHORTS MANAGEMENT ---------------- */}
        {activeTab === 'cohorts' && (
          <div className="flex flex-col gap-6">

            {/* Supervisor cohort scope notice */}
            {!currentUser.isOwner && (
              <div className="bg-[#e8f7f0] border border-[#0d533d]/20 rounded-2xl p-4 flex items-center justify-between text-right">
                <div className="flex items-center gap-2.5">
                  <BadgeCheck className="w-5 h-5 text-[#0d533d] shrink-0" />
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#003a29] block">
                      صلاحية المشرف على الأفواج:
                    </span>
                    <span className="text-xs text-[#404944]">
                      يمكنك التعديل في بيانات الفوج الخاص بك ({currentUser.assignedCohorts?.join('، ') || 'المسند'}) وإضافة المنخرطين له فقط.
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-sm border border-[#0d533d]/15">
              <div>
                <h2 className="text-xl font-black text-[#003a29]">تنظيم الأفواج والمجموعات الميدانية</h2>
                <p className="text-xs text-[#404944]">
                  التقسيم المعتمد: «شباب القيم» للذكور و«فتيات القيم» للإناث مع المتابعة التربوية الدقيقة
                </p>
              </div>

              {currentUser.isOwner && (
                <button
                  onClick={() => setShowAddCohortModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-[#003a29] text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-[#0d533d] shadow-sm cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>إنشاء فوج تربوي جديد</span>
                </button>
              )}
            </div>

            {/* Cohorts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cohorts.map((cohort) => {
                const assigned = members.filter(m => m.cohortName === cohort.name);
                const paid = assigned.filter(m => m.subscriptionPaid).length;

                return (
                  <div key={cohort.id} className="bg-white rounded-3xl shadow-sm border border-[#0d533d]/15 overflow-hidden flex flex-col justify-between">
                    <div className="p-6 flex flex-col gap-4">
                      
                      {/* Top Cohort Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                            cohort.category === 'فتيات القيم'
                              ? 'bg-[#eefdf6] text-[#003a29] border border-[#0d533d]/20'
                              : 'bg-[#e8f7f0] text-[#003a29]'
                          }`}>
                            <Layers className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xl font-black text-[#003a29] flex items-center gap-1.5">
                                <span>فوج «{cohort.name}»</span>
                                {(currentUser.isOwner || (currentUser.assignedCohorts && currentUser.assignedCohorts.includes(cohort.name))) && (
                                  <button
                                    onClick={() => handleOpenEditCohort(cohort)}
                                    className="p-1 rounded-lg text-[#003a29] hover:bg-[#eefdf6] transition-colors cursor-pointer"
                                    title="تعديل اسم الفوج والمكان"
                                    aria-label="تعديل اسم الفوج والمكان"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                )}
                              </h3>
                              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                cohort.category === 'فتيات القيم'
                                  ? 'bg-[#eefdf6] text-[#003a29] border border-[#0d533d]/20'
                                  : 'bg-[#aff0d2] text-[#003a29]'
                              }`}>
                                {cohort.category}
                              </span>
                            </div>
                            <span className="text-xs text-[#707973] flex items-center gap-1.5 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-[#003a29] shrink-0" />
                              <span>{cohort.location}</span>
                              {(currentUser.isOwner || (currentUser.assignedCohorts && currentUser.assignedCohorts.includes(cohort.name))) && (
                                <button
                                  onClick={() => handleOpenEditCohort(cohort)}
                                  className="p-0.5 px-1.5 rounded-md text-[#003a29] hover:bg-[#eefdf6] transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold mr-1"
                                  title="تعديل مكان ومقر الفوج"
                                  aria-label="تعديل مكان ومقر الفوج"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>تعديل المكان</span>
                                </button>
                              )}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-[#eefdf6] text-[#003a29] border border-[#0d533d]/15">
                          {assigned.length} منخرطاً
                        </span>
                      </div>

                      {/* Supervisors Section (Up to 4 supervisors per cohort) */}
                      {(() => {
                        const currentSupervisors = supervisors
                          .filter(s => s.status === 'approved' && s.assignedCohorts?.includes(cohort.name))
                          .map(s => `${s.firstName} ${s.lastName}`);
                        const allCohortSupervisors = Array.from(new Set([
                          ...(cohort.supervisors || []),
                          ...currentSupervisors,
                          ...(cohort.supervisorName && cohort.supervisorName !== 'لم يحدد بعد' ? [cohort.supervisorName.replace(/^أ\.\s*/, '')] : [])
                        ])).filter(Boolean);

                        return (
                          <div className="bg-[#eefdf6] p-3.5 rounded-2xl border border-[#0d533d]/15 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-[#003a29]" />
                                <span className="text-xs font-bold text-[#003a29]">
                                  مشرفو وأساتذة الفوج:
                                </span>
                              </div>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-[#003a29] border border-[#0d533d]/15">
                                {allCohortSupervisors.length} من 4 مشرفين
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {allCohortSupervisors.length > 0 ? (
                                allCohortSupervisors.map((sName, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white text-[#003a29] border border-[#0d533d]/20 text-xs font-bold shadow-xs"
                                  >
                                    <span>أ. {sName}</span>
                                    {currentUser.isOwner && (
                                      <button
                                        onClick={() => handleRemoveSupervisorFromCohort(cohort, sName)}
                                        className="text-[#ba1a1a] hover:bg-[#ffdad6] rounded-full p-0.5 cursor-pointer"
                                        title="إزالة المشرف من هذا الفوج"
                                      >
                                        <XCircle className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-[#707973] italic">
                                  لم يتم تعيين مشرفين بعد (يمكن إضافة حتى 4 مشرفين).
                                </span>
                              )}
                            </div>

                            {currentUser.isOwner && allCohortSupervisors.length < 4 && (
                              <button
                                onClick={() => setSelectedCohortForSupervisors(cohort)}
                                className="self-start mt-1 text-xs font-bold text-[#003a29] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>إسناد مشرف للفوج (المتاح: {4 - allCohortSupervisors.length} مقاعد إشراف)</span>
                              </button>
                            )}
                          </div>
                        );
                      })()}

                      <p className="text-xs text-[#404944] leading-relaxed">
                        {cohort.description || 'فوج تربوي مخصص لغرس القيم وبناء السلوك والأخلاق الفاضلة.'}
                      </p>

                      {/* Stats Strip */}
                      <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
                        <div className="p-2.5 rounded-xl bg-[#eefdf6]">
                          <span className="block text-[11px] text-[#707973]">المسددين للبطاقة</span>
                          <span className="font-black text-sm text-[#003a29]">{paid}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#eefdf6]">
                          <span className="block text-[11px] text-[#707973]">غير المسددين</span>
                          <span className="font-black text-sm text-[#ba1a1a]">{assigned.length - paid}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#eefdf6]">
                          <span className="block text-[11px] text-[#707973]">نسبة السداد</span>
                          <span className="font-black text-sm text-[#003a29]">
                            {assigned.length ? Math.round((paid / assigned.length) * 100) : 0}%
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Actions */}
                    <div className="bg-[#eefdf6] px-6 py-3.5 border-t border-[#0d533d]/10 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedCohortForPrint(cohort)}
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-[#0d533d]/20 text-[#003a29] text-xs font-bold flex items-center gap-1.5 hover:bg-[#ddece5] cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>طباعة وتصدير قائمة الفوج</span>
                      </button>

                      {currentUser.isOwner && cohort.name !== 'غزة العزة' && cohort.name !== 'طوفان الأقصى' && (
                        <button
                          onClick={() => handleDeleteCohort(cohort)}
                          className="text-xs text-[#ba1a1a] hover:underline cursor-pointer"
                        >
                          حذف الفوج
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: SUPERVISORS & PRIVILEGES (OWNER ONLY) ---------------- */}
        {activeTab === 'supervisors' && currentUser.isOwner && (
          <div className="flex flex-col gap-6">
            
            {/* Pending Requests Callout */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#0d533d]/15 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#003a29]">
                  <Clock className="w-5 h-5 text-[#ba1a1a]" />
                  <h2 className="text-lg font-black">طلبات انضمام المشرفين المعلقة (تنتظر موافقة المالك)</h2>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ffdad6] text-[#ba1a1a]">
                  {pendingSupervisorsCount} بانتظار الاعتماد
                </span>
              </div>

              {supervisors.filter(s => s.status === 'pending').length === 0 ? (
                <p className="text-xs text-[#707973] py-2">لا توجد طلبات معلقة حالياً.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supervisors.filter(s => s.status === 'pending').map((sup) => (
                    <div key={sup.id} className="p-4 rounded-2xl bg-[#eefdf6] border border-[#0d533d]/20 flex flex-col justify-between gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-[#003a29] text-sm">
                            {sup.firstName} {sup.lastName}
                          </span>
                          <span className="text-xs font-mono text-[#707973] dir-ltr inline-block self-start">
                            {sup.email}
                          </span>
                          <span className="text-xs font-bold text-[#003a29] mt-1">
                            الصفة المطلوبة: {sup.role}
                          </span>
                          {sup.experience && (
                            <p className="text-xs text-[#404944] mt-1 line-clamp-2">
                              «{sup.experience}»
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-200">
                        <button
                          onClick={() => handleUpdateSupervisorStatus(sup.id, 'approved', { isCohortTeacher: false, assignedCohorts: [] })}
                          className="w-full sm:flex-1 py-2 px-2.5 rounded-xl bg-white border border-[#0d533d]/30 text-[#003a29] text-xs font-bold hover:bg-[#eefdf6] transition-colors cursor-pointer text-center"
                          title="قبول واعتماد المشرف دون إعطائه صفة أستاذ فوج (صلاحيات عامة)"
                        >
                          قبول مشرف عام (بدون صفة أستاذ فوج)
                        </button>
                        <button
                          onClick={() => setSelectedSupervisorForAssign(sup)}
                          className="w-full sm:flex-1 py-2 px-2.5 rounded-xl bg-[#003a29] text-white text-xs font-bold hover:bg-[#0d533d] transition-colors cursor-pointer text-center shadow-xs"
                          title="قبول وإسناده كأستاذ لأحد الأفواج (حتى 4 مشرفين للفوج)"
                        >
                          قبول وتعيين كأستاذ فوج
                        </button>
                        <button
                          onClick={() => handleUpdateSupervisorStatus(sup.id, 'rejected')}
                          className="py-2 px-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold hover:bg-[#ffb4ab] transition-colors cursor-pointer"
                        >
                          رفض
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accredited Supervisors Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#0d533d]/15 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#003a29]">هيئة الإشراف والقيادة المعتمدة بالمشروع</h3>
                  <span className="text-xs text-[#707973]">
                    المالك: {SUPER_ADMIN_EMAIL} يملك حصرًا حق التعيين، التجميد، وإلغاء الصلاحيات
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#eefdf6] text-[#404944] font-bold border-b border-[#0d533d]/10">
                      <th className="p-4">المشرف</th>
                      <th className="p-4">البريد الإلكتروني</th>
                      <th className="p-4">الصفة المعتمدة</th>
                      <th className="p-4">صفة أستاذ فوج / الأفواج المسندة</th>
                      <th className="p-4">حالة الصلاحية</th>
                      <th className="p-4 text-center">إجراءات المالك الحصرية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {supervisors.filter(s => s.status !== 'pending').map((sup) => (
                      <tr key={sup.id} className="hover:bg-[#eefdf6]/50 transition-colors">
                        <td className="p-4 font-black text-[#003a29]">
                          {sup.firstName} {sup.lastName}
                          {sup.isOwner && (
                            <span className="mr-2 px-2 py-0.5 rounded-full bg-[#eefdf6] text-[#003a29] border border-[#0d533d]/20 text-[10px] font-bold">
                              المالك
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-mono dir-ltr text-[#707973]">{sup.email}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full bg-[#eefdf6] text-[#003a29] font-bold text-xs border border-[#0d533d]/20">
                            {sup.role}
                          </span>
                        </td>
                        <td className="p-4">
                          {sup.isOwner ? (
                            <span className="font-bold text-[#003a29]">مشرف عام على كامل الأفواج</span>
                          ) : sup.assignedCohorts?.length ? (
                            <span className="px-2.5 py-1 rounded-full bg-[#aff0d2] text-[#003a29] font-bold text-xs inline-block">
                              أستاذ فوج ({sup.assignedCohorts.join('، ')})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[#404944] font-bold text-xs inline-block">
                              مشرف عام معتمد (بدون صفة أستاذ فوج)
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            sup.status === 'approved' 
                              ? 'bg-[#aff0d2] text-[#003a29]' 
                              : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}>
                            {sup.status === 'approved' ? 'نشط ومفوض' : 'مجمد مؤقتاً'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {sup.isOwner ? (
                            <span className="text-xs text-[#707973]">كامل الصلاحيات</span>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {/* Assign / change cohort */}
                              <button
                                onClick={() => setSelectedSupervisorForAssign(sup)}
                                className="px-2.5 py-1.5 rounded-xl bg-[#eefdf6] text-[#003a29] border border-[#0d533d]/20 hover:bg-[#ddece5] text-xs font-bold cursor-pointer"
                                title="إسناد أو تغيير الفوج (أستاذ فوج)"
                              >
                                {sup.assignedCohorts?.length ? 'تغيير الفوج' : 'إسناد كأستاذ فوج'}
                              </button>

                              {/* Unassign cohort (revoke cohort teacher role, keeping general supervisor status) */}
                              {sup.assignedCohorts && sup.assignedCohorts.length > 0 && (
                                <button
                                  onClick={() => handleUnassignCohortTeacher(sup)}
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-[#ba1a1a] hover:bg-slate-200 text-xs font-bold cursor-pointer"
                                  title="سحب الفوج وتحويله لمشرف عام دون صفة أستاذ فوج"
                                >
                                  سحب صفة أستاذ فوج
                                </button>
                              )}

                              {/* Change role */}
                              <button
                                onClick={() => {
                                  const newRole = sup.role === 'مشرف تربوي' ? 'مشرف إداري' : 'مشرف تربوي';
                                  handleUpdateSupervisorRole(sup.id, newRole);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-white border border-[#0d533d]/15 text-[#404944] hover:bg-slate-50 text-xs font-bold cursor-pointer"
                                title="تبديل الصفة بين تربوي وإداري"
                              >
                                تحويل لـ {sup.role === 'مشرف تربوي' ? 'إداري' : 'تربوي'}
                              </button>

                              {/* Toggle freeze */}
                              <button
                                onClick={() => handleUpdateSupervisorStatus(sup.id, sup.status === 'approved' ? 'frozen' : 'approved')}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-[#404944] hover:bg-slate-200 text-xs font-bold cursor-pointer"
                              >
                                {sup.status === 'approved' ? 'تجميد' : 'تنشيط'}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteSupervisor(sup.id, `${sup.firstName} ${sup.lastName}`)}
                                className="p-1.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab] cursor-pointer"
                                title="سحب الاعتماد فوراً"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ---------------- TAB 4: MEMBERSHIP CARDS & SUBSCRIPTIONS ---------------- */}
        {activeTab === 'cards' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#0d533d]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#003a29]">إدارة الاشتراكات وبطاقات الانخراط الرسمية</h2>
                <p className="text-xs text-[#404944]">
                  مبلغ الاشتراك المعتمد: 500 دج سنوياً لكل منخرط، يُدفع حضورياً ويؤهل لاستلام البطاقة الرسمية.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#707973]">إجمالي المحصل:</span>
                <span className="text-lg font-black text-[#0d533d] tabular-nums">
                  {(paidCount * 500).toLocaleString('ar-DZ')} دج
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div key={member.id} className="bg-white p-5 rounded-3xl shadow-sm border border-[#0d533d]/15 flex flex-col justify-between gap-4 text-right">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-extrabold text-[#003a29] text-base block">
                        {member.firstName} {member.lastName}
                      </span>
                      <span className="font-mono text-xs text-[#707973]">{member.code}</span>
                      <div className="text-xs text-[#404944] mt-1">
                        الفوج: <strong className="text-[#003a29]">{member.cohortName}</strong>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      member.subscriptionPaid
                        ? 'bg-[#aff0d2] text-[#003a29]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}>
                      {member.subscriptionPaid ? 'مسدد 500 دج' : 'غير مسدد'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleTogglePayment(member.id)}
                      className="text-xs font-bold text-[#0d533d] hover:underline cursor-pointer"
                    >
                      {member.subscriptionPaid ? 'إلغاء التأكيد' : 'تأكيد استلام 500 دج'}
                    </button>

                    <button
                      onClick={() => setSelectedMemberForCard(member)}
                      className="px-4 py-2 rounded-xl bg-[#003a29] text-white text-xs font-bold hover:bg-[#0d533d] flex items-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-white" />
                      <span>معاينة وطباعة البطاقة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 5: GALLERY MANAGEMENT (OWNER ONLY) ---------------- */}
        {activeTab === 'gallery' && currentUser.isOwner && (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#0d533d]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#003a29]">إدارة ونشر صور النشاطات الميدانية</h2>
                <p className="text-xs text-[#404944]">
                  التحكم بالصور الأصلية المنشورة في المعرض العام، مع إمكانية الإخفاء والتعديل والحذف.
                </p>
              </div>

              <button
                onClick={() => setShowAddPhotoModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-[#003a29] text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-[#0d533d] shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة صورة نشاط جديدة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#0d533d]/15 flex flex-col justify-between">
                  <div className="relative aspect-4/3 w-full bg-[#ddece5]">
                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                      photo.published ? 'bg-[#003a29] text-white' : 'bg-[#707973] text-white'
                    }`}>
                      {photo.published ? 'منشور للعامة' : 'مخفي عن العامة'}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-black/70 text-white text-xs backdrop-blur-xs">
                      {photo.category}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="font-bold text-[#003a29] text-base">{photo.title}</h3>
                    <p className="text-xs text-[#404944] line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleTogglePhotoVisibility(photo.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#eefdf6] text-[#003a29] text-xs font-bold hover:bg-[#ddece5] flex items-center gap-1 cursor-pointer"
                      >
                        {photo.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{photo.published ? 'إخفاء' : 'نشر'}</span>
                      </button>

                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-2 rounded-xl bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab] cursor-pointer"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 6: AUDIT LOGS (OWNER ONLY) ---------------- */}
        {activeTab === 'logs' && currentUser.isOwner && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#0d533d]/15 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#003a29]">سجل العمليات والتدقيق الأمني (Audit Log)</h2>
                <span className="text-xs text-[#707973]">موثق ومشفر باسم المرجع: {SUPER_ADMIN_EMAIL}</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#eefdf6] text-[#003a29] text-xs font-bold border border-[#0d533d]/20 shrink-0">
                      {log.action}
                    </span>
                    <span className="text-[#111e1a] font-medium leading-relaxed">
                      {log.details}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#707973] text-xs shrink-0 font-mono dir-ltr">
                    <span>{new Date(log.timestamp).toLocaleString('ar-DZ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ---------------- MODAL: OFFICIAL PRINTABLE MEMBERSHIP CARD ---------------- */}
      {selectedMemberForCard && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right">
            
            {/* Modal Top Bar */}
            <div className="p-4 bg-[#003a29] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#aff0d2]" />
                <span className="font-extrabold text-base">بطاقة الانخراط الرسمية المعتمدة</span>
              </div>
              <button onClick={() => setSelectedMemberForCard(null)} className="text-white/80 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            {/* Printable Card Area */}
            <div className="p-6 flex flex-col items-center gap-6">
              <div 
                id="printableCardArea" 
                className="w-full bg-gradient-to-br from-[#ffffff] via-[#f7faf8] to-[#e8f7f0] p-6 rounded-3xl shadow-xl border-2 border-[#0d533d]/30 relative overflow-hidden flex flex-col gap-4 text-right"
              >
                {/* Decorative watermark */}
                <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-[#0d533d]/5 pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#0d533d]/20">
                  <div className="flex items-center gap-2">
                    <img src={LOGO_PROJECT} alt="Logo" referrerPolicy="no-referrer" className="h-10 w-auto object-contain" />
                    <div className="flex flex-col text-right">
                      <span className="font-black text-sm text-[#003a29]">مشروع شباب القيم تامست</span>
                      <span className="text-[10px] text-[#404944]">جمعية المعالي للعلوم والتربية</span>
                    </div>
                  </div>
                  <div className="text-left font-mono font-black text-sm text-[#003a29]">
                    {selectedMemberForCard.code}
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="flex items-center gap-4 my-1">
                  <div className="w-20 h-24 rounded-2xl bg-[#ddece5] border border-[#0d533d]/20 flex flex-col items-center justify-center text-[#707973] shrink-0">
                    <span className="text-[10px] font-bold">صورة العضو</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right flex-1">
                    <span className="text-lg font-black text-[#003a29]">
                      {selectedMemberForCard.firstName} {selectedMemberForCard.lastName}
                    </span>
                    <span className="text-xs text-[#404944]">
                      المستوى: <strong className="text-[#003a29]">{selectedMemberForCard.educationLevel}</strong>
                    </span>
                    <span className="text-xs text-[#404944]">
                      الفوج: <strong className="text-[#003a29]">{selectedMemberForCard.cohortName}</strong>
                    </span>
                    <span className="text-[11px] text-[#707973]">الموسم التربوي: 2026 / 2027</span>
                  </div>
                </div>

                {/* Card Footer Stamp */}
                <div className="flex items-center justify-between pt-3 border-t border-[#0d533d]/20 text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                    selectedMemberForCard.subscriptionPaid
                      ? 'bg-[#aff0d2] text-[#003a29]'
                      : 'bg-[#ffdad6] text-[#ba1a1a]'
                  }`}>
                    {selectedMemberForCard.subscriptionPaid ? 'الاشتراك: مسدد (500 دج)' : 'الاشتراك: غير مسدد'}
                  </span>

                  <div className="flex items-center gap-1.5 text-[10px] text-[#707973]">
                    <span>ختم الإدارة المركزية</span>
                    <img src={LOGO_ASSOCIATION} alt="Seal" referrerPolicy="no-referrer" className="w-8 h-8 object-contain" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between w-full pt-2">
                <span className="text-xs text-[#707973]">جاهزة للطباعة والتسليم الميداني</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-[#003a29] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 hover:bg-[#0d533d] cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة فورية</span>
                  </button>
                  <button
                    onClick={() => setSelectedMemberForCard(null)}
                    className="px-4 py-2.5 bg-slate-100 text-[#404944] rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ---------------- MODAL: REASSIGN COHORT ---------------- */}
      {selectedMemberForCohort && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-right">
            <h3 className="text-lg font-black text-[#003a29]">
              نقل المنخرط ({selectedMemberForCohort.firstName} {selectedMemberForCohort.lastName})
            </h3>
            <p className="text-xs text-[#404944]">
              الفوج الحالي: <strong className="text-[#003a29]">{selectedMemberForCohort.cohortName}</strong>
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#111e1a]">اختر الفوج الجديد المراد النقل إليه:</label>
              {cohorts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleAssignCohort(selectedMemberForCohort.id, c.name)}
                  className={`p-3.5 rounded-xl text-xs font-bold border text-right transition-all cursor-pointer ${
                    selectedMemberForCohort.cohortName === c.name
                      ? 'bg-[#eefdf6] border-[#0d533d] text-[#003a29]'
                      : 'hover:bg-slate-50 border-slate-200 text-[#404944]'
                  }`}
                >
                  <span className="block font-black">{c.name}</span>
                  <span className="block text-[11px] text-[#707973]">{c.category} - المشرف: {c.supervisorName}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedMemberForCohort(null)}
              className="mt-2 py-2.5 rounded-xl bg-slate-100 text-[#404944] text-xs font-bold hover:bg-slate-200 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: PRINTABLE COHORT ROSTER ---------------- */}
      {selectedCohortForPrint && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-right">
            <div id="printableCohortArea" className="flex flex-col gap-4 text-right">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <img src={LOGO_PROJECT} alt="Logo" referrerPolicy="no-referrer" className="h-12 w-auto object-contain" />
                  <div>
                    <h3 className="text-lg font-black text-[#003a29]">قائمة فوج «{selectedCohortForPrint.name}»</h3>
                    <span className="text-xs text-[#707973]">مشروع شباب القيم تامست - جمعية المعالي</span>
                  </div>
                </div>
                <div className="text-left text-xs text-[#404944]">
                  <span>المشرف: <strong>{selectedCohortForPrint.supervisorName}</strong></span>
                  <div className="font-mono">{new Date().toISOString().slice(0, 10)}</div>
                </div>
              </div>

              {/* Members List */}
              <table className="w-full text-right text-xs border border-slate-200">
                <thead>
                  <tr className="bg-[#eefdf6] text-[#003a29]">
                    <th className="p-2 border">الرقم</th>
                    <th className="p-2 border">الرمز</th>
                    <th className="p-2 border">الاسم واللقب</th>
                    <th className="p-2 border">المستوى</th>
                    <th className="p-2 border">هاتف الولي</th>
                    <th className="p-2 border">حالة الاشتراك</th>
                  </tr>
                </thead>
                <tbody>
                  {members.filter(m => m.cohortName === selectedCohortForPrint.name).map((m, idx) => (
                    <tr key={m.id} className="border-b">
                      <td className="p-2 border font-bold text-center">{idx + 1}</td>
                      <td className="p-2 border font-mono">{m.code}</td>
                      <td className="p-2 border font-black">{m.firstName} {m.lastName}</td>
                      <td className="p-2 border">{m.educationLevel}</td>
                      <td className="p-2 border font-mono dir-ltr text-center">{m.guardianPhone}</td>
                      <td className="p-2 border text-center">{m.subscriptionPaid ? 'مسدد (500 دج)' : 'غير مسدد'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#003a29] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة القائمة</span>
              </button>
              <button
                onClick={() => setSelectedCohortForPrint(null)}
                className="px-4 py-2 bg-slate-100 text-[#404944] rounded-xl text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: ADD MEMBER ---------------- */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-right">
            <h3 className="text-lg font-black text-[#003a29]">إضافة منخرط جديد يدوياً من الإدارة</h3>
            
            {!currentUser.isOwner && (!currentUser.assignedCohorts || currentUser.assignedCohorts.length === 0) ? (
              <div className="p-4 bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-2xl text-[#93000a] text-xs leading-relaxed flex flex-col gap-3">
                <span className="font-bold">تنبيه إداري:</span>
                <p>
                  أنت مسجل كمشرف عام معتمد دون صفة «أستاذ فوج». تقتصر صلاحية إضافة وتعديل المنخرطين على المشرفين المسند لهم فوج تربوي معتمد. يرجى مراجعة المشرف العام والمالك لإسنادك إلى أحد الأفواج.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 bg-white text-[#93000a] rounded-xl font-bold self-start border border-[#ba1a1a]/30"
                >
                  إغلاق
                </button>
              </div>
            ) : (
            <form onSubmit={handleCreateMember} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#111e1a]">الاسم</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.firstName}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#111e1a]">اللقب</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.lastName}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#111e1a]">الجنس</label>
                  <select
                    value={newMemberForm.gender}
                    onChange={(e: any) => setNewMemberForm({ ...newMemberForm, gender: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  >
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#111e1a]">الفوج المسند</label>
                  {currentUser.isOwner ? (
                    <select
                      value={newMemberForm.cohortName}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, cohortName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-xs"
                    >
                      {cohorts.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  ) : currentUser.assignedCohorts && currentUser.assignedCohorts.length > 1 ? (
                    <select
                      value={newMemberForm.cohortName}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, cohortName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-xs bg-[#eefdf6] font-bold text-[#003a29]"
                    >
                      {currentUser.assignedCohorts.map((cName) => (
                        <option key={cName} value={cName}>{cName} (فوجك المسند)</option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-3 py-2 border rounded-xl text-xs bg-[#eefdf6] font-bold text-[#003a29] border-[#0d533d]/20">
                      {currentUser.assignedCohorts?.[0] || 'غزة العزة'} (فوجك المسند حصراً)
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#111e1a]">اسم الولي</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.guardianName}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, guardianName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#111e1a]">هاتف الولي</label>
                  <input
                    type="tel"
                    required
                    placeholder="06XXXXXXXX"
                    value={newMemberForm.guardianPhone}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, guardianPhone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs dir-ltr"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="newSubPaid"
                  checked={newMemberForm.subscriptionPaid}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, subscriptionPaid: e.target.checked })}
                  className="w-4 h-4 rounded text-[#003a29]"
                />
                <label htmlFor="newSubPaid" className="text-xs text-[#111e1a]">
                  تم تسديد اشتراك 500 دج فوراً
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#003a29] text-white rounded-xl text-xs font-bold"
                >
                  حفظ المنخرط
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-[#404944] rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}

      {/* ---------------- MODAL: ADD COHORT ---------------- */}
      {showAddCohortModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-right">
            <h3 className="text-lg font-black text-[#003a29]">إنشاء فوج تربوي جديد</h3>
            
            <form onSubmit={handleCreateCohort} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#111e1a]">اسم الفوج</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فوج القدس"
                  value={newCohortForm.name}
                  onChange={(e) => setNewCohortForm({ ...newCohortForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111e1a]">التصنيف التربوي</label>
                <select
                  value={newCohortForm.category}
                  onChange={(e: any) => setNewCohortForm({ ...newCohortForm, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                >
                  <option value="شباب القيم">شباب القيم (ذكور)</option>
                  <option value="فتيات القيم">فتيات القيم (إناث)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111e1a]">المشرف المسؤول</label>
                <input
                  type="text"
                  placeholder="مثال: أ. جاب الله رشيد"
                  value={newCohortForm.supervisorName}
                  onChange={(e) => setNewCohortForm({ ...newCohortForm, supervisorName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111e1a]">وصف الفوج</label>
                <textarea
                  rows={2}
                  value={newCohortForm.description}
                  onChange={(e) => setNewCohortForm({ ...newCohortForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#003a29] text-white rounded-xl text-xs font-bold"
                >
                  إنشاء الفوج
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCohortModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-[#404944] rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: ADD PHOTO ---------------- */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-right">
            <h3 className="text-lg font-black text-[#003a29]">إضافة صورة نشاط للمعرض</h3>
            
            <form onSubmit={handleAddPhoto} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#111e1a]">عنوان النشاط</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ورشة بناء الشخصية"
                  value={newPhotoForm.title}
                  onChange={(e) => setNewPhotoForm({ ...newPhotoForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111e1a]">رابط الصورة (URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newPhotoForm.imageUrl}
                  onChange={(e) => setNewPhotoForm({ ...newPhotoForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs dir-ltr"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111e1a]">التصنيف</label>
                <select
                  value={newPhotoForm.category}
                  onChange={(e) => setNewPhotoForm({ ...newPhotoForm, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                >
                  <option value="خرجة ميدانية">خرجة ميدانية</option>
                  <option value="لقاءات تربوية">لقاءات تربوية</option>
                  <option value="مخيمات قرآنية">مخيمات قرآنية</option>
                  <option value="تكريم وتميز">تكريم وتميز</option>
                  <option value="فتيات القيم">فتيات القيم</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111e1a]">الوصف</label>
                <textarea
                  rows={2}
                  value={newPhotoForm.description}
                  onChange={(e) => setNewPhotoForm({ ...newPhotoForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#003a29] text-white rounded-xl text-xs font-bold"
                >
                  حفظ الصورة
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-[#404944] rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: EDIT COHORT (NAME & LOCATION) ---------------- */}
      {editingCohort && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#003a29] flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#0d533d]" />
                <span>تعديل بيانات الفوج (الاسم والمكان)</span>
              </h3>
              <button
                onClick={() => setEditingCohort(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveEditCohort} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#111e1a] block mb-1">
                  اسم الفوج <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: غزة العزة"
                  value={editCohortForm.name}
                  onChange={(e) => setEditCohortForm({ ...editCohortForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111e1a] block mb-1">
                  المقر والمكان الميداني <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: القاعة المركزية - تامست"
                    value={editCohortForm.location}
                    onChange={(e) => setEditCohortForm({ ...editCohortForm, location: e.target.value })}
                    className="w-full pr-10 pl-3.5 py-2.5 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d]"
                  />
                  <MapPin className="w-4 h-4 text-[#003a29] absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111e1a] block mb-1">التصنيف التربوي</label>
                <select
                  value={editCohortForm.category}
                  onChange={(e: any) => setEditCohortForm({ ...editCohortForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d]"
                >
                  <option value="شباب القيم">شباب القيم (ذكور)</option>
                  <option value="فتيات القيم">فتيات القيم (إناث)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111e1a] block mb-1">المشرف المسؤول</label>
                <input
                  type="text"
                  placeholder="مثال: أ. جاب الله رشيد"
                  value={editCohortForm.supervisorName}
                  onChange={(e) => setEditCohortForm({ ...editCohortForm, supervisorName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111e1a] block mb-1">وصف الفوج وبرنامجه</label>
                <textarea
                  rows={2}
                  value={editCohortForm.description}
                  onChange={(e) => setEditCohortForm({ ...editCohortForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#003a29] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#0d533d] transition-colors cursor-pointer"
                >
                  حفظ التعديلات
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCohort(null)}
                  className="px-4 py-2.5 bg-slate-100 text-[#404944] rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: ASSIGN COHORT TO SUPERVISOR ---------------- */}
      {selectedSupervisorForAssign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-right">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#003a29]">
                إسناد صفة «أستاذ فوج» للمشرف
              </h3>
              <button
                onClick={() => setSelectedSupervisorForAssign(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#eefdf6] p-3 rounded-2xl border border-[#0d533d]/20">
              <span className="text-xs text-[#707973] block">المشرف:</span>
              <span className="text-sm font-black text-[#003a29]">
                {selectedSupervisorForAssign.firstName} {selectedSupervisorForAssign.lastName} ({selectedSupervisorForAssign.email})
              </span>
              <span className="text-xs text-[#0d533d] block mt-1">
                ملاحظة: يمكن إسناد حتى 4 مشرفين في الفوج الواحد.
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              <label className="text-xs font-bold text-[#111e1a]">اختر الفوج المراد إسناد المشرف إليه:</label>
              {cohorts.map((c) => {
                const assignedCount = supervisors.filter(s => s.status === 'approved' && s.assignedCohorts?.includes(c.name)).length;
                const isFull = assignedCount >= 4;
                const isCurrent = selectedSupervisorForAssign.assignedCohorts?.includes(c.name);

                return (
                  <button
                    key={c.id}
                    disabled={isFull && !isCurrent}
                    onClick={async () => {
                      if (selectedSupervisorForAssign.status === 'pending') {
                        await handleUpdateSupervisorStatus(selectedSupervisorForAssign.id, 'approved', {
                          isCohortTeacher: true,
                          assignedCohorts: [c.name]
                        });
                      } else {
                        await handleAssignSupervisorCohorts(selectedSupervisorForAssign.id, [c.name]);
                      }
                      setSelectedSupervisorForAssign(null);
                    }}
                    className={`p-3.5 rounded-xl text-xs font-bold border text-right transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'bg-[#003a29] text-white border-[#003a29]'
                        : isFull
                        ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                        : 'bg-white hover:bg-[#eefdf6] border-[#0d533d]/20 text-[#003a29]'
                    }`}
                  >
                    <div>
                      <span className="block font-black">{c.name}</span>
                      <span className="block text-[11px] opacity-80">{c.category} • {c.location}</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/30 border border-current">
                      {assignedCount} / 4 مشرفين {isFull ? '(مكتمل)' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedSupervisorForAssign(null)}
                className="px-4 py-2 bg-slate-100 text-[#404944] rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: MANAGE COHORT SUPERVISORS (UP TO 4) ---------------- */}
      {selectedCohortForSupervisors && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-right">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#003a29]">
                إدارة مشرفي فوج «{selectedCohortForSupervisors.name}»
              </h3>
              <button
                onClick={() => setSelectedCohortForSupervisors(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#404944] leading-relaxed">
              يمكنك تعيين حتى 4 مشرفين وأساتذة في هذا الفوج لمتابعة الحلقات والأنشطة المشتركة.
            </p>

            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              <label className="text-xs font-bold text-[#111e1a]">المشرفون المعتمدون بالمشروع:</label>
              {supervisors.filter(s => s.status === 'approved' && !s.isOwner).map((sup) => {
                const isAssigned = sup.assignedCohorts?.includes(selectedCohortForSupervisors.name);

                return (
                  <div
                    key={sup.id}
                    className="p-3 rounded-xl border border-[#0d533d]/15 flex items-center justify-between bg-[#eefdf6]/50"
                  >
                    <div>
                      <span className="block font-black text-xs text-[#003a29]">
                        أ. {sup.firstName} {sup.lastName}
                      </span>
                      <span className="block text-[10px] text-[#707973] dir-ltr inline-block">
                        {sup.email}
                      </span>
                    </div>

                    {isAssigned ? (
                      <button
                        onClick={() => handleRemoveSupervisorFromCohort(selectedCohortForSupervisors, `${sup.firstName} ${sup.lastName}`)}
                        className="px-2.5 py-1 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold hover:bg-[#ffb4ab] cursor-pointer"
                      >
                        إلغاء الإسناد
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddSupervisorToCohort(selectedCohortForSupervisors, sup.email)}
                        className="px-2.5 py-1 rounded-lg bg-[#003a29] text-white text-xs font-bold hover:bg-[#0d533d] cursor-pointer"
                      >
                        إسناد للفوج
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCohortForSupervisors(null)}
                className="px-4 py-2 bg-[#003a29] text-white rounded-xl text-xs font-bold hover:bg-[#0d533d]"
              >
                تم والانتهاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
