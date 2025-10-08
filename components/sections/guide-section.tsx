'use client';

import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Languages, Award, Clock } from 'lucide-react';

export function GuideSection() {
  const { t } = useLanguage();

  const guides = [
    {
      id: 1,
      name: 'Ahmed El Fassi',
      title: 'Guide Principal',
      experience: "15 ans d'expérience",
      languages: ['Français', 'Anglais', 'Arabe', 'Espagnol'],
      specialties: [
        'Histoire de Fès',
        'Architecture islamique',
        'Traditions locales',
      ],
      rating: 4.9,
      image: '/optimized/placeholder-user.webp',
    },
    {
      id: 2,
      name: 'Fatima Benali',
      title: 'Guide Culturelle',
      experience: "10 ans d'expérience",
      languages: ['Français', 'Anglais', 'Arabe'],
      specialties: ['Art traditionnel', 'Artisanat', 'Cuisine marocaine'],
      rating: 4.8,
      image: '/optimized/placeholder-user.webp',
    },
    {
      id: 3,
      name: 'Omar Tazi',
      title: 'Guide Photographique',
      experience: "8 ans d'expérience",
      languages: ['Français', 'Anglais', 'Arabe', 'Italien'],
      specialties: ['Photographie', 'Architecture', 'Lumière naturelle'],
      rating: 4.9,
      image: '/optimized/placeholder-user.webp',
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Guides Experts</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez le Palais El Mokri avec nos guides passionnés et
            expérimentés, véritables ambassadeurs du patrimoine marocain
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {guides.map(guide => (
            <Card
              key={guide.id}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={guide.image} alt={guide.name} />
                  <AvatarFallback>
                    {guide.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{guide.name}</CardTitle>
                <p className="text-primary font-medium">{guide.title}</p>
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {guide.experience}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{guide.rating}</span>
                  <span className="text-sm text-muted-foreground">/5</span>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Languages className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Langues</span>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {guide.languages.map(lang => (
                      <Badge key={lang} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Spécialités</span>
                  </div>
                  <div className="space-y-1">
                    {guide.specialties.map(specialty => (
                      <div
                        key={specialty}
                        className="text-sm text-muted-foreground"
                      >
                        • {specialty}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-muted/50 rounded-lg p-6 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">Garantie de Qualité</h3>
            <p className="text-muted-foreground">
              Tous nos guides sont certifiés par le Ministère du Tourisme
              marocain et formés spécifiquement à l'histoire et aux
              particularités du Palais El Mokri. Ils parlent plusieurs langues
              et s'adaptent à tous les publics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
