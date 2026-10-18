import React, { useState } from 'react';
import { api } from '../services/api';
import { EDUCATION_LEVELS, SUGGESTED_HOBBIES, LOGO_PROJECT, LOGO_ASSOCIATION, CURRENT_SEASON } from '../constants';
import { Gender } from '../types';
import { CheckCircle2, AlertCircle, ShieldCheck, CreditCard, Sparkles, Send, BadgeCheck } from 'lucide-react';

interface RegistrationFormProps {
  onSuccess?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>('ذكر');
  const [educationLevel, setEducationLevel] = useState('');
  const [hobby, setHobby] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianConsent, setGuardianConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState<{
    registrationCode: string;
    memberName: string;
    gender: string;
    notice: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName.trim() || !lastName.trim() || !birthDate || !educationLevel || !hobby || !guardianName.trim() || !guardianPhone.trim()) {
      setErrorMessage('يرجى ملء جميع الحقول الإلزامية المؤشرة بنجمة (*).');
      return;
    }

    const cleanPhone = guardianPhone.replace(/\s+/g, '');
    if (!/^(05|06|07)[0-9]{8}$/.test(cleanPhone)) {
      setErrorMessage('رقم هاتف الولي غير صحيح. يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام.');
      return;
    }

    if (!guardianConsent) {
      setErrorMessage('يرجى تأكيد موافقة وإقرار الولي الشرعي على التسجيل.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.registerMember({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthDate,
        gender,
        educationLevel,
        hobby,
        guardianName: guardianName.trim(),
        guardianPhone: cleanPhone,
        guardianConsent
      });

      setSuccessData({
        registrationCode: res.registrationCode,
        memberName: res.memberName,
        gender: res.gender,
        notice: res.notice
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء إرسال التسجيل. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setBirthDate('');
    setGender('ذكر');
    setEducationLevel('');
    setHobby('');
    setGuardianName('');
    setGuardianPhone('');
    setGuardianConsent(false);
    setSuccessData(null);
    setErrorMessage('');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Banner Notice */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#0d533d]/15 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col text-right max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eefdf6] text-[#003a29] text-xs font-bold mb-2 border border-[#0d533d]/20 self-start">
            <Sparkles className="w-4 h-4 text-[#003a29]" />
            <span>الموسم التربوي الحالي {CURRENT_SEASON}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003a29] mb-1">
            استمارة انخراط وتسجيل لموسم التربية والقيم
          </h1>
          <p className="text-sm text-[#404944] leading-relaxed">
            مرحباً بأولياء الأمور وأبنائنا وبناتنا في رحاب مشروع شباب القيم تامست تحت مظلة جمعية المعالي للعلوم والتربية. خطوة واثقة نحو بناء الشخصية وتنمية المواهب.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <img src={LOGO_PROJECT} alt="شعار شباب القيم" referrerPolicy="no-referrer" className="h-14 sm:h-16 w-auto object-contain drop-shadow-xs" />
          <img src={LOGO_ASSOCIATION} alt="شعار جمعية المعالي" referrerPolicy="no-referrer" className="h-14 sm:h-16 w-auto object-contain drop-shadow-xs" />
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#eefdf6] border border-[#0d533d]/20 p-4 sm:p-5 rounded-2xl flex items-start gap-4 text-right">
          <div className="w-12 h-12 rounded-xl bg-[#003a29] text-white flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-extrabold text-[#003a29] block mb-0.5">
              قيمة الاشتراك الرمزي: 500 دج
            </span>
            <p className="text-xs text-[#404944] leading-relaxed">
              تُسدد حضورياً في الحصة التربوية الأولى (حصة التعارف)، ويستلم المنخرط بطاقة الانخراط الرسمية المعتمدة فور تسديد الاشتراك واستكمال الملف.
            </p>
          </div>
        </div>

        <div className="bg-[#e8f7f0] border border-[#0d533d]/20 p-4 sm:p-5 rounded-2xl flex items-start gap-4 text-right">
          <div className="w-12 h-12 rounded-xl bg-[#0d533d] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-extrabold text-[#003a29] block mb-0.5">
              سرية وأمان المعطيات الشخصية
            </span>
            <p className="text-xs text-[#404944] leading-relaxed">
              البيانات المدخلة محمية وتستخدم حصراً لتنظيم الأفواج والأنشطة التربوية من قبل الإدارة والمشرفين المخولين، ولا يتم كشفها لأي طرف خارجي.
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Section 1: Member Data */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#0d533d]/15 flex flex-col gap-6 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#003a29] text-white text-sm font-bold flex items-center justify-center">1</span>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#003a29]">البيانات الشخصية للمنخرط(ة)</h2>
              </div>
              <span className="text-xs text-[#404944]">الحقول بعلامة (*) إلزامية</span>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#111e1a]">
                  الاسم الشخصي <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: يونس"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d] transition-all"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#111e1a]">
                  اللقب العائلي <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تامستي"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d] transition-all"
                />
              </div>

              {/* Birth Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#111e1a]">
                  تاريخ الميلاد <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d] transition-all"
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#111e1a]">
                  الجنس <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('ذكر')}
                    className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      gender === 'ذكر'
                        ? 'bg-[#0d533d] text-white border-[#0d533d] shadow-sm'
                        : 'bg-[#eefdf6]/50 border-[#0d533d]/20 text-[#404944] hover:bg-[#e2f1eb]'
                    }`}
                  >
                    <span>ذكر (فوج شباب)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('أنثى')}
                    className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      gender === 'أنثى'
                        ? 'bg-[#003a29] text-white border-[#003a29] shadow-sm'
                        : 'bg-[#eefdf6]/50 border-[#0d533d]/20 text-[#404944] hover:bg-[#e2f1eb]'
                    }`}
                  >
                    <span>أنثى (فوج فتيات)</span>
                  </button>
                </div>
              </div>

              {/* Education Level */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#111e1a]">
                  المستوى الدراسي (الموسم الحالي) <span className="text-[#ba1a1a]">*</span>
                </label>
                <select
                  required
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full px-4 py-3 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d] transition-all"
                >
                  <option value="">-- اختر المستوى الدراسي بالجزائر --</option>
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Hobby: Custom Input + Suggested Options */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-sm font-bold text-[#111e1a] flex items-center gap-1.5">
                    <span>الموهبة أو الهواية الشخصية</span>
                    <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <span className="text-xs text-[#707973]">
                    اكتب هوايتك بنفسك، أو اختر من الهوايات المقترحة
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="اكتب هوايتك هنا (مثال: حفظ القرآن الكريم، الرسم، الإلقاء، المسرح، الأناشيد، أو أي هواية أخرى...)"
                    value={hobby}
                    onChange={(e) => setHobby(e.target.value)}
                    className="w-full px-4 py-3 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d] transition-all"
                  />
                  {hobby && (
                    <button
                      type="button"
                      onClick={() => setHobby('')}
                      className="absolute left-3 top-3 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="مسح الحقل"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Suggestions Pills */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-xs font-bold text-[#003a29] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#0d533d]" />
                    <span>هوايات مقترحة (انقر للاختيار التلقائي):</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_HOBBIES.map((item) => {
                      const isSelected = hobby.trim() === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setHobby(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#003a29] text-white border-[#003a29] shadow-xs'
                              : 'bg-white hover:bg-[#eefdf6] text-[#003a29] border-[#0d533d]/20'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Guardian Data */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#0d533d]/15 flex flex-col gap-6 text-right">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-8 h-8 rounded-full bg-[#003a29] text-white text-sm font-bold flex items-center justify-center">2</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#003a29]">بيانات الولي والاتصال المباشر</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Guardian Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#111e1a]">
                  الاسم الكامل للولي أو الوصي الشرعي <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الحاج بلقاسم تامستي"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d] transition-all"
                />
              </div>

              {/* Guardian Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#111e1a]">
                  رقم هاتف الولي (الجزائر) <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="06XXXXXXXX / 07XXXXXXXX"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm font-mono text-left dir-ltr focus:outline-none focus:ring-2 focus:ring-[#0d533d] transition-all"
                  />
                  <span className="absolute left-3 top-3.5 text-xs font-bold text-[#404944]">DZ (+213)</span>
                </div>
                <span className="text-[11px] text-[#404944]">يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام</span>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="p-4 rounded-2xl bg-[#eefdf6] border border-[#0d533d]/20 flex items-start gap-3">
              <input
                type="checkbox"
                id="guardianConsent"
                checked={guardianConsent}
                onChange={(e) => setGuardianConsent(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-[#0d533d] text-[#0d533d] focus:ring-0 cursor-pointer accent-[#0d533d]"
              />
              <label htmlFor="guardianConsent" className="text-xs sm:text-sm text-[#111e1a] cursor-pointer leading-relaxed">
                <strong className="font-bold text-[#003a29]">إقرار وموافقة الولي:</strong> أقر أنا الولي الشرعي بموافقتي الصريحة على تسجيل ابني/ابنتي في مشروع شباب القيم تامست، والتزامه بحضور الحصص التربوية والأنشطة الدورية والتقيد بأنظمة الفوج تحت إشراف جمعية المعالي للعلوم والتربية.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#0d533d]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#404944]">
              تُحفظ البيانات وتخضع لمراجعة الطاقم التربوي فور الإرسال
            </span>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 bg-[#003a29] text-white font-extrabold text-base rounded-2xl hover:bg-[#0d533d] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>جارٍ تسجيل البيانات بأمان...</span>
              ) : (
                <>
                  <span>تأكيد وإرسال طلب التسجيل</span>
                  <Send className="w-5 h-5 -scale-x-100" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Success Modal */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-right">
            
            <div className="w-16 h-16 rounded-full bg-[#e8f7f0] text-[#0d533d] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-black text-[#003a29] mb-1">
                تم استلام طلب التسجيل بنجاح!
              </h3>
              <p className="text-sm text-[#404944]">
                شكراً لثقتكم في مشروع شباب القيم تامست. تم تقييد بيانات المنخرط(ة) في القوائم الأولية المعتمدة.
              </p>
            </div>

            {/* Voucher Card */}
            <div className="bg-[#eefdf6] border border-[#0d533d]/20 p-5 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#0d533d]/15">
                <span className="text-xs text-[#404944]">رمز التسجيل الداخلي المؤقت:</span>
                <span className="font-mono font-extrabold text-lg text-[#003a29] dir-ltr">
                  {successData.registrationCode}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#404944]">اسم المنخرط(ة):</span>
                <span className="text-sm font-bold text-[#111e1a]">{successData.memberName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#404944]">قيمة الاشتراك:</span>
                <span className="text-sm font-extrabold text-[#003a29]">500 دج (تسدد حضورياً في الحصة الأولى)</span>
              </div>
              <div className="pt-2 text-xs text-[#003a29] font-medium leading-relaxed">
                {successData.notice}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReset}
                className="w-full py-3.5 bg-[#003a29] text-white font-bold text-sm rounded-xl hover:bg-[#0d533d] shadow-md transition-all cursor-pointer"
              >
                تسجيل منخرط آخر
              </button>
              <button
                onClick={() => setSuccessData(null)}
                className="w-full py-3.5 bg-[#e2f1eb] text-[#003a29] font-bold text-sm rounded-xl hover:bg-[#ddece5] transition-all cursor-pointer"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
