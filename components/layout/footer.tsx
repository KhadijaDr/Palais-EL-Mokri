'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2 group min-w-0">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src="/optimized/logo.webp"
                    alt="Palais El Mokri - Logo"
                    fill
                    className="object-contain"
                    unoptimized
                    sizes="48px"
                  />
                </div>
                <h3 className="font-display text-xl font-bold text-secondary">
                  Palais El Mokri
                </h3>
                </Link>
              </div>
              <p className="text-sm leading-5 text-primary-foreground/80">
                {t('footer.preserveMessage')}
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-primary-foreground/60 hover:text-secondary transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-primary-foreground/60 hover:text-secondary transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 xl:col-span-2 xl:mt-0">
            <div className="flex justify-center">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-secondary uppercase tracking-wider">
                  {t('footer.discover')}
                </h3>
                <ul role="list" className="mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                  <li>
                    <Link
                      href="/histoire"
                      className="text-xs sm:text-sm leading-4 sm:leading-5 text-primary-foreground/80 hover:text-secondary transition-colors"
                    >
                      {t('footer.history')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/galerie"
                      className="text-xs sm:text-sm leading-4 sm:leading-5 text-primary-foreground/80 hover:text-secondary transition-colors"
                    >
                      {t('footer.gallery')}
                    </Link>
                  </li>
                  <li>
                     <Link
                      href="/visite/hebergement"
                      className="text-xs sm:text-sm leading-4 sm:leading-5 text-primary-foreground/80 hover:text-secondary transition-colors"
                    >
                      {t('footer.prepareVisit')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/association"
                      className="text-xs sm:text-sm leading-4 sm:leading-5 text-primary-foreground/80 hover:text-secondary transition-colors"
                    >
                      {t('nav.association')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-secondary uppercase tracking-wider">
                  {t('footer.support')}
                </h3>
                <ul role="list" className="mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                  <li>
                    <Link
                      href="/don"
                      className="text-xs sm:text-sm leading-4 sm:leading-5 text-primary-foreground/80 hover:text-secondary transition-colors"
                    >
                      {t('footer.makeADonation')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/boutique"
                      className="text-xs sm:text-sm leading-4 sm:leading-5 text-primary-foreground/80 hover:text-secondary transition-colors"
                    >
                      {t('nav.boutique')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/association#membre"
                      className="text-xs sm:text-sm leading-4 sm:leading-5 text-primary-foreground/80 hover:text-secondary transition-colors"
                    >
                      {t('Devenir Membre')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold leading-4 sm:leading-5 text-secondary uppercase tracking-wider">
                  {t('footer.contact')}
                </h3>
                <div className="mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                  <div className="flex items-start space-x-1 sm:space-x-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-primary-foreground/80">
                      {t('footer.location')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-secondary flex-shrink-0" />
                    <Link
                      href="mailto:contact@palaiselmokri.com"
                      className="text-xs sm:text-sm text-primary-foreground/80 hover:text-secondary transition-colors truncate"
                    >
                      contact@palaiselmokri.com
                    </Link>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-secondary flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-primary-foreground/80">
                      +212 567 839 993
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/10 pt-6">
          <div className="flex flex-col items-center justify-center sm:flex-row gap-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/optimized/logo.webp"
                  alt="Palais El Mokri - Logo"
                  fill
                  className="object-contain opacity-60"
                  unoptimized
                  sizes="32px"
                />
              </div>
              <p className="text-sm leading-4 text-primary-foreground/60 text-center">
                &copy; 2025 Palais El Mokri. {t('footer.allRightsReserved')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

