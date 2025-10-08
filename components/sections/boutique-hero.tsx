'use client';

import { Button } from '@/components/ui/button';
import { ShoppingBag, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function BoutiqueHero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
          <ShoppingBag className="h-8 w-8 text-secondary" />
          <span className="text-secondary font-display text-lg tracking-wider">
            {t('boutique.section')}
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
          {t('boutique.title')}
          <span className="block text-secondary">{t('boutique.subtitle')}</span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-pretty max-w-2xl mx-auto leading-relaxed text-white/90">
          {t('boutique.description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-sans px-8 py-3 text-lg"
            onClick={() => {
              document.getElementById('collections')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
          >
            {t('boutique.cta')}
          </Button>
          <div className="flex items-center gap-2 text-white/80">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-secondary text-secondary"
                />
              ))}
            </div>
            <span className="text-sm">Artisanat certifié authentique</span>
          </div>
        </div>
      </div>
    </section>
  );
}
