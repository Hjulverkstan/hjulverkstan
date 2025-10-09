import { ComponentType } from 'react';
import { BadgeProps } from '@components/shadcn/Badge';
import { TranslationKeys } from '@data/translations';

//

export interface EnumAttributesRaw {
  value: any;
  dataKey: string;
  translationKey?: TranslationKeys;
  icon?: ComponentType<any>;
  /* Following fields aggregated in some business logic down the line */
  variant?: BadgeProps['variant'];
  tooltip?: string;
  children?: string[];
  count?: number;
}

export type EnumAttributes<V extends EnumAttributesRaw = EnumAttributesRaw> =
  V & {
    label: string;
  };

//

/**
 * Used to create a matchFn used by <DataTable.FilterSearch />. While we can
 * match any word on any fields we find on a row, with enums we want to match on
 * the localised label and not its enum value. Also when matching on enums the
 * word should start with the enum. For instance searching 'avail' should not
 * match for 'unavail'...
 */

// For easier matching especially when making matchFns for the searchbar in
// portal pages. See implementations for reference.

interface EnumsMatchWordProps {
  enums?: EnumAttributesRaw[];
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
