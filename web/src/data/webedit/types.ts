import { GeneralContentStripped } from './general/types';
import { Shop } from './shop/types';
import { Story } from './story/types';

export interface AllEntitiesRaw {
  generalContent: GeneralContentStripped[];
  shops: Shop[];
  story: Story[];
}

export interface AllEntities {
  generalContent: Record<string, string>;
  shops: Shop[];
  story: Story[];
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