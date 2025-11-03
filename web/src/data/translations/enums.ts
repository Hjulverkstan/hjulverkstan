import { Global, Lang } from '@data/webedit/types';
import { EnumAttributes, EnumAttributesRaw } from '@data/types';

export const lang: EnumAttributesRaw[] = [
  {
    dataKey: 'lang',
    translationKey: 'langGlobal',
    value: Global,
  },
  {
    dataKey: 'lang',
    translationKey: 'langSwe',
    value: Lang.SV,
  },
  {
    dataKey: 'lang',
    translationKey: 'langEng',
    value: Lang.EN,
  },
  {
    dataKey: 'lang',
    translationKey: 'langPer',
    value: Lang.FA,
  },
  {
    dataKey: 'lang',
    translationKey: 'langAra',
    value: Lang.AR,
  },
  {
    dataKey: 'lang',
    translationKey: 'langSom',
    value: Lang.SO,
  },
  {
    dataKey: 'lang',
    translationKey: 'langBos',
    value: Lang.BS,
  },
  {
    dataKey: 'lang',
    translationKey: 'langTur',
    value: Lang.TR,
  },
];

export const langCodes: EnumAttributes[] = [
  {
    dataKey: 'lang',
    label: 'SV',
    value: Lang.SV,
  },
  {
    dataKey: 'lang',
    label: 'EN',
    value: Lang.EN,
  },
  {
    dataKey: 'lang',
    label: 'FA',
    value: Lang.FA,
  },
  {
    dataKey: 'lang',
    label: 'AR',
    value: Lang.AR,
  },
  {
    dataKey: 'lang',
    label: 'SO',
    value: Lang.SO,
  },
  {
    dataKey: 'lang',
    label: 'BS',
    value: Lang.BS,
  },
  {
    dataKey: 'lang',
    label: 'TR',
    value: Lang.TR,
  },
];
