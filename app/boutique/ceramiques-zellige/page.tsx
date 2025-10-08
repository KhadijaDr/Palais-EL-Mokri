'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CategoryProducts } from '@/components/sections/category-products';
import { CeramiquesHero } from '@/components/sections/ceramiques-hero';
import { useLanguage } from '@/contexts/language-context';

export default function CeramiquesZelligePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CeramiquesHero />
        <CategoryProducts categorySlug="ceramiques-zellige" />
      </main>
      <Footer />
    </div>
  );
}
