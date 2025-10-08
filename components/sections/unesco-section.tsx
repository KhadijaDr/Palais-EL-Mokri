'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Shield, Award, ExternalLink } from 'lucide-react';

export function UnescoSection() {
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

  const unescoFeatures = [
    {
      icon: Globe,
      title: 'Patrimoine Mondial',
      description:
        "Inscrit au patrimoine mondial de l'UNESCO depuis 1981, le Palais El Mokri fait partie intégrante de la médina de Fès.",
    },
    {
      icon: Shield,
      title: 'Protection Internationale',
      description:
        "Bénéficie d'une protection juridique internationale garantissant sa préservation pour les générations futures.",
    },
    {
      icon: Award,
      title: 'Valeur Universelle',
      description:
        "Reconnu pour sa valeur universelle exceptionnelle en tant que témoignage de l'art architectural islamique.",
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div
            className={`transition-all duration-800 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
          >
            <div className="flex items-center mb-6">
              <Image
                src="/optimized/unesco.webp"
                alt="UNESCO Logo"
                width={48}
                height={48}
                className="mr-4"
              />
              <h2 className="font-display text-4xl font-bold text-foreground">
                Patrimoine UNESCO
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-8 mb-8 text-pretty">
              Depuis 1981, la médina de Fès, incluant le Palais El Mokri, est
              inscrite sur la liste du patrimoine mondial de l'UNESCO. Cette
              reconnaissance internationale souligne l'importance exceptionnelle
              de ce témoignage de l'urbanisme et de l'architecture islamiques.
            </p>

            <div className="space-y-6 mb-8">
              {unescoFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`flex items-start space-x-4 transition-all duration-800 ${
                    isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="rounded-full bg-secondary/10 p-2 flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-6">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="group bg-transparent">
              En savoir plus sur UNESCO
              <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Image */}
          <div
            className={`transition-all duration-800 delay-400 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}
          >
            <Card className="overflow-hidden">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/optimized/ornate-moroccan-palace-ceiling-with-traditional-ge.webp"
                  alt="Palais El Mokri - Patrimoine UNESCO"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-lg font-semibold text-foreground">
                      Médina de Fès
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Patrimoine mondial UNESCO depuis 1981
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-bold text-secondary">
                      1981
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Inscription
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
