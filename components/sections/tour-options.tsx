'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Camera, Star } from 'lucide-react';
import { toast } from 'sonner';
import { AuthModal } from '@/components/auth/auth-modal';
import { EstimationModal } from '@/components/estimation/estimation-modal';

export function TourOptions() {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEstimationModal, setShowEstimationModal] = useState(false);
  const [selectedTourType, setSelectedTourType] = useState('');

  const handleBookTour = (tourTitle: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSelectedTourType(tourTitle);
    setShowEstimationModal(true);
  };

  const handleCustomQuote = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSelectedTourType('Devis personnalisé');
    setShowEstimationModal(true);
  };

  const tours = [
    {
      id: 1,
      name: 'Visite Guidée Classique',
      description: 'Découverte complète du palais avec guide expert',
      duration: '2 heures',
      groupSize: 'Max 15 personnes',
      price: '25€',
      highlights: [
        'Architecture traditionnelle',
        'Histoire de la famille',
        'Jardins secrets',
      ],
      popular: false,
    },
    {
      id: 2,
      name: 'Visite Privée Premium',
      description: 'Expérience exclusive avec accès aux zones privées',
      duration: '3 heures',
      groupSize: 'Max 6 personnes',
      price: '75€',
      highlights: [
        'Accès exclusif',
        'Dégustation de thé',
        'Rencontre avec les artisans',
      ],
      popular: true,
    },
    {
      id: 3,
      name: 'Visite Photographique',
      description: 'Visite spécialement conçue pour les photographes',
      duration: '4 heures',
      groupSize: 'Max 8 personnes',
      price: '50€',
      highlights: [
        'Meilleurs angles photo',
        'Lumière optimale',
        'Conseils techniques',
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-16 bg-background" id="tour-options-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Options de Visite</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choisissez la formule qui vous convient pour découvrir les
            merveilles du Palais El Mokri
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tours.map(tour => (
            <Card
              key={tour.id}
              className={`relative ${tour.popular ? 'ring-2 ring-primary' : ''}`}
            >
              {tour.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                  <Star className="h-3 w-3 mr-1" />
                  Populaire
                </Badge>
              )}

              <CardHeader>
                <CardTitle className="text-xl">{tour.name}</CardTitle>
                <CardDescription>{tour.description}</CardDescription>
                <div className="text-2xl font-bold text-primary">
                  {tour.price}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {tour.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {tour.groupSize}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Points forts :</h4>
                  <ul className="space-y-1">
                    {tour.highlights.map((highlight, index) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className="w-full"
                  variant={tour.popular ? 'default' : 'outline'}
                  onClick={() => handleBookTour(tour.name)}
                >
                  Réserver cette visite
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Besoin d'une visite sur mesure ? Contactez-nous pour organiser votre
            expérience personnalisée.
          </p>
          <Button variant="outline" onClick={handleCustomQuote}>
            <Camera className="h-4 w-4 mr-2" />
            Demander un devis personnalisé
          </Button>
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
        tourType={selectedTourType}
      />
    </section>
  );
}
