'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Globe, ChevronDown } from 'lucide-react';

interface GoogleTranslateWidgetProps {
  className?: string;
}

export function GoogleTranslateWidget({
  className = '',
}: GoogleTranslateWidgetProps) {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇲🇦' },
  ];

  const currentLanguage =
    languages.find(lang => lang.code === locale) || languages[0];

  useEffect(() => {
    // Fonction pour déclencher la traduction Google
    const triggerGoogleTranslate = (targetLang: string) => {
      if (
        typeof window !== 'undefined' &&
        window.google &&
        window.google.translate
      ) {
        setIsTranslating(true);

        // Attendre que le widget soit initialisé
        setTimeout(() => {
          const selectElement = document.querySelector(
            '.goog-te-combo'
          ) as HTMLSelectElement;
          if (selectElement) {
            // Mapper les codes de langue
            const langMap: { [key: string]: string } = {
              fr: '',
              en: 'en',
              ar: 'ar',
            };

            selectElement.value = langMap[targetLang] || '';
            selectElement.dispatchEvent(new Event('change'));

            // Ajouter une classe au body pour indiquer la traduction
            document.body.classList.add('translated-page');
            if (targetLang === 'ar') {
              document.body.classList.add('translated-rtl');
              document.body.classList.remove('translated-ltr');
            } else {
              document.body.classList.add('translated-ltr');
              document.body.classList.remove('translated-rtl');
            }
          }

          setTimeout(() => {
            setIsTranslating(false);
          }, 2000);
        }, 500);
      }
    };

    // Déclencher la traduction quand la langue change
    if (locale !== 'fr') {
      triggerGoogleTranslate(locale);
    } else {
      triggerGoogleTranslate('fr');
      // Retirer les classes de traduction pour le français
      document.body.classList.remove(
        'translated-page',
        'translated-rtl',
        'translated-ltr'
      );
    }
  }, [locale]);

  const handleLanguageChange = (langCode: string) => {
    setLocale(langCode as 'fr' | 'en' | 'ar');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Indicateur de traduction */}
      {isTranslating && (
        <div className="fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span className="text-sm">Traduction en cours...</span>
        </div>
      )}

      {/* Sélecteur de langue personnalisé */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Sélectionner la langue"
        >
          <Globe className="w-4 h-4 text-gray-600" />
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="text-sm font-medium text-gray-700">
            {currentLanguage.name}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Menu déroulant */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-40 min-w-full">
            {languages.map(language => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  locale === language.code
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
                {locale === language.code && (
                  <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Overlay pour fermer le menu */}
      {isOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}

// Déclaration des types pour Google Translate
declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: any;
      };
    };
    googleTranslateElementInit: () => void;
  }
}