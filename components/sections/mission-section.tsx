'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, BookOpen, Users, Lightbulb } from 'lucide-react';

export function MissionSection() {
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

  const missions = [
    {
      icon: Shield,
      title: 'Préservation',
      description:
        'Sauvegarder le patrimoine architectural et artistique de Fès en menant des projets de restauration respectueux des techniques traditionnelles.',
    },
    {
      icon: BookOpen,
      title: 'Transmission',
      description:
        "Transmettre les savoir-faire ancestraux aux nouvelles générations d'artisans et sensibiliser le public à l'importance du patrimoine.",
    },
    {
      icon: Users,
      title: 'Valorisation',
      description:
        "Mettre en valeur le patrimoine culturel par des événements, expositions et résidences d'artistes qui créent un dialogue entre tradition et modernité.",
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description:
        'Développer des approches innovantes pour la conservation du patrimoine en alliant techniques traditionnelles et technologies modernes.',
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
            Notre mission
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            L'Association Tourat Mdinty s'engage pour la préservation du
            patrimoine culturel de Fès
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {missions.map((mission, index) => (
            <Card
              key={mission.title}
              className={`group hover:shadow-lg transition-all duration-500 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
              style={{ animationDelay: `${400 + index * 150}ms` }}
            >
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-secondary/10 p-3 flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <mission.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                      {mission.title}
                    </h3>
                    <p className="text-muted-foreground leading-7">
                      {mission.description}
                    </p>
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
