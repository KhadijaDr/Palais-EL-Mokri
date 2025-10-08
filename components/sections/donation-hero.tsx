'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Users, Target } from 'lucide-react';

export function DonationHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/optimized/palais-el-mokri-f-s-morocco-architecture.webp"
          alt="Soutenir la rénovation du Palais El Mokri"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div
            className={`transition-all duration-1000 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
          >
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-secondary/20 p-4 backdrop-blur-sm">
                <Heart className="h-12 w-12 text-secondary" />
              </div>
            </div>

            <h1 className="font-display text-5xl font-bold text-white sm:text-6xl lg:text-7xl text-balance">
              Sauvons ensemble le
              <span className="block text-secondary mt-2">Palais El Mokri</span>
            </h1>

            <p className="mt-8 text-xl leading-8 text-white/90 max-w-3xl mx-auto text-pretty">
              Votre soutien est essentiel pour préserver ce joyau architectural
              de Fès. Chaque don, petit ou grand, contribue à sauvegarder ce
              patrimoine exceptionnel pour les générations futures.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-4 text-lg font-medium"
              >
                <Heart className="mr-2 h-5 w-5" />
                Faire un don maintenant
              </Button>

              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="text-sm">1,247 donateurs</span>
                </div>
                <div className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  <span className="text-sm">68% de l'objectif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
