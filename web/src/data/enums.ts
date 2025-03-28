import { ComponentType } from 'react';

import { Row } from '@hooks/useHeadlessTable';
import { BadgeProps } from '@components/shadcn/Badge';

//

export interface EnumAttributes {
  value: any;
  label: string;
  dataKey: string;
  icon?: ComponentType<any>;
  /* Following fields aggregated in some business logic down the line */
  variant?: BadgeProps['variant'];
  tooltip?: string;
  children?: string[];
  count?: number;
}

//

export const createFindFn = (enums: EnumAttributes[]) => (value: any) => {
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
 * the localised label and not its enum value. Also when matching on enums the
 * word should start with the enum. For instance searching 'avail' should not
 * match for 'unavail'...
 */

export const createMatchFn =
  (enums: EnumAttributes[]) => (word: string, row: Row) =>
    enums.some((e) => {
      const dataVal = row[e.dataKey];

      return (
        (Array.isArray(dataVal)
          ? dataVal.includes(e.value)
          : e.value === dataVal) && e.label.toLowerCase().startsWith(word)
      );
    });

// For easier matching especially when making matchFns for the searchbar in
// portal pages. See implementations for reference.

interface EnumsMatchWordProps {
  enums?: EnumAttributes[];
  includes?: string;
  startsWith?: string;
  isOf?: string | string[];
}

export const enumsMatchUtil = ({
  enums,
  includes,
  startsWith,
  isOf,
}: EnumsMatchWordProps) => {
  const isOfArr = Array.isArray(isOf) ? isOf : [isOf];

  if (startsWith === undefined && includes === undefined) {
    throw new Error('enumsMatchWord is missing prop includes or startsWith');
  }

  return !!enums?.some(
    (
      e: any, // reminder for if a problem occurs due to this 'any'.
    ) =>
      (!isOf || isOfArr.includes(e.value)) &&
      (startsWith
        ? e.label.toLowerCase().startsWith(startsWith.toLowerCase())
        : e.label.toLowerCase().includes(includes!.toLowerCase())),
  );
};
