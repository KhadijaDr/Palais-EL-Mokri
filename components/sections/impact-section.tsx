'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Hammer, Palette, BookOpen, Users } from 'lucide-react';

export function ImpactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const impacts = [
    {
      icon: Hammer,
      title: 'Restauration structurelle',
      description:
        'Réparation des fondations, toitures et murs porteurs pour assurer la pérennité du bâtiment',
      amount: '25 €',
      result: '1m² de mur restauré',
    },
    {
      icon: Palette,
      title: 'Préservation artistique',
      description:
        'Restauration des zelliges, stucs et plafonds sculptés par des artisans traditionnels',
      amount: '50 €',
      result: '1m² de décoration restaurée',
    },
    {
      icon: BookOpen,
      title: 'Conservation documentaire',
      description:
        'Numérisation et préservation des archives historiques et manuscrits anciens',
      amount: '100 €',
      result: '50 documents numérisés',
    },
    {
      icon: Users,
      title: 'Formation artisanale',
      description:
        'Formation de jeunes artisans aux techniques traditionnelles de restauration',
      amount: '250 €',
      result: '1 mois de formation',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2
            className={`font-display text-4xl font-bold text-foreground sm:text-5xl transition-all duration-800 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            L'impact de votre don
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Découvrez comment votre contribution participe concrètement à la
            sauvegarde du patrimoine
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {impacts.map((impact, index) => (
            <Card
              key={impact.title}
              className={`group hover:shadow-lg transition-all duration-500 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
              style={{ animationDelay: `${400 + index * 150}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-secondary/10 p-3 flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <impact.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      {impact.title}
                    </h3>
                    <p className="text-muted-foreground leading-6 mb-4">
                      {impact.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="bg-secondary/10 px-3 py-1 rounded-full">
                        <span className="font-display text-lg font-bold text-secondary">
                          {impact.amount}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {impact.result}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Impact direct
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
