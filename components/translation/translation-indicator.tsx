'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Globe, Loader2 } from 'lucide-react';

export function TranslationIndicator() {
  const { locale } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (locale !== 'fr') {
      setIsTranslating(true);
      setShowIndicator(true);

      // Simuler la fin de traduction après un délai
      const timer = setTimeout(() => {
        setIsTranslating(false);

        // Masquer l'indicateur après 2 secondes
        setTimeout(() => {
          setShowIndicator(false);
        }, 2000);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowIndicator(false);
      setIsTranslating(false);
    }
  }, [locale]);

  if (!showIndicator) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
      {isTranslating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">
            {locale === 'en'
              ? 'Translating...'
              : locale === 'ar'
                ? 'جاري الترجمة...'
                : 'Traduction...'}
          </span>
        </>
      ) : (
        <>
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">
            {locale === 'en'
              ? 'Translation complete'
              : locale === 'ar'
                ? 'اكتملت الترجمة'
                : 'Traduction terminée'}
          </span>
        </>
      )}
    </div>
  );
}