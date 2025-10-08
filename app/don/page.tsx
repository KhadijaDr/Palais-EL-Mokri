import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DonationHero } from '@/components/sections/donation-hero';
import { DonationForm } from '@/components/sections/donation-form';
import { ImpactSection } from '@/components/sections/impact-section';
import { DonationProgress } from '@/components/sections/donation-progress';
import { TestimonialsSection } from '@/components/sections/testimonials-section';

export const metadata = {
  title: 'Soutenir la rénovation - Palais El Mokri',
  description:
    'Participez à la préservation du Palais El Mokri en faisant un don. Chaque contribution compte pour sauvegarder ce patrimoine exceptionnel de Fès.',
};

export default function DonationPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <DonationHero />
        <DonationProgress />
        <DonationForm />
        <ImpactSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
