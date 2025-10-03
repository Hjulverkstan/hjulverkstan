import sv from './sv';
import en from './en';

export const translations = {
  sv,
  en,
};

export type AvailableLanguages = keyof typeof translations;
export type TranslationKeys = keyof typeof sv;
