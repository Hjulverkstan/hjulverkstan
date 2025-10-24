import { LangSlug } from '@data/webedit/types';
import { createFindFn, EnumAttributes } from '@data/enums';

export const locale: EnumAttributes[] = [
  {
    dataKey: 'locale',
    label: 'SV',
    value: LangSlug.SWE,
  },
  {
    dataKey: 'locale',
    label: 'EN',
    value: LangSlug.ENG,
  },
  {
    dataKey: 'locale',
    label: 'FA',
    value: LangSlug.PER,
  },
  {
    dataKey: 'locale',
    label: 'AR',
    value: LangSlug.ARA,
  },
  {
    dataKey: 'locale',
    label: 'SO',
    value: LangSlug.SOM,
  },
  {
    dataKey: 'locale',
    label: 'BS',
    value: LangSlug.BOS,
  },
  {
    dataKey: 'locale',
    label: 'TR',
    value: LangSlug.TUR,
  },
];

export const all = locale;
export const find = createFindFn(all);
