import React from 'react';
import { ShieldCheck, UserCheck, Lock, ArrowLeft, CreditCard, Sparkles, Award, BadgeCheck } from 'lucide-react';

interface HeroProps {
  onNavigate: (tab: string) => void;
  stats?: {
    totalMembers: number;
    maleMembers: number;
    femaleMembers: number;
  };
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, stats }) => {
  return (
    <div className="w-full">
      {/* Intro Section */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pb-24">
        {/* Ambient Glows */}
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#aff0d2]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 w-80 h-80 bg-[#e8f7f0]/60 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            {/* Association Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#0d533d]/15 backdrop-blur-md shadow-xs mb-4">
              <Sparkles className="w-4 h-4 text-[#003a29]" />
              <span className="text-xs sm:text-sm text-[#003a29] font-bold">
                جمعية المعالي للعلوم والتربية • الفوج البلدي تامست
              </span>
            </div>

            {/* Main Title */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#003a29] tracking-tight leading-tight">
                مشروع شباب القيم تامست
              </h1>
            </div>

            {/* Slogan */}
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#0d533d] mb-4">
              صياغة جيل رائد بأخلاق رفيعة وقيم راسخة
            </p>

            {/* Project Summary */}
            <p className="text-base sm:text-lg text-[#404944] max-w-3xl leading-relaxed mb-6">
              مشروع تربوي قيادي هادف تحت إشراف جمعية المعالي للعلوم والتربية - الفوج البلدي تامست، يُعنى بتنمية مهارات وقيم أبناء وبنات المنطقة عبر برامج تربوية متكاملة، لقاءات إيمانية ملهمة، وأنشطة ميدانية هادفة تصنع الأثر الإيجابي المستدام.
            </p>

            {/* Strict Privacy Callout */}
            <div className="w-full max-w-2xl bg-white/90 border border-[#0d533d]/20 backdrop-blur-md rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 text-right">
              <div className="w-11 h-11 rounded-xl bg-[#0d533d]/10 flex items-center justify-center text-[#003a29] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-bold text-[#003a29]">
                  التزام صارم بالخصوصية وحماية البيانات
                </span>
                <span className="text-xs text-[#404944]">
                  كافة بيانات التسجيلات وأسماء الأفواج والمنخرطين محفوظة بسرية تامة وتخضع لصلاحيات مشددة وإشراف تربوي معتمد.
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Central Registration Hub (Bento Dual Cards) */}
      <section className="relative -mt-6 md:-mt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Card 1: Students & Families */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#0d533d]/15 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-l from-[#003a29] to-[#0d533d]" />
              
              <div className="flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0d533d]/10 text-[#003a29] flex items-center justify-center shadow-inner">
                    <UserCheck className="w-9 h-9" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#0d533d] text-white text-xs font-bold">
                    متاح الآن لجميع الفئات
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003a29] mb-1">
                  تسجيلات شباب القيم
                </h2>
                <p className="text-sm sm:text-base font-bold text-[#0d533d] mb-3">
                  مخصصة لأبناء وبنات المشروع وأولياء الأمور
                </p>
                <p className="text-sm sm:text-base text-[#404944] leading-relaxed mb-6">
                  فتح باب التسجيل للموسم التربوي الجديد للأبناء والفتيات ضمن أفواج القيم والأنشطة الريادية لصقل المواهب وبناء السلوك القويم.
                </p>

                {/* Subscription Notice Inside Card */}
                <div className="bg-[#e8f7f0] border border-[#0d533d]/15 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-7 h-7 text-[#003a29] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base font-extrabold text-[#111e1a]">
                        مساهمة الاشتراك الرمزية: 500 دج
                      </span>
                      <span className="text-xs text-[#404944]">
                        تُسدد حضورياً خلال الحصة الأولى (حصة التعارف)
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003a29] shrink-0 bg-white/70 px-2.5 py-1 rounded-lg">
                    <Award className="w-4 h-4 text-[#003a29]" />
                    تسليم بطاقة الانخراط الرسمية
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('registration')}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#003a29] text-white font-bold text-base shadow-lg hover:bg-[#0d533d] transition-all text-center cursor-pointer active:scale-[0.99]"
                >
                  <span>افتح استمارة التسجيل الآن</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Card 2: Municipal Supervisors */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#ddece5]/90 to-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-[#0d533d]/20 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-l from-[#003a29] to-[#0d533d]" />
              
              <div className="flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0d533d]/10 text-[#003a29] flex items-center justify-center shadow-inner">
                    <ShieldCheck className="w-9 h-9" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#eefdf6] text-[#003a29] border border-[#0d533d]/20 text-xs font-bold">
                    بوابة القيادة والاعتماد
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003a29] mb-1">
                  خاص بالمشرفين البلديين
                </h2>
                <p className="text-sm sm:text-base font-bold text-[#0d533d] mb-3">
                  بوابة الإشراف والمتابعة التربوية
                </p>
                <p className="text-sm sm:text-base text-[#404944] leading-relaxed mb-6">
                  تسجيل دخول المشرفين المعتمدين أو تقديم طلب اعتماد مشرف تربوي / إداري جديد لمتابعة الأفواج والتقارير الدورية للمشروع.
                </p>

                {/* Strict Security Callout */}
                <div className="bg-white/80 border border-[#ba1a1a]/20 rounded-2xl p-4 flex items-start gap-3 mb-6">
                  <Lock className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[#404944] leading-relaxed">
                    <strong className="text-[#003a29] font-bold">تنويه أمني:</strong> لا يتم تفعيل أي صلاحيات متابعة أو إدارة إلا بعد التدقيق والموافقة المباشرة من المالك وصاحب الصلاحية الكاملة.
                  </p>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('supervisors')}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white text-[#003a29] font-bold text-base shadow-md border border-[#0d533d]/20 hover:bg-[#003a29] hover:text-white transition-all text-center cursor-pointer active:scale-[0.99]"
                >
                  <Lock className="w-4 h-4" />
                  <span>دخول المشرفين / طلب اعتماد</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
