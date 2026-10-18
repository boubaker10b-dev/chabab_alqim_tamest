const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : './';
const getAssetPath = (file: string) => {
  const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  return `${base}${file}`;
};

export const LOGO_PROJECT = getAssetPath('logo-chabab-alqiyam.png');
export const LOGO_PROJECT_PNG = getAssetPath('logo-chabab-alqiyam.png');

export const LOGO_ASSOCIATION = getAssetPath('logo-el-maali.png');
export const LOGO_ASSOCIATION_PNG = getAssetPath('logo-el-maali.png');

export const SUPERVISOR_DJABALLAH_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBjPR9Ft8XGrzHNgLdzDfeNFSIJ6sZgANFUOAriTG4pcYMJQ6IOSasLHEqqiXC92p39FecS6cbtDuxF40w3y9gdv8O_jvRfOJGOoU526gLnuknF-w1J_UVxyJ2la4-z6zx7xqfVps-M_7LbAlU2WlCuC_cC1xkw6hxhxr8Bxxv_CNE4IIMI8nRfth-xvgSFqZG3Z6JSdjX_r07O_GWiT8EQhi7Rane7RTFoo9lTTqRDyzMI1iN_a3c5_bK4HvzAVIjrV-Q";

export const SOCIAL_FACEBOOK = "https://www.facebook.com/p/%D8%B4%D8%A8%D8%A7%D8%A8-%D8%A7%D9%84%D9%82%D9%8A%D9%85-%D8%AA%D8%A7%D9%85%D8%B3%D8%AA-61575016846206/";
export const SOCIAL_INSTAGRAM = "https://www.instagram.com/chabab_al_qiyam_tamest/";

export const SUPER_ADMIN_EMAIL = "bobaker10b@gmail.com";
export const SUPER_ADMIN_ALT_EMAIL = "rachiddjabellah@gmail.com";
export const ADMIN_EMAILS = ["bobaker10b@gmail.com", "rachiddjabellah@gmail.com", "boubaker10b@gmail.com"];
export const ADMIN_PASSWORD = "admin2025";
export const SUPERVISOR_PASSWORD = "chabab-alqiam2027";

export const CURRENT_SEASON = "2026 / 2027";

export const EDUCATION_LEVELS = [
  "السنة الرابعة ابتدائي",
  "السنة الخامسة ابتدائي",
  "السنة الأولى متوسط",
  "السنة الثانية متوسط",
  "السنة الثالثة متوسط",
  "السنة الرابعة متوسط",
  "السنة الأولى ثانوي",
  "السنة الثانية ثانوي",
  "السنة الثالثة ثانوي (بكالوريا)"
];

export const SUGGESTED_HOBBIES = [
  "حفظ القرآن الكريم",
  "الرسم",
  "الإلقاء",
  "المسرح",
  "الأناشيد"
];

export const HOBBIES = SUGGESTED_HOBBIES;
