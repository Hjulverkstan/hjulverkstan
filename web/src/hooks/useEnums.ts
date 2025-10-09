import { EnumAttributesRaw, EnumAttributes } from '@data/enums';
import { useTranslations } from '@hooks/useTranslations';
import { Row } from '@hooks/useHeadlessTable';
import { useMemo } from 'react';

// This can be created by "import * as enums from '@data/.../enums'"

export type EnumAttributesMap<Raw = EnumAttributesRaw> = Record<string, Raw[]>;

export type UseEnumsReturn<MapRaw, Raw extends EnumAttributesRaw> = MapRaw & {
  find: (value: any) => EnumAttributes<Raw>;
  matchFn: (word: string, row: Row) => boolean;
};

/**
 *
 * @param enumsMap
 */

export const useEnums = <
  MapRaw extends EnumAttributesMap<Raw>,
  Raw extends EnumAttributesRaw = EnumAttributesRaw,
>(
  enumsMap: EnumAttributesMap<Raw>,
): UseEnumsReturn<MapRaw, Raw> => {
  const { t } = useTranslations();

  const enumsMapTranslatedEntries = useMemo(
    () =>
      Object.entries(enumsMap).map(
        ([key, enumAttrList]) =>
          [
            key,

            enumAttrList.map((enumAttr) => ({
              ...enumAttr,

              label: t(enumAttr.translationKey),
            })),
          ] as [string, EnumAttributes<Raw>[]],
      ),

    [enumsMap],
  );

  const allEnumAtrr = useMemo(
    () =>
      enumsMapTranslatedEntries.flatMap(([_, enumAttrList]) => enumAttrList),

    [enumsMapTranslatedEntries],
  );

  const enumsMapTranslated = useMemo(
    () => Object.fromEntries(enumsMapTranslatedEntries),

    [enumsMapTranslatedEntries],
  );

  const matchFn = (word: string, row: Row) =>
    allEnumAtrr.some((e) => {
      const dataVal = row[e.dataKey];

      return (
        (Array.isArray(dataVal)
          ? dataVal.includes(e.value)
          : e.value === dataVal) && e.label.toLowerCase().startsWith(word)
      );
    });

  const find = (value: any) => {
    const enumAttr = allEnumAtrr.find((e) => e.value === value);

    if (!enumAttr)
      throw Error(
        `find (by createFindFn) was given a value [${value}] that was not the enums list [${allEnumAtrr.map((e) => e.value).join()}]`,
      );

    return enumAttr;
  };

  return { ...enumsMapTranslated, find, matchFn } as unknown as UseEnumsReturn<
    MapRaw,
    Raw
  >;
};
