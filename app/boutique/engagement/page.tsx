import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DonationCTA } from '@/components/ui/donation-cta';
import { EngagementHero } from '@/components/sections/engagement-hero';
import { EngagementContent } from '@/components/sections/engagement-content';

export const metadata = {
  title: 'Notre Engagement - Palais El Mokri',
  description:
    "Découvrez notre engagement pour la préservation de l'artisanat traditionnel marocain et le soutien aux artisans de Fès.",
};

export default function EngagementPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <EngagementHero />
        <EngagementContent />
        <DonationCTA variant="floating" />
      </main>
      <Footer />
    </div>
  );
}
