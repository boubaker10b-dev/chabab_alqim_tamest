import React from 'react';
import { LOGO_PROJECT, LOGO_ASSOCIATION, SOCIAL_FACEBOOK, SOCIAL_INSTAGRAM } from '../constants';
import { ShieldCheck, CreditCard, ExternalLink, Heart, BadgeCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#e8f7f0] text-[#111e1a] pt-16 pb-8 border-t border-[#0d533d]/15 text-right">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
          
          {/* Col 1: About & Logos */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 mb-1">
              {/* الصورتان واضحتان وبدون إطار بخلفية شفافة */}
              <img 
                src={LOGO_PROJECT} 
                alt="شعار شباب القيم تامست" 
                referrerPolicy="no-referrer"
                style={{ backgroundColor: '#000000' }}
                className="h-12 sm:h-14 w-auto max-w-[56px] object-contain drop-shadow-xs rounded-full" 
              />
              <img 
                src={LOGO_ASSOCIATION} 
                alt="شعار جمعية المعالي للعلوم والتربية" 
                referrerPolicy="no-referrer"
                className="h-12 sm:h-14 w-auto max-w-[56px] object-contain drop-shadow-xs" 
              />

              <div className="flex flex-col">
                <span className="font-extrabold text-base text-[#003a29]">شباب القيم تامست</span>
                <span className="text-xs text-[#404944]">الفوج البلدي تامست</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#404944] leading-relaxed">
              مشروع تربوي قيمي رائد يهدف إلى صقل مواهب الناشئة والشباب، وترسيخ الأخلاق الفاضلة والانتماء المجتمعي تحت مظلة جمعية المعالي للعلوم والتربية.
            </p>
          </div>

          {/* Col 2: Subscription & Location */}
          <div className="flex flex-col gap-3">
            <h3 className="font-extrabold text-base text-[#003a29]">معلومات الاشتراك والمقر</h3>
            <div className="bg-white p-4 rounded-2xl border border-[#0d533d]/15 flex flex-col gap-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-[#003a29] font-extrabold text-sm">
                <CreditCard className="w-4 h-4 text-[#003a29]" />
                <span>مساهمة الاشتراك: 500 دج</span>
              </div>
              <p className="text-xs text-[#404944] leading-relaxed">
                تُسدد المساهمة حضورياً خلال حصة التعارف الافتتاحية وتشمل برامج الأنشطة الدورية والمتابعة التربوية.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#003a29] text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>إشراف تربوي موثوق ومسجل قانونياً</span>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-extrabold text-base text-[#003a29]">روابط الوصول السريع</h3>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#404944]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#003a29] transition-colors cursor-pointer text-right"
                >
                  الرئيسية والتعريف بالمشروع
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('registration')}
                  className="hover:text-[#003a29] transition-colors cursor-pointer text-right"
                >
                  استمارة تسجيل المنخرطين الجدد
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#003a29] transition-colors cursor-pointer text-right"
                >
                  ألبوم ومعرض النشاطات والمخيمات
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('leadership')}
                  className="hover:text-[#003a29] transition-colors cursor-pointer text-right"
                >
                  إشراف الفوج والقيادة التربوية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('supervisors')}
                  className="hover:text-[#003a29] transition-colors cursor-pointer text-right font-bold text-[#003a29]"
                >
                  فضاء القادة والمشرفين التربويين
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Social Channels */}
          <div className="flex flex-col gap-3">
            <h3 className="font-extrabold text-base text-[#003a29]">منصات التواصل الرسمية</h3>
            <p className="text-xs text-[#404944]">
              تابعوا فعاليات الفوج وأخبار الأنشطة والمخيمات الأسبوعية عبر قنواتنا المعتمدة:
            </p>
            
            <div className="flex flex-col gap-2">
              <a
                href={SOCIAL_FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between p-3 rounded-xl bg-white border border-[#0d533d]/15 hover:bg-[#003a29] hover:text-white text-[#003a29] transition-all text-xs font-bold shadow-xs group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">صفحة فيسبوك الرسمية</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </a>

              <a
                href={SOCIAL_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between p-3 rounded-xl bg-white border border-[#0d533d]/15 hover:bg-[#003a29] hover:text-white text-[#003a29] transition-all text-xs font-bold shadow-xs group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">حساب إنستغرام الرسمي</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Security note */}
        <div className="pt-8 border-t border-[#0d533d]/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#404944]">
          <p>
            © 2026 / 2027 فوج شباب القيم تامست - جمعية المعالي للعلوم والتربية. جميع الحقوق محفوظة.
          </p>

          <div className="flex items-center gap-2 text-[#003a29] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#003a29]" />
            <span>بيانات التسجيل محمية وتخضع للسرية التربوية المطلقة</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
