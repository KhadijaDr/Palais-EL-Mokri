'use client';

import { useLanguage } from '@/contexts/language-context';
import { useState, useRef, useEffect } from 'react';

export function OriginalHero() {
  const { t } = useLanguage();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Preload video immediately for better performance
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <section className="relative h-[100vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        {/* Video that loads immediately */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          poster="/optimized/palais.webp"
          onLoadedData={handleVideoLoad}
          preload="auto"
        >
          <source src="/palais-el-mokri.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content - positioned to account for header */}
      <div className="absolute inset-0 flex items-center justify-center pt-20 pb-20">
        <div className="text-center text-white max-w-4xl px-6">
          <h1 className="font-display text-6xl md:text-8xl font-bold mb-4 tracking-wider text-shadow-lg">
            PALAIS EL MOKRI
          </h1>
          <p className="font-sans text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed text-shadow">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
}
