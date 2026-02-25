import { Shop } from './shop/types';
import { Story } from './story/types';
import { TextKey } from '@data/webedit/text/types';

export interface AllEntities {
  text: Record<`${TextKey}`, string>;
  shops: Shop[];
  stories: Story[];
}

export type LangAllEntitiesMap = Record<string, AllEntities>;

// Use language as key but lang as value
export enum Lang {
  SV = 'sv', // Swedish
  EN = 'en', // English
  AR = 'ar', // Arabic
  FA = 'fa', // Persian (Farsi)
  SO = 'so', // Somali
  BS = 'bs', // Bosnian
  TR = 'tr', // Turkish
}

export type WithLang<Obj extends Record<string, any>> = {
  lang: Lang;
} & Obj;
