'use client';

import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ExperienceSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-primary text-primary-foreground text-center">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Gallery Label */}
        <Link href="/galerie">
          <Button
            variant="outline"
            size="sm"
            className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-sans bg-transparent mb-8"
          >
            {t('experience.label')}
          </Button>
        </Link>

        {/* Main Content */}
        <h2 className="font-sans text-lg mb-4 opacity-90">
          {t('experience.subtitle')}
        </h2>

        <h3 className="font-serif text-4xl md:text-5xl font-bold mb-12 leading-tight">
          {t('experience.title')}
        </h3>

        {/* CTA Button */}
        <Button
          size="lg"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-semibold px-12 py-4 text-lg tracking-wide"
          onClick={() => {
            // Rediriger vers la page d'hébergement avec la section de réservation
            window.location.href = '/visite/hebergement#booking-section';
          }}
        >
          {t('experience.cta')}
        </Button>
      </div>
    </section>
  );
}

export default ExperienceSection;
