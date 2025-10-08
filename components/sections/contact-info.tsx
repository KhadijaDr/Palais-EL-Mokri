'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Car, Bus } from 'lucide-react';

export function ContactInfo() {
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

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['Palais El Mokri', 'Médina de Fès', '30000 Fès, Maroc'],
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['+212 56 888 999', '+212 567 839 993'],
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@palaiselmokri.com', 'info@touratmdinty.org'],
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: [
        'Lun-Ven : 9h-18h',
        'Sam-Dim : 10h-16h',
        'Fermé les jours fériés',
      ],
    },
  ];

  const accessInfo = [
    {
      icon: Car,
      title: 'En voiture',
      description: 'Parking disponible à proximité de Bab Boujloud',
    },
    {
      icon: Bus,
      title: 'Transport public',
      description: 'Lignes de bus 9, 11, 12 - Arrêt Bab Boujloud',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-muted/30 rounded-xl overflow-hidden"
    >
      <div className="mx-auto max-w-2xl px-6">
        <div className="space-y-6">
          <div
            className={`transition-all duration-800 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Informations de contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <Card
                  key={info.title}
                  className={`transition-all duration-800 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="rounded-full bg-secondary/10 p-2 flex-shrink-0">
                        <info.icon className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-serif font-semibold text-foreground mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-sm text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Access Information */}
          <div
            className={`transition-all duration-800 delay-400 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
              Comment nous rejoindre
            </h3>
            <div className="space-y-4">
              {accessInfo.map((access, index) => (
                <Card
                  key={access.title}
                  className={`transition-all duration-800 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="rounded-full bg-secondary/10 p-2 flex-shrink-0">
                        <access.icon className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-1">
                          {access.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {access.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div
            className={`transition-all duration-800 delay-600 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}
          >
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <h4 className="font-serif text-lg font-semibold text-foreground mb-2">
                      Plan d'accès
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Carte interactive disponible prochainement
                    </p>
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

export default ContactInfo;
