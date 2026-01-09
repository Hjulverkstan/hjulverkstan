import {
  EnumAttributes,
  EnumAttributesMap,
  EnumAttributesRaw,
  EnumAttributesRawMap,
} from '@data/types';
import { Row } from '@hooks/useHeadlessTable';

// Helper for finding enums quickly, exported in case it needs to be used
// with enums assembled in query layer. Otherwise, returned by useTranslateRawEnums().

export const findEnum = <
  E extends EnumAttributes<V>,
  V extends EnumAttributesRaw = EnumAttributesRaw,
>(
  input: E[] | EnumAttributesMap<EnumAttributesRawMap<E>>,
  value: any,
) => {
  const enums = (
    Array.isArray(input) ? input : Object.values(input).flat()
  ) as E[];
  const enumAttr = enums.find((e) => e.value === value);

  if (!enumAttr) {
    throw new Error(
      `find was given a value [${value}] not in enums [${enums
        .map((e) => e.value)
        .join(',')}]`,
    );
  }

  return enumAttr;
};

export const failedEnum = {
  label: '?',
  variant: 'red',
} as EnumAttributes;

// Safe variant which gives a "warning enum" and logs reason to console

export const findEnumSafe = <
  E extends EnumAttributes<V>,
  V extends EnumAttributesRaw = EnumAttributesRaw,
>(
  enums: E[],
  value: any,
) => {
  try {
    return findEnum(enums, value);
  } catch (e) {
    console.error('findSafeEnum failed to match enum: See error', e);
    return failedEnum;
  }
};

/**
 * Used by <DataTable.FilterSearch /> to be able to search for enums base
 * their label. Some enum has to exist on the entity / row (using dataKey)
 * and its label has to start with the word.
 */

export const matchEnumsOnRow = (
  input: EnumAttributes[] | EnumAttributesMap<any>,
  word: string,
  row: Row,
) => {
  const enums = (
    Array.isArray(input) ? input : Object.values(input)
  ) as EnumAttributes[];

  return enums.flat().some((e) => {
    const dataVal = row[e.dataKey];

    return (
      (Array.isArray(dataVal)
        ? dataVal.includes(e.value)
        : e.value === dataVal) && e.label.toLowerCase().startsWith(word)
    );
  });
};

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
  enums?: EnumAttributes[];
  includes?: string;
  startsWith?: string;
  isOf?: string | string[];
}

export const matchEnumsBy = ({
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
