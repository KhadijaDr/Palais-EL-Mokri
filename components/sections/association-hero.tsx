'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Heart } from 'lucide-react';

export function AssociationHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-[70vh] w-full overflow-hidden bg-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-800/70 to-slate-900/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div
            className={`transition-all duration-1000 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
          >
            <h1
              className="font-display text-5xl font-bold text-white sm:text-6xl lg:text-7xl text-balance"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
            >
              Association
              <span
                className="block text-secondary mt-2"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
              >
                Tourat Mdinty
              </span>
            </h1>

            <p
              className="mt-8 text-xl leading-8 text-white/95 max-w-3xl mx-auto text-pretty"
              style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
            >
              Depuis 2015, nous œuvrons pour la préservation et la valorisation
              du patrimoine culturel de Fès. Notre mission : transmettre aux
              générations futures la richesse de notre héritage architectural et
              artistique.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-4 text-lg font-medium"
                onClick={() => {
                  const membershipSection =
                    document.getElementById('membership-section');
                  if (membershipSection) {
                    membershipSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Users className="mr-2 h-5 w-5" />
                Devenir membre
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg backdrop-blur-sm bg-black/30"
                onClick={() => {
                  const projectsSection =
                    document.getElementById('projects-section');
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Heart className="mr-2 h-5 w-5" />
                Soutenir nos projets
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
