import type { Metadata } from 'next';
import { Suspense, lazy } from 'react';
import { translations } from '@/lib/translations';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DonationCTA } from '@/components/ui/donation-cta';
import { BoutiqueHero } from '@/components/sections/boutique-hero';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load non-critical components
const ProductCategories = lazy(
  () => import('@/components/sections/product-categories')
);
const FeaturedProducts = lazy(
  () => import('@/components/sections/featured-products')
);
const CraftmanshipSection = lazy(
  () => import('@/components/sections/craftmanship-section')
);

export function generateMetadata(): Metadata {
  return {
    title: translations.fr.metadata.boutique.title,
    description: translations.fr.metadata.boutique.description,
  };
}

export default function BoutiquePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <BoutiqueHero />
        <div id="collections">
          <Suspense fallback={<LoadingSpinner />}>
            <ProductCategories />
          </Suspense>
        </div>
        <div id="produits-vedettes">
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedProducts />
          </Suspense>
        </div>
        <div id="artisans">
          <Suspense fallback={<LoadingSpinner />}>
            <CraftmanshipSection />
          </Suspense>
        </div>
        <DonationCTA variant="floating" />
      </main>
      <Footer />
    </div>
  );
}
