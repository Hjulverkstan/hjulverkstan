import { useMemo } from 'react';
import { IntlMessageFormat } from 'intl-messageformat';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { translations, type TranslationKeys } from '@data/translations';
import { fallBackLocale } from '@root';

export type { TranslationKeys } from '@data/translations';

export function useTranslations() {
  const { currLocale } = usePreloadedDataLocalized();

  const strings = useMemo(() => {
    return (
      translations[currLocale as keyof typeof translations] ?? fallBackLocale
    );
  }, [currLocale]);

  const t = <K extends TranslationKeys>(
    key: K | undefined,
    values?: Record<string, any>,
  ): string => {
    if (!key) return ''; // fallback vid undefined
    return strings[key]
      ? (new IntlMessageFormat(strings[key], currLocale).format(
          values,
        ) as string)
      : key;
  };

  return { t };
}
