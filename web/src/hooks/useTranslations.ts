import { useMemo } from 'react';
import { IntlMessageFormat } from 'intl-messageformat';

import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import {
  langTranslationsMap,
  type TranslationKeys,
  TranslationLangs,
} from '@data/translations';
import { fallbackLang } from '@root';
export type { TranslationKeys } from '@data/translations';

export function useTranslations() {
  const { currLang } = usePreloadedDataLocalized();

  const translations = useMemo(
    () =>
      (langTranslationsMap[currLang as TranslationLangs] ??
        fallbackLang) as Record<TranslationKeys, string>,
    [currLang],
  );

  const t = <K extends TranslationKeys>(
    key: K | undefined,
    values?: Record<string, any>,
  ): string =>
    key && translations[key]
      ? (new IntlMessageFormat(translations[key], currLang).format(
          values,
        ) as string)
      : (key ?? 'noTranslationKeyFound');

  return { t };
}
