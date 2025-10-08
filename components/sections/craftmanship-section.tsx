'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Users, Clock, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CraftmanshipSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
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

  const craftsmen = [
    {
      name: 'Maître Hassan El Fassi',
      specialty: 'Céramique & Zellige',
      experience: "35 ans d'expérience",
      location: 'Médina de Fès',
      image: '/optimized/moroccan-ceramic-artisan-master-craftsman.webp',
      description:
        "Héritier d'une tradition familiale de cinq générations, spécialisé dans les techniques ancestrales.",
    },
    {
      name: 'Lalla Fatima Chraibi',
      specialty: 'Broderie & Textiles',
      experience: "28 ans d'expérience",
      location: 'Coopérative de Fès',
      image: '/optimized/moroccan-textile-artisan-woman-embroidery.webp',
      description:
        'Maîtresse brodeuse reconnue pour ses créations uniques alliant tradition et modernité.',
    },
    {
      name: 'Maître Youssef Bennani',
      specialty: 'Dinanderie',
      experience: "42 ans d'expérience",
      location: 'Souk des Dinandiers',
      image: '/optimized/moroccan-metalwork-artisan-copper-brass.webp',
      description:
        "Expert en travail du cuivre et du laiton, créateur de pièces d'exception pour palais et riads.",
    },
  ];

  const stats = [
    { icon: Award, value: '50+', label: 'Artisans partenaires' },
    { icon: Users, value: '15', label: 'Générations de savoir-faire' },
    { icon: Clock, value: '100%', label: 'Fait main' },
    { icon: MapPin, value: 'Fès', label: 'Origine authentique' },
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
            Nos Maîtres Artisans
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Rencontrez les gardiens des traditions artisanales de Fès
          </p>
        </div>

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

        {/* Craftsmen */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {craftsmen.map((craftsman, index) => (
            <Card
              key={craftsman.name}
              className={`group text-center hover:shadow-lg transition-all duration-500 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
              style={{ animationDelay: `${600 + index * 200}ms` }}
            >
              <CardContent className="p-6">
                <div className="aspect-square overflow-hidden rounded-full mx-auto mb-6 w-32 h-32">
                  <img
                    src={craftsman.image || '/placeholder.svg'}
                    alt={craftsman.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {craftsman.name}
                </h3>
                <p className="text-secondary font-medium mb-1">
                  {craftsman.specialty}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {craftsman.experience}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {craftsman.location}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-6 mb-6">
                  {craftsman.description}
                </p>
                <Button variant="outline" size="sm">
                  Voir ses créations
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div
            className={`transition-all duration-800 delay-1000 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
              {t('common.supportTraditionalCrafts')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('common.supportCraftsDescription')}
            </p>
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90"
              onClick={() => router.push('/boutique/engagement')}
            >
              {t('common.discoverOurCommitment')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CraftmanshipSection;
