import React from 'react';
import { CreditCard, ShieldCheck, Award, Handshake } from 'lucide-react';

export const SubscriptionNotice: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0d533d] to-[#003a29] text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-60 h-60 rounded-full bg-white/5 pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col max-w-2xl text-right">
              <div className="inline-flex items-center gap-2 text-[#aff0d2] mb-2">
                <CreditCard className="w-5 h-5 text-[#aff0d2]" />
                <span className="text-sm sm:text-base font-bold">
                  تفاصيل اشتراك الموسم التربوي
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">
                مساهمة رمزية قدرها 500 دينار جزائري فقط
              </h3>

              <p className="text-sm sm:text-base text-[#aff0d2] leading-relaxed">
                يُدفع رسم الانخراط حضورياً وبشكل مباشر في الحصة التربوية الأولى (حصة التعارف والافتتاح). لا يتم الدفع عبر أي وسيلة إلكترونية لضمان التواصل المباشر مع أولياء الأمور وتسليم بطاقة الانخراط الرسمية الصادرة عن الفوج البلدي تامست في اليوم ذاته.
              </p>
            </div>

            {/* Feature Breakdown Chips */}
            <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <Award className="w-8 h-8 text-[#aff0d2] shrink-0" />
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-white">بطاقة انخراط رسمية</span>
                  <span className="text-xs text-[#aff0d2]">معتمدة من الفوج وجمعية المعالي</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <Handshake className="w-8 h-8 text-[#aff0d2] shrink-0" />
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-white">تسليم وتأكيد حضوري</span>
                  <span className="text-xs text-[#aff0d2]">في الجلسة الأولى مع الطاقم التربوي</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
