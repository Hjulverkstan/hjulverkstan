import { EnumAttributes } from '@data/enums';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';

export const useLocaliseEnumsByPreloadedData = (enums: EnumAttributes[]) => {
  const { data } = usePreloadedDataLocalized();

  return enums.map((e) => ({
    ...e,
    label: e.generalContentKey
      ? data.generalContent[e.generalContentKey]
      : e.label,
  }));
};
