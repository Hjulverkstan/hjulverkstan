import {
  EnumAttributes,
  EnumAttributesMap,
  EnumAttributesRaw,
  EnumAttributesRawMap,
} from '@data/types';
import { useTranslations } from '@hooks/useTranslations';
import { useMemo } from 'react';

/**
 * Learn more about the hook and enums:
 * https://github.com/Hjulverkstan/hjulverkstan/blob/main/web/README.md#enumsts
 */

export const useTranslateRawEnums = <
  MapRaw extends EnumAttributesRawMap<Raw>,
  Raw extends EnumAttributesRaw = EnumAttributesRaw,
>(
  enumsMap: MapRaw,
): EnumAttributesMap<MapRaw, Raw> => {
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

  return useMemo(
    () =>
      Object.fromEntries(enumsMapTranslatedEntries) as EnumAttributesMap<
        MapRaw,
        Raw
      >,
    [enumsMapTranslatedEntries],
  );
};
