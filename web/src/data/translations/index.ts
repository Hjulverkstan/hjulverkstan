import sv from './sv';
import en from './en';

export const langTranslationsMap = {
  sv,
  en,
};

export type TranslationLangs = keyof typeof langTranslationsMap;
export type TranslationKeys = keyof typeof sv;
