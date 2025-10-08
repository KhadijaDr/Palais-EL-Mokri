import type React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Analytics } from '@vercel/analytics/next';
import { Suspense } from 'react';
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from '@/contexts/auth-context';
import { CartProvider } from '@/contexts/cart-context';
// Charger le wrapper de traduction uniquement côté client pour éviter les problèmes de bundle
const AutoTranslateWrapper = dynamic(
  () =>
    import('@/components/providers/auto-translate-wrapper').then(
      m => m.AutoTranslateWrapper
    ),
  { ssr: false }
);
import { translations } from '@/lib/translations';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export function generateMetadata(): Metadata {
  return {
    title: translations.fr.metadata.home.title,
    description: translations.fr.metadata.home.description,
    keywords:
      'Palais El Mokri, Fès, Maroc, patrimoine, culture, architecture, rénovation, don',
    authors: [{ name: 'Association Tourat Mdinty' }],
    openGraph: {
      title: translations.fr.metadata.home.title,
      description: translations.fr.metadata.home.description,
      type: 'website',
      locale: 'fr_FR',
      alternateLocale: ['en_US', 'ar_MA'],
    },
    robots: {
      index: true,
      follow: true,
    },
    generator: 'Palais El Mokri Website',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/optimized/logo.webp" type="image/webp" />
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <AutoTranslateWrapper>
                <Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                    </div>
                  }
                >
                  {children}
                </Suspense>
              </AutoTranslateWrapper>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
