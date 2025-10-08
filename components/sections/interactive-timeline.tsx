'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Crown,
} from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  details: string;
  image: string;
  icon: React.ElementType;
  category: 'construction' | 'famille' | 'renovation' | 'unesco';
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '1850',
    title: 'Origines du Palais',
    description: 'Construction initiale du palais par la famille El Mokri',
    details:
      "Le Palais El Mokri fut édifié au milieu du XIXe siècle par la prestigieuse famille El Mokri, une des familles les plus influentes de Fès. La construction reflète l'apogée de l'art architectural marocain de l'époque, mêlant traditions andalouses et innovations locales.",
    image: '/1.jpg',
    icon: Crown,
    category: 'construction',
  },
  {
    year: '1880',
    title: 'Expansion et embellissements',
    description: 'Agrandissement du palais et ajout des jardins',
    details:
      "Sous l'impulsion de la deuxième génération de la famille El Mokri, le palais connaît une importante phase d'expansion. Les jardins à la française sont créés, les salons d'apparat sont ornés de zelliges exceptionnels et les plafonds en bois de cèdre sont sculptés par les meilleurs artisans de Fès.",
    image: '/optimized/palais-el-mokri-f-s-morocco-architecture-tradition.webp',
    icon: MapPin,
    category: 'construction',
  },
  {
    year: '1912',
    title: 'Période du Protectorat',
    description: 'Le palais traverse les changements politiques',
    details:
      "Avec l'établissement du Protectorat français, la famille El Mokri adapte le palais aux nouveaux usages tout en préservant son caractère authentique. Cette période voit l'introduction discrète d'éléments de confort moderne sans altérer l'architecture traditionnelle.",
    image: '/optimized/EL mokri.webp',
    icon: Users,
    category: 'famille',
  },
  {
    year: '1956',
    title: 'Indépendance du Maroc',
    description: 'Nouvelle ère pour le patrimoine marocain',
    details:
      "L'indépendance du Maroc marque un tournant dans la préservation du patrimoine. Le Palais El Mokri devient un symbole de l'identité culturelle marocaine retrouvée, attirant l'attention des historiens et des architectes du monde entier.",
    image: '/optimized/Reunion.webp',
    icon: Crown,
    category: 'famille',
  },
  {
    year: '1981',
    title: 'Classement UNESCO',
    description: 'Reconnaissance internationale du patrimoine',
    details:
      "La médina de Fès, incluant le Palais El Mokri, est inscrite au patrimoine mondial de l'UNESCO. Cette reconnaissance internationale souligne l'importance exceptionnelle de ce témoignage de l'art de vivre marocain traditionnel.",
    image: '/optimized/afrique.webp',
    icon: Calendar,
    category: 'unesco',
  },
  {
    year: '2020',
    title: 'Projet de restauration',
    description: 'Lancement des travaux de préservation',
    details:
      "Face aux défis du temps et des intempéries, un ambitieux projet de restauration est lancé. L'objectif : préserver l'authenticité du palais tout en l'adaptant aux exigences contemporaines de conservation et d'accueil du public.",
    image: '/3.jpg',
    icon: MapPin,
    category: 'renovation',
  },
];

export function InteractiveTimeline() {
  const [selectedEvent, setSelectedEvent] = useState(0);
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

  const nextEvent = () => {
    setSelectedEvent(prev => (prev + 1) % timelineEvents.length);
  };

  const prevEvent = () => {
    setSelectedEvent(
      prev => (prev - 1 + timelineEvents.length) % timelineEvents.length
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'construction':
        return 'bg-blue-500/10 text-blue-600';
      case 'famille':
        return 'bg-purple-500/10 text-purple-600';
      case 'renovation':
        return 'bg-green-500/10 text-green-600';
      case 'unesco':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  const currentEvent = timelineEvents[selectedEvent];

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2
            className={`font-display text-4xl font-bold text-foreground sm:text-5xl transition-all duration-800 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Chronologie historique
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Explorez les moments clés de l'histoire du Palais El Mokri
          </p>
        </div>

        {/* Timeline Navigation */}
        <div
          className={`mb-12 transition-all duration-800 delay-300 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border transform -translate-y-1/2"></div>

            {/* Timeline Points */}
            <div className="flex justify-between items-center relative z-10">
              {timelineEvents.map((event, index) => (
                <button
                  key={event.year}
                  onClick={() => setSelectedEvent(index)}
                  className={`flex flex-col items-center group transition-all duration-300 ${
                    index === selectedEvent ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      index === selectedEvent
                        ? 'bg-secondary border-secondary shadow-lg'
                        : 'bg-background border-border group-hover:border-secondary'
                    }`}
                  ></div>
                  <span
                    className={`mt-2 text-sm font-medium transition-all duration-300 ${
                      index === selectedEvent
                        ? 'text-secondary'
                        : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  >
                    {event.year}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div
          className={`transition-all duration-800 delay-500 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}
        >
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="aspect-[4/3] lg:aspect-auto">
                <img
                  src={currentEvent.image || '/placeholder.svg'}
                  alt={currentEvent.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <CardContent className="p-8 lg:p-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-secondary/10 p-2">
                      <currentEvent.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getCategoryColor(currentEvent.category)}`}
                    >
                      {currentEvent.year}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={prevEvent}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextEvent}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-display text-3xl font-bold text-foreground mb-4">
                  {currentEvent.title}
                </h3>

                <p className="font-serif text-lg text-muted-foreground mb-6 italic">
                  {currentEvent.description}
                </p>

                <p className="text-foreground leading-7">
                  {currentEvent.details}
                </p>

                {/* Progress Indicator */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex space-x-2">
                    {timelineEvents.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-8 rounded-full transition-all duration-300 ${
                          index === selectedEvent ? 'bg-secondary' : 'bg-border'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedEvent + 1} / {timelineEvents.length}
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
