import { Global, Locale } from '@data/webedit/types';
import { EnumAttributesRaw } from '@data/types';

export const locale: EnumAttributesRaw[] = [
  {
    dataKey: 'locale',
    translationKey: 'localeGlobal',
    value: Global,
  },
  {
    dataKey: 'locale',
    translationKey: 'localeSwe',
    value: Locale.SWE,
  },
  {
    dataKey: 'locale',
    translationKey: 'localeEng',
    value: Locale.ENG,
  },
  {
    dataKey: 'locale',
    translationKey: 'localePer',
    value: Locale.PER,
  },
  {
    dataKey: 'locale',
    translationKey: 'localeAra',
    value: Locale.ARA,
  },
  {
    dataKey: 'locale',
    translationKey: 'localeSom',
    value: Locale.SOM,
  },
  {
    dataKey: 'locale',
    translationKey: 'localeBos',
    value: Locale.BOS,
  },
  {
    dataKey: 'locale',
    translationKey: 'localeTur',
    value: Locale.TUR,
  },
];
