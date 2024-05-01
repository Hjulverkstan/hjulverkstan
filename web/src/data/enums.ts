import { LucideIcon } from 'lucide-react';

import { Row } from '@hooks/useHeadlessTable';

//

export interface EnumAttributes {
  value: string;
  name: string;
  dataKey: string;
  icon?: LucideIcon;
  /* Following fields aggregated in some bussines logic down the line */
  children?: string[];
  count?: number;
}

export interface RowEnumAttrMap {
  [key: string]: EnumAttributes[];
}

//

export const createFindFn = (enums: EnumAttributes[]) => (value: string) => {
  const enumAttr = enums.find((e) => e.value === value);

  if (!enumAttr)
    throw Error(
      `find (by createFindFn) was given a value [${value}] that was not the enums list [${enums.map((e) => e.value).join()}]`,
    );

  return enumAttr;
};

/**
 * Used to create a matchFn used by <DataTable.FilterSearch />. While we can
 * match any word on any fields we find on a row, with enums we want to match on
 * the localised name and not its enum value. Also when matching on enums the
 * word should start with the enum. For instance searching 'avail' should not
 * match for 'unavail'...
 */

export const createMatchFn =
  (enums: EnumAttributes[]) => (word: string, row: Row) =>
    enums.some(
      (e) =>
        e.value === row[e.dataKey] && e.name.toLowerCase().startsWith(word),
    );
