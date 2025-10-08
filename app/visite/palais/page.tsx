import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DonationCTA } from '@/components/ui/donation-cta';
import { PalaceTourHero } from '@/components/sections/palace-tour-hero';
import { TourOptions } from '@/components/sections/tour-options';
import { HighlightsSection } from '@/components/sections/highlights-section';
import { GuideSection } from '@/components/sections/guide-section';

export const metadata = {
  title: 'Visite du Palais El Mokri - Découverte Guidée',
  description:
    "Explorez les merveilles architecturales du Palais El Mokri avec nos visites guidées. Découvrez l'histoire et les secrets de ce joyau de Fès.",
};

export default function PalaceTourPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PalaceTourHero />
        <TourOptions />
        <HighlightsSection />
        <GuideSection />
        <DonationCTA variant="floating" />
      </main>
      <Footer />
    </div>
  );
}
