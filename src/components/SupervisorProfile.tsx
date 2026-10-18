import React from 'react';
import { SUPERVISOR_DJABALLAH_IMG } from '../constants';
import { Award, HeartHandshake, Users, Sparkles } from 'lucide-react';

export const SupervisorProfile: React.FC = () => {
  return (
    <section className="py-16 bg-[#e8f7f0]/70 border-y border-[#0d533d]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#0d533d]/15 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Image Portrait Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-[#ddece5] border-4 border-white">
                <img
                  src={SUPERVISOR_DJABALLAH_IMG}
                  alt="صورة المشرف العام للفوج الأستاذ جاب الله رشيد"
                  className="w-full h-[380px] sm:h-[420px] object-cover object-top hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003a29]/90 via-transparent to-transparent flex items-end p-5">
                  <div className="text-right text-white">
                    <span className="text-xs uppercase tracking-wider text-[#aff0d2] block font-bold mb-0.5">
                      الإشراف والقيادة التربوية
                    </span>
                    <span className="text-xl sm:text-2xl font-black">
                      الأستاذ جاب الله رشيد
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supervisor Statement & Official Roles */}
            <div className="lg:col-span-7 flex flex-col justify-center text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0d533d]/10 text-[#003a29] self-start mb-3 border border-[#0d533d]/20">
                <Award className="w-4 h-4 text-[#003a29]" />
                <span className="text-xs sm:text-sm font-bold">
                  المشرف العام للفوج: جاب الله رشيد
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#003a29] mb-4 leading-snug">
                «القيمُ أمانة، وصناعة القادة تبدأ بغرس الأثر»
              </h2>

              <div className="space-y-3.5 text-[#404944] text-sm sm:text-base leading-relaxed mb-6">
                <p>
                  أهلاً بكم في رحاب مشروع «شباب القيم تامست». إن رسالتنا التي انطلقنا منها تحت مظلة جمعية المعالي للعلوم والتربية ترتكز على بناء شخصية شبابية متكاملة تتسلح بالعلم، وتتحلى بالقيم الأخلاقية، وتثق بقدرتها على خدمة مجتمعها ووطنها.
                </p>
                <p>
                  نعمل من خلال طواقمنا التربوية المخلصة على توفير فضاء تربوي آمن ومحفز يجمع بين النشاط الترفيهي الهادف واللقاء القيمي الرصين، حتى يكون كل شاب وكل فتاة بذرة خير وعطاء أينما حلوا وارتحلوا.
                </p>
              </div>

              {/* Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#eefdf6] border border-[#0d533d]/15 flex items-center gap-2.5 text-[#003a29]">
                  <Sparkles className="w-5 h-5 text-[#0d533d] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold">غرس المبادئ والأخلاق</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#eefdf6] border border-[#0d533d]/15 flex items-center gap-2.5 text-[#003a29]">
                  <Users className="w-5 h-5 text-[#003a29] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold">العمل الجماعي وروح الفوج</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#eefdf6] border border-[#0d533d]/15 flex items-center gap-2.5 text-[#003a29]">
                  <HeartHandshake className="w-5 h-5 text-[#0d533d] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold">الريادة والخدمة المجتمعية</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
