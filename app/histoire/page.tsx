import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DonationCTA } from '@/components/ui/donation-cta';
import { HistoryHero } from '@/components/sections/history-hero';
import { InteractiveTimeline } from '@/components/sections/interactive-timeline';
import { FamilySection } from '@/components/sections/family-section';
import { UnescoSection } from '@/components/sections/unesco-section';
import { DocumentarySection } from '@/components/sections/documentary-section';

export const metadata = {
  title: 'Histoire du Palais El Mokri - Patrimoine de Fès',
  description:
    "Découvrez l'histoire fascinante du Palais El Mokri et de la famille El Mokri, témoins de l'évolution de Fès à travers les siècles.",
};

export default function HistoryPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HistoryHero />
        <InteractiveTimeline />
        <FamilySection />
        <UnescoSection />
        <DocumentarySection />
        <DonationCTA variant="floating" />
      </main>
      <Footer />
    </div>
  );
}
