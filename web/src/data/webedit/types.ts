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

// Used for global mode / no language selected – in web edit. This because
// undefined is not a possible value to use in radix select and the backend
// take undefined when making "global" edits and a value of Lang when
// editing for a translation. Global is defined as a substitute of undefined
// when working in the frontend. The helper type WithWebEditLang wraps all params
// for the api layer in web edit since we need to pass lang when making
// request to the web edit backend. The api layer then replaces global with
// undefined to comply.

export const Global = 'global';

export type WebEditLang = Lang | typeof Global;

export type WithWebEditLang<Obj extends Record<string, any>> = {
  lang: WebEditLang;
} & Obj;
