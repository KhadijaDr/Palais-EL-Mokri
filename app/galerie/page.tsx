import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DonationCTA } from '@/components/ui/donation-cta';
import { GalleryHero } from '@/components/sections/gallery-hero';
import { CategoryTabs } from '@/components/sections/category-tabs';
import { VirtualTourSection } from '@/components/sections/virtual-tour-section';
import { PhotoGallery } from '@/components/sections/photo-gallery';

export const metadata = {
  title: 'Galerie & Visite Virtuelle - Palais El Mokri',
  description:
    "Explorez le Palais El Mokri à travers notre galerie immersive et notre visite virtuelle 360°. Découvrez l'architecture, les jardins et les intérieurs d'exception.",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <GalleryHero />
        <div id="visite-virtuelle">
          <VirtualTourSection />
        </div>
        <CategoryTabs />
        <div id="galerie-photos">
          <PhotoGallery />
        </div>
        <DonationCTA variant="floating" />
      </main>
      <Footer />
    </div>
  );
}
