'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CategoryProducts } from '@/components/sections/category-products';
import { DecorationHero } from '@/components/sections/decoration-hero';
import { useLanguage } from '@/contexts/language-context';

export default function DecorationPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <DecorationHero />
        <CategoryProducts categorySlug="decoration" />
      </main>
      <Footer />
    </div>
  );
}
