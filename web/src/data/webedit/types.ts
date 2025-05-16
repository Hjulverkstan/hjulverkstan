import { GeneralContentStripped } from './general/types';
import { Shop } from './shop/types';

export interface AllEntitiesRaw {
  generalContent: GeneralContentStripped[];
  shops: Shop[];
}

export interface AllEntities {
  generalContent: Record<string, string>;
  shops: Shop[];
}

export type LocaleAllEntitiesMap = Record<string, AllEntities>;

export enum LangSlugs {
  SWE = 'sv', // Swedish
  ENG = 'en', // English
  ARA = 'ar', // Arabic
  PER = 'fa', // Persian (Farsi)
  SOM = 'so', // Somali
  BOS = 'bs', // Bosnian
  TUR = 'tr', // Turkish
}