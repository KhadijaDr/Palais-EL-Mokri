'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CategoryProducts } from '@/components/sections/category-products';
import { TextilesHero } from '@/components/sections/textiles-hero';
import { useLanguage } from '@/contexts/language-context';

export default function TextilesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <TextilesHero />
        <CategoryProducts categorySlug="textiles" />
      </main>
      <Footer />
    </div>
  );
}
