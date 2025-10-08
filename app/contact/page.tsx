import { Suspense, lazy } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DonationCTA } from '@/components/ui/donation-cta';
import { ContactHero } from '@/components/sections/contact-hero';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load non-critical components
const ContactForm = lazy(() => import('@/components/sections/contact-form'));
const ContactInfo = lazy(() => import('@/components/sections/contact-info'));
const SocialSection = lazy(
  () => import('@/components/sections/social-section')
);

export const metadata = {
  title: 'Contact - Palais El Mokri',
  description:
    "Contactez l'équipe du Palais El Mokri et de l'Association Tourat Mdinty. Nous sommes à votre disposition pour toute question.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ContactHero />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div>
            <Suspense fallback={<LoadingSpinner />}>
              <ContactForm />
            </Suspense>
            <Suspense fallback={<LoadingSpinner />}>
              <SocialSection />
            </Suspense>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <ContactInfo />
          </Suspense>
        </div>
        <DonationCTA variant="floating" />
      </main>
      <Footer />
    </div>
  );
}
