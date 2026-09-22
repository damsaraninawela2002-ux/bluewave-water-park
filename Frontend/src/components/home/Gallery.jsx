import React, { useState, useEffect } from 'react';
import { Camera, Maximize2, X, Sparkles } from 'lucide-react';
import Modal from '../Modal';

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const photos = [
    {
      id: 1,
      title: 'Twister Speed Funnel',
      category: 'SpeedBay',
      src: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1000&q=80',
      span: 'md:col-span-2 md:row-span-2',
    },
    {
      id: 2,
      title: 'Ocean Surf Swells',
      category: 'SplashBay',
      src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 3,
      title: 'Splash Kingdom Water Cannon',
      category: 'ChillBay',
      src: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 4,
      title: 'Tropical Sunset Cabanas',
      category: 'Relaxation',
      src: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80',
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 5,
      title: 'Kamikaze Drop Plunge',
      category: 'SpeedBay',
      src: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=800&q=80',
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 6,
      title: 'Lazy River Float',
      category: 'SplashBay',
      src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 7,
      title: 'Toddler Fountain Haven',
      category: 'ChillBay',
      src: 'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?auto=format&fit=crop&w=800&q=80',
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      id: 8,
      title: 'Blue Lightning Chute',
      category: 'SpeedBay',
      src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      span: 'md:col-span-2 md:row-span-1',
    },
  ];

  // Esc key listener for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    if (selectedPhoto) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-white dark:bg-navy-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-aqua-50 dark:bg-aqua-950/60 text-aqua-800 dark:text-aqua-300 border border-aqua-200/80 dark:border-aqua-800 text-xs font-semibold uppercase tracking-widest font-heading mb-3">
            <Camera className="w-3.5 h-3.5 text-aqua-600 dark:text-aqua-400" />
            <span>Splash Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ocean-950 dark:text-white font-heading tracking-tight">
            Moments at BlueWave
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
            Catch a glimpse of high-speed waterslide thrills, sun-drenched wave beaches, and pure family bliss.
          </p>
        </div>

        {/* Masonry-Style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[220px]">
          {photos.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPhoto(p)}
              className={`group relative overflow-hidden rounded-3xl bg-ocean-900 cursor-pointer shadow-soft hover:shadow-card-hover transition-all duration-300 ${p.span}`}
            >
              <img
                src={p.src}
                alt={p.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/80 via-transparent to-black/20 opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Hover Overlay Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className="flex justify-end">
                  <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-aqua-300 font-heading block">
                    {p.category}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white font-heading mt-0.5">
                    {p.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ocean-950/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors focus:outline-none"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Image */}
            <div className="relative max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-h-[75vh] w-full object-contain"
              />
            </div>

            {/* Caption Footer */}
            <div className="p-5 bg-white flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-aqua-600 font-heading">
                  {selectedPhoto.category}
                </span>
                <h3 className="text-lg font-extrabold text-ocean-950 font-heading">
                  {selectedPhoto.title}
                </h3>
              </div>
              <span className="text-xs text-slate-400">Press Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
