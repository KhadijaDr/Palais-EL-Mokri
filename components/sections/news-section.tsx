'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function NewsSection() {
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

  const news = [
    {
      date: '15 Septembre 2024',
      title: 'Lancement de la campagne de restauration',
      excerpt:
        "Nous sommes fiers d'annoncer le lancement officiel de notre campagne de collecte de fonds pour la restauration du Palais El Mokri.",
      image: '/optimized/dar do.webp',
      category: 'Actualités',
    },
    {
      date: '10 Septembre 2024',
      title: "Nouvelle exposition : L'art de vivre au XIXe siècle",
      excerpt:
        "Découvrez comment vivait l'aristocratie marocaine au XIXe siècle à travers une exposition exceptionnelle d'objets d'époque.",
      image: '/optimized/palais-el-mokri-f-s-morocco-architecture-tradition.webp',
      category: 'Exposition',
    },
    {
      date: '5 Septembre 2024',
      title: "Partenariat avec l'UNESCO",
      excerpt:
        "Le Palais El Mokri renforce sa collaboration avec l'UNESCO pour la préservation du patrimoine culturel de Fès.",
      image: '/optimized/ornate-moroccan-palace-ceiling-with-traditional-ge.webp',
      category: 'Partenariat',
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
            Actualités
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Suivez les dernières nouvelles du Palais El Mokri et de nos projets
            de préservation
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          {news.map((article, index) => (
            <Card
              key={article.title}
              className={`group overflow-hidden hover:shadow-lg transition-all duration-500 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
              style={{ animationDelay: `${300 + index * 150}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={article.image || '/placeholder.svg'}
                  alt={article.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary">
                    {article.category}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    {article.date}
                  </div>
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-6 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <Button
                  variant="ghost"
                  className="p-0 h-auto font-medium text-secondary hover:text-secondary/80"
                >
                  Lire la suite
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div
          className={`text-center mt-12 transition-all duration-800 delay-800 ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
        >
          <Button variant="outline" size="lg" asChild>
            <Link href="/actualites">Voir toutes les actualités</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
