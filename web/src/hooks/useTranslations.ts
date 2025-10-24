import { useMemo } from 'react';
import { IntlMessageFormat } from 'intl-messageformat';

import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import {
  langTranslationsMap,
  type TranslationKeys,
  TranslationLangs,
} from '@data/translations';
import { fallbackLocale } from '@root';
export type { TranslationKeys } from '@data/translations';

export function useTranslations() {
  const { currLocale } = usePreloadedDataLocalized();

  const translations = useMemo(
    () =>
      (langTranslationsMap[currLocale as TranslationLangs] ??
        fallbackLocale) as Record<TranslationKeys, string>,
    [currLocale],
  );

  const t = <K extends TranslationKeys>(
    key: K | undefined,
    values?: Record<string, any>,
  ): string =>
    key && translations[key]
      ? (new IntlMessageFormat(translations[key], currLocale).format(
          values,
        ) as string)
      : (key ?? 'noTranslationKeyFound');

  return { t };
}
