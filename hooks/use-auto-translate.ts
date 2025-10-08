'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/language-context';

// Cache pour éviter les re-traductions
const translationCache = new Map<string, string>();

export function useAutoTranslate() {
  const { locale } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const isTranslatingRef = useRef<boolean>(false);

  // Fonction pour traduire le texte via l'API MyMemory
  const translateText = useCallback(
    async (text: string, targetLang: string): Promise<string> => {
      const cacheKey = `${text}-${targetLang}`;

      if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey)!;
      }

      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${targetLang}`
        );
        const data = await response.json();

        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          const translatedText = data.responseData.translatedText;
          translationCache.set(cacheKey, translatedText);
          return translatedText;
        }
      } catch (error) {
        // Translation failed
      }

      return text;
    },
    []
  );

  // Fonction pour vérifier si un élément doit être traduit
  const shouldTranslateElement = useCallback((element: Element): boolean => {
    const tagName = element.tagName.toLowerCase();

    // Ignorer certains éléments
    if (['script', 'style', 'noscript', 'code', 'pre'].includes(tagName)) {
      return false;
    }

    // Ignorer les éléments avec data-no-translate
    if (element.hasAttribute('data-no-translate')) {
      return false;
    }

    // Ignorer les éléments de traduction
    if (
      element.classList.contains('language-selector') ||
      element.closest('.language-selector') ||
      element.classList.contains('translation-indicator') ||
      element.closest('.translation-indicator')
    ) {
      return false;
    }

    return true;
  }, []);

  // Fonction pour vérifier si un texte doit être traduit
  const shouldTranslateText = useCallback((text: string): boolean => {
    const trimmedText = text.trim();

    // Ignorer les textes vides ou très courts
    if (trimmedText.length < 2) return false;

    // Ignorer les nombres purs
    if (/^\d+$/.test(trimmedText)) return false;

    // Ignorer les URLs
    if (/^https?:\/\//.test(trimmedText)) return false;

    // Ignorer les emails
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedText)) return false;

    return true;
  }, []);

  // Traduire un élément et ses enfants
  const translateElement = useCallback(
    async (element: Element, targetLang: string) => {
      if (!shouldTranslateElement(element)) {
        return;
      }

      // Créer un TreeWalker pour parcourir tous les nœuds de texte
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
        acceptNode: node => {
          const parent = node.parentElement;
          if (!parent || !shouldTranslateElement(parent)) {
            return NodeFilter.FILTER_REJECT;
          }

          const text = node.textContent?.trim();
          if (!text || !shouldTranslateText(text)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      });

      // Collecter tous les nœuds de texte
      const textNodes: Text[] = [];
      let node;
      while ((node = walker.nextNode())) {
        textNodes.push(node as Text);
      }

      // Traduire les nœuds de texte par petits lots pour éviter de surcharger l'API
      const batchSize = 5;
      for (let i = 0; i < textNodes.length; i += batchSize) {
        const batch = textNodes.slice(i, i + batchSize);

        await Promise.all(
          batch.map(async textNode => {
            const originalText = textNode.textContent?.trim();
            if (originalText && shouldTranslateText(originalText)) {
              try {
                const translatedText = await translateText(
                  originalText,
                  targetLang
                );
                if (translatedText !== originalText) {
                  textNode.textContent = translatedText;
                }
              } catch (error) {
                // Error translating text node
              }
            }
          })
        );

        // Petite pause entre les lots pour éviter de surcharger l'API
        if (i + batchSize < textNodes.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Traduire les attributs (alt, title, placeholder)
      const elementsWithAttributes = element.querySelectorAll(
        '[alt], [title], [placeholder]'
      );
      for (const el of elementsWithAttributes) {
        const htmlEl = el as HTMLElement;

        // Traduire l'attribut alt
        const altText = htmlEl.getAttribute('alt');
        if (altText && shouldTranslateText(altText)) {
          try {
            const translatedAlt = await translateText(altText, targetLang);
            htmlEl.setAttribute('alt', translatedAlt);
          } catch (error) {
            // Error translating alt attribute
          }
        }

        // Traduire l'attribut title
        const titleText = htmlEl.getAttribute('title');
        if (titleText && shouldTranslateText(titleText)) {
          try {
            const translatedTitle = await translateText(titleText, targetLang);
            htmlEl.setAttribute('title', translatedTitle);
          } catch (error) {
            // Error translating title attribute
          }
        }

        // Traduire l'attribut placeholder
        const placeholderText = htmlEl.getAttribute('placeholder');
        if (placeholderText && shouldTranslateText(placeholderText)) {
          try {
            const translatedPlaceholder = await translateText(
              placeholderText,
              targetLang
            );
            htmlEl.setAttribute('placeholder', translatedPlaceholder);
          } catch (error) {
            // Error translating placeholder attribute
          }
        }
      }
    },
    [translateText, shouldTranslateElement, shouldTranslateText]
  );

  // Fonction principale de traduction
  const performTranslation = useCallback(
    async (container: HTMLElement) => {
      if (isTranslatingRef.current || locale === 'fr') {
        return;
      }

      isTranslatingRef.current = true;

      try {
        const langMap: { [key: string]: string } = {
          en: 'en',
          ar: 'ar',
        };

        const targetLang = langMap[locale];
        if (targetLang) {
          await translateElement(container, targetLang);
        }
      } catch (error) {
        // Translation error
      } finally {
        isTranslatingRef.current = false;
      }
    },
    [locale, translateElement]
  );

  // Fonction pour initialiser la traduction sur un conteneur
  const initializeTranslation = useCallback(
    (container: HTMLElement) => {
      // Nettoyer l'observer précédent
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Traduction initiale
      setTimeout(() => {
        performTranslation(container);
      }, 200);

      // Observer les changements dans le DOM
      if (locale !== 'fr') {
        observerRef.current = new MutationObserver(mutations => {
          let shouldTranslate = false;

          mutations.forEach(mutation => {
            if (
              mutation.type === 'childList' &&
              mutation.addedNodes.length > 0
            ) {
              mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  shouldTranslate = true;
                }
              });
            }
          });

          if (shouldTranslate && !isTranslatingRef.current) {
            setTimeout(() => performTranslation(container), 100);
          }
        });

        observerRef.current.observe(container, {
          childList: true,
          subtree: true,
          attributes: false,
          characterData: false,
        });
      }
    },
    [locale, performTranslation]
  );

  // Nettoyer l'observer lors du démontage
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Effet pour initialiser la traduction
  useEffect(() => {
    if (containerRef.current) {
      initializeTranslation(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [initializeTranslation, locale]);

  return containerRef;
}