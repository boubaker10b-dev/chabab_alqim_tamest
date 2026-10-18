import React, { useState } from 'react';
import { ActivityPhoto } from '../types';
import { Image as ImageIcon, CheckCircle, Eye, X, ArrowLeft, Sparkles } from 'lucide-react';

interface GallerySectionProps {
  photos: ActivityPhoto[];
  isHome?: boolean;
  onNavigate?: (tab: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  photos,
  isHome = false,
  onNavigate
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<ActivityPhoto | null>(null);

  const categories = [
    { id: 'all', label: 'جميع النشاطات' },
    { id: 'خرجة ميدانية', label: 'الخرجات الميدانية' },
    { id: 'لقاءات تربوية', label: 'اللقاءات الأسبوعية' },
    { id: 'مخيمات قرآنية', label: 'المخيمات القرآنية' },
    { id: 'تكريم وتميز', label: 'التكريم والتميز' },
    { id: 'فتيات القيم', label: 'فوج الفتيات' }
  ];

  // In home mode, show prominent photos (all or up to 6 featured photos)
  const displayedPhotos = isHome
    ? photos.slice(0, 6)
    : activeCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  return (
    <section className="py-16 bg-[#f7faf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-1.5 text-[#0d533d] font-bold text-sm mb-1">
              <ImageIcon className="w-4 h-4" />
              <span>{isHome ? 'أبرز اللحظات والأنشطة' : 'توثيق الأثر والأنشطة'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#003a29]">
              {isHome ? 'معرض النشاطات والخرجات واللقاءات' : 'معرض النشاطات والخرجات واللقاءات الميدانية'}
            </h2>
            <p className="text-sm sm:text-base text-[#404944] max-w-2xl mt-1">
              {isHome
                ? 'استعراض لأبرز الصور والخرجات واللقاءات التربوية الهادفة لمشروع شباب القيم تامست.'
                : 'لقطات موثقة من برامجنا المتنوعة التي تجمع بين المغامرة التربوية، اللقاءات الإيمانية، وتكريم النجاحات.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="px-4 py-2 rounded-full bg-white border border-[#0d533d]/15 text-[#003a29] text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs">
              <CheckCircle className="w-4 h-4 text-[#0d533d]" />
              <span>{isHome ? 'الصور البارزة المعتمدة' : 'صور أصلية موثقة ومعتمدة'}</span>
            </div>

            {isHome && onNavigate && (
              <button
                onClick={() => onNavigate('gallery')}
                className="px-4 py-2 rounded-full bg-[#003a29] hover:bg-[#0d533d] text-white text-xs sm:text-sm font-bold shrink-0 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>عرض المعرض الكامل</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar - Shown on full gallery page */}
        {!isHome && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#003a29] text-white shadow-sm'
                      : 'bg-white border border-[#0d533d]/15 text-[#404944] hover:bg-[#e2f1eb]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Prominent badge in Home Mode */}
        {isHome && (
          <div className="flex items-center justify-between pb-4 text-xs font-bold text-[#003a29]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#0d533d]" />
              <span>عرض مختارات من أبرز صور النشاطات والخرجات واللقاءات:</span>
            </span>
            <span className="text-[#404944]">{displayedPhotos.length} صورة بارزة</span>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="bg-white rounded-3xl overflow-hidden shadow-md border border-[#0d533d]/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 w-full bg-[#ddece5] overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#003a29]/90 text-white text-xs font-bold backdrop-blur-xs">
                  {photo.category}
                </div>
                <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              <div className="p-5 flex flex-col text-right">
                <h3 className="text-base sm:text-lg font-bold text-[#003a29] mb-1.5 line-clamp-1 group-hover:text-[#0d533d]">
                  {photo.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#404944] leading-relaxed line-clamp-2">
                  {photo.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Shortcut in Home Mode */}
        {isHome && onNavigate && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => onNavigate('gallery')}
              className="px-6 py-3.5 rounded-2xl bg-white border border-[#0d533d]/20 text-[#003a29] hover:bg-[#003a29] hover:text-white font-extrabold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>مشاهدة كافة ألبومات النشاطات والخرجات واللقاءات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col text-right"
          >
            <div className="relative max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#eefdf6] text-[#003a29] text-xs font-bold border border-[#0d533d]/20">
                  {selectedPhoto.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#003a29] mb-2">
                {selectedPhoto.title}
              </h3>
              <p className="text-sm text-[#404944] leading-relaxed">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
