import { Suspense, lazy } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OriginalHero } from '@/components/sections/original-hero';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load non-critical components
const PalaisDescription = lazy(
  () => import('@/components/sections/palais-description')
);
const InteriorGallery = lazy(
  () => import('@/components/sections/interior-gallery')
);
const ExperienceSection = lazy(
  () => import('@/components/sections/experience-section')
);
const CeilingSection = lazy(
  () => import('@/components/sections/ceiling-section')
);

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <OriginalHero />
        <Suspense fallback={<LoadingSpinner />}>
          <PalaisDescription />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <InteriorGallery />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <ExperienceSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <CeilingSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
