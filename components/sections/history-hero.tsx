'use client';

import { useState, useEffect } from 'react';

export function HistoryHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/optimized/palais-el-mokri-f-s-morocco-architecture.webp"
          alt="Palais El Mokri - Architecture historique"
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
              Histoire du
              <span className="block text-secondary mt-2">Palais El Mokri</span>
            </h1>

            <p className="mt-8 text-xl leading-8 text-white/90 max-w-3xl mx-auto text-pretty">
              Plongez dans l'histoire fascinante de ce joyau architectural,
              témoin de l'évolution de Fès et du Maroc à travers les siècles. De
              sa construction au XIXe siècle à sa reconnaissance par l'UNESCO,
              découvrez un patrimoine d'exception.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
