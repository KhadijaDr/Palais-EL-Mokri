import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DonationCTA } from '@/components/ui/donation-cta';
import { AccommodationHero } from '@/components/sections/accommodation-hero';
import { RoomTypes } from '@/components/sections/room-types';
import { AmenitiesSection } from '@/components/sections/amenities-section';
import { BookingSection } from '@/components/sections/booking-section';

export const metadata = {
  title: 'Hébergement au Palais El Mokri - Séjour Authentique',
  description:
    "Vivez une expérience unique en séjournant dans les chambres d'hôtes du Palais El Mokri. Hébergement de luxe dans un cadre historique exceptionnel.",
};

export default function AccommodationPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <AccommodationHero />
        <RoomTypes />
        <AmenitiesSection />
        <BookingSection />
        <DonationCTA variant="floating" />
      </main>
      <Footer />
    </div>
  );
}
