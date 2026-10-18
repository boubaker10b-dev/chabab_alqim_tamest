import { PublicInfo, Member, Cohort, Supervisor, ActivityPhoto, AuditLog } from '../types';

export const FALLBACK_PHOTOS: ActivityPhoto[] = [
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
];

export const FALLBACK_COHORTS: Cohort[] = [
  {
    id: "cohort-gaza",
    name: "غزة العزة",
    category: "شباب القيم",
    targetGender: "ذكر",
    supervisorName: "أ. جاب الله رشيد",
    supervisors: ["جاب الله رشيد"],
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
    supervisors: ["مريم تامست"],
    location: "القاعة الخميس - تامست",
    description: "فوج الفتيات والناشئة المخصص للورشات التربوية والإيمانية والأعمال الإبداعية.",
    createdAt: "2025-09-01T00:00:00Z"
  }
];

export const FALLBACK_MEMBERS: Member[] = [
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
    firstName: "سارة",
    lastName: "طهراوي",
    birthDate: "2012-05-30",
    gender: "أنثى",
    educationLevel: "السنة الثانية متوسط",
    hobby: "المسرح والإلقاء الشعري",
    guardianName: "مختار طهراوي",
    guardianPhone: "0668401923",
    cohortId: "cohort-toufan",
    cohortName: "طوفان الأقصى",
    subscriptionPaid: true,
    paidAt: "2025-09-18",
    cardIssued: true,
    guardianConsent: true,
    createdAt: "2025-09-14T09:30:00Z"
  },
  {
    id: "mem-2505",
    code: "#TK-2025-088",
    firstName: "يوسف",
    lastName: "زروقي",
    birthDate: "2008-11-04",
    gender: "ذكر",
    educationLevel: "السنة الثانية ثانوي",
    hobby: "التلاوة والعمل الجمعوي",
    guardianName: "أحمد زروقي",
    guardianPhone: "0771904561",
    cohortId: "cohort-gaza",
    cohortName: "غزة العزة",
    subscriptionPaid: false,
    cardIssued: false,
    guardianConsent: true,
    createdAt: "2025-09-15T16:00:00Z"
  }
];

export const FALLBACK_SUPERVISORS: Supervisor[] = [
  {
    id: "sup-owner",
    firstName: "بوبكر",
    lastName: "بخيتي",
    email: "bobaker10b@gmail.com",
    role: "المشرف العام والمالك",
    status: "approved",
    isCohortTeacher: true,
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
    isCohortTeacher: true,
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
    isCohortTeacher: true,
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
    isCohortTeacher: true,
    assignedCohorts: ["طوفان الأقصى"],
    isOwner: false,
    createdAt: "2025-08-20T00:00:00Z"
  }
];

export const FALLBACK_PUBLIC_INFO: PublicInfo = {
  project: {
    name: "مشروع شباب القيم تامست",
    association: "جمعية المعالي للعلوم والتربية",
    generalSupervisor: "بوبكر بخيتي",
    fee: 500,
    feeCurrency: "دج",
    paymentInfo: "تُسدد حضورياً في الحصة الافتتاحية الأولى (حصة التعارف)"
  },
  stats: {
    totalMembers: 10,
    maleMembers: 7,
    femaleMembers: 3,
    cohortsCount: 2,
    photosCount: 6
  },
  photos: FALLBACK_PHOTOS
};
