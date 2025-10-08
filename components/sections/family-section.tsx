'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Users, Award, BookOpen } from 'lucide-react';

export function FamilySection() {
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

  const familyMembers = [
    {
      name: 'Ahmed El Mokri',
      title: 'Fondateur du Palais',
      period: '1820-1890',
      description:
        "Visionnaire et mécène, Ahmed El Mokri fut à l'origine de la construction du palais. Grand amateur d'art et de littérature, il fit appel aux meilleurs artisans de Fès pour créer ce chef-d'œuvre architectural.",
      icon: Crown,
    },
    {
      name: 'Mohammed El Mokri',
      title: 'Ministre et Diplomate',
      period: '1851-1957',
      description:
        "Fils d'Ahmed, Mohammed El Mokri fut une figure politique majeure du Maroc. Ministre sous plusieurs sultans, il contribua à la modernisation du pays tout en préservant les traditions ancestrales.",
      icon: Award,
    },
    {
      name: 'Fatima El Mokri',
      title: 'Mécène des Arts',
      period: '1880-1965',
      description:
        'Épouse de Mohammed, Fatima El Mokri fut une grande protectrice des arts et des lettres. Elle organisa de nombreux salons littéraires dans le palais, attirant les intellectuels de tout le Maghreb.',
      icon: BookOpen,
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2
            className={`font-display text-4xl font-bold text-foreground sm:text-5xl transition-all duration-800 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            La Famille El Mokri
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Découvrez les personnalités exceptionnelles qui ont façonné
            l'histoire du palais
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {familyMembers.map((member, index) => (
            <Card
              key={member.name}
              className={`group overflow-hidden hover:shadow-lg transition-all duration-500 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
              style={{ animationDelay: `${300 + index * 200}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-secondary/10 p-2 mr-3">
                    <member.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {member.period}
                    </p>
                  </div>
                </div>

                <h4 className="font-serif text-lg font-semibold text-secondary mb-3">
                  {member.title}
                </h4>

                <p className="text-muted-foreground leading-6 text-sm">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div
          className={`mt-16 text-center transition-all duration-800 delay-800 ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
        >
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 lg:p-12">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-secondary/10 p-4">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                Un héritage préservé
              </h3>
              <p className="text-muted-foreground leading-7 text-lg">
                Aujourd'hui, les descendants de la famille El Mokri continuent
                de veiller sur ce patrimoine exceptionnel. Leur engagement pour
                la préservation de l'architecture traditionnelle marocaine et la
                transmission des savoir-faire ancestraux fait du Palais El Mokri
                un témoignage vivant de l'art de vivre fassi.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
