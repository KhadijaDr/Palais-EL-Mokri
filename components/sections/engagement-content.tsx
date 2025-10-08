'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, Clock, MapPin, Heart, Shield, Star } from 'lucide-react';

export function EngagementContent() {
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

  const commitments = [
    {
      icon: Heart,
      title: 'Soutien Direct aux Artisans',
      description:
        '80% du prix de vente revient directement aux artisans et à leurs familles, garantissant un revenu équitable.',
    },
    {
      icon: Shield,
      title: 'Authenticité Garantie',
      description:
        'Tous nos produits sont certifiés authentiques et créés selon les techniques traditionnelles transmises de génération en génération.',
    },
    {
      icon: Award,
      title: 'Préservation du Patrimoine',
      description:
        'Chaque achat contribue à maintenir vivantes les traditions artisanales menacées par la modernisation.',
    },
    {
      icon: Users,
      title: 'Formation et Transmission',
      description:
        'Nous soutenons la formation des jeunes artisans pour assurer la continuité des savoir-faire ancestraux.',
    },
  ];

  const stats = [
    { icon: Users, value: '50+', label: 'Artisans soutenus' },
    { icon: Award, value: '15', label: 'Générations de savoir-faire' },
    { icon: Heart, value: '80%', label: 'Revenus aux artisans' },
    { icon: Star, value: '100%', label: 'Produits authentiques' },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-800 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-4">
                <stat.icon className="h-6 w-6 text-secondary" />
              </div>
              <div className="font-display text-3xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Commitments */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2
            className={`font-display text-4xl font-bold text-foreground sm:text-5xl transition-all duration-800 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Nos Engagements
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Découvrez comment nous contribuons à la préservation de l'artisanat
            traditionnel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {commitments.map((commitment, index) => (
            <Card
              key={commitment.title}
              className={`group hover:shadow-lg transition-all duration-500 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
              style={{ animationDelay: `${600 + index * 200}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-secondary/10 p-3 flex-shrink-0">
                    <commitment.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                      {commitment.title}
                    </h3>
                    <p className="text-muted-foreground leading-6">
                      {commitment.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div
            className={`transition-all duration-800 delay-1000 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
              Rejoignez notre mission
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              En achetant nos produits artisanaux, vous participez activement à
              la préservation du patrimoine culturel marocain et au soutien des
              familles d'artisans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/boutique" className="inline-block">
                <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-sans px-8 py-3 text-lg rounded-md transition-colors">
                  Découvrir nos produits
                </button>
              </a>
              <a href="/don" className="inline-block">
                <button className="border border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-sans px-8 py-3 text-lg rounded-md transition-colors bg-transparent">
                  Faire un don
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
