'use client';

import Image from 'next/image';

export function CeramiquesHero() {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/optimized/moroccan-ceramics-and-zellige-tiles.webp"
          alt="Céramiques et Zellige Marocains"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-6">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 tracking-wider text-shadow-lg">
            Céramiques & Zellige
          </h1>
          <p className="font-sans text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed text-shadow mb-4">
            Poteries traditionnelles et carreaux zellige de Fès
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
            <span className="text-sm font-medium">24 produits disponibles</span>
          </div>
        </div>
      </div>
    </section>
  );
}
