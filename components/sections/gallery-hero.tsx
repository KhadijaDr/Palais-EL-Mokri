'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Eye } from 'lucide-react';

export function GalleryHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/optimized/palais-el-mokri-f-s-morocco-architecture-tradition.webp"
          alt="Galerie Palais El Mokri"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div
            className={`transition-all duration-1000 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
          >
            <h1 className="font-display text-5xl font-bold text-white sm:text-6xl lg:text-7xl text-balance">
              Galerie &
              <span className="block text-secondary mt-2">
                Visite Virtuelle
              </span>
            </h1>

            <p className="mt-8 text-xl leading-8 text-white/90 max-w-3xl mx-auto text-pretty">
              Explorez chaque recoin du Palais El Mokri grâce à notre galerie
              immersive haute définition et notre expérience de visite virtuelle
              360°. Découvrez l'architecture, les jardins et les intérieurs
              d'exception.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-4 text-lg font-medium"
                onClick={() => {
                  document.getElementById('visite-virtuelle')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
              >
                <Eye className="mr-2 h-5 w-5" />
                Visite virtuelle 360°
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg backdrop-blur-sm bg-transparent"
                onClick={() => {
                  document.getElementById('galerie-photos')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
              >
                <Camera className="mr-2 h-5 w-5" />
                Explorer la galerie
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
