import React, { useState } from 'react';
import { LOGO_PROJECT, LOGO_ASSOCIATION } from '../constants';
import { AuthUser } from '../types';
import { Shield, User, LogOut, Menu, X, CheckCircle2, BadgeCheck, Image as ImageIcon } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'registration', label: 'استمارة التسجيل' },
    { id: 'gallery', label: 'النشاطات والخرجات واللقاءات' },
    { id: 'leadership', label: 'إشراف المشروع' },
    { id: 'supervisors', label: 'بوابة المشرفين والإدارة' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-[#eefdf6]/90 backdrop-blur-xl border-b border-[#0d533d]/10 shadow-[0_1px_12px_rgba(13,83,61,0.06)]">
      <div className="h-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Zone */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer shrink-0 group select-none"
        >
          <div className="flex items-center gap-2">
            {/* شعار شباب القيم تامست - بدون خلفية وبدقة عالية */}
            <img
              src={LOGO_PROJECT}
              alt="شعار شباب القيم تامست"
              referrerPolicy="no-referrer"
              className="h-12 md:h-14 w-auto max-w-[56px] object-contain group-hover:scale-105 transition-transform drop-shadow-xs"
            />

            {/* شعار جمعية المعالي للعلوم والتربية - بدون خلفية وبدقة عالية */}
            <img
              src={LOGO_ASSOCIATION}
              alt="شعار جمعية المعالي للعلوم والتربية"
              referrerPolicy="no-referrer"
              className="h-12 md:h-14 w-auto max-w-[56px] object-contain group-hover:scale-105 transition-transform drop-shadow-xs"
            />
          </div>
          <div className="flex flex-col text-right">
            <span className="font-extrabold text-lg md:text-xl text-[#003a29] leading-tight group-hover:text-[#0d533d] transition-colors">
              شباب القيم تامست
            </span>
            <span className="text-xs text-[#404944] font-medium hidden sm:inline-block">
              جمعية المعالي للعلوم والتربية • الفوج البلدي تامست
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0d533d] text-white shadow-sm'
                    : 'text-[#404944] hover:text-[#003a29] hover:bg-[#e2f1eb]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                  activeTab === 'admin'
                    ? 'bg-[#003a29] text-white ring-2 ring-[#0d533d]'
                    : 'bg-[#e2f1eb] text-[#003a29] hover:bg-[#003a29] hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4 text-[#aff0d2]" />
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {currentUser.isOwner ? 'لوحة القيادة المركزية' : 'لوحة المشرف'}
                </span>
              </button>
              <button
                onClick={onLogout}
                title="تسجيل الخروج"
                className="p-2 rounded-xl text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('registration')}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-[#003a29] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#0d533d] shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                تسجيل الأبناء والفتيات
              </button>
              <button
                onClick={() => handleNavClick('supervisors')}
                className="inline-flex items-center justify-center px-4 py-2 bg-white text-[#003a29] border border-[#0d533d]/25 font-bold text-xs sm:text-sm rounded-xl hover:bg-[#eefdf6] shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                دخول الإدارة
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#003a29] hover:bg-[#e2f1eb] transition-colors"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-[#0d533d]/10 px-4 pt-2 pb-6 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-right px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  isActive
                    ? 'bg-[#0d533d] text-white'
                    : 'text-[#404944] hover:bg-[#e2f1eb]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('gallery')}
              className="w-full py-3 bg-[#eefdf6] text-[#003a29] border border-[#0d533d]/20 font-bold text-sm rounded-xl text-center flex items-center justify-center gap-2"
            >
              <ImageIcon className="w-4 h-4 text-[#003a29]" />
              <span>معرض النشاطات والخرجات واللقاءات</span>
            </button>
            <button
              onClick={() => handleNavClick('registration')}
              className="w-full py-3 bg-[#003a29] text-white font-bold text-sm rounded-xl text-center"
            >
              استمارة تسجيل الأبناء والفتيات
            </button>
            <button
              onClick={() => handleNavClick('supervisors')}
              className="w-full py-3 bg-[#003a29] text-white font-bold text-sm rounded-xl text-center"
            >
              بوابة المشرفين البلديين
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
