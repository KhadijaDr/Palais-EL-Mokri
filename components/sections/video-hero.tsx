'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';

export function VideoHero() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          poster="/optimized/palais.webp"
        >
          <source src="/palais-el-mokri.mp4" type="video/mp4" />
          {/* Fallback image */}
          <img src="/optimized/palais.webp" alt="Palais El Mokri" className="h-full w-full object-cover" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-6 left-6 z-20 flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div
            className={`transition-all duration-1000 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
          >
            <h1
              className="font-display text-5xl font-bold text-white sm:text-6xl lg:text-7xl text-balance drop-shadow-lg"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
            >
              {t('home.hero.title')}
              <span
                className="block text-secondary mt-2 drop-shadow-lg"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
              >
                {t('home.hero.subtitle')}
              </span>
            </h1>

            <p
              className="mt-8 text-xl leading-8 text-white max-w-2xl mx-auto text-pretty drop-shadow-md"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              {t('home.hero.description')}
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-4 text-lg font-medium shadow-lg"
                asChild
              >
                <Link href="/don">{t('home.hero.donate')}</Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg backdrop-blur-sm bg-black/20 shadow-lg"
                asChild
              >
                <Link href="/histoire">{t('home.hero.cta')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
