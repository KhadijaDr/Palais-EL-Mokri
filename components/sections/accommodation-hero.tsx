'use client';

import { Button } from '@/components/ui/button';
import { Bed, Wifi, Car } from 'lucide-react';

export function AccommodationHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/optimized/moroccan-palace-luxury-bedroom-with-traditio.webp')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Bed className="h-8 w-8 text-secondary" />
          <span className="text-secondary font-display text-lg tracking-wider">
            HÉBERGEMENT
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
          Séjour
          <span className="block text-secondary">Authentique</span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-pretty max-w-2xl mx-auto leading-relaxed text-white/90">
          Vivez une expérience unique dans les chambres d'hôtes du Palais El
          Mokri
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-sans px-8 py-3 text-lg"
            onClick={() => {
              const bookingSection = document.getElementById('booking-section');
              if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Réserver Maintenant
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary font-sans px-8 py-3 text-lg bg-transparent"
            onClick={() => {
              const roomTypesSection =
                document.getElementById('room-types-section');
              if (roomTypesSection) {
                roomTypesSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Voir les Chambres
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-white/80">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <span className="text-sm">WiFi Gratuit</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span className="text-sm">Parking Privé</span>
          </div>
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            <span className="text-sm">Petit-déjeuner Inclus</span>
          </div>
        </div>
      </div>
    </section>
  );
}
