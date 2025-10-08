'use client';

import { useLanguage } from '@/contexts/language-context';
import Image from 'next/image';
import { useState } from 'react';

export function InteriorGallery() {
  const { t } = useLanguage();
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const galleryImages = [
    {
      src: '/optimized/moroccan-palace-interior-with-traditional-doors.webp',
      alt: 'Traditional Doors',
    },
    {
      src: '/optimized/moroccan-palace-room-with-zellige-tiles.webp',
      alt: 'Zellige Room',
    },
    {
      src: '/optimized/moroccan-palace-corridor-with-arches.webp',
      alt: 'Palace Corridor',
    },
    {
      src: '/optimized/moroccan-palace-decorated-room-with-traditional-fu.webp',
      alt: 'Decorated Room',
    },
    {
      src: '/optimized/moroccan-palace-garden-courtyard.webp',
      alt: 'Palace Garden',
    },
  ];

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="aspect-[3/4] overflow-hidden rounded-lg group cursor-pointer relative"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                  loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                quality={80}
                onLoad={() => handleImageLoad(index)}
                loading="lazy"
              />
              {!loadedImages.has(index) && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InteriorGallery;
