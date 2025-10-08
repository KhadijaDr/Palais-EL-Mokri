'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CategoryProducts } from '@/components/sections/category-products';
import { BijouxHero } from '@/components/sections/bijoux-hero';
import { useLanguage } from '@/contexts/language-context';

export default function BijouxTraditionnelsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <BijouxHero />
        <CategoryProducts categorySlug="bijoux-traditionnels" />
      </main>
      <Footer />
    </div>
  );
}
