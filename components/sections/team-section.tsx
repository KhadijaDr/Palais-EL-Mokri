'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin, Mail } from 'lucide-react';

export function TeamSection() {
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

  const team = [
    {
      name: 'Dr. Aicha Bennani',
      role: 'Présidente',
      bio: "Historienne de l'art spécialisée dans l'architecture islamique, elle dirige l'association depuis sa création en 2015.",
      image: '/optimized/placeholder-user.webp?key=team1',
      linkedin: '#',
      email: 'aicha@touratmdinty.org',
    },
    {
      name: 'Hassan El Fassi',
      role: 'Directeur des projets',
      bio: "Architecte du patrimoine, il supervise tous les projets de restauration et de valorisation de l'association.",
      image: '/optimized/placeholder-user.webp?key=team2',
      linkedin: '#',
      email: 'hassan@touratmdinty.org',
    },
    {
      name: 'Fatima Chraibi',
      role: 'Responsable culturelle',
      bio: "Médiatrice culturelle, elle coordonne les résidences d'artistes et les événements culturels.",
      image: '/optimized/placeholder-user.webp?key=team3',
      linkedin: '#',
      email: 'fatima@touratmdinty.org',
    },
    {
      name: 'Omar Tazi',
      role: 'Trésorier',
      bio: "Expert-comptable, il gère les finances de l'association et assure la transparence des comptes.",
      image: '/optimized/placeholder-user.webp?key=team4',
      linkedin: '#',
      email: 'omar@touratmdinty.org',
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
            Notre équipe
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Rencontrez les personnes passionnées qui œuvrent pour la
            préservation du patrimoine
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card
              key={member.name}
              className={`group text-center hover:shadow-lg transition-all duration-500 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
              style={{ animationDelay: `${400 + index * 150}ms` }}
            >
              <CardContent className="p-6">
                <div className="aspect-square overflow-hidden rounded-full mx-auto mb-4 w-24 h-24">
                  <img
                    src={member.image || '/optimized/placeholder-user.webp'}
                    alt={member.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-secondary font-medium mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground leading-5 mb-4">
                  {member.bio}
                </p>
                <div className="flex justify-center space-x-3">
                  <a
                    href={member.linkedin}
                    className="text-muted-foreground hover:text-secondary transition-colors"
                    aria-label={`LinkedIn de ${member.name}`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-muted-foreground hover:text-secondary transition-colors"
                    aria-label={`Email de ${member.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
