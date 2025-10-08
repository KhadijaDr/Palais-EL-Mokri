'use client';

import { useAutoTranslate } from '@/hooks/use-auto-translate';
import { TranslationIndicator } from './translation-indicator';

interface AutoTranslatorProps {
  children: React.ReactNode;
}

export function AutoTranslator({ children }: AutoTranslatorProps) {
  const containerRef = useAutoTranslate();

  return (
    <>
      <div ref={containerRef} className="w-full">
        {children}
      </div>
      <TranslationIndicator />
    </>
  );
}