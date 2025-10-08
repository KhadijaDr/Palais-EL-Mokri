'use client';

import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users } from 'lucide-react';

export function PalaceTourHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/optimized/moroccan-palace-guided-tour-with-traditional.webp')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <div className="flex items-center justify-center gap-2 mb-6">
          <MapPin className="h-8 w-8 text-secondary" />
          <span className="text-secondary font-display text-lg tracking-wider">
            VISITE GUIDÉE
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
          Découverte
          <span className="block text-secondary">du Palais</span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-pretty max-w-2xl mx-auto leading-relaxed text-white/90">
          Explorez les merveilles architecturales et l'histoire fascinante du
          Palais El Mokri
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-sans px-8 py-3 text-lg"
            onClick={() => {
              const tourOptionsSection = document.getElementById(
                'tour-options-section'
              );
              if (tourOptionsSection) {
                tourOptionsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Réserver une Visite
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary font-sans px-8 py-3 text-lg bg-transparent"
            onClick={() => {
              const tourOptionsSection = document.getElementById(
                'tour-options-section'
              );
              if (tourOptionsSection) {
                tourOptionsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Voir les Tarifs
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-white/80">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Durée: 1h30</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">Groupes de 2-15 personnes</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Guide Expert Inclus</span>
          </div>
        </div>
      </div>
    </section>
  );
}
