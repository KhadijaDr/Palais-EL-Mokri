import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DonationCTA } from '@/components/ui/donation-cta';
import { CategoryHero } from '@/components/sections/category-hero';
import { CategoryProducts } from '@/components/sections/category-products';

export const metadata = {
  title: 'Catégorie - Palais El Mokri',
  description:
    "Découvrez notre collection d'artisanat traditionnel marocain par catégorie.",
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categorySlug = params.slug;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CategoryHero 
          title="Catégorie"
          description="Découvrez notre collection d'artisanat traditionnel marocain"
          image="/optimized/bijoux.webp"
          productCount={0}
        />
        <CategoryProducts categorySlug={categorySlug} />
        <DonationCTA variant="floating" />
      </main>
      <Footer />
    </div>
  );
}
