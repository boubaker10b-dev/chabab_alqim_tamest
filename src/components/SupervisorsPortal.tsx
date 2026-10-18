import React, { useState } from 'react';
import { api } from '../services/api';
import { AuthUser } from '../types';
import { SUPER_ADMIN_EMAIL, LOGO_PROJECT, LOGO_ASSOCIATION } from '../constants';
import { ShieldCheck, Lock, UserCheck, AlertTriangle, ArrowLeft, Send, CheckCircle2, BadgeCheck } from 'lucide-react';

interface SupervisorsPortalProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const SupervisorsPortal: React.FC<SupervisorsPortalProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'apply'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Application form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'مشرف تربوي' | 'مشرف إداري'>('مشرف تربوي');
  const [experience, setExperience] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('يرجى إدخال البريد الإلكتروني.');
      return;
    }

    try {
      setLoginLoading(true);
      const res = await api.login(loginEmail.trim(), loginPassword);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setLoginError(err.message || 'فشل تسجيل الدخول.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setApplyError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    try {
      setApplyLoading(true);
      await api.applySupervisor({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        role,
        experience: experience.trim()
      });

      setApplySuccess(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setExperience('');
    } catch (err: any) {
      setApplyError(err.message || 'حدث خطأ أثناء تقديم طلب الاعتماد.');
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Portal Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#0d533d]/15 mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src={LOGO_PROJECT} alt="شعار شباب القيم" referrerPolicy="no-referrer" className="h-14 sm:h-16 w-auto object-contain drop-shadow-xs" />
          <img src={LOGO_ASSOCIATION} alt="شعار جمعية المعالي" referrerPolicy="no-referrer" className="h-14 sm:h-16 w-auto object-contain drop-shadow-xs" />
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#eefdf6] text-[#003a29] border border-[#0d533d]/20 mb-2 inline-block">
          منظومة الإشراف والقيادة البلديـة
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003a29] mb-2">
          بوابة المشرفين البلديين والإدارة المركزية
        </h1>
        <p className="text-sm text-[#404944] max-w-xl mx-auto leading-relaxed">
          مشروع شباب القيم تامست - متابعة الأفواج التربوية والريادية وإدارة البرامج تحت رعاية جمعية المعالي للعلوم والتربية.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 mt-6 p-1 bg-[#eefdf6] rounded-2xl max-w-md mx-auto border border-[#0d533d]/15">
          <button
            onClick={() => { setActiveTab('login'); setApplySuccess(false); }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#003a29] text-white shadow-sm'
                : 'text-[#404944] hover:text-[#003a29]'
            }`}
          >
            تسجيل دخول المشرفين المعتمدين
          </button>
          <button
            onClick={() => { setActiveTab('apply'); setLoginError(''); }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'apply'
                ? 'bg-[#003a29] text-white shadow-sm'
                : 'text-[#404944] hover:text-[#003a29]'
            }`}
          >
            تقديم طلب اعتماد مشرف جديد
          </button>
        </div>
      </div>

      {/* TAB 1: LOGIN */}
      {activeTab === 'login' && (
        <div className="flex flex-col gap-6">
          
          {/* Security Alert Banner */}
          <div className="bg-white rounded-3xl p-5 border border-[#ba1a1a]/30 shadow-sm flex items-start gap-4 text-right">
            <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-extrabold text-[#ba1a1a] block mb-1">
                تنبيه أمني وصلاحيات خاصة
              </span>
              <p className="text-xs sm:text-sm text-[#404944] leading-relaxed">
                تسجيل الدخول متاح حصراً للمشرفين والإدارة المركزية المعتمدة رسمياً (
                <span className="font-mono font-bold text-[#003a29] mx-1 dir-ltr inline-block">
                  bobaker10b@gmail.com
                </span>
                و
                <span className="font-mono font-bold text-[#003a29] mx-1 dir-ltr inline-block">
                  rachiddjabellah@gmail.com
                </span>
                ). لن يتمكن أي حساب من الدخول قبل تفعيله واعتماده رسمياً.
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#0d533d]/15 text-right">
            <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto">
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#e8f7f0] text-[#003a29] flex items-center justify-center mx-auto mb-2">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-[#003a29]">فضاء المشرف المعتمد</h2>
                <p className="text-xs text-[#404944]">أدخل بريدك الإلكتروني المعتمد للوصول إلى لوحة المتابعة</p>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-xs sm:text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#111e1a]">
                  البريد الإلكتروني المعتمد
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm font-mono text-left dir-ltr focus:outline-none focus:ring-2 focus:ring-[#0d533d] transition-all"
                />
              </div>

              {/* Password / Access code */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#111e1a]">
                    رمز الدخول / كلمة المرور
                  </label>
                  <span className="text-[11px] text-[#0d533d]">مرسل إلى بريدك المعتمد</span>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm font-mono text-left dir-ltr focus:outline-none focus:ring-2 focus:ring-[#0d533d] transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-4 bg-[#003a29] text-white font-extrabold text-base rounded-2xl hover:bg-[#0d533d] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
              >
                {loginLoading ? (
                  <span>جارٍ التحقق من الصلاحيات...</span>
                ) : (
                  <>
                    <span>دخول إلى فضاء الإشراف التربوي</span>
                    <ArrowLeft className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      )}

      {/* TAB 2: APPLY FOR NEW SUPERVISOR */}
      {activeTab === 'apply' && (
        <div className="flex flex-col gap-6">
          
          {/* Status Policy Callout */}
          <div className="bg-white rounded-3xl p-5 border border-[#0d533d]/20 shadow-sm flex items-start gap-4 text-right">
            <div className="w-10 h-10 rounded-xl bg-[#eefdf6] text-[#003a29] flex items-center justify-center shrink-0 border border-[#0d533d]/15">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-extrabold text-[#003a29] block mb-1">
                مسار الاعتماد والتدقيق الإداري
              </span>
              <p className="text-xs sm:text-sm text-[#404944] leading-relaxed">
                بعد إرسال طلبكم، تكون حالته تلقائياً <span className="font-extrabold text-[#0d533d]">«بانتظار موافقة صاحب الموقع»</span>. لن تُمنح أي صلاحية أو وصول لقوائم الأفواج والشباب إلا بعد المراجعة والاعتماد الرسمي من إدارة المنظومة.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#0d533d]/15 text-right">
            {applySuccess ? (
              <div className="p-8 text-center flex flex-col items-center gap-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#e8f7f0] text-[#0d533d] flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#003a29]">
                  تم استلام طلب الاعتماد بنجاح!
                </h3>
                <p className="text-sm text-[#404944] leading-relaxed">
                  تم تحويل طلبك الإشرافي إلى بريد الإدارة المركزية لصاحب الموقع ({SUPER_ADMIN_EMAIL}).
                </p>
                <div className="p-3 bg-[#eefdf6] rounded-xl border border-[#0d533d]/20 w-full text-center">
                  <span className="text-xs font-bold text-[#003a29]">حالة الطلب: </span>
                  <span className="text-xs font-extrabold text-[#0d533d]">بانتظار موافقة صاحب الموقع</span>
                </div>
                <button
                  onClick={() => setApplySuccess(false)}
                  className="px-6 py-2.5 bg-[#003a29] text-white rounded-xl text-sm font-bold hover:bg-[#0d533d] transition-colors"
                >
                  تقديم طلب آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 max-w-xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-extrabold text-[#003a29]">طلب اعتماد مشرف بلدي جديد</h2>
                  <p className="text-xs text-[#404944]">يرجى تعبئة البيانات بدقة ليتم فحصها من طرف الإدارة</p>
                </div>

                {applyError && (
                  <div className="p-3.5 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-xs sm:text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{applyError}</span>
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
                      placeholder="مثال: صالح"
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
                      placeholder="مثال: عبد العالي"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d] transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#111e1a]">
                    البريد الإلكتروني المهني / الشخصي <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="supervisor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm font-mono text-left dir-ltr focus:outline-none focus:ring-2 focus:ring-[#0d533d] transition-all"
                  />
                  <span className="text-[11px] text-[#404944]">سيتم ربط تفعيل هذا البريد مباشرة مع حساب المالك</span>
                </div>

                {/* Role selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#111e1a]">
                    الصفة الإشرافية المطلوبة <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('مشرف تربوي')}
                      className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                        role === 'مشرف تربوي'
                          ? 'bg-[#0d533d] text-white border-[#0d533d] shadow-sm'
                          : 'bg-[#eefdf6]/50 border-[#0d533d]/20 text-[#404944] hover:bg-[#e2f1eb]'
                      }`}
                    >
                      <span className="text-sm font-extrabold block mb-1">مشرف تربوي</span>
                      <span className="text-xs opacity-85 block leading-relaxed">
                        متابعة السلوك، البرامج القيمية، وتسيير الحلقات التربوية الأسبوعية.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('مشرف إداري')}
                      className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                        role === 'مشرف إداري'
                          ? 'bg-[#003a29] text-white border-[#003a29] shadow-sm'
                          : 'bg-[#eefdf6]/50 border-[#0d533d]/20 text-[#404944] hover:bg-[#e2f1eb]'
                      }`}
                    >
                      <span className="text-sm font-extrabold block mb-1">مشرف إداري</span>
                      <span className="text-xs opacity-85 block leading-relaxed">
                        تنظيم الأفواج، متابعة الحضور، الاشتراكات، وإصدار بطاقات الانخراط.
                      </span>
                    </button>
                  </div>
                </div>

                {/* Experience */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#111e1a]">
                    نبذة عن الخبرة التربوية أو دافع الانضمام
                  </label>
                  <textarea
                    rows={3}
                    placeholder="اذكر بإيجاز تجربتك في العمل الجمعوي أو التربوي، ودوافعك للمساهمة في مشروع شباب القيم تامست..."
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 bg-[#eefdf6]/50 border border-[#0d533d]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d533d] transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={applyLoading}
                  className="w-full py-4 bg-[#003a29] text-white font-extrabold text-base rounded-2xl hover:bg-[#0d533d] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
                >
                  {applyLoading ? (
                    <span>جارٍ إرسال طلب الاعتماد...</span>
                  ) : (
                    <>
                      <span>إرسال طلب الاعتماد للمراجعة</span>
                      <Send className="w-5 h-5 -scale-x-100" />
                    </>
                  )}
                </button>

              </form>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
