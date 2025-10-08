import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DonationCTA } from '@/components/ui/donation-cta';
import { AssociationHero } from '@/components/sections/association-hero';
import { MissionSection } from '@/components/sections/mission-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { TeamSection } from '@/components/sections/team-section';
import { MembershipSection } from '@/components/sections/membership-section';

export const metadata = {
  title: 'Association Tourat Mdinty - Palais El Mokri',
  description:
    "Découvrez l'Association Tourat Mdinty, ses projets de préservation du patrimoine, ses résidences d'artistes et comment devenir membre.",
};

export default function AssociationPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <AssociationHero />
        <MissionSection />
        <ProjectsSection />
        <TeamSection />
        <MembershipSection />
        <DonationCTA variant="floating" />
      </main>
      <Footer />
    </div>
  );
}
