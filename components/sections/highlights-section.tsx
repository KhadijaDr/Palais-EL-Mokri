'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Clock, Heart, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { toast } from 'sonner';
import { AuthModal } from '@/components/auth/auth-modal';
import { EstimationModal } from '@/components/estimation/estimation-modal';

export function HighlightsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEstimationModal, setShowEstimationModal] = useState(false);

  const handleEventOrganization = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setShowEstimationModal(true);
  };

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

  const highlights = [
    {
      icon: Camera,
      title: 'Architecture mauresque authentique',
      description:
        'Admirez les portes sculptées, les plâtres ciselés et les zelliges géométriques qui font la renommée de l’artisanat marocain dans ce palais historique.',
      image: '/optimized/moroccan-palace-interior-with-traditional-doors.webp',
      link: '/galerie',
      linkText: 'Visiter la galerie',
    },
    {
      icon: Clock,
      title: 'Histoire & Patrimoine',
      description:
        'Découvrez plus d’un siècle d’histoire à travers les salons, patios et décors artisanaux qui ont vu passer les grandes figures de la société marocaine.',
      image: '/optimized/ornate-moroccan-palace-ceiling-with-traditional-ge.webp',
      link: '/histoire',
      linkText: "Explorer l'histoire",
    },
    {
      icon: Users,
      title: 'Événements privés',
      description:
        "Organisez vos événements dans un cadre d'exception : mariages, séminaires, réceptions.",
      image: '/optimized/moroccan-palace-room-with-zellige-tiles.webp',
      link: '/visite',
      linkText: 'Organiser un événement',
    },
    {
      icon: Heart,
      title: 'Restauration patrimoniale',
      description:
        'Participez à la sauvegarde du patrimoine en soutenant la restauration minutieuse des zelliges, plâtres sculptés et boiseries historiques du palais.',
      image: '/optimized/moroccan-artisan-workshop-with-traditional-cr.webp',
      link: '/don',
      linkText: 'Faire un don',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className={`font-display text-4xl font-bold text-foreground sm:text-5xl transition-all duration-800 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            {t('home.highlights.title')}
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Plongez dans l'univers fascinant du Palais El Mokri à travers nos
            différentes expériences
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2">
          {highlights.map((highlight, index) => (
            <Card
              key={highlight.title}
              className={`group overflow-hidden hover:shadow-lg transition-all duration-500 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
              style={{ animationDelay: `${300 + index * 150}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={highlight.image || '/placeholder.svg'}
                  alt={highlight.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-secondary/10 p-2 mr-3">
                    <highlight.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {highlight.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-6 mb-6">
                  {highlight.description}
                </p>
                {highlight.linkText === 'Organiser un événement' ? (
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleEventOrganization}
                  >
                    {highlight.linkText}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link href={highlight.link}>{highlight.linkText}</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <EstimationModal
        isOpen={showEstimationModal}
        onClose={() => setShowEstimationModal(false)}
        tourType="Organisation d'événement"
      />
    </section>
  );
}
