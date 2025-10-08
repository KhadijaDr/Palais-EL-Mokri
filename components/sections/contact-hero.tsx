'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function ContactHero() {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/optimized/palais-el-mokri-f-s-morocco-architecture.webp"
          alt="Contact Palais El Mokri"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
      </div>
      
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className={`transition-all duration-1000 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
            <h1 className="font-display text-5xl font-bold text-white sm:text-6xl lg:text-7xl text-balance">
              Contactez-<span className="text-secondary">nous</span>
            </h1>

            <p className="mt-8 text-xl leading-8 text-white/90 max-w-3xl mx-auto text-pretty">
              Notre équipe est à votre disposition pour répondre à toutes vos questions concernant le Palais El Mokri,
              nos projets de restauration ou l'Association Tourat Mdinty.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center text-white/80">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span className="text-sm">contact@palaiselmokri.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span className="text-sm">+212 56 888 999</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-sm">Fès, Maroc</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
