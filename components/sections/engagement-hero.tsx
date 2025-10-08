'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';

export function EngagementHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/moroccan-artisan-workshop-with-traditional-cr.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Heart className="h-8 w-8 text-secondary" />
          <span className="text-secondary font-display text-lg tracking-wider">
            NOTRE ENGAGEMENT
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight">
          Soutenir l'Artisanat
          <span className="block text-secondary">Traditionnel</span>
        </h1>

        <p className="text-lg md:text-xl mb-8 text-pretty max-w-2xl mx-auto leading-relaxed text-white/90">
          Chaque achat contribue à préserver les savoir-faire ancestraux et
          soutient directement les artisans et leurs familles.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/boutique">
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg backdrop-blur-sm bg-transparent"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour à la boutique
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
