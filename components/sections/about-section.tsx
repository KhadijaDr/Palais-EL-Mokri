'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Users, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: Calendar,
      value: 'XIXe siècle',
      label: 'Construction',
    },
    {
      icon: MapPin,
      value: 'Fès',
      label: 'Médina historique',
    },
    {
      icon: Award,
      value: 'UNESCO',
      label: 'Patrimoine mondial',
    },
    {
      icon: Users,
      value: '1000+',
      label: 'Visiteurs/mois',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className={`font-display text-4xl font-bold text-foreground sm:text-5xl transition-all duration-800 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            {t('home.about.title')}
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            {t('home.about.description')}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                className={`text-center transition-all duration-800 ${
                  isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
                }`}
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-secondary/10 p-3">
                      <stat.icon className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <div className="font-display text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div
            className={`transition-all duration-800 delay-500 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Architecture et artisanat
            </h3>
            <p className="text-muted-foreground leading-7 mb-4">
              Le palais se distingue par ses zelliges multicolores, ses plafonds
              en bois sculpté et ses jardins à la française. Chaque détail
              architectural raconte l'histoire d'un savoir-faire ancestral
              transmis de génération en génération.
            </p>
            <p className="text-muted-foreground leading-7 mb-6">
              Les salons d'apparat, ornés de stucs finement ciselés et de
              calligraphies arabes, offrent un voyage dans le temps au cœur de
              l'art de vivre marocain traditionnel.
            </p>
            <Button variant="outline" asChild>
              <Link href="/galerie">Découvrir la galerie</Link>
            </Button>
          </div>

          <div
            className={`transition-all duration-800 delay-700 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="aspect-[4/3] overflow-hidden rounded-lg relative">
              <Image
                src="/optimized/placeholder-user.webp"
                alt="Intérieur du Palais El Mokri"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
