'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/language-context';

interface AutoTranslateWrapperProps {
  children: React.ReactNode;
}

// Service de traduction Google Translate
const translateWithGoogle = async (
  text: string,
  targetLang: string
): Promise<string> => {
  try {
    // Utiliser l'API Google Translate via un proxy CORS
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    return data[0][0][0] || text;
  } catch (error) {
    return text;
  }
};

export function AutoTranslateWrapper({ children }: AutoTranslateWrapperProps) {
  const { locale } = useLanguage();
  const translatedElements = useRef(new Set<HTMLElement>());
  const isTranslating = useRef(false);

  const translateElement = async (element: HTMLElement, targetLang: string) => {
    if (translatedElements.current.has(element) || isTranslating.current)
      return;

    try {
      // Marquer comme en cours de traduction
      translatedElements.current.add(element);

      // Traduire le contenu textuel
      if (
        element.childNodes.length === 1 &&
        element.childNodes[0].nodeType === Node.TEXT_NODE
      ) {
        const originalText = element.textContent?.trim();
        if (originalText && originalText.length > 1) {
          const translatedText = await translateWithGoogle(
            originalText,
            targetLang
          );
          if (translatedText !== originalText) {
            element.textContent = translatedText;
            element.setAttribute('data-original-text', originalText);
            element.setAttribute('data-translated', 'true');
          }
        }
      }

      // Traduire les attributs placeholder
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        const placeholder = element.placeholder;
        if (placeholder && placeholder.trim().length > 1) {
          const translatedPlaceholder = await translateWithGoogle(
            placeholder,
            targetLang
          );
          if (translatedPlaceholder !== placeholder) {
            element.setAttribute('data-original-placeholder', placeholder);
            element.placeholder = translatedPlaceholder;
          }
        }
      }

      // Traduire les attributs title et alt
      const title = element.getAttribute('title');
      if (title && title.trim().length > 1) {
        const translatedTitle = await translateWithGoogle(title, targetLang);
        if (translatedTitle !== title) {
          element.setAttribute('data-original-title', title);
          element.setAttribute('title', translatedTitle);
        }
      }

      const alt = element.getAttribute('alt');
      if (alt && alt.trim().length > 1) {
        const translatedAlt = await translateWithGoogle(alt, targetLang);
        if (translatedAlt !== alt) {
          element.setAttribute('data-original-alt', alt);
          element.setAttribute('alt', translatedAlt);
        }
      }
    } catch (error) {
      // Ignorer les erreurs de traduction d'éléments
    }
  };

  const restoreOriginalText = (element: HTMLElement) => {
    // Restaurer le texte original
    const originalText = element.getAttribute('data-original-text');
    if (originalText) {
      element.textContent = originalText;
      element.removeAttribute('data-original-text');
      element.removeAttribute('data-translated');
    }

    // Restaurer les attributs originaux
    const originalPlaceholder = element.getAttribute(
      'data-original-placeholder'
    );
    if (
      originalPlaceholder &&
      (element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement)
    ) {
      element.placeholder = originalPlaceholder;
      element.removeAttribute('data-original-placeholder');
    }

    const originalTitle = element.getAttribute('data-original-title');
    if (originalTitle) {
      element.setAttribute('title', originalTitle);
      element.removeAttribute('data-original-title');
    }

    const originalAlt = element.getAttribute('data-original-alt');
    if (originalAlt) {
      element.setAttribute('alt', originalAlt);
      element.removeAttribute('data-original-alt');
    }
  };

  const translatePage = async () => {
    if (isTranslating.current) return;
    isTranslating.current = true;

    try {
      // Si on revient au français, restaurer tous les textes originaux
      if (locale === 'fr') {
        document
          .querySelectorAll('[data-translated="true"]')
          .forEach(element => {
            restoreOriginalText(element as HTMLElement);
          });
        translatedElements.current.clear();
        return;
      }

      // Sélectionner TOUS les éléments texte possibles
      const allElements = document.querySelectorAll('*');
      const elementsToTranslate: HTMLElement[] = [];

      allElements.forEach(element => {
        const htmlElement = element as HTMLElement;

        // Ignorer les éléments de script, style, etc.
        if (
          htmlElement.tagName === 'SCRIPT' ||
          htmlElement.tagName === 'STYLE' ||
          htmlElement.tagName === 'NOSCRIPT' ||
          htmlElement.tagName === 'CODE' ||
          htmlElement.tagName === 'PRE' ||
          htmlElement.hasAttribute('data-no-translate')
        ) {
          return;
        }

        // Vérifier si l'élément a du contenu textuel direct
        const hasDirectText = Array.from(htmlElement.childNodes).some(
          node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
        );

        // Vérifier les attributs à traduire
        const hasTranslatableAttributes =
          (htmlElement instanceof HTMLInputElement &&
            htmlElement.placeholder) ||
          (htmlElement instanceof HTMLTextAreaElement &&
            htmlElement.placeholder) ||
          htmlElement.getAttribute('title') ||
          htmlElement.getAttribute('alt');

        if (hasDirectText || hasTranslatableAttributes) {
          elementsToTranslate.push(htmlElement);
        }
      });

      // Traduire par lots pour éviter de surcharger l'API
      const batchSize = 5;
      for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
        const batch = elementsToTranslate.slice(i, i + batchSize);
        await Promise.all(
          batch.map(element => translateElement(element, locale))
        );
        // Petite pause entre les lots
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      // Ignorer les erreurs de traduction de page
    } finally {
      isTranslating.current = false;
    }
  };

  useEffect(() => {
    // Réinitialiser les éléments traduits quand la langue change
    translatedElements.current.clear();

    // Délai pour s'assurer que le DOM est complètement chargé
    const timeouts = [
      setTimeout(translatePage, 500),
      setTimeout(translatePage, 1500),
      setTimeout(translatePage, 3000),
      setTimeout(translatePage, 5000),
    ];

    // Observer les changements du DOM
    const observer = new MutationObserver(mutations => {
      let shouldTranslate = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              shouldTranslate = true;
            }
          });
        }
      });

      if (shouldTranslate && !isTranslating.current) {
        setTimeout(translatePage, 200);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    // Observer les changements de route
    const handleRouteChange = () => {
      translatedElements.current.clear();
      setTimeout(translatePage, 1000);
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('pushstate', handleRouteChange);
    window.addEventListener('replacestate', handleRouteChange);

    return () => {
      timeouts.forEach(clearTimeout);
      observer.disconnect();
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('pushstate', handleRouteChange);
      window.removeEventListener('replacestate', handleRouteChange);
    };
  }, [locale]);

  return <>{children}</>;
}