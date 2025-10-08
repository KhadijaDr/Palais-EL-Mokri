'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Maximize, RotateCcw, Info, Navigation } from 'lucide-react';
import Image from 'next/image';

export function VirtualTourSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(0);
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

  const rooms = [
    {
      name: "Salon d'Honneur",
      description:
        'Le salon principal avec ses zelliges exceptionnels et plafonds sculptés',
      image: '/optimized/chambre bleu.webp',
      hotspots: 8,
    },
    {
      name: "Cour d'Honneur",
      description: 'La cour centrale avec sa fontaine en marbre et ses arcades',
      image: '/optimized/palais-el-mokri-f-s-morocco-architecture-tradition.webp',
      hotspots: 12,
    },
    {
      name: 'Chambre rouge',
      description:
        'La Chambre rouge séduit par ses zelliges raffinés et ses boiseries élégantes, symbole du raffinement marocain',
      image: '/optimized/chambre rouge.webp',
      hotspots: 6,
    },
    {
      name: 'Bibliothèque Historique',
      description:
        'La bibliothèque avec ses manuscrits anciens et reliures précieuses',
      image: '/optimized/Fes2019.webp',
      hotspots: 5,
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
            Visite Virtuelle 360°
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Explorez le Palais El Mokri comme si vous y étiez grâce à notre
            technologie immersive
          </p>
        </div>

        <div
          className={`transition-all duration-800 delay-400 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}
        >
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20">
              <Image
                src={rooms[currentRoom].image || '/placeholder.svg'}
                alt={rooms[currentRoom].name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority={currentRoom === 0}
              />

              {/* Virtual Tour Controls */}
              <div className="absolute inset-0 bg-black/20">
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30 px-8 py-4"
                    onClick={() => {
                      // Rediriger vers la page de visite virtuelle 360°
                      window.location.href = '/visite-virtuelle';
                    }}
                  >
                    <Play className="mr-2 h-6 w-6" />
                    Démarrer la visite 360°
                  </Button>
                </div>

                {/* Top Controls */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                    <Navigation className="inline h-4 w-4 mr-2" />
                    {rooms[currentRoom].name}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-black/60 text-white hover:bg-black/80"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-black/60 text-white hover:bg-black/80"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                    {rooms[currentRoom].hotspots} points d'intérêt
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-black/60 text-white hover:bg-black/80"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Réinitialiser
                  </Button>
                </div>

                {/* Hotspot indicators */}
                <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-secondary rounded-full animate-pulse cursor-pointer"></div>
                <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-secondary rounded-full animate-pulse cursor-pointer"></div>
                <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-secondary rounded-full animate-pulse cursor-pointer"></div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {rooms.map((room, index) => (
                  <button
                    key={room.name}
                    onClick={() => setCurrentRoom(index)}
                    className={`text-left p-4 rounded-lg border transition-all duration-300 ${
                      index === currentRoom
                        ? 'border-secondary bg-secondary/10 text-secondary'
                        : 'border-border hover:border-secondary/50 hover:bg-secondary/5'
                    }`}
                  >
                    <h4 className="font-serif font-semibold mb-2">
                      {room.name}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {room.description}
                    </p>
                    <div className="mt-2 text-xs">
                      <span className="inline-flex items-center text-secondary">
                        <Info className="h-3 w-3 mr-1" />
                        {room.hotspots} points
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div
          className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-800 delay-600 ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
        >
          <div className="text-center">
            <div className="rounded-full bg-secondary/10 p-4 w-fit mx-auto mb-4">
              <Navigation className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Navigation Intuitive
            </h3>
            <p className="text-muted-foreground">
              Déplacez-vous librement dans chaque pièce avec des contrôles
              simples
            </p>
          </div>
          <div className="text-center">
            <div className="rounded-full bg-secondary/10 p-4 w-fit mx-auto mb-4">
              <Info className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Points d'Intérêt
            </h3>
            <p className="text-muted-foreground">
              Découvrez l'histoire de chaque élément architectural
            </p>
          </div>
          <div className="text-center">
            <div className="rounded-full bg-secondary/10 p-4 w-fit mx-auto mb-4">
              <Maximize className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Plein Écran
            </h3>
            <p className="text-muted-foreground">
              Immersion totale en mode plein écran haute définition
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
