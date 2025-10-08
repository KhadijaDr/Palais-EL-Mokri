'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Building, TreePine, Sofa, Crown } from 'lucide-react';

export function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState('architecture');
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

  const categories = [
    {
      id: 'architecture',
      name: 'Architecture',
      icon: Building,
      count: 45,
      description: 'Découvrez les détails architecturaux exceptionnels',
    },
    {
      id: 'jardins',
      name: 'Jardins',
      icon: TreePine,
      count: 28,
      description: 'Explorez les jardins à la française et leurs bassins',
    },
    {
      id: 'interieurs',
      name: 'Intérieurs',
      icon: Sofa,
      count: 62,
      description: "Admirez les salons d'apparat et leurs décorations",
    },
    {
      id: 'collections',
      name: 'Collections',
      icon: Crown,
      count: 34,
      description: "Objets d'art et mobilier d'époque",
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2
            className={`font-display text-3xl font-bold text-foreground sm:text-4xl transition-all duration-800 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Catégories
          </h2>
          <p
            className={`mt-4 text-lg leading-8 text-muted-foreground transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Explorez le palais par thématiques
          </p>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-800 delay-400 ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
        >
          {categories.map((category, index) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              className={`h-auto p-6 flex flex-col items-center space-y-3 transition-all duration-300 group ${
                activeCategory === category.id
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                  : 'hover:border-secondary hover:bg-secondary/5 hover:text-secondary-foreground'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <category.icon className="h-8 w-8 transition-colors duration-300" />
              <div className="text-center">
                <div className="font-serif text-lg font-semibold transition-colors duration-300">
                  {category.name}
                </div>
                <div
                  className="text-sm mt-1 transition-opacity duration-300 group-hover:opacity-90"
                  style={{
                    opacity: activeCategory === category.id ? 0.9 : 0.8,
                  }}
                >
                  {category.count} photos
                </div>
                <div
                  className="text-xs mt-2 line-clamp-2 transition-opacity duration-300 group-hover:opacity-80"
                  style={{
                    opacity: activeCategory === category.id ? 0.8 : 0.7,
                  }}
                >
                  {category.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
