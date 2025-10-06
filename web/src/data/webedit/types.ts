import { Shop } from './shop/types';
import { Story } from './story/types';

export interface AllEntities {
  text: Record<string, string>;
  shops: Shop[];
  stories: Story[];
}

export type LocaleAllEntitiesMap = Record<string, AllEntities>;

export enum LangSlug {
  SWE = 'sv', // Swedish
  ENG = 'en', // English
  ARA = 'ar', // Arabic
  PER = 'fa', // Persian (Farsi)
  SOM = 'so', // Somali
  BOS = 'bs', // Bosnian
  TUR = 'tr', // Turkish
}
