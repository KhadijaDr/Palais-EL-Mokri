'use client';

import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Wifi,
  Car,
  Coffee,
  Utensils,
  Dumbbell,
  Waves,
  Shield,
  Clock,
} from 'lucide-react';

export function AmenitiesSection() {
  const { t } = useLanguage();

  const amenities = [
    {
      icon: <Wifi className="h-8 w-8" />,
      title: 'WiFi Gratuit',
      description: 'Connexion internet haut débit dans tout le palais',
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: 'Parking Privé',
      description: 'Stationnement sécurisé pour votre véhicule',
    },
    {
      icon: <Coffee className="h-8 w-8" />,
      title: 'Petit Déjeuner',
      description: 'Petit déjeuner traditionnel marocain inclus',
    },
    {
      icon: <Utensils className="h-8 w-8" />,
      title: 'Restaurant',
      description: 'Cuisine authentique dans un cadre exceptionnel',
    },
    {
      icon: <Waves className="h-8 w-8" />,
      title: 'Hammam',
      description: 'Détente et bien-être dans notre hammam traditionnel',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Sécurité 24h/24',
      description: 'Surveillance et sécurité assurées en permanence',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Conciergerie',
      description: 'Service de conciergerie pour organiser vos visites',
    },
    {
      icon: <Dumbbell className="h-8 w-8" />,
      title: 'Espace Détente',
      description: 'Jardins et terrasses pour votre relaxation',
    },
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Services & Équipements</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Profitez de tous nos services pour un séjour inoubliable au cœur du
            patrimoine marocain
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="mx-auto text-primary mb-2">{amenity.icon}</div>
                <CardTitle className="text-lg">{amenity.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {amenity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
