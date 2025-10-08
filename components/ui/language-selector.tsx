'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { locales, localeNames, localeFlags } from '@/lib/i18n';

export function LanguageSelector() {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10"
        title={t('common.changeLanguage')}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <span className="sm:hidden">{localeFlags[locale]}</span>
        <ChevronDown className="h-3 w-3" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border border-primary/20 bg-primary shadow-lg">
            <div className="py-1">
              {locales.map(loc => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-primary-foreground/20 hover:text-primary-foreground ${
                    locale === loc
                      ? 'bg-primary-foreground/10 text-primary-foreground font-semibold'
                      : 'text-primary-foreground/90'
                  }`}
                  title={t('common.selectLanguage')}
                >
                  <span className="text-lg">{localeFlags[loc]}</span>
                  <span className="font-medium">{localeNames[loc]}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
