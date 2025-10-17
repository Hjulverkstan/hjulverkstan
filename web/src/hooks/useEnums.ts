import { EnumAttributesRaw, EnumAttributes } from '@data/enums';
import { useTranslations } from '@hooks/useTranslations';
import { Row } from '@hooks/useHeadlessTable';
import { useMemo } from 'react';

export type EnumAttributesMap<Raw = EnumAttributesRaw> = Record<string, Raw[]>;

export type EnumAttributesMapTranslated<
  MapRaw extends EnumAttributesMap<Raw>,
  Raw extends EnumAttributesRaw = EnumAttributesRaw,
> = {
  [K in keyof MapRaw]: EnumAttributes<Raw>[];
};

export type UseEnumsReturn<
  MapRaw extends EnumAttributesMap<Raw>,
  Raw extends EnumAttributesRaw,
> = EnumAttributesMapTranslated<MapRaw, Raw> & {
  find: (value: any) => EnumAttributes<Raw>;
  matchFn: (word: string, row: Row) => boolean;
};

/**
 * Learn more about the hook and enums:
 * https://github.com/Hjulverkstan/hjulverkstan/blob/main/web/README.md#enumsts
 */

export const useEnums = <
  MapRaw extends EnumAttributesMap<Raw>,
  Raw extends EnumAttributesRaw = EnumAttributesRaw,
>(
  enumsMap: MapRaw,
): UseEnumsReturn<MapRaw, Raw> => {
  const { t } = useTranslations();

  const enumsMapTranslatedEntries = useMemo(
    () =>
      (Object.entries(enumsMap) as [keyof MapRaw, Raw[]][]).map(
        ([key, enumAttrList]) =>
          [
            key as string,
            enumAttrList.map((enumAttr) => ({
              ...enumAttr,
              label: t(enumAttr.translationKey),
            })),
          ] as [string, EnumAttributes<Raw>[]],
      ),
    [enumsMap, t],
  );

  const allEnumAttr = useMemo(
    () => enumsMapTranslatedEntries.flatMap(([_, list]) => list),
    [enumsMapTranslatedEntries],
  );

  const enumsMapTranslated = useMemo(
    () =>
      Object.fromEntries(
        enumsMapTranslatedEntries,
      ) as EnumAttributesMapTranslated<MapRaw, Raw>,
    [enumsMapTranslatedEntries],
  );

  const matchFn = (word: string, row: Row) =>
    allEnumAttr.some((e) => {
      const dataVal = row[e.dataKey];
      return (
        (Array.isArray(dataVal)
          ? dataVal.includes(e.value)
          : e.value === dataVal) && e.label.toLowerCase().startsWith(word)
      );
    });

  const find = (value: any) => {
    const enumAttr = allEnumAttr.find((e) => e.value === value);
    if (!enumAttr)
      throw new Error(
        `find was given a value [${value}] not in enums [${allEnumAttr
          .map((e) => e.value)
          .join(',')}]`,
      );
    return enumAttr;
  };

  return {
    ...(enumsMapTranslated as unknown as EnumAttributesMapTranslated<
      MapRaw,
      Raw
    >),
    find,
    matchFn,
  } as UseEnumsReturn<MapRaw, Raw>;
};
