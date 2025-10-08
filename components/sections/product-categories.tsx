'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Gem, Home, Shirt, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProductCategories() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

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
      icon: Palette,
      title: 'Céramiques & Zellige',
      description: 'Carreaux traditionnels et poteries artisanales de Fès',
      image: '/optimized/moroccan-ceramics-and-zellige-tiles.webp',
      count: '24 produits',
      slug: 'ceramiques-zellige',
    },
    {
      icon: Gem,
      title: 'Bijoux Traditionnels',
      description: 'Bijoux berbères et arabes en argent et pierres précieuses',
      image: '/optimized/traditional-moroccan-jewelry-silver.webp',
      count: '18 produits',
      slug: 'bijoux-traditionnels',
    },
    {
      icon: Home,
      title: 'Décoration',
      description: 'Objets décoratifs, lanternes et mobilier traditionnel',
      image: '/optimized/moroccan-home-decoration-lanterns.webp',
      count: '36 produits',
      slug: 'decoration',
    },
    {
      icon: Shirt,
      title: 'Textiles',
      description: 'Tapis, coussins et tissus brodés à la main',
      image: '/optimized/moroccan-textiles-carpets-embroidery.webp',
      count: '15 produits',
      slug: 'textiles',
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
            Nos Collections
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Explorez nos différentes catégories d'artisanat traditionnel
            marocain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Card
              key={category.title}
              className={`group overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
              style={{ animationDelay: `${400 + index * 150}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={category.image || '/placeholder.svg'}
                  alt={category.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="rounded-full bg-secondary/10 p-2">
                    <category.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-6 mb-4">
                  {category.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group bg-transparent"
                  onClick={() => router.push(`/boutique/${category.slug}`)}
                >
                  Explorer
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductCategories;
