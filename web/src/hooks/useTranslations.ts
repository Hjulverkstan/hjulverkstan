import { useMemo } from 'react';
import { IntlMessageFormat } from 'intl-messageformat';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { translations, type TranslationKeys } from '@data/translations';

export type { TranslationKeys } from '@data/translations';

export function useTranslations() {
  const { currLocale } = usePreloadedDataLocalized();

  const messages = useMemo(() => {
    return (
      translations[currLocale as keyof typeof translations] ?? translations.sv
    );
  }, [currLocale]);

  return <K extends TranslationKeys>(
    key: K,
    values?: Record<string, any>,
  ): string =>
    messages[key]
      ? (new IntlMessageFormat(messages[key], currLocale).format(
          values,
        ) as string)
      : key;
}
