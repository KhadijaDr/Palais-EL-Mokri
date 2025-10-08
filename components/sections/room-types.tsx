'use client';

import { useLanguage } from '@/contexts/language-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bed, Users, Wifi, Car, Coffee, Bath } from 'lucide-react';

export function RoomTypes() {
  const { t } = useLanguage();

  const rooms = [
    {
      id: 1,
      name: 'Suite Royale',
      description: 'Suite luxueuse avec vue sur le jardin',
      price: '200€/nuit',
      capacity: 2,
      amenities: ['wifi', 'parking', 'Petit-déjeuner', 'bathroom'],
      image: '/optimized/chambre rouge.webp',
    },
    {
      id: 2,
      name: 'Chambre Traditionnelle',
      description: 'Chambre authentique avec décoration marocaine',
      price: '150€/nuit',
      capacity: 2,
      amenities: ['wifi', 'Petit-déjeuner', 'bathroom'],
      image: '/optimized/suite.webp',
    },
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      case 'Petit-déjeuner':
        return <Coffee className="h-4 w-4" />;
      case 'bathroom':
        return <Bath className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const scrollToBookingForm = () => {
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="room-types-section" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Chambres</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos chambres authentiques alliant confort moderne et
            tradition marocaine
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {rooms.map(room => (
            <Card key={room.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-primary">
                  {room.price}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {room.name}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {room.capacity} personnes
                  </div>
                </CardTitle>
                <CardDescription>{room.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.map(amenity => (
                    <div
                      key={amenity}
                      className="flex items-center gap-1 text-sm text-muted-foreground"
                    >
                      {getAmenityIcon(amenity)}
                      <span className="capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full" onClick={scrollToBookingForm}>
                  Réserver
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
