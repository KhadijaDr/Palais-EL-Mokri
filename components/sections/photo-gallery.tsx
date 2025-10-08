'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  X,
  ZoomIn,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Photo {
  id: string;
  src: string;
  title: string;
  description: string;
  category: string;
  photographer?: string;
  date?: string;
}

export function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
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

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('gallery-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: Set<string>) => {
    localStorage.setItem(
      'gallery-favorites',
      JSON.stringify(Array.from(newFavorites))
    );
  };

  // Function to add watermark to image and download
  const downloadImageWithWatermark = async (photo: Photo) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        // Set canvas size to image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the original image
        ctx.drawImage(img, 0, 0);

        // Add watermark
        const watermarkText = '© Palais El Mokri ';
        const fontSize = Math.max(img.width / 100, 160);

        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;

        // Position watermark at bottom right
        const textWidth = ctx.measureText(watermarkText).width;
        const x = img.width - textWidth - 20;
        const y = img.height - 20;

        // Add background rectangle for better visibility
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x - 10, y - fontSize - 5, textWidth + 20, fontSize + 15);

        // Draw watermark text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(watermarkText, x, y);
        ctx.strokeText(watermarkText, x, y);

        // Convert canvas to blob and download
        canvas.toBlob(
          blob => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `palais-el-mokri-${photo.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);

              toast({
                title: 'Téléchargement réussi',
                description: `La photo "${photo.title}" a été téléchargée avec le filigrane.`,
              });
            }
          },
          'image/jpeg',
          0.9
        );
      };

      img.onerror = () => {
        toast({
          title: 'Erreur de téléchargement',
          description: 'Impossible de télécharger cette image.',
          variant: 'destructive',
        });
      };

      img.src = photo.src;
    } catch (error) {
      toast({
        title: 'Erreur de téléchargement',
        description: "Une erreur s'est produite lors du téléchargement.",
        variant: 'destructive',
      });
    }
  };

  // Function to share photo
  const sharePhoto = async (photo: Photo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: photo.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        copyToClipboard(photo);
      }
    } else {
      copyToClipboard(photo);
    }
  };

  // Fallback: copy to clipboard
  const copyToClipboard = (photo: Photo) => {
    const shareText = `Découvrez "${photo.title}" au Palais El Mokri - ${window.location.href}`;
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        toast({
          title: 'Lien copié',
          description: 'Le lien de partage a été copié dans le presse-papiers.',
        });
      })
      .catch(() => {
        toast({
          title: 'Erreur de partage',
          description: 'Impossible de copier le lien de partage.',
          variant: 'destructive',
        });
      });
  };

  // Function to toggle favorite
  const toggleFavorite = (photoId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(photoId)) {
      newFavorites.delete(photoId);
      toast({
        title: 'Retiré des favoris',
        description: 'Cette photo a été retirée de vos favoris.',
      });
    } else {
      newFavorites.add(photoId);
      toast({
        title: 'Ajouté aux favoris',
        description: 'Cette photo a été ajoutée à vos favoris.',
      });
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const photos: Photo[] = [
    {
      id: '1',
      src: '/optimized/palais-el-mokri-f-s-morocco-architecture.webp',
      title: 'Façade principale',
      description:
        'La façade principale du palais avec ses arcs en fer à cheval caractéristiques',
      category: 'architecture',
      photographer: 'Hassan Benali',
      date: '2024',
    },
    {
      id: '2',
      src: '/optimized/palais-el-mokri-f-s-morocco-architecture-tradition.webp',
      title: 'Cour intérieure',
      description:
        "La cour d'honneur avec sa fontaine centrale en marbre de Carrare",
      category: 'architecture',
      photographer: 'Fatima Zahra',
      date: '2024',
    },
    {
      id: '3',
      src: '/optimized/moroccan-palace-decorated-room-with-traditional-fu.webp',
      title: "Salon d'apparat",
      description:
        'Le grand salon avec ses zelliges multicolores et plafond en bois de cèdre',
      category: 'interieurs',
      photographer: 'Ahmed Tazi',
      date: '2023',
    },
    {
      id: '4',
      src: '/optimized/bertal vert.webp',
      title: 'Bertal vert',
      description: 'Le bârtal vert avec ses plantes et ses fleurs',
      category: 'jardins',
      photographer: 'Laila Bennani',
      date: '2024',
    },
    {
      id: '5',
      src: '/optimized/Fes2019.webp',
      title: 'Détail de zellige',
      description: 'Motifs géométriques traditionnels en céramique émaillée',
      category: 'architecture',
      photographer: 'Omar Fassi',
      date: '2023',
    },
    {
      id: '6',
      src: '/optimized/suite.webp',
      title: 'Suite Traditionnelle',
      description: 'La suite traditionnelle avec ses zelliges et ses boiseries',
      category: 'collections',
      photographer: 'Aicha Alami',
      date: '2024',
    },
    {
      id: '7',
      src: '/optimized/3.webp',
      title: 'Plafond sculpté',
      description: 'Plafond en bois de cèdre avec calligraphies arabes dorées',
      category: 'interieurs',
      photographer: 'Youssef Idrissi',
      date: '2023',
    },
    {
      id: '8',
      src: '/optimized/Chambre radia.webp',
      title: 'Chambre radia',
      description: 'La chambre radia avec ses zelliges et ses boiseries',
      category: 'interieurs',
      photographer: 'Nadia Chraibi',
      date: '2024',
    },
    {
      id: '9',
      src: '/optimized/2.webp',
      title: "Mobilier d'époque",
      description:
        "Coffre en bois marqué avec incrustations de nacre et d'ébène",
      category: 'collections',
      photographer: 'Karim Benjelloun',
      date: '2023',
    },
  ];

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    const nextIndex = (currentIndex + 1) % photos.length;
    setCurrentIndex(nextIndex);
    setSelectedPhoto(photos[nextIndex]);
  };

  const prevPhoto = () => {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setCurrentIndex(prevIndex);
    setSelectedPhoto(photos[prevIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          nextPhoto();
          break;
        case 'ArrowLeft':
          prevPhoto();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPhoto, currentIndex]);

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2
            className={`font-display text-4xl font-bold text-foreground sm:text-5xl transition-all duration-800 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Galerie Photo
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Une collection exceptionnelle de photographies haute définition
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <Card
              key={photo.id}
              className={`group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
              style={{ animationDelay: `${300 + index * 100}ms` }}
              onClick={() => openLightbox(photo, index)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={photo.src || '/placeholder.svg'}
                  alt={photo.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="font-serif text-lg font-semibold text-white mb-1">
                    {photo.title}
                  </h3>
                  <p className="text-white/80 text-sm line-clamp-2">
                    {photo.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Lightbox */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative max-w-6xl max-h-full w-full">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={prevPhoto}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={nextPhoto}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Image */}
              <div className="relative">
                <img
                  src={selectedPhoto.src || '/placeholder.svg'}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-[80vh] object-contain mx-auto"
                />

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-white mb-2">
                        {selectedPhoto.title}
                      </h3>
                      <p className="text-white/90 mb-2">
                        {selectedPhoto.description}
                      </p>
                      {selectedPhoto.photographer && (
                        <p className="text-white/70 text-sm">
                          Photo : {selectedPhoto.photographer} •{' '}
                          {selectedPhoto.date}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-white hover:bg-white/20 ${favorites.has(selectedPhoto.id) ? 'text-red-400' : ''}`}
                        onClick={() => toggleFavorite(selectedPhoto.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${favorites.has(selectedPhoto.id) ? 'fill-current' : ''}`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        onClick={() => sharePhoto(selectedPhoto)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        onClick={() =>
                          downloadImageWithWatermark(selectedPhoto)
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Counter */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {photos.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
