import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Database file path
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Data models
export interface DbMember {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'ذكر' | 'أنثى';
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

export interface DbCohort {
  id: string;
  name: string;
  category: 'شباب القيم' | 'فتيات القيم';
  targetGender: 'ذكر' | 'أنثى';
  supervisorName: string;
  supervisors?: string[];
  location: string;
  description: string;
  createdAt: string;
}

export interface DbSupervisor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'pending' | 'approved' | 'frozen';
  isCohortTeacher?: boolean;
  assignedCohorts: string[];
  experience?: string;
  isOwner?: boolean;
  createdAt: string;
}

export interface DbPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  published: boolean;
  order: number;
  createdAt: string;
}

export interface DbAuditLog {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface AppDatabase {
  members: DbMember[];
  cohorts: DbCohort[];
  supervisors: DbSupervisor[];
  photos: DbPhoto[];
  auditLogs: DbAuditLog[];
}

// Initial seed data
const initialData: AppDatabase = {
  members: [
    {
      id: "mem-2501",
      code: "#TK-2025-084",
      firstName: "أيوب",
      lastName: "بن عائشة",
      birthDate: "2011-04-12",
      gender: "ذكر",
      educationLevel: "السنة الثالثة متوسط",
      hobby: "حفظ وتجويد القرآن الكريم",
      guardianName: "عبد القادر بن عائشة",
      guardianPhone: "0661248910",
      cohortId: "cohort-gaza",
      cohortName: "غزة العزة",
      subscriptionPaid: true,
      paidAt: "2025-09-15",
      cardIssued: true,
      guardianConsent: true,
      createdAt: "2025-09-10T10:14:00Z"
    },
    {
      id: "mem-2502",
      code: "#TK-2025-085",
      firstName: "فاطمة الزهراء",
      lastName: "مباركي",
      birthDate: "2009-08-20",
      gender: "أنثى",
      educationLevel: "السنة الأولى ثانوي",
      hobby: "الرسم والأشغال اليدوية",
      guardianName: "الهاشمي مباركي",
      guardianPhone: "0672551240",
      cohortId: "cohort-toufan",
      cohortName: "طوفان الأقصى",
      subscriptionPaid: true,
      paidAt: "2025-09-16",
      cardIssued: true,
      guardianConsent: true,
      createdAt: "2025-09-11T11:20:00Z"
    },
    {
      id: "mem-2503",
      code: "#TK-2025-086",
      firstName: "محمد الصالح",
      lastName: "قدور",
      birthDate: "2010-02-15",
      gender: "ذكر",
      educationLevel: "السنة الرابعة متوسط",
      hobby: "الرياضة والأنشطة الكشفية",
      guardianName: "بلقاسم قدور",
      guardianPhone: "0554183391",
      cohortId: "cohort-gaza",
      cohortName: "غزة العزة",
      subscriptionPaid: false,
      cardIssued: false,
      guardianConsent: true,
      createdAt: "2025-09-12T14:45:00Z"
    },
    {
      id: "mem-2504",
      code: "#TK-2025-087",
      firstName: "خديجة",
      lastName: "لعريبي",
      birthDate: "2008-11-05",
      gender: "أنثى",
      educationLevel: "السنة الثانية ثانوي",
      hobby: "المطالعة ونوادي القراءة",
      guardianName: "عمر لعريبي",
      guardianPhone: "0663904122",
      cohortId: "cohort-toufan",
      cohortName: "طوفان الأقصى",
      subscriptionPaid: true,
      paidAt: "2025-09-13",
      cardIssued: true,
      guardianConsent: true,
      createdAt: "2025-09-13T09:30:00Z"
    },
    {
      id: "mem-2505",
      code: "#TK-2025-088",
      firstName: "عبد الرحمان",
      lastName: "تامستي",
      birthDate: "2012-06-18",
      gender: "ذكر",
      educationLevel: "السنة الأولى متوسط",
      hobby: "الإنشاد والمسرح الهادف",
      guardianName: "سليمان تامستي",
      guardianPhone: "0770192837",
      cohortId: "cohort-gaza",
      cohortName: "غزة العزة",
      subscriptionPaid: true,
      paidAt: "2025-09-18",
      cardIssued: true,
      guardianConsent: true,
      createdAt: "2025-09-14T16:00:00Z"
    },
    {
      id: "mem-2506",
      code: "#TK-2025-089",
      firstName: "مريم",
      lastName: "بوشيخي",
      birthDate: "2010-09-29",
      gender: "أنثى",
      educationLevel: "السنة الرابعة متوسط",
      hobby: "الخط العربي والزخرفة",
      guardianName: "مختار بوشيخي",
      guardianPhone: "0561998877",
      cohortId: "cohort-toufan",
      cohortName: "طوفان الأقصى",
      subscriptionPaid: false,
      cardIssued: false,
      guardianConsent: true,
      createdAt: "2025-09-15T08:15:00Z"
    }
  ],
  cohorts: [
    {
      id: "cohort-gaza",
      name: "غزة العزة",
      category: "شباب القيم",
      targetGender: "ذكر",
      supervisorName: "أ. جاب الله رشيد",
      location: "القاعة المركزية - تامست",
      description: "فوج الفتيان والشباب المخصص لغرس القيم الأخلاقية والمهارات القيادية والأنشطة الميدانية.",
      createdAt: "2025-09-01T00:00:00Z"
    },
    {
      id: "cohort-toufan",
      name: "طوفان الأقصى",
      category: "فتيات القيم",
      targetGender: "أنثى",
      supervisorName: "أ. مريم تامست",
      location: "نادي الفتاة المعالي - تامست",
      description: "فوج الفتيات والناشئة المخصص للورشات التربوية والإيمانية والأعمال الإبداعية.",
      createdAt: "2025-09-01T00:00:00Z"
    }
  ],
  supervisors: [
    {
      id: "sup-owner",
      firstName: "بوبكر",
      lastName: "بخيتي",
      email: "bobaker10b@gmail.com",
      role: "المشرف العام والمالك",
      status: "approved",
      assignedCohorts: ["غزة العزة", "طوفان الأقصى"],
      isOwner: true,
      createdAt: "2025-08-01T00:00:00Z"
    },
    {
      id: "sup-owner-djaballah",
      firstName: "رشيد",
      lastName: "جاب الله",
      email: "rachiddjabellah@gmail.com",
      role: "المشرف العام التربوي",
      status: "approved",
      assignedCohorts: ["غزة العزة", "طوفان الأقصى"],
      isOwner: true,
      createdAt: "2025-08-01T00:00:00Z"
    },
    {
      id: "sup-djaballah",
      firstName: "جاب الله",
      lastName: "رشيد",
      email: "djaballah.r@tamest-values.dz",
      role: "مشرف تربوي",
      status: "approved",
      assignedCohorts: ["غزة العزة"],
      isOwner: false,
      createdAt: "2025-08-15T00:00:00Z"
    },
    {
      id: "sup-meryem",
      firstName: "مريم",
      lastName: "تامست",
      email: "meryem.tamest@values.dz",
      role: "مشرفة تربوية",
      status: "approved",
      assignedCohorts: ["طوفان الأقصى"],
      isOwner: false,
      createdAt: "2025-08-20T00:00:00Z"
    },
    {
      id: "sup-req-1",
      firstName: "صالح",
      lastName: "عبد العالي",
      email: "saleh.abdelali@gmail.com",
      role: "مشرف تربوي",
      status: "pending",
      assignedCohorts: [],
      experience: "مربٍّ سابق في الكشافة الإسلامية وناشط جمعوي في رعاية الفتية لمدة 5 سنوات بتامست.",
      isOwner: false,
      createdAt: "2025-10-01T11:00:00Z"
    },
    {
      id: "sup-req-2",
      firstName: "نور الهدى",
      lastName: "كريم",
      email: "nour.karim@gmail.com",
      role: "مشرف إداري",
      status: "pending",
      assignedCohorts: [],
      experience: "حاصلة على ليسانس في علوم التسيير، متطوعة سابقة في إدارة الفعاليات التربوية.",
      isOwner: false,
      createdAt: "2025-10-03T15:20:00Z"
    }
  ],
  photos: [
    {
      id: "photo-1",
      title: "الخرجة الميدانية الختامية الكبرى",
      description: "«نستكشف .. نعيش القيم .. نصنع الأثر» أمام المعالم التاريخية والتراثية لقصر تامست العتيق.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrAflLY0eNc-jBbJXWACgri_BsRQ_I4RRm0rYUA3N4fEZ68VW9x58CUuEn-5mh7XUScAlsTguRLGSCIBcu2wWFLKYdCSNqM4eAmxMPWHkQyna09Bp--MJZUWDWMJQjp1U0U4pRIcAmCLNTWlA8sJuuY2sB14qWdKbOklfYI6MvxCxOOSMBKwWVDw6iVihItnV8ckzVuMtessfR_8RliqtTJstqG4R-U9hg5C_vQrNumjDRe2sQSYIjyY0oHO4VevcqLmU",
      category: "خرجة ميدانية",
      published: true,
      order: 1,
      createdAt: "2025-09-01T00:00:00Z"
    },
    {
      id: "photo-2",
      title: "اللقاء الأسبوعي وحلقات الحوار وبناء الشخصية",
      description: "حوارات تربوية، ترسيخ القيم الأخلاقية، ومسابقات فكرية تصقل مدارك الفتية.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsY94WZofzHdd1xk0wdlLYR_D3UaQwIF6z8OAxKsl4Q5EJ4n5TH6f722yri1WjhLoyE12He9yV3gfU-4rksRRLZnGy3fFv3TqvOxoMXDQmv_Uwy0mEJnsF5wfxCKJ-fGZRnn2E9yYV-llK1aHCrwpke5WYBzSWkQjAICAMiJWiCz5XhA-yTnOi8UJff45G_S2OCRFP5hlIQbA4BqAnFevmmZIwqO8hGihg4qXxbGgPeP9EcqfuPe1IgGG13W0Ec_I5awU",
      category: "لقاءات تربوية",
      published: true,
      order: 2,
      createdAt: "2025-09-02T00:00:00Z"
    },
    {
      id: "photo-3",
      title: "تكريم واختتام مخيم القيم القرآني",
      description: "تسليم شهادات التميز والإتقان القرآني بإشراف شيوخ وأساتذة الفوج البلدي لجمعية المعالي بتامست.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBdV4CsxrjDw1NZejviOJBooG0774KkhB_BxS6JHdCcckpX91ZrbIcyf9xRaZMbpuIEhaKKvUd8vwsW-wWNDoU3Y7ftmU96IOgnRBSBypKlaalMtN_mmxUlgag2Hwuqlj1PYrWVje0pk77FMtkjqjXFQUfpcvBE1o-aNRi_ljcY1OQrs0i0BgWJ_jju6U1lUgG0X3_Ndd8x0l06acKta8BaZZxONgU7vSY2ZYLYKxXPlLbt2CSpl4taw",
      category: "مخيمات قرآنية",
      published: true,
      order: 3,
      createdAt: "2025-09-03T00:00:00Z"
    },
    {
      id: "photo-4",
      title: "حفل اختتام الدورات وتتويج النجباء",
      description: "مكافأة المنخرطين المجتهدين بالشهادات التقديرية والجوائز التشجيعية لتحفيز التفوق الدراسي والتربوي.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOpfFD7S4pDiJJVrpBycuRD9Pa43ApgNMqeukTd4QG-JWX4Er2D-FEYa5DKkfSE0BJrh7dvGlMHFcKPLweZMP6rARa2haI0OVdCiIjspKsaWad5elf7AvGoh76HR1csbZSdVkzxB0G0vzq_ANNIdWd7-8DZ6W7tYTvUW5S7GbXIb7-FqdtoNb8mpn-xFecxZDca5GfHqLS3XOxtHpJNTSbDdeqJNAmJJeCrpQZB9p9pyO-NCg2nDUccak5m0C48r7BgXs",
      category: "تكريم وتميز",
      published: true,
      order: 4,
      createdAt: "2025-09-04T00:00:00Z"
    },
    {
      id: "photo-5",
      title: "فوج الفتيات والناشئة - أنشطة وأعمال يدوية هادفة",
      description: "برامج مخصصة للفتيات تهدف إلى التثقيف والإبداع العملي وتنمية الروح الأسرية والقيم الاجتماعية.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxfKoeYz4RSMso8brulbLHoabp4FCFT2to7abCAOztz0ABhZ7qTwlLlDO4-hc78JkaCFCecOZQTVW-x2iWLIwrQoDZij1tt6VONCv1JpLku76xlDfPN-SIO4I4p8UiQqzk4384FNoZ9NcMTbI4HTM_iN7KexOvzMuk6Dex5JnYEeM328JUEzPzSDg1SddRADZZLt8m4spcshMpkFtlUzemo8eDHmcyA1yzsc2uNt4yyYh0zy_d3rrc6Gg8sMaKnFMKBZ4",
      category: "فتيات القيم",
      published: true,
      order: 5,
      createdAt: "2025-09-05T00:00:00Z"
    },
    {
      id: "photo-6",
      title: "خرجة استكشافية لكثبان وواحات تامست",
      description: "معايشة قيم التضامن وتحمل المسؤولية في رحاب الطبيعة الصحراوية الساحرة لولاية أدرار.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMpAjQv00EYqs2n16Ly4cq0VN-ORccizpAO3lr1QI2_kBgWGTdFTGycESo3c7AjSykUpUPHxqqUkW2BR11A4PsbtlDnXHceNWMmqrTLEFWljU8szEADXMND9sqbPGsbkjSf7lQtd-DaJ5aWTRr7t2Qn9JACbq8xPYr8Nwhz49AGjFZjOxzM23Sib6X9IELKY2c-YhkUI6zxzMQ75Rw5I1WsLrm6jXUv9V_7iLOOJsBQU6ftpqDUE6HprQnmKsQZfdvmzg",
      category: "خرجة ميدانية",
      published: true,
      order: 6,
      createdAt: "2025-09-06T00:00:00Z"
    }
  ],
  auditLogs: [
    {
      id: "log-1",
      action: "تأكيد اشتراك",
      details: "تأكيد استلام اشتراك 500 دج للمنخرط أيوب بن عائشة (#TK-2025-084) وتفعيل البطاقة الرسمية",
      performedBy: "bobaker10b@gmail.com",
      timestamp: "2025-09-15T10:45:00Z"
    },
    {
      id: "log-2",
      action: "توزيع أفواج",
      details: "إسناد وتوزيع المنخرطة فاطمة الزهراء مباركي ضمن فوج طوفان الأقصى بإشراف أ. مريم تامست",
      performedBy: "bobaker10b@gmail.com",
      timestamp: "2025-09-16T18:20:00Z"
    },
    {
      id: "log-3",
      action: "مصادقة أمنية",
      details: "دخول مصادق بنجاح من جهاز المشرف المالك الأعلى (bobaker10b@gmail.com)",
      performedBy: "bobaker10b@gmail.com",
      timestamp: "2025-10-09T09:12:00Z"
    }
  ]
};

// Database helper functions
function loadData(): AppDatabase {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db:', err);
    return initialData;
  }
}

function saveData(data: AppDatabase) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db:', err);
  }
}

function logAudit(action: string, details: string, performedBy: string) {
  const data = loadData();
  const newLog: DbAuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    action,
    details,
    performedBy,
    timestamp: new Date().toISOString()
  };
  data.auditLogs.unshift(newLog);
  if (data.auditLogs.length > 200) {
    data.auditLogs = data.auditLogs.slice(0, 200);
  }
  saveData(data);
}

// Check if user is Super Admin
function isSuperAdmin(email?: string): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return clean === 'bobaker10b@gmail.com' || clean === 'rachiddjabellah@gmail.com' || clean === 'boubaker10b@gmail.com';
}

// ---------------------------------------------------------------------
// PUBLIC ENDPOINTS
// ---------------------------------------------------------------------

// 1. Public Info (Stats & Published Gallery only - NEVER lists youth or private cohorts details)
app.get('/api/public-info', (_req, res) => {
  const data = loadData();
  const publishedPhotos = data.photos
    .filter((p: DbPhoto) => p.published)
    .sort((a: DbPhoto, b: DbPhoto) => a.order - b.order);

  const maleCount = data.members.filter((m: DbMember) => m.gender === 'ذكر').length;
  const femaleCount = data.members.filter((m: DbMember) => m.gender === 'أنثى').length;
  const totalCount = data.members.length;

  res.json({
    project: {
      name: "مشروع شباب القيم تامست",
      association: "جمعية المعالي للعلوم والتربية - الفوج البلدي تامست",
      generalSupervisor: "الأستاذ جاب الله رشيد",
      fee: 500,
      feeCurrency: "دينار جزائري (دج)",
      paymentInfo: "تسدد حضورياً في الحصة التربوية الأولى (حصة التعارف)"
    },
    stats: {
      totalMembers: totalCount,
      maleMembers: maleCount,
      femaleMembers: femaleCount,
      cohortsCount: data.cohorts.length,
      photosCount: publishedPhotos.length
    },
    photos: publishedPhotos
  });
});

// 2. Submit Youth Registration (Public endpoint with strict validation & privacy guarantee)
app.post('/api/register', (req, res) => {
  const {
    firstName,
    lastName,
    birthDate,
    gender,
    educationLevel,
    hobby,
    guardianName,
    guardianPhone,
    guardianConsent
  } = req.body;

  if (!firstName || !lastName || !birthDate || !gender || !educationLevel || !hobby || !guardianName || !guardianPhone) {
    return res.status(400).json({ error: "يرجى ملء جميع الحقول المطلوبة." });
  }

  if (gender !== 'ذكر' && gender !== 'أنثى') {
    return res.status(400).json({ error: "قيمة الجنس غير صالحة." });
  }

  const phoneClean = guardianPhone.replace(/\s+/g, '');
  if (!/^(05|06|07)[0-9]{8}$/.test(phoneClean)) {
    return res.status(400).json({ error: "رقم هاتف الولي غير صالح. يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام." });
  }

  const data = loadData();

  // Check for duplicate registration attempt (same name + same phone)
  const existing = data.members.find(
    (m: DbMember) => m.firstName.trim() === firstName.trim() &&
         m.lastName.trim() === lastName.trim() &&
         m.guardianPhone.replace(/\s+/g, '') === phoneClean
  );

  if (existing) {
    return res.json({
      success: true,
      message: "تم تسجيل هذا المنخرط مسبقاً في المنظومة وهو قيد المتابعة.",
      registrationCode: existing.code,
      memberName: `${existing.firstName} ${existing.lastName}`,
      status: "مقيّد مسبقاً"
    });
  }

  // Auto cohort suggestion based on gender
  const defaultCohort = data.cohorts.find((c: DbCohort) => c.targetGender === gender);

  const sequentialNum = data.members.length + 85;
  const registrationCode = `#TK-2026-${sequentialNum.toString().padStart(3, '0')}`;
  const memberId = `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const newMember: DbMember = {
    id: memberId,
    code: registrationCode,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    birthDate,
    gender,
    educationLevel,
    hobby,
    guardianName: guardianName.trim(),
    guardianPhone: phoneClean,
    cohortId: defaultCohort ? defaultCohort.id : null,
    cohortName: defaultCohort ? defaultCohort.name : 'قيد التوزيع',
    subscriptionPaid: false,
    cardIssued: false,
    guardianConsent: !!guardianConsent,
    createdAt: new Date().toISOString()
  };

  data.members.push(newMember);
  saveData(data);

  logAudit(
    "تسجيل منخرط جديد",
    `تسجيل المنخرط(ة) ${firstName.trim()} ${lastName.trim()} برمز ${registrationCode}`,
    "استمارة التسجيل العامة"
  );

  // Return success without leaking personal contact info back
  res.json({
    success: true,
    message: "تم استلام طلب التسجيل بنجاح وتقييده في القوائم المعتمدة.",
    registrationCode,
    memberName: `${firstName.trim()} ${lastName.trim()}`,
    gender,
    fee: 500,
    notice: "تسدد مساهمة الاشتراك الرمزية (500 دج) حضورياً في حصة التعارف الافتتاحية."
  });
});

// 3. Submit Supervisor Application (Requires approval from owner)
app.post('/api/supervisors/apply', (req, res) => {
  const { firstName, lastName, email, role, experience } = req.body;

  if (!firstName || !lastName || !email || !role) {
    return res.status(400).json({ error: "جميع الحقول الإلزامية مطلوبة." });
  }

  if (role !== 'مشرف تربوي' && role !== 'مشرف إداري') {
    return res.status(400).json({ error: "الصفة يجب أن تكون 'مشرف تربوي' أو 'مشرف إداري'." });
  }

  const cleanEmail = email.toLowerCase().trim();
  const data = loadData();

  const existing = data.supervisors.find((s: DbSupervisor) => s.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({
      error: existing.status === 'approved' 
        ? "هذا البريد الإلكتروني مسجل ومعتمد بالفعل كمشرف." 
        : "تم تقديم طلب بهذا البريد الإلكتروني مسبقاً وهو قيد المراجعة من طرف صاحب الموقع."
    });
  }

  const newSupervisor: DbSupervisor = {
    id: `sup-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: cleanEmail,
    role,
    status: 'pending',
    assignedCohorts: [],
    experience: experience ? experience.trim() : '',
    isOwner: false,
    createdAt: new Date().toISOString()
  };

  data.supervisors.push(newSupervisor);
  saveData(data);

  logAudit(
    "طلب اعتماد مشرف",
    `تقديم طلب اعتماد من ${firstName} ${lastName} (${cleanEmail}) بصفة: ${role}`,
    cleanEmail
  );

  res.json({
    success: true,
    message: "تم إرسال طلب الاعتماد بنجاح، وهو الآن «بانتظار موافقة صاحب الموقع» (bobaker10b@gmail.com).",
    status: "pending"
  });
});

// 4. Supervisor & Admin Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: "البريد الإلكتروني مطلوب." });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanPassword = (password || '').trim();
  const data = loadData();

  // Super Admin Check
  if (isSuperAdmin(cleanEmail)) {
    if (cleanPassword !== 'admin2025') {
      return res.status(401).json({ error: "كلمة المرور غير صحيحة. يرجى إدخال كلمة المرور الصحيحة." });
    }

    const isDjaballah = cleanEmail === 'rachiddjabellah@gmail.com';
    const adminName = isDjaballah ? "الأستاذ رشيد جاب الله (المشرف العام التربوي)" : "بوبكر بخيتي (المشرف العام والمالك)";
    const adminRole = isDjaballah ? "المشرف العام التربوي" : "صاحب الموقع والمشرف العام";

    logAudit(
      "تسجيل دخول الإدارة العليا",
      `تسجيل دخول ناجح لصاحب الموقع والمشرف العام (${cleanEmail})`,
      cleanEmail
    );

    return res.json({
      success: true,
      user: {
        id: isDjaballah ? "owner-djaballah" : "owner-root",
        email: cleanEmail,
        name: adminName,
        role: adminRole,
        isOwner: true,
        status: "approved",
        assignedCohorts: data.cohorts.map((c: DbCohort) => c.name)
      },
      token: `auth-token-owner-${Date.now()}`
    });
  }

  // Regular Supervisor check
  const sup = data.supervisors.find((s: DbSupervisor) => s.email.toLowerCase() === cleanEmail);

  if (!sup) {
    return res.status(403).json({
      error: "هذا البريد الإلكتروني غير مسجل في هيئة الإشراف. يمكنك تقديم طلب اعتماد جديد."
    });
  }

  if (sup.status === 'pending') {
    return res.status(403).json({
      error: "حسابك بانتظار موافقة الإدارة المركزية (bobaker10b@gmail.com). لا يمكنك الدخول حتى يتم اعتمادك رسمياً."
    });
  }

  if (sup.status === 'frozen') {
    return res.status(403).json({
      error: "تم تجميد صلاحيات هذا الحساب مؤقتاً من قبل الإدارة. يرجى مراجعة المشرف العام."
    });
  }

  if (cleanPassword !== 'chabab-alqiam2027') {
    return res.status(401).json({ error: "كلمة المرور غير صحيحة. كلمة المرور المعتمدة للمشرفين هي chabab-alqiam2027" });
  }

  logAudit(
    "تسجيل دخول مشرف",
    `تسجيل دخول المشرف ${sup.firstName} ${sup.lastName} (${sup.email})`,
    sup.email
  );

  res.json({
    success: true,
    user: {
      id: sup.id,
      email: sup.email,
      name: `${sup.firstName} ${sup.lastName}`,
      role: sup.role,
      isOwner: false,
      status: sup.status,
      assignedCohorts: sup.assignedCohorts || []
    },
    token: `auth-token-sup-${sup.id}-${Date.now()}`
  });
});

// ---------------------------------------------------------------------
// PROTECTED ADMIN & SUPERVISOR OPERATIONS
// ---------------------------------------------------------------------

// Middleware for authorization check
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const userEmail = req.headers['x-user-email'] as string;

  if (!userEmail) {
    return res.status(401).json({ error: "غير مصرح. يرجى تسجيل الدخول أولاً." });
  }

  const clean = userEmail.toLowerCase().trim();
  const data = loadData();

  if (isSuperAdmin(clean)) {
    (req as any).currentUser = {
      email: clean,
      isOwner: true,
      name: "المشرف العام"
    };
    return next();
  }

  const sup = data.supervisors.find((s: DbSupervisor) => s.email.toLowerCase() === clean && s.status === 'approved');
  if (sup) {
    (req as any).currentUser = sup;
    return next();
  }

  return res.status(403).json({ error: "ليس لديك صلاحية الوصول لهذه البيانات." });
}

// Ensure Super Admin only
function requireOwner(req: express.Request, res: express.Response, next: express.NextFunction) {
  const userEmail = req.headers['x-user-email'] as string;
  if (!isSuperAdmin(userEmail)) {
    return res.status(403).json({
      error: "هذا الإجراء مخصص حصراً لصاحب الموقع والمشرف العام (bobaker10b@gmail.com)."
    });
  }
  (req as any).currentUser = {
    email: userEmail.toLowerCase().trim(),
    isOwner: true,
    name: "المشرف العام"
  };
  next();
}

// 1. Get Members List
app.get('/api/admin/members', requireAuth, (req, res) => {
  const data = loadData();
  const currentUser = (req as any).currentUser;

  let members = [...data.members];

  // If regular supervisor, only show members belonging to their assigned cohorts
  if (!currentUser.isOwner) {
    const assigned = currentUser.assignedCohorts || [];
    members = members.filter((m: DbMember) => assigned.includes(m.cohortName));
  }

  res.json({
    members,
    total: members.length,
    paidCount: members.filter((m: DbMember) => m.subscriptionPaid).length,
    unpaidCount: members.filter((m: DbMember) => !m.subscriptionPaid).length,
    maleCount: members.filter((m: DbMember) => m.gender === 'ذكر').length,
    femaleCount: members.filter((m: DbMember) => m.gender === 'أنثى').length
  });
});

// 2. Add Member from Admin
app.post('/api/admin/members', requireAuth, (req, res) => {
  const data = loadData();
  const {
    firstName,
    lastName,
    birthDate,
    gender,
    educationLevel,
    hobby,
    guardianName,
    guardianPhone,
    cohortName,
    subscriptionPaid
  } = req.body;

  if (!firstName || !lastName || !gender) {
    return res.status(400).json({ error: "بيانات المنخرط غير مكتملة." });
  }

  const currentUser = (req as any).currentUser;
  let finalCohort = cohortName;

  if (!currentUser.isOwner) {
    if (!currentUser.assignedCohorts || currentUser.assignedCohorts.length === 0) {
      return res.status(403).json({ error: "ليس لديك صلاحية أستاذ فوج لإضافة منخرطين. يجب أن يتم إسنادك إلى فوج أولاً من قبل الإدارة." });
    }
    if (!currentUser.assignedCohorts.includes(cohortName)) {
      finalCohort = currentUser.assignedCohorts[0];
    }
  }

  const seq = data.members.length + 85;
  const newMember: DbMember = {
    id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    code: `#TK-2026-${seq.toString().padStart(3, '0')}`,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    birthDate: birthDate || "2011-01-01",
    gender: gender || "ذكر",
    educationLevel: educationLevel || "السنة الثانية متوسط",
    hobby: hobby || "حفظ وتجويد القرآن الكريم",
    guardianName: guardianName ? guardianName.trim() : "الولي",
    guardianPhone: guardianPhone ? guardianPhone.replace(/\s+/g, '') : "0660000000",
    cohortId: null,
    cohortName: finalCohort || (gender === 'أنثى' ? "طوفان الأقصى" : "غزة العزة"),
    subscriptionPaid: !!subscriptionPaid,
    paidAt: subscriptionPaid ? new Date().toISOString() : undefined,
    cardIssued: !!subscriptionPaid,
    guardianConsent: true,
    createdAt: new Date().toISOString()
  };

  data.members.unshift(newMember);
  saveData(data);

  logAudit(
    "إضافة منخرط يدوياً",
    `إضافة المنخرط ${firstName} ${lastName} بواسطة الإدارة`,
    (req as any).currentUser.email
  );

  res.json({ success: true, member: newMember });
});

// 3. Update Member
app.put('/api/admin/members/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const user = (req as any).currentUser;
  const data = loadData();
  const index = data.members.findIndex((m: DbMember) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "المنخرط غير موجود." });
  }

  const old = data.members[index];

  if (!user.isOwner) {
    const assigned = user.assignedCohorts || [];
    if (!assigned.includes(old.cohortName)) {
      return res.status(403).json({ error: "صلاحيتك كمشرف تقتصر على التعديل في المنخرطين في الفوج الخاص بك فقط." });
    }
    if (req.body.cohortName && req.body.cohortName !== old.cohortName) {
      return res.status(403).json({ error: "لا يمكنك نقل المنخرط إلى فوج آخر. هذا الإجراء مخصص للمالك." });
    }
  }

  data.members[index] = {
    ...old,
    ...req.body,
    id: old.id,
    code: old.code,
    cohortName: user.isOwner ? (req.body.cohortName || old.cohortName) : old.cohortName
  };

  saveData(data);
  logAudit(
    "تعديل بيانات منخرط",
    `تعديل بيانات ${old.firstName} ${old.lastName} (${old.code})`,
    user.email
  );

  res.json({ success: true, member: data.members[index] });
});

// 4. Delete Member
app.delete('/api/admin/members/:id', requireOwner, (req, res) => {
  const { id } = req.params;
  const data = loadData();
  const target = data.members.find((m: DbMember) => m.id === id);

  if (!target) {
    return res.status(404).json({ error: "المنخرط غير موجود." });
  }

  data.members = data.members.filter((m: DbMember) => m.id !== id);
  saveData(data);

  logAudit(
    "حذف منخرط",
    `حذف المنخرط ${target.firstName} ${target.lastName} (${target.code})`,
    (req as any).currentUser.email
  );

  res.json({ success: true, message: `تم حذف ${target.firstName} ${target.lastName} بنجاح.` });
});

// 5. Toggle Payment Status (500 DZD)
app.patch('/api/admin/members/:id/toggle-payment', requireAuth, (req, res) => {
  const { id } = req.params;
  const user = (req as any).currentUser;
  const data = loadData();
  const member = data.members.find((m: DbMember) => m.id === id);

  if (!member) {
    return res.status(404).json({ error: "المنخرط غير موجود." });
  }

  if (!user.isOwner) {
    const assigned = user.assignedCohorts || [];
    if (!assigned.includes(member.cohortName)) {
      return res.status(403).json({ error: "صلاحيتك كمشرف تقتصر على المنخرطين في الفوج الخاص بك فقط." });
    }
  }

  member.subscriptionPaid = !member.subscriptionPaid;
  if (member.subscriptionPaid) {
    member.paidAt = new Date().toISOString();
    member.cardIssued = true;
  } else {
    member.paidAt = undefined;
    member.cardIssued = false;
  }

  saveData(data);

  logAudit(
    "تحديث حالة الاشتراك",
    `تغيير حالة اشتراك ${member.firstName} ${member.lastName} إلى ${member.subscriptionPaid ? 'مسدد (500 دج)' : 'غير مسدد'}`,
    user.email
  );

  res.json({ success: true, member });
});

// 6. Assign / Move Cohort
app.patch('/api/admin/members/:id/cohort', requireOwner, (req, res) => {
  const { id } = req.params;
  const { cohortName } = req.body;
  const data = loadData();
  const member = data.members.find((m: DbMember) => m.id === id);

  if (!member) {
    return res.status(404).json({ error: "المنخرط غير موجود." });
  }

  const oldCohort = member.cohortName;
  member.cohortName = cohortName || 'بدون فوج';
  saveData(data);

  logAudit(
    "نقل بين الأفواج",
    `نقل المنخرط ${member.firstName} ${member.lastName} من [${oldCohort}] إلى [${cohortName}]`,
    (req as any).currentUser.email
  );

  res.json({ success: true, member });
});

// 7. Get Cohorts
app.get('/api/admin/cohorts', requireAuth, (req, res) => {
  const data = loadData();
  const cohortsWithStats = data.cohorts.map((c: DbCohort) => {
    const assignedMembers = data.members.filter((m: DbMember) => m.cohortName === c.name);
    const assignedSupervisors = data.supervisors
      .filter((s: DbSupervisor) => s.status === 'approved' && s.assignedCohorts && s.assignedCohorts.includes(c.name))
      .map((s: DbSupervisor) => `${s.firstName} ${s.lastName}`);

    return {
      ...c,
      supervisors: assignedSupervisors,
      membersCount: assignedMembers.length,
      paidCount: assignedMembers.filter((m: DbMember) => m.subscriptionPaid).length
    };
  });
  res.json({ cohorts: cohortsWithStats });
});

// 8. Create Cohort
app.post('/api/admin/cohorts', requireOwner, (req, res) => {
  const { name, category, targetGender, supervisorName, location, description } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: "اسم الفوج وتصنيفه مطلوبان." });
  }

  const data = loadData();
  const newCohort: DbCohort = {
    id: `cohort-${Date.now()}`,
    name: name.trim(),
    category: category || "شباب القيم",
    targetGender: targetGender || (category === 'فتيات القيم' ? 'أنثى' : 'ذكر'),
    supervisorName: supervisorName ? supervisorName.trim() : "لم يحدد بعد",
    location: location ? location.trim() : "تامست",
    description: description ? description.trim() : "",
    createdAt: new Date().toISOString()
  };

  data.cohorts.push(newCohort);
  saveData(data);

  logAudit(
    "إنشاء فوج تربوي",
    `إنشاء فوج تربوي جديد: ${name} (${category})`,
    (req as any).currentUser.email
  );

  res.json({ success: true, cohort: newCohort });
});

// 9. Update Cohort (Owner can update any cohort, Supervisor can update their assigned cohort only)
app.put('/api/admin/cohorts/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const user = (req as any).currentUser;
  const data = loadData();
  const index = data.cohorts.findIndex((c: DbCohort) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "الفوج غير موجود." });
  }

  const old = data.cohorts[index];

  // If regular supervisor, verify that this cohort is assigned to them
  if (!user.isOwner) {
    const isAssigned = user.assignedCohorts && user.assignedCohorts.includes(old.name);
    if (!isAssigned) {
      return res.status(403).json({ error: "صلاحيتك كمشرف تقتصر على التعديل في الفوج الخاص بك فقط." });
    }
  }
  const updated: DbCohort = {
    ...old,
    ...req.body,
    id: old.id
  };

  // If cohort name changed, update members who belong to it
  if (old.name !== updated.name) {
    data.members.forEach((m: DbMember) => {
      if (m.cohortName === old.name) {
        m.cohortName = updated.name;
      }
    });
  }

  data.cohorts[index] = updated;
  saveData(data);

  logAudit(
    "تعديل فوج",
    `تعديل بيانات فوج ${updated.name}`,
    (req as any).currentUser.email
  );

  res.json({ success: true, cohort: updated });
});

// 10. Delete Cohort
app.delete('/api/admin/cohorts/:id', requireOwner, (req, res) => {
  const { id } = req.params;
  const data = loadData();
  const target = data.cohorts.find((c: DbCohort) => c.id === id);

  if (!target) {
    return res.status(404).json({ error: "الفوج غير موجود." });
  }

  // Remove cohort and reset its members to 'قيد التوزيع'
  data.members.forEach((m: DbMember) => {
    if (m.cohortName === target.name) {
      m.cohortName = "قيد التوزيع";
    }
  });

  data.cohorts = data.cohorts.filter((c: DbCohort) => c.id !== id);
  saveData(data);

  logAudit(
    "حذف فوج تربوي",
    `حذف فوج ${target.name} وإعادة منخرطيه لحالة قيد التوزيع`,
    (req as any).currentUser.email
  );

  res.json({ success: true, message: `تم حذف فوج ${target.name}.` });
});

// 11. Get Supervisors List (Owner Only)
app.get('/api/admin/supervisors', requireOwner, (_req, res) => {
  const data = loadData();
  res.json({
    supervisors: data.supervisors,
    pending: data.supervisors.filter((s: DbSupervisor) => s.status === 'pending'),
    approved: data.supervisors.filter((s: DbSupervisor) => s.status === 'approved'),
    frozen: data.supervisors.filter((s: DbSupervisor) => s.status === 'frozen')
  });
});

// 12. Update Supervisor Status (Approve / Reject / Freeze / Activate)
app.patch('/api/admin/supervisors/:id/status', requireOwner, (req, res) => {
  const { id } = req.params;
  const { status, isCohortTeacher, assignedCohorts } = req.body;
  const data = loadData();
  const target = data.supervisors.find((s: DbSupervisor) => s.id === id);

  if (!target) {
    return res.status(404).json({ error: "المشرف غير موجود." });
  }

  if (target.isOwner) {
    return res.status(400).json({ error: "لا يمكن تعديل صلاحيات حساب المشرف العام المالك." });
  }

  if (status === 'rejected') {
    data.supervisors = data.supervisors.filter((s: DbSupervisor) => s.id !== id);
    saveData(data);
    logAudit(
      "رفض طلب مشرف",
      `رفض وحذف طلب المشرف ${target.firstName} ${target.lastName} (${target.email})`,
      (req as any).currentUser.email
    );
    return res.json({ success: true, message: `تم رفض طلب المشرف ${target.firstName} ${target.lastName}.` });
  }

  target.status = status;

  if (status === 'approved') {
    if (isCohortTeacher === false) {
      target.isCohortTeacher = false;
      target.assignedCohorts = [];
    } else if (isCohortTeacher === true) {
      target.isCohortTeacher = true;
      if (Array.isArray(assignedCohorts) && assignedCohorts.length > 0) {
        for (const cName of assignedCohorts) {
          const currentCount = data.supervisors.filter((s: DbSupervisor) => s.id !== target.id && s.status === 'approved' && s.assignedCohorts?.includes(cName)).length;
          if (currentCount >= 4) {
            return res.status(400).json({ error: `الفوج «${cName}» مكتمل المشرفين (الحد الأقصى 4 مشرفين لكل فوج).` });
          }
        }
        target.assignedCohorts = assignedCohorts;
      }
    }
  }

  saveData(data);

  logAudit(
    "تعديل حالة مشرف",
    `تغيير حالة المشرف ${target.firstName} ${target.lastName} إلى ${status} (${target.isCohortTeacher ? 'أستاذ فوج' : 'مشرف عام بدون فوج'})`,
    (req as any).currentUser.email
  );

  res.json({ success: true, supervisor: target });
});

// 13. Update Supervisor Role or Cohorts (Owner Only)
app.patch('/api/admin/supervisors/:id/update', requireOwner, (req, res) => {
  const { id } = req.params;
  const { role, assignedCohorts, isCohortTeacher, firstName, lastName } = req.body;
  const data = loadData();
  const target = data.supervisors.find((s: DbSupervisor) => s.id === id);

  if (!target) {
    return res.status(404).json({ error: "المشرف غير موجود." });
  }

  if (role) target.role = role;
  
  if (isCohortTeacher !== undefined) {
    target.isCohortTeacher = !!isCohortTeacher;
    if (!isCohortTeacher) {
      target.assignedCohorts = [];
    }
  }

  if (Array.isArray(assignedCohorts)) {
    // Check max 4 supervisors per cohort
    for (const cName of assignedCohorts) {
      const currentCount = data.supervisors.filter((s: DbSupervisor) => s.id !== target.id && s.status === 'approved' && s.assignedCohorts?.includes(cName)).length;
      if (currentCount >= 4) {
        return res.status(400).json({ error: `الفوج «${cName}» مكتمل المشرفين (الحد الأقصى هو 4 مشرفين لكل فوج).` });
      }
    }
    target.assignedCohorts = assignedCohorts;
    if (assignedCohorts.length > 0) {
      target.isCohortTeacher = true;
    }
  }

  if (firstName) target.firstName = firstName.trim();
  if (lastName) target.lastName = lastName.trim();

  saveData(data);

  logAudit(
    "تحديث صلاحيات مشرف",
    `تحديث مهام المشرف ${target.firstName} ${target.lastName} (${target.role}) [أستاذ فوج: ${target.isCohortTeacher ? 'نعم' : 'لا'}]`,
    (req as any).currentUser.email
  );

  res.json({ success: true, supervisor: target });
});

// 14. Revoke / Delete Supervisor
app.delete('/api/admin/supervisors/:id', requireOwner, (req, res) => {
  const { id } = req.params;
  const data = loadData();
  const target = data.supervisors.find((s: DbSupervisor) => s.id === id);

  if (!target) {
    return res.status(404).json({ error: "المشرف غير موجود." });
  }

  if (target.isOwner) {
    return res.status(400).json({ error: "لا يمكن حذف حساب المالك الأساسي." });
  }

  data.supervisors = data.supervisors.filter((s: DbSupervisor) => s.id !== id);
  saveData(data);

  logAudit(
    "إلغاء اعتماد مشرف",
    `إلغاء وحذف اعتماد المشرف ${target.firstName} ${target.lastName} فورياً`,
    (req as any).currentUser.email
  );

  res.json({ success: true, message: "تم إلغاء اعتماد المشرف وحذف صلاحياته فوراً." });
});

// 15. Manage Gallery (Photos)
app.get('/api/admin/photos', requireAuth, (_req, res) => {
  const data = loadData();
  res.json({ photos: data.photos });
});

app.post('/api/admin/photos', requireOwner, (req, res) => {
  const { title, description, imageUrl, category, published } = req.body;

  if (!title || !imageUrl) {
    return res.status(400).json({ error: "عنوان الصورة ورابطها مطلوبان." });
  }

  const data = loadData();
  const newPhoto: DbPhoto = {
    id: `photo-${Date.now()}`,
    title: title.trim(),
    description: description ? description.trim() : "",
    imageUrl: imageUrl.trim(),
    category: category || "أنشطة عامة",
    published: published !== undefined ? !!published : true,
    order: data.photos.length + 1,
    createdAt: new Date().toISOString()
  };

  data.photos.unshift(newPhoto);
  saveData(data);

  logAudit(
    "إضافة صورة نشاط",
    `إضافة صورة جديدة للمعرض: ${title}`,
    (req as any).currentUser.email
  );

  res.json({ success: true, photo: newPhoto });
});

app.put('/api/admin/photos/:id', requireOwner, (req, res) => {
  const { id } = req.params;
  const data = loadData();
  const index = data.photos.findIndex((p: DbPhoto) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "الصورة غير موجودة." });
  }

  data.photos[index] = {
    ...data.photos[index],
    ...req.body,
    id: data.photos[index].id
  };

  saveData(data);
  res.json({ success: true, photo: data.photos[index] });
});

app.patch('/api/admin/photos/:id/visibility', requireOwner, (req, res) => {
  const { id } = req.params;
  const data = loadData();
  const photo = data.photos.find((p: DbPhoto) => p.id === id);

  if (!photo) {
    return res.status(404).json({ error: "الصورة غير موجودة." });
  }

  photo.published = !photo.published;
  saveData(data);

  logAudit(
    "تعديل ظهور صورة",
    `تغيير حالة ظهور الصورة "${photo.title}" إلى: ${photo.published ? 'منشور للعامة' : 'مخفي'}`,
    (req as any).currentUser.email
  );

  res.json({ success: true, photo });
});

app.delete('/api/admin/photos/:id', requireOwner, (req, res) => {
  const { id } = req.params;
  const data = loadData();
  const photo = data.photos.find((p: DbPhoto) => p.id === id);

  if (!photo) {
    return res.status(404).json({ error: "الصورة غير موجودة." });
  }

  data.photos = data.photos.filter((p: DbPhoto) => p.id !== id);
  saveData(data);

  logAudit(
    "حذف صورة",
    `حذف الصورة "${photo.title}" من المعرض`,
    (req as any).currentUser.email
  );

  res.json({ success: true, message: "تم حذف الصورة من المعرض." });
});

// 16. Audit Logs
app.get('/api/admin/audit-logs', requireOwner, (_req, res) => {
  const data = loadData();
  res.json({ logs: data.auditLogs });
});

// ---------------------------------------------------------------------
// VITE INTEGRATION FOR DEVELOPMENT & PRODUCTION
// ---------------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true'
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tamest Values Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
