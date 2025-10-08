'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, Star } from 'lucide-react';

export function TestimonialsSection() {
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

  const testimonials = [
    {
      name: 'Dr. Amina Benali',
      title: "Historienne de l'art",
      location: 'Rabat, Maroc',
      message:
        "Le Palais El Mokri représente un témoignage exceptionnel de l'art de vivre marocain. Chaque don contribue à préserver cette mémoire collective pour les générations futures.",
      amount: '500 €',
      avatar: '/optimized/placeholder-user.webp',
    },
    {
      name: 'Jean-Pierre Dubois',
      title: 'Architecte du patrimoine',
      location: 'Paris, France',
      message:
        "J'ai eu la chance de visiter ce palais lors d'un voyage à Fès. La richesse architecturale m'a profondément marqué. Il est essentiel de soutenir sa restauration.",
      amount: '250 €',
      avatar: '/optimized/placeholder-user.webp',
    },
    {
      name: 'Fatima Zahra El Alami',
      title: 'Descendante de la famille El Mokri',
      location: 'Fès, Maroc',
      message:
        "Ce palais fait partie de notre histoire familiale et de celle du Maroc. Voir tant de personnes s'engager pour sa préservation nous touche énormément.",
      amount: '1000 €',
      avatar: '/optimized/placeholder-user.webp',
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
            Témoignages de nos donateurs
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Ils ont choisi de soutenir la préservation du Palais El Mokri
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className={`transition-all duration-800 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}
              style={{ animationDelay: `${400 + index * 200}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-secondary/30" />
                  <div className="flex ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-secondary fill-current"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-muted-foreground leading-6 mb-6 italic">
                  "{testimonial.message}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.avatar || '/optimized/placeholder-user.webp'}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-bold text-secondary">
                      {testimonial.amount}
                    </div>
                    <div className="text-xs text-muted-foreground">Don</div>
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
