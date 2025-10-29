import { Shop } from './shop/types';
import { Story } from './story/types';
import { TextKey } from '@data/webedit/text/types';

export interface AllEntities {
  text: Record<`${TextKey}`, string>;
  shops: Shop[];
  stories: Story[];
}

export type LocaleAllEntitiesMap = Record<string, AllEntities>;

// Use language as key but locale as value
export enum Locale {
  SWE = 'sv', // Swedish
  ENG = 'en', // English
  ARA = 'ar', // Arabic
  PER = 'fa', // Persian (Farsi)
  SOM = 'so', // Somali
  BOS = 'bs', // Bosnian
  TUR = 'tr', // Turkish
}

// Used for global mode / no language selected – in web edit. This because
// undefined is not a possible value to use in radix select and the backend
// take undefined when making "global" edits and a value of Locale when
// editing for a translation. Global is defined as a substitute of undefined
// when working in the frontend. The helper type WithLocale wraps all params
// for the api layer in web edit since we need to pass locale when making
// request to the web edit backend. The api layer then replaces global with
// undefined to comply.

export const Global = 'global';

export type LocaleAndGlobal = Locale | typeof Global;

export type WithLocale<Obj extends Record<string, any>> = {
  locale: LocaleAndGlobal;
} & Obj;
