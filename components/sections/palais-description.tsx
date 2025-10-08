'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

export function PalaisDescription() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/optimized/palais-el-mokri-f-s-morocco-architecture-tradition.webp"
          alt="Palais El Mokri Interior"
          fill
          className="object-cover"
          priority
          unoptimized
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Title */}
        <div className="text-center md:text-left">
          <h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-8 leading-tight text-shadow-lg">
            LE PALAIS
            <br />
            EL MOKRI
          </h2>
        </div>

        {/* Right side - Description */}
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
          <h3 className="font-serif text-2xl font-bold text-secondary mb-6">
            {t('description.title')}
          </h3>
          <div className="space-y-4 text-white font-sans leading-relaxed">
            <p>{t('description.paragraph1')}</p>
            <p>{t('description.paragraph2')}</p>
            <p>{t('description.paragraph3')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PalaisDescription;
