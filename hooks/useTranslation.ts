'use client';

import { useCallback } from 'react';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { translations } from '@/lib/i18n/dict';

/**
 * 🧬 GemigramOS Sovereign Translation Hook
 * Handles multi-language string retrieval with 'Sovereign Intelligence' persona.
 */
export function useTranslation() {
  const locale = useGemigramStore(state => state.locale);

  const t = useCallback((path: string): string => {
    const keys = path.split('.');
    let result: Record<string, unknown> | string = translations[locale];

    for (const key of keys) {
      if (typeof result === 'object' && result !== null && key in result) {
        result = (result as Record<string, string | Record<string, unknown>>)[key] as Record<string, unknown> | string;
      } else {
        console.warn(`[i18n] Missing translation key: ${path} for locale: ${locale}`);
        return path;
      }
    }

    return typeof result === 'string' ? result : path;
  }, [locale]);

  return { t, locale };
}
